const { MessageEmbed } = require("discord.js");

module.exports = (message) => {
    message.react("❌");
    const noPlayersEmbed = new MessageEmbed()
        .setColor(15548997)
        .setDescription(":x: No Music is playing Around You");
    message.channel.send({ embeds: [noPlayersEmbed] });
};
