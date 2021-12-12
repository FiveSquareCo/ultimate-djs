const { MessageEmbed } = require("discord.js");

module.exports = (client, queue) => {
    const channel = queue.textChannel;
    const errorEmbed = new MessageEmbed()
        .setColor(3092790)
        .setDescription("The queue is empty, use `+play` to play some songs.");
    channel.send({ embeds: [errorEmbed] });
};
