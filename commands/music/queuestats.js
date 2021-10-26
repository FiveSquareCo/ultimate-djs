const { MessageEmbed } = require("discord.js");
const noplayersEmbed = require("../../utils/embeds/noPlayersEmbed");
module.exports = {
    name: "queuestats",
    aliases: ["qs", "questats"],
    category: "music",
    description: "Get or set the volume of song.",
    run: async (message) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue) {
            return noplayersEmbed(message);
        }
        const queueStats = message.client.playerStatus(queue, false);
        const queueStatsEmbed = new MessageEmbed()
            .setAuthor("Queue Stats")
            .setColor(3092790)
            .setDescription(
                `Total Duration: ${queue.formattedDuration}\n${queueStats}`
            );
        message.channel.send({ embeds: [queueStatsEmbed] });
    },
};
