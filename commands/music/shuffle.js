const { MessageEmbed } = require("discord.js");
const noplayersEmbed = require("../../utils/embeds/noPlayersEmbed");
module.exports = {
    name: "shuffle",
    aliases: ["mix", "rearrange"],
    category: "music",
    description: "Shuffle all the songs in Queue.",
    run: async (message) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue) {
            noplayersEmbed(message);
        }
        if (queue.songs.length < 3) {
            message.react("❌");
            const lessSongsInQueueToShuffleEmbed = new MessageEmbed()
                .setColor(15548997)
                .setDescription(
                    `:x: There should be more than 3 songs in Queue to Shuffle.`
                );
            return message.channel.send({
                embeds: [lessSongsInQueueToShuffleEmbed],
            });
        }
        player.shuffle(message);
        const shuffledQueueEmbed = new MessageEmbed()
            .setColor(3092790)
            .setDescription(
                `Shuffled **${queue.songs.length}** Songs in Queue!`
            );

        return message.channel.send({ embeds: [shuffledQueueEmbed] });
    },
};
