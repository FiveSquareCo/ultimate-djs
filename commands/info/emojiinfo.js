const { Util, MessageEmbed } = require("discord.js");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
module.exports = {
    name: "emojiinfo",
    aliases: ["einfo", "aboutemoji"],
    cooldown: 3000,
    description: "give users ping",
    category: "misc",
    run: async (message, [emote]) => {
        const { id } = Util.parseEmoji(emote);
        if (!id) {
            return errorMessageEmbed(
                message,
                "Please enter valid emoji/emoji id"
            );
        }
        const emoji = message.guild.emojis.cache.get(id);
        if (!emoji) {
            return errorMessageEmbed(
                message,
                "The mentioned emoji doesnot exist in this server, enter an emoji from this server!"
            );
        }
        const anim = emoji.animated ? "Yes" : "No";
        const author = await emoji.fetchAuthor();
        const date = (new Date(emoji.createdTimestamp) / 1000).toFixed();
        const emojiInfoEmbed = new MessageEmbed()
            .setAuthor("Emoji Information")
            .setColor(3092790)
            .setDescription(
                `:white_small_square: **Name :**${emoji.name} \n :white_small_square: **Id :**${emoji.id}\n :white_small_square: **Animated :** ${anim}\n :white_small_square: **Added by :** ${author.tag} - ${author.id}\n:white_small_square: **Added on :** <t:${date}:R> \n :white_small_square: **Usage :** \`${emote}\` `
            )
            .setImage(emoji.url)
            .setTimestamp();
        message.reply({ embeds: [emojiInfoEmbed] });
    },
};
