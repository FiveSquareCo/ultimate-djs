const chatRankingDB = require("../../schemas/chatRankSchema");
const { MessageEmbed } = require("discord.js");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");

module.exports = {
    name: "userchatrank",
    aliases: ["rank", "messages", "level"],
    cooldown: 3000,
    description: "give users ping",
    category: "misc",
    run: async (message, args) => {
        const user =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.fetch(args[0]))) ||
            message.author;
        const userId = user.id;
        const guildId = message.guildId;
        const results = await chatRankingDB.findOne({ guildId, userId });
        if (!results) {
            return errorMessageEmbed(
                message,
                "You dont have any level, first send some mesages then check back!"
            );
        }
        const { level, xp, messages } = results;
        const result = await chatRankingDB
            .find({
                guildId,
            })
            .sort({
                level: -1,
                xp: -1,
            });
        let userRank;
        for (let i = 0; i < result.length; i++) {
            if (result[i].userId === userId) {
                userRank = i + 1;
            }
        }
        const userRnakEmbed = new MessageEmbed()
            .setColor(3092790)
            .setAuthor(`Chat Rank of ${user.tag}`)
            .setDescription(
                ` :dizzy: **Xp :** ${xp} \n :speech_balloon: **Messages :** ${messages}  \n:trophy: **level :** ${level} \n:bar_chart: **Rank :** ${userRank}`
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setFooter(`${message.guild.name} Rankings`)
            .setTimestamp();
        message.reply({ embeds: [userRnakEmbed] });
    },
};
