const { MessageEmbed } = require("discord.js");
const noplayersEmbed = require("../../utils/embeds/noPlayersEmbed");
module.exports = {
    name: "looptrack",
    category: "music",
    description: "",
    aliases: ["lt", "loopt", "looptrack", "ltrack", "loopsong", "lsong"],
    run: async (message) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue) {
            return noplayersEmbed(message);
        }
        const isAlreadyLooping = {
            queue: false,
            song: false,
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
        if (isAlreadyLooping.queue) {
            message.react("❌");
            const songIsAlreadyLoopingEmbed = new MessageEmbed()
                .setColor(15548997)
                .setDescription(
                    ":x: The Current Queue is Already looping, cannot loop the Track when Queue is Looping, turn off the Queue loop then try again."
                );
            return message.channel.send({
                embeds: [songIsAlreadyLoopingEmbed],
            });
        }
        if (isAlreadyLooping.song) {
            player.setRepeatMode(message, 0);
            message.react("🔂");
            const stoppedLoopingQueue = new MessageEmbed()
                .setColor(3092790)
                .setDescription("Stopped Looping the Track!");
            return message.channel.send({ embeds: [stoppedLoopingQueue] });
        }
        message.react("🔂");
        player.setRepeatMode(message, 1);
        const startedLoopingQueue = new MessageEmbed()
            .setColor(3092790)
            .setDescription("Started Looping The Track!");
        return message.channel.send({ embeds: [startedLoopingQueue] });
    },
};
