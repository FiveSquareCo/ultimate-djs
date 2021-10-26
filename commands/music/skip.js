const noplayersEmbed = require("../../utils/embeds/noPlayersEmbed");
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
            return noplayersEmbed(message);
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
