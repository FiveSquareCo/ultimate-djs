const { MessageEmbed } = require("discord.js");
const noplayersEmbed = require("../../utils/embeds/noPlayersEmbed");
module.exports = {
    name: "resume",
    aliases: ["res", "unhold", "continue"],
    category: "music",
    description: "Resume The Paused Music!",
    run: async (message) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue) {
            return noplayersEmbed(Discord, message);
        }
        if (queue.playing || !queue.paused) {
            message.react("❌");
            const alreadyPlayingTheMusicEmbed = new MessageEmbed()
                .setColor(15548997)
                .setDescription(":x: Music Is Not Paused to Resume!");
            return message.channel.send({
                embeds: [alreadyPlayingTheMusicEmbed],
            });
        }
        message.react("▶️");
        player.resume(message);
        const resumedMusicEmbed = new MessageEmbed()
            .setColor(3092790)
            .setDescription("Resumed The Music!");
        message.channel.send({ embeds: [resumedMusicEmbed] });
    },
};
