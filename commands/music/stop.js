const noplayersEmbed = require("../../utils/embeds/noPlayersEmbed");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "stop",
    aliases: ["end"],
    category: "music",
    description: "Skips the current song in queue.",
    run: (message) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue) {
            return noplayersEmbed(message);
        }
        message.react("🛑");
        player.stop(queue);
        const stoppedPlayingEmbed = new MessageEmbed()
            .setDescription("Stopped playing music!")
            .setColor(3092790);
        message.channel.send({ embeds: [stoppedPlayingEmbed] });
    },
};
