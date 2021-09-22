const { MessageEmbed, MessageAttachment } = require("discord.js");
const { Canvacord } = require("canvacord");
module.exports = {
    name: "trigger",
    cooldown: "3000",
    run: async (message, args) => {
        const user =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.fetch(args[0]))) ||
            message.author;
        const avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
        const triggeredImage = await Canvacord.trigger(avatar);
        const attachment = new MessageAttachment(
            triggeredImage,
            "FSX_BOT_TEMPLATE_IMAGE_MANUPLATION_triggered.gif"
        );
        const triggeredEmbed = new MessageEmbed()
            .setTitle(`Triggered ${user.tag}`)
            .setColor(3092790)
            .setImage(
                `attachment://FSX_BOT_TEMPLATE_IMAGE_MANUPLATION_triggered.gif`
            );

        message.reply({ embeds: [triggeredEmbed], files: [attachment] });
    },
};
