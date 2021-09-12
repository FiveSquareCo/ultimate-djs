const { working, message_update_logs_channel_id } =
    require("../../configs/features.json").mod_logs;
const { MessageEmbed } = require("discord.js");
const createBin = require("../../utils/functions/createBin");
module.exports = async (client, oldMessage, newMessage) => {
    if (!working || message_update_logs_channel_id === "channel_id_here")
        return;
    if (oldMessage.content === newMessage.content) return;
    const channel = client.channels.cache.get(message_update_logs_channel_id);
    let oldContent = oldMessage.content;
    let newContent = newMessage.content;
    const messageLink = `https://discord.com/channels/${oldMessage.guildId}/${oldMessage.channel.id}/${oldMessage.id}`;
    if (oldMessage.content.length > 500) {
        oldContent = await createBin(oldMessage.content, "", "");
    }
    if (newMessage.content.length > 500) {
        newContent = await createBin(newMessage.content, "", "");
    }

    const messageUpdateLogs = new MessageEmbed()
        .setColor(3092790)
        .setAuthor("Message Update")
        .setDescription(
            `**OLD MESSAGE :**\n ${oldContent} \n\n **NEW MESSAGE :**\n ${newContent}`
        )
        .addFields(
            {
                name: "Channel",
                value: `${oldMessage.channel.name} - ${oldMessage.channel.id}`,
                inline: true,
            },
            {
                name: "Author",
                value: `${oldMessage.author.tag} - ${oldMessage.author.id}`,
                inline: true,
            },
            {
                name: "Link",
                value: `[click here](${messageLink})`,
            }
        )
        .setTimestamp()
        .setFooter("Time");
    channel.send({ embeds: [messageUpdateLogs] });
};
