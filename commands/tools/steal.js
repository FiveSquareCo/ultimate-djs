const { Util, MessageEmbed } = require("discord.js");
const errorEmbed = require("../../utils/embeds/errorEmbed");

module.exports = {
    name: "steal",
    requiredPermission: "MANAGE_EMOJIS_AND_STICKERS",
    run: (message, args) => {
        if (!args.length) {
            return;
        }
        const emoji = args[0];
        const getEmoji = Util.parseEmoji(emoji);
        if (getEmoji.id) {
            const emojiExt = getEmoji.animated ? ".gif" : ".png";
            const emojiURL = `https://cdn.discordapp.com/emojis/${
                getEmoji.id + emojiExt
            }`;
            message.guild.emojis
                .create(emojiURL, getEmoji.name)
                .then((emoji) => {
                    const replyEmbed = new MessageEmbed()
                        .setColor(3092790)
                        .setDescription(
                            `Added ${emoji} with the name "${emoji.name}"`
                        );
                    return message.reply({ embeds: [replyEmbed] });
                });
            return;
        }
        return errorEmbed(
            message,
            "Mention a valid custom emoji from any other server."
        );
    },
};
