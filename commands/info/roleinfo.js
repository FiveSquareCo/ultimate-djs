const { MessageEmbed } = require("discord.js");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");

module.exports = {
    name: "roleinfo",
    aliases: ["rolei", "ri", "aboutrole"],
    cooldown: 3000,
    description: "give users ping",
    category: "misc",
    run: async (message, [id]) => {
        const role =
            message.mentions.roles.first() || message.guild.roles.cache.get(id);
        if (!role) {
            return errorMessageEmbed(
                message,
                "Please enter a valid role/ role id"
            );
        }
        const timestamp = `<t:${(
            new Date(role.createdTimestamp) / 1000
        ).toFixed()}:R>`;
        const managed = role.managed ? "Yes" : "No";
        const hoist = role.hoist ? "Yes" : "No";
        const mention = role.mentionable ? "Yes" : "No";
        const permissions = role.permissions.toArray().join(", ");
        const roleinfoEmbed = new MessageEmbed()
            .setColor(role.hexColor)
            .setTimestamp()
            .setAuthor("Role information")
            .setDescription(
                `:white_small_square: **Name :** ${role.name} \n:white_small_square: **Id :** ${role.id} \n :white_small_square: **Color :** ${role.hexColor} \n :white_small_square: **Created on :** ${timestamp} \n :white_small_square: **Managed :** ${managed} \n :white_small_square: **Displayed seperately :** ${hoist} \n :white_small_square: **Members :** ${role.members.size} \n :white_small_square: **Mentionable :** ${mention} \n :white_small_square: **Permissions :** \`\`\`${permissions}\`\`\` `
            );
        message.reply({ embeds: [roleinfoEmbed] });
    },
};
