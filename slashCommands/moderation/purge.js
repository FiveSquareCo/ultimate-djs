const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const createBin = require("../../utils/functions/createBin");
const { working, commands_logs_channel_id } = require("../../configs/features.json").mod_logs;
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "purge",
    description: " Delete a number of messages from a channel. (limit 100)",
    requiredPermission: ["MANAGE_MESSAGES"],
    cooldown: 5000,
    options: [
        {
            name: "messages",
            type: "NUMBER",
            description: "Number of messages to delete",
            required: true,
        },
    ],
    run: async (interaction, args) => {
        const noOfMessagesToDelete = args.get("messages").value;
        if (noOfMessagesToDelete > 100) {
            return errorMessageEmbed(interaction, "You can only delete 100 messages at a time.", "SC");
        }
        const messages = await interaction.channel.bulkDelete(noOfMessagesToDelete);
        let messagesLinkDesc = "";
        messages.map((message, index) => {
            messagesLinkDesc += `(${message.id}) ${new Date(message.createdTimestamp).toLocaleDateString()} "${message.author.tag}"(${message.author.id}) -- ${message.content || "this was an embed message"} \n\n`;
        });
        const messagesLink = await createBin(messagesLinkDesc, `Purge Command Deleted Messages ${interaction.guild.name}`, `used on ${new Date().toLocaleDateString()}`);
        purgeModlogs(interaction, interaction.user, noOfMessagesToDelete, interaction.channel, messagesLink);
        const deletedMessagesEmbed = new MessageEmbed().setColor(4437378).setDescription(`Deleted ${noOfMessagesToDelete} messages!`);
        interaction.reply({
            embeds: [deletedMessagesEmbed],
            ephemeral: true,
        });
    },
};

const purgeModlogs = (interaction, moderator, messageCount, channel, messagesLink) => {
    if (!working || commands_logs_channel_id === "channel_id_here") return;
    const logschannel = interaction.guild.channels.cache.get(commands_logs_channel_id);
    const date = `<t:${(new Date() / 1000).toFixed()}:R>`;
    const purgelogsEmbed = new MessageEmbed()
        .setAuthor("Mod Logs")
        .setColor(3092790)
        .setTimestamp()
        .setDescription(`${moderator.tag} deleted ${messageCount} in <#${channel.id}> on ${date}`)
        .setFields(
            {
                name: "Moderator",
                value: `${moderator.tag} - ${moderator.id}`,
                inline: true,
            },
            {
                name: "Channel",
                value: `${channel.name} - ${channel.id}`,
                inline: true,
            },
            { name: "Messages Count", value: `${messageCount}`, inline: true },
            { name: "Messages", value: `${messagesLink}`, inline: true }
        );
    logschannel.send({ embeds: [purgelogsEmbed] });
};
