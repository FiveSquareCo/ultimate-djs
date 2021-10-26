const { MessageEmbed } = require("discord.js");
const noplayersEmbed = require("../../utils/embeds/noPlayersEmbed");
module.exports = {
    name: "disconnect",
    aliases: ["dc", "exit", "leave"],
    category: "music",
    description: "Disconnect From a Voice Channel.",
    run: async (message) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue) {
            return noplayersEmbed(message);
        }
        message.react("👋");
        const disconnectedEmbed = new MessageEmbed()
            .setColor(3092790)
            .setDescription("Disconnected From Voice Channel!");
        message.channel.send({ embeds: [disconnectedEmbed] });
        queue.voice.leave();
    },
};
