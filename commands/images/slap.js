const { MessageEmbed, MessageAttachment, User } = require("discord.js");
const { Canvacord } = require("canvacord");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
module.exports = {
    name: "slap",
    cooldown: "3000",
    run: async (message, args) => {
        const user = message.author;
        const userToSlap =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.cache.get(args[0])));
        if (!(userToSlap instanceof User)) {
            return errorMessageEmbed(
                message,
                "You need to mention a user to slap."
            );
        }
        const avatar1 = user.displayAvatarURL({
            dynamic: false,
            format: "png",
        });
        const avatar2 = userToSlap.displayAvatarURL({
            dynamic: false,
            format: "png",
        });
        const slapImage = await Canvacord.slap(avatar1, avatar2);
        const attachment = new MessageAttachment(
            slapImage,
            "FSX_BOT_TEMPLATE_IMAGE_MANUPLATION_slap.png"
        );
        const triggeredEmbed = new MessageEmbed()
            .setTitle(`${user.tag} slaps ${userToSlap.tag}`)
            .setColor(3092790)
            .setImage(
                `attachment://FSX_BOT_TEMPLATE_IMAGE_MANUPLATION_slap.png`
            );

        message.reply({ embeds: [triggeredEmbed], files: [attachment] });
    },
};
