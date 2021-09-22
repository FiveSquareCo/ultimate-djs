const { MessageEmbed, MessageAttachment } = require("discord.js");
const { Canvacord } = require("canvacord");
module.exports = {
    name: "jail",
    cooldown: "3000",
    run: async (message, args) => {
        const user =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.fetch(args[0]))) ||
            message.author;
        const avatar = user.displayAvatarURL({ dynamic: false, format: "png" });
        const jailImage = await Canvacord.jail(avatar, false);
        const attachment = new MessageAttachment(
            jailImage,
            "FSX_BOT_TEMPLATE_IMAGE_MANUPLATION_jail.gif"
        );
        const triggeredEmbed = new MessageEmbed()
            .setTitle(` ${user.tag} is behind bars!`)
            .setColor(3092790)
            .setImage(
                `attachment://FSX_BOT_TEMPLATE_IMAGE_MANUPLATION_jail.gif`
            );

        message.reply({ embeds: [triggeredEmbed], files: [attachment] });
    },
};
