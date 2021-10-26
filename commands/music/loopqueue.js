const { MessageEmbed } = require("discord.js");
const noplayersEmbed = require("../../utils/embeds/noPlayersEmbed");
module.exports = {
    name: "loopqueue",
    category: "music",
    description: "",
    aliases: ["1q", "loopq", "loopque", "lque", "lqueue"],
    run: async (message) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue) {
            return noplayersEmbed(message);
        }
        const isAlreadyLooping = {
            song: false,
            queue: false,
        };
        switch (queue.repeatMode) {
            case 0:
                break;
            case 1:
                isAlreadyLooping.song = true;
                break;
            case 2:
                isAlreadyLooping.queue = true;
                break;
            default:
                break;
        }
        if (isAlreadyLooping.song) {
            message.react("❌");
            const songIsAlreadyLoopingEmbed = new MessageEmbed()
                .setColor(15548997)
                .setDescription(
                    ":x: The Current Song is Already looping, cannot loop the Queue when a song is Looping, turn off the song loop then try again."
                );
            return message.channel.send({
                embeds: [songIsAlreadyLoopingEmbed],
            });
        }
        if (isAlreadyLooping.queue) {
            player.setRepeatMode(message, 0);
            message.react("🔁");
            const stoppedLoopingQueue = new MessageEmbed()
                .setColor(3092790)
                .setDescription("Stopped Looping the Queue!");
            return message.channel.send({ embeds: [stoppedLoopingQueue] });
        }
        message.react("🔁");
        player.setRepeatMode(message, 2);
        const startedLoopingQueue = new MessageEmbed()
            .setColor(3092790)
            .setDescription("Started Looping The Queue!");
        return message.channel.send({ embeds: [startedLoopingQueue] });
    },
};
