const { Queue, Song } = require("distube");
const { MessageEmbed } = require("discord.js");

/**
 *
 * @param {} client
 * @param {Queue} queue
 * @param {Song} song
 */
module.exports = async (client, queue, song) => {
    if (queue.textChannel?.guild.me.voice.serverDeaf) {
        queue.textChannel?.guild.me.voice.setDeaf(true, "Playing Music");
    }
    const playingSOngEmbed = new MessageEmbed()
        .setTitle(song.name)
        .setAuthor({ name: "Now Playing" })
        .setColor(3092790)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Req. By: ${song.user?.tag}` })
        .setTimestamp()
        .setDescription(
            `[Web Link](${song.url}) | [Support Server](google.com)\n${client.playerStatus(queue, false)}\n\n***Details:***\n:small_blue_diamond: **Publisher  :**  [${song.uploader.name}](${song.uploader.url})\n:small_blue_diamond: **Duration  :**  ${
                song.formattedDuration
            }\n\n****Note:*** *use +stats for more inforamtion of song.*`
        );

    await queue.textChannel.send({ embeds: [playingSOngEmbed] });
};
