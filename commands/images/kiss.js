const { MessageEmbed, MessageAttachment, User } = require("discord.js");
const { Canvacord } = require("canvacord");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
module.exports = {
    name: "kiss",
    cooldown: "3000",
    run: async (message, args) => {
        const user = message.author;
        const userToKiss =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.cache.get(args[0])));
        if (!(userToKiss instanceof User)) {
            return errorMessageEmbed(
                message,
                "You need to mention a user to kiss."
            );
        }
        const avatar1 = user.displayAvatarURL({
            dynamic: false,
            format: "png",
        });
        const avatar2 = userToKiss.displayAvatarURL({
            dynamic: false,
            format: "png",
        });
        const kissImage = await Canvacord.kiss(avatar1, avatar2);
        const attachment = new MessageAttachment(
            kissImage,
            "FSX_BOT_TEMPLATE_IMAGE_MANUPLATION_kiss.png"
        );
        const triggeredEmbed = new MessageEmbed()
            .setTitle(`${user.tag} Kisses ${userToKiss.tag}`)
            .setColor(3092790)
            .setImage(
                `attachment://FSX_BOT_TEMPLATE_IMAGE_MANUPLATION_kiss.png`
            );

        message.reply({ embeds: [triggeredEmbed], files: [attachment] });
    },
};
