const { MessageEmbed } = require("discord.js");
const noplayersEmbed = require("../../utils/embeds/noPlayersEmbed");
module.exports = {
    name: "volume",
    aliases: ["vol", "sound"],
    category: "music",
    description: "Get or set the volume of song.",
    run: async (message, args) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue) {
            return noplayersEmbed(message);
        }
        if (!args.length) {
            const currentQueueVolume = queue.volume;
            currentQueueVolume > 50 ? message.react("🔊") : message.react("🔉");
            const currentQueueVolumeEmbed = new MessageEmbed()
                .setColor(3092790)
                .setDescription(
                    `Current Queue Volume is **${currentQueueVolume}**`
                );
            return message.channel.send({ embeds: [currentQueueVolumeEmbed] });
        }
        const volumeToBeSet = parseInt(args[0]);
        if (isNaN(volumeToBeSet)) {
            message.react("❌");
            const enterAValidNumberAsArgumentEmbed = new MessageEmbed()
                .setColor(15548997)
                .setDescription(
                    ":x: Please Enter a Valid Number to set Volume!"
                );
            return message.channel.send({
                embeds: [enterAValidNumberAsArgumentEmbed],
            });
        }
        if (volumeToBeSet > 100 || volumeToBeSet < 0) {
            message.react("❌");
            const enterNumberBetween1And100Embed = new MessageEmbed()
                .setColor(15548997)
                .setDescription(":x: Please Enter a Number Between 1 and 100.");
            return message.channel.send({
                embeds: [enterNumberBetween1And100Embed],
            });
        }
        player.setVolume(message, volumeToBeSet);
        volumeToBeSet > 50 ? message.react("🔊") : message.react("🔉");
        const volumeSetEmbed = new MessageEmbed()
            .setColor(3092790)
            .setDescription(`Queue Volume Set to **${queue.volume}**`);
        return message.channel.send({ embeds: [volumeSetEmbed] });
    },
};
