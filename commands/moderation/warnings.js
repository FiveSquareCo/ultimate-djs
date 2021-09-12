const { MessageEmbed } = require("discord.js");
const warningsDB = require("../../schemas/warningSchema");
const errorEmbed = require("../../utils/embeds/errorEmbed");
const tag = require("../../utils/functions/getUserTag");
module.exports = {
    name: "warnings",
    requiredPermission: "MANAGE_MESSAGES",
    run: async (message, args) => {
        const guildId = message.guildId;
        const user =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.fetch(args[0]))) ||
            message.author;
        if (!user) {
            return errorEmbed(message, "Please mention a valid user.");
        }
        const warnings = await warningsDB.findOne({
            guildId,
            userId: user.id,
        });
        if (!warnings || !warnings.warnings.length) {
            const noWarningsForUser = new MessageEmbed()
                .setDescription(`0 Warnings for user **${tag(user)}**`)
                .setColor(3092790);
            return message.reply({ embeds: [noWarningsForUser] });
        }
        const noOfWarns = warnings.warnings.length;
        let reply = "";
        warnings.warnings.forEach((warn, num) => {
            const { id, moderator, reason, timestamp } = warn;
            const mod = message.guild.members.cache.get(moderator);
            reply += `${num + 1} **ID  :** ${id} \n**On  :** ${new Date(
                timestamp
            ).toDateString()} **Warned By  :** ${tag(
                mod.user
            )}\n**Reason  :** '${reason}'\n\n`;
        });
        const warningsEmbed = new MessageEmbed()
            .setDescription(reply)
            .setTitle(`**${noOfWarns}** Warn(s) for **${tag(user)}**`)
            .setColor(3092790)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        message.reply({ embeds: [warningsEmbed] });
    },
};
