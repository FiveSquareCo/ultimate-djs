const { Message, MessageEmbed } = require("discord.js");
const chatRankingDB = require("../../schemas/chatRankSchema");

module.exports = {
    name: "chatrankboard",
    aliases: ["clb", "chatlb"],
    cooldown: 3000,
    /**
     *
     * @param {Message} message
     */
    run: async (message) => {
        let desc = "";

        const guildId = message.guild.id;

        const results = await chatRankingDB
            .find({
                guildId,
            })
            .sort({
                level: -1,
                xp: -1,
            })
            .limit(10);
        if (!results) {
            return message.reply("No Ranks");
        }
        for (let counter = 0; counter < results.length; ++counter) {
            const { userId, level, xp, messages } = results[counter];
            let user =
                message.client.users.cache.get(userId) ||
                (await message.client.users.fetch(userId));
            desc += `**#${counter + 1} ${user.tag} **
            **- Level:** ${level} , **Xp:** ${xp} , **Messages:** ${messages}
            \n`;
        }
        const lbEmbed = new MessageEmbed()
            .setDescription(desc)
            .setColor(3092790)
            .setAuthor(message.guild.name)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setTitle("Chat Ranking Leaderboard")
            .setFooter("Top 10 Ranks as of")
            .setTimestamp();
        message.reply({ embeds: [lbEmbed] });
    },
};
