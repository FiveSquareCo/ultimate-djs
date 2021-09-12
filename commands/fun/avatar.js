const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "avatar",
    aliases: ["av", "pfp"],
    cooldown: 3000,
    run: async (message, args) => {
        const user =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.fetch(args[0]))) ||
            message.author;
        const url = user.displayAvatarURL({ dynamic: true, size: 512 });
        const avEmbed = new MessageEmbed()
            .setTitle(`Avatar of *${user.tag}*`)
            .setImage(url)
            .setURL(url)
            .setColor(3092790);
        message.reply({ embeds: [avEmbed] });
    },
};
