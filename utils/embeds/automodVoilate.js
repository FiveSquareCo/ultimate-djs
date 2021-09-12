const deleteMessage = require("../functions/deleteMessage");
const { MessageEmbed } = require("discord.js");

module.exports = async (message, errorMessage) => {
    const errorMessageEMbed = new MessageEmbed()
        .setColor(15548997)
        .setDescription(errorMessage);
    const sentMessage = await message.channel.send({
        embeds: [errorMessageEMbed],
    });
    deleteMessage(sentMessage, 3000);
};
