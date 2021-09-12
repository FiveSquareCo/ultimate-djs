const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "membercount",
    aliases: ["mc", "stats"],
    cooldown: 3000,
    description: "give users ping",
    category: "misc",
    run: async (message) => {
        const memberCountEmbed = new MessageEmbed()
            .setDescription(`${message.guild.memberCount}`)
            .setColor(3092790)
            .setAuthor("Members")
            .setTimestamp();
        message.channel.send({ embeds: [memberCountEmbed] });
    },
};
