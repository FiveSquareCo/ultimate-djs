const successMessageEmbed = require("../../utils/embeds/sucessEmbed");
const { MessageEmbed } = require("discord.js");
module.exports = async (client, data) => {
    data.member.timeout(data.seconds * 1000, data.reason);
    const { user } = data.member;
    const type = data.type === "Command" ? "Moderator" : "Automod";
    successMessageEmbed(data.interaction, `**${user.tag}** has been Muted for ${data.duration} ${data.durationType} | **reason:** ${data.reason}`);
    const userEmbed = new MessageEmbed().setColor(15548997).setDescription(`You were Muted in **${data.interaction.guild.name}** by ${type} for ${data.duration} ${data.durationType} |  **reason:** ${data.reason}`);
    user.send({ embeds: [userEmbed] }).catch();
};
