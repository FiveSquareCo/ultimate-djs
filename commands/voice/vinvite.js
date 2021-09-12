const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const joinToCreateDB = require("../../schemas/voiceJ2CSchema");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const { working, channels_type, channel_id } =
    require("../../configs/features.json").join_to_create;
module.exports = {
    name: "voiceinvite",
    aliases: ["vinv", "vinvite"],
    cooldown: 3000,
    run: async (message, args) => {
        if (working && channels_type != "PRIVATE") {
            return errorMessageEmbed(
                message,
                "This command is disabled because this server's J2C Voice channels are Public"
            );
        }
        const userId = message.member.id;
        const guildId = message.guildId;
        const invUser =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.fetch(args[0])));
        if (
            !message.member.voice &&
            !message.member.voice.channel.name.startsWith("J2C")
        ) {
            return errorMessageEmbed(
                message,
                "You are not in a voice channel/custom voice channel"
            );
        }
        const results = await joinToCreateDB.findOne({ userId, guildId });
        if (!results) {
            return;
        }
        if (results.voiceChannelId != message.member.voice.channelId) {
            return message.reply("you not owner");
        }
        if (results.invites.length >= 2) {
            return errorMessageEmbed(
                message,
                "You already invited 2 people, you cannot invite more! remove them and then invite more members."
            );
        }
        const channel = message.guild.channels.cache.get(
            results.voiceChannelId
        );
        const inviteEmbed = new MessageEmbed()
            .setDescription(
                `${message.author.tag} Invited you for a voice channel ( <#${results.voiceChannelId}> ), you can accept or reject.`
            )
            .setColor(3092790);
        const button1 = new MessageButton()
            .setCustomId("J2C_ACCEPT")
            .setLabel("✔️ Accept")
            .setStyle("SUCCESS");

        const button2 = new MessageButton()
            .setCustomId("J2C_REJECT")
            .setLabel("❌ Reject")
            .setStyle("DANGER");
        const buttons = new MessageActionRow().addComponents([
            button1,
            button2,
        ]);
        const msg = await message.channel.send({
            content: `|| <@${invUser.id}> ||`,
            embeds: [inviteEmbed],
            components: [buttons],
        });
        const filter = (interaction) => interaction.user.id === invUser.id;
        msg.channel
            .awaitMessageComponent({ filter, time: 30000 })
            .then(async (interaction) => {
                if (interaction.customId === "J2C_ACCEPT") {
                    const acceptedEmbed = new MessageEmbed()
                        .setDescription(
                            `**${invUser.tag}** Accepted to join voice channel, permissions updated!`
                        )
                        .setColor(3092790);
                    channel.permissionOverwrites.edit(invUser, {
                        CONNECT: true,
                    });
                    interaction.reply("Accepted");
                    interaction.deleteReply();
                    msg.edit({
                        content: `<@${message.author.id}>`,
                        embeds: [acceptedEmbed],
                        components: [],
                    });
                    return await joinToCreateDB.findOneAndUpdate(
                        {
                            guildId,
                            userId,
                        },
                        {
                            guildId,
                            userId,
                            $push: {
                                invites: invUser.id,
                            },
                        },
                        {
                            upsert: true,
                        }
                    );
                }
                interaction.reply("Rejected");
                interaction.deleteReply();
                const rejectedEmbed = new MessageEmbed()
                    .setDescription(
                        `**${invUser.tag}** Rejected to join voice channel!`
                    )
                    .setColor(3092790);
                return msg.edit({
                    content: `<@${message.author.id}>`,
                    embeds: [rejectedEmbed],
                    components: [],
                });
            })
            .catch((e) => {
                const rejectedEmbed = new MessageEmbed()
                    .setDescription(`**${invUser.tag}** Filed to reply!`)
                    .setColor(3092790);
                return msg.edit({
                    content: `<@${message.author.id}>`,
                    embeds: [rejectedEmbed],
                    components: [],
                });
            });
    },
};
