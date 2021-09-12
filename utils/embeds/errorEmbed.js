const deleteMessage = require("../functions/deleteMessage");
const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = async (message, errorMessage, type, color) => {
    const errorMessageEMbed = new MessageEmbed()
        .setColor(15548997)
        .setDescription(errorMessage);
    if (message instanceof CommandInteraction) {
        return await message.reply({
            embeds: [errorMessageEMbed],
            ephemeral: true,
        });
    }
    const sentMessage = await message.reply({ embeds: [errorMessageEMbed] });
    deleteMessage(sentMessage, 3000);
    return;
};
