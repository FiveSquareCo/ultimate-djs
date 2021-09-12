const { MessageEmbed } = require("discord.js");
const createBin = require("../../utils/functions/createBin");
const { working, message_delete_logs_channel_id } =
    require("../../configs/features.json").mod_logs;

module.exports = async (client, message) => {
    // return;
    if (!working && message_delete_logs_channel_id === "channel_id_here") {
        return;
    }

    const channel = message.guild.channels.cache.get(
        message_delete_logs_channel_id
    );
    let content = message.content;
    if (message.content.length && message.content.length > 100) {
        content = await createBin(
            message.content,
            ``,
            `Message delete logs of ${message.guild.name}`
        );
    }
    const guildAuditLogs = await message.guild.fetchAuditLogs({ type: 72 });
    const entry = guildAuditLogs.entries.first();
    if (
        new Date(entry.createdTimestamp).getMinutes() != new Date().getMinutes()
    )
        return;
    const messageDeleteEmbed = new MessageEmbed()
        .setAuthor("Message Deleted")
        .setColor(3092790)
        .setDescription(
            `<@${message.author.id}>'s Message was deleted by <@${entry.executor.id}> in <#${message.channel.id}>`
        )
        .addFields(
            {
                name: "Channel",
                value: `${message.channel.name} - ${message.channel.id}`,
                inline: true,
            },
            {
                name: "Deleted By",
                value: `${entry.executor.tag} - ${entry.executor.id}`,
                inline: true,
            },
            {
                name: "Author",
                value: `${message.author.tag} - ${message.author.id}`,
            },
            {
                name: "Content",
                value: content,
            }
        )
        .setFooter(`Time`)
        .setTimestamp();
    let files;
    if (message.attachments.size > 0) {
        files = message.attachments.first();
        if (files.contentType.startsWith("image")) {
            messageDeleteEmbed.setImage(files.url);
            return message.channel.send({
                embeds: [messageDeleteEmbed],
            });
        }
        return message.channel.send({
            content: "**Files:**",
            embeds: [messageDeleteEmbed],
            files: [files],
        });
    }
    channel.send({ embeds: [messageDeleteEmbed] });
};
