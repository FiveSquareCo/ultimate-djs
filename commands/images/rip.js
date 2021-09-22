const { MessageEmbed, MessageAttachment } = require("discord.js");
const { Canvacord } = require("canvacord");
module.exports = {
    name: "rip",
    cooldown: "3000",
    run: async (message, args) => {
        const user =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.fetch(args[0]))) ||
            message.author;
        const avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
        const ripImage = await Canvacord.rip(avatar);
        const attachment = new MessageAttachment(
            ripImage,
            "FSX_BOT_TEMPLATE_IMAGE_MANUPLATION_rip.gif"
        );
        const triggeredEmbed = new MessageEmbed()
            .setTitle(`Rip ${user.tag}`)
            .setColor(3092790)
            .setImage(
                `attachment://FSX_BOT_TEMPLATE_IMAGE_MANUPLATION_rip.gif`
            );

        message.reply({ embeds: [triggeredEmbed], files: [attachment] });
    },
};
