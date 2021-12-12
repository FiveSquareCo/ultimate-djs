const noplayersEmbed = require("../../utils/embeds/noPlayersEmbed");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "pause",
    aliases: ["pse", "hold"],
    category: "music",
    description: "Pause The playing Music!",
    run: async (message) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue) {
            return noplayersEmbed(message);
        }
        if (queue.paused) {
            message.react("❌");
            const alreadyPausedTheMusicEmbed = new MessageEmbed()
                .setColor(3092790)
                .setDescription(":x: Already Paused The Music!");
            return message.channel.send({
                embeds: [alreadyPausedTheMusicEmbed],
            });
        }
        message.react("⏸️");
        player.pause(message);
        const pausedMusicEmbed = new MessageEmbed()
            .setColor(3092790)
            .setDescription(
                `Paused the music at [${queue.formattedCurrentTime}](${queue.songs[0].url})`
            );
        message.channel.send({ embeds: [pausedMusicEmbed] });
    },
};
