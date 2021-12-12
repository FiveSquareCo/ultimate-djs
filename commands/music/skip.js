const { noMusicAroundYouEmbed, errorEmbed } = require("../../utils/embeds");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "skip",
    aliases: ["next"],
    category: "music",
    description: "Skips the current song in queue.",
    run: (message) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue) {
            return noMusicAroundYouEmbed(message);
        }
        if (queue.songs.length <= 1) {
            message.react("❌");
            return errorEmbed(
                message,
                ":x: There are no songs in queue to skip, please play some songs and then skip."
            );
        }
        message.react("⏭️");
        player.skip(message);
        const stoppedPlayingEmbed = new MessageEmbed()
            .setDescription(
                `Skipped [${queue.songs[0].name}](${queue.songs[0].url})`
            )
            .setColor(3092790);
        message.channel.send({ embeds: [stoppedPlayingEmbed] });
    },
};
