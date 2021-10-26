const { MessageEmbed } = require("discord.js");

module.exports = (client, queue, playlist) => {
    const addedToQueueEmbed = new MessageEmbed()
        .setColor(3092790)
        .setDescription(
            `Queued **${playlist.songs.length}** songs from [${playlist.name}](${playlist.url})`
        );
    queue.textChannel.send({ embeds: [addedToQueueEmbed] });
};
