const modmailDB = require("../../schemas/modmailSchema");
const { category_id, working } =
    require("../../configs/features.json").mod_mail;
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
module.exports = {
    name: "mreply",
    aliases: ["mrep"],
    run: async (message, args) => {
        if (!working || category_id === "category_id_here") {
            return errorMessageEmbed(
                message,
                "This command is disabled by admin."
            );
        }
        if (message.channel.parentId != category_id) {
            return errorMessageEmbed(
                message,
                "You only use this command in modmail channels"
            );
        }
        const results = await modmailDB.findOne({
            guildId: message.guild.id,
            channelid: message.channel.id,
        });
        if (!results) {
            return errorMessageEmbed(
                message,
                "This is not a modmail channel/there is no ticket opened in this channel."
            );
        }
        const user =
            message.guild.members.cache.get(results.userId) ||
            (await message.guild.members.fetch(results.userId));
        let messageUpdate = `**${message.author.tag}** -- ${args.join(" ")}`;

        if (message.attachments.size > 0) {
            const attachment = message.attachments.cache.first();
            messageUpdate += attachment.url;
        }
        await modmailDB.findOneAndUpdate(
            { guildId: message.guild.id, userId: user.id },
            {
                guildId: message.guild.id,
                userId: user.id,
                $push: {
                    conversation: messageUpdate,
                },
            },
            { upsert: true }
        );
        user.send({ content: messageUpdate }).catch((e) => null);
        return errorMessageEmbed(message, "Message sent");
    },
};
