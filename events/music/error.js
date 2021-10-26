const { MessageEmbed } = require("discord.js");

module.exports = (client, channel, error) => {
    const errorEmbed = new MessageEmbed()
        .setColor(3092790)
        .setDescription("Oops! Something Went Wrong, Please Try Again.");
    channel.send({ embeds: [errorEmbed] });
};
