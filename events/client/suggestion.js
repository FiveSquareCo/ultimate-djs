const { suggestionsStatusMessages } = require("../../configs/constants");
const { MessageEmbed } = require("discord.js");
module.exports = async (client, message) => {
    console.log("ji");
    const status = suggestionsStatusMessages.WAITING;
    const embed = new MessageEmbed()
        .setColor(status.color)
        .setDescription(message.content)
        .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
        )
        .setTitle("Suggestion")
        .addFields({ name: "Status", value: status.text })
        .setFooter(`suggestion by ${message.author.id}`)
        .setTimestamp();
    const messageSent = await message.channel.send({ embeds: [embed] });
    message.delete();
    messageSent.react("⬆️");
    messageSent.react("⬇️");
};
