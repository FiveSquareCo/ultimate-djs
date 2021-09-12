const joinToCreateDB = require("../../schemas/voiceJ2CSchema");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const { working, channels_type, channel_id } =
    require("../../configs/features.json").join_to_create;
module.exports = {
    name: "voicerequest",
    aliases: ["vreq", "vrequest"],
    cooldown: 3000,
    run: async (message, args) => {
        if (working && channels_type != "PRIVATE") {
            return errorMessageEmbed(
                message,
                "This command is disabled because this server's J2C Voice channels are Public"
            );
        }
        const guildId = message.guildId;
        const owner =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.fetch(args[0])));
        const results = await joinToCreateDB.findOne({
            guildId,
            userId: owner.id,
        });
        if (!results) {
            return errorMessageEmbed(
                message,
                `There is no J2C Voice channel made for **${owner.tag}**`
            );
        }
        if (results.invites.length >= 2) {
            return errorMessageEmbed(
                message,
                `The user already did 2 invites, wait untill the user clear them or ask them to clear.`
            );
        }
    },
};
