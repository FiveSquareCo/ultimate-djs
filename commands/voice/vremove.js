const joinToCreateDB = require("../../schemas/voiceJ2CSchema");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const successMessageEmbed = require("../../utils/embeds/sucessEmbed");
const { working, channels_type, channel_id } =
    require("../../configs/features.json").join_to_create;

module.exports = {
    name: "vremove",
    aliases: ["vrem", "vremove"],
    cooldown: 3000,
    run: async (message, args) => {
        if (working && channels_type != "PRIVATE") {
            return errorMessageEmbed(
                message,
                "This command is disabled because this server's J2C Voice channels are Public"
            );
        }
        const { id, tag } =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.fetch(args[0])));
        const results = await joinToCreateDB.findOne({
            guildId: message.guild.id,
            userId: message.author.id,
        });
        if (!results) {
            return errorMessageEmbed(
                message,
                `You dont have any active J2C Voice Channels.`
            );
        }
        if (!results.invites.includes(id)) {
            return errorMessageEmbed(
                message,
                `The given user is not in your users list!`
            );
        }
        const updatedResults = await joinToCreateDB.findOneAndUpdate(
            { guildId: message.guild.id, userId: message.author.id },
            {
                guildId: message.guild.id,
                userId: message.author.id,
                $pull: {
                    invites: id,
                },
            },
            {
                upsert: true,
                new: true,
            }
        );
        if (updatedResults.invites.length < results.invites.length) {
            successMessageEmbed(
                message,
                `Removed **${tag}** from your J2C invites`
            );
        }
    },
};
