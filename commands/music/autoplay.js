const { MessageEmbed } = require("discord.js");
const noplayersEmbed = require("../../utils/embeds/noPlayersEmbed");
module.exports = {
    name: "autoplay",
    aliases: ["ap"],
    category: "music",
    run: async (message) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue) {
            return noplayersEmbed(message);
        }
        const autoplayStatus = player.toggleAutoplay(message);
        const toggledAutoplayEmbed = new MessageEmbed()
            .setColor(3092790)
            .setDescription(
                `Autoplay is Turned ${autoplayStatus ? "**On**" : "**Off**"}`
            );
        return message.channel.send({ embeds: [toggledAutoplayEmbed] });
    },
};
