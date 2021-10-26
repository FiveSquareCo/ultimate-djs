const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const { modmail_end_message, transcripts_channel_id } =
    require("../../configs/features.json").mod_mail;
const modmailDB = require("../../schemas/modmailSchema");
const createBin = require("../../utils/functions/createBin");

module.exports = async (client, interaction) => {
    if (interaction.isCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (command) {
            if (
                client.commandCooldowns.has(
                    `${interaction.member.id}_SC_${command.name}`
                )
            ) {
                return errorMessageEmbed(
                    interaction,
                    "Chill! This command has cooldown.",
                    "SC"
                );
            }
            if (command.requiredPermission) {
                if (
                    !interaction.member.permissions.has(
                        command.requiredPermission
                    )
                ) {
                    return errorMessageEmbed(
                        interaction,
                        `You don't have permissions to run this command\n :small_blue_diamond: Required permission: \`${command.requiredPermission}\``,
                        "SC"
                    );
                }
            }
            const options = interaction.options;
            command.run(interaction, options);
            if (command.cooldown) {
                client.commandCooldowns.set(
                    `${interaction.member.id}_SC_${command.name}`,
                    Date.now() + command.cooldown
                );
                setTimeout(() => {
                    client.commandCooldowns.delete(
                        `${interaction.member.id}_SC_${command.name}`,
                        Date.now() + command.cooldown
                    );
                }, command.cooldown);
            }
        }
    }
    if (interaction.isButton()) {
        if (interaction.customId.startsWith("MODMAIL")) {
            const [modmail, channelId] = interaction.customId.split("_");
            interaction.reply("Closing Ticket");
            const channel = interaction.guild.channels.cache.get(channelId);
            const user = client.users.cache.get(channel.topic);
            const thanksForContactingEmbed = new MessageEmbed()
                .setDescription(modmail_end_message)
                .setColor(4437378);
            user.send({ embeds: [thanksForContactingEmbed] });
            const results = await modmailDB.findOneAndDelete({
                guildId: interaction.guildId,
                userId: user.id,
            });
            if (results) {
                const channel = interaction.guild.channels.cache.get(
                    transcripts_channel_id
                );
                const transcripts = results.conversation.join("\n");
                const link = await createBin(
                    transcripts,
                    `${interaction.guild.name} Modmail Transripts | USER: ${results.userId}`,
                    `Transcritps of modmail of user - ${
                        results.userId
                    }, closed on ${new Date().toLocaleDateString()} by ${
                        interaction.user.id
                    }(${interaction.user.username})`
                ).catch((e) => null);
                const user = interaction.client.users.cache.get(results.userId);
                const transcriptsEmbed = new MessageEmbed()
                    .setColor(3092790)
                    .setDescription(
                        `**Messages count :** ${results.conversation.length}\n**Created by :** ${user.tag} - ${user.id}\n **Closed by :** ${interaction.user.tag} - ${interaction.user.id}`
                    )
                    .setTimestamp()
                    .setAuthor("Ticket closed");
                const components = [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setURL(link)
                            .setLabel("Transcript")
                            .setStyle("LINK")
                    ),
                ];
                channel.send({ embeds: [transcriptsEmbed], components });
            }
            channel.delete();
        }
    }
};
