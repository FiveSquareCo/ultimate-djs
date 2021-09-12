const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = (message, successMessage) => {
    const errorMessageEMbed = new MessageEmbed()
        .setColor(4437378)
        .setDescription(successMessage);
    if (message instanceof CommandInteraction) {
        return message.reply({ embeds: [errorMessageEMbed] });
    }
    return message.channel.send({
        embeds: [errorMessageEMbed],
        content: `|| <@${message.member.id}> ||`,
    });
};
