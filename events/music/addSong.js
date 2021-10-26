const { MessageEmbed } = require("discord.js");

module.exports = (client, queue, song) => {
    const addedToQueueEmbed = new MessageEmbed()
        .setColor(3092790)
        .setDescription(`Queued [${song.name}](${song.url}) [${song.user}]`);
    queue.textChannel.send({ embeds: [addedToQueueEmbed] });
};
