const noplayersEmbed = require("../../utils/embeds/noPlayersEmbed");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "skipto",
    aliases: ["jump"],
    category: "music",
    run: async (message, args) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue) {
            return noplayersEmbed(message);
        }
        const queueLength = queue.songs.length;
        const jumpToNumber = parseInt(args[0]);
        if (isNaN(jumpToNumber)) {
            message.react("❌");
            const enterAvalidNumberEmbed = new MessageEmbed()
                .setColor(15548997)
                .setDescription(":x: Please Emter A Valid Number To Skip!");
            return message.channel.send({ embeds: [enterAvalidNumberEmbed] });
        }
        if (queueLength <= jumpToNumber) {
            message.react("❌");
            const enteredNumberIsMoreThanQueueEmbed = new MessageEmbed()
                .setDescription(
                    ":x: The Number You Entered Is Bigger than Queue Length!"
                )
                .setColor(15548997);
            return message.channel.send({
                embeds: [enteredNumberIsMoreThanQueueEmbed],
            });
        }
        const { songs } = await player.jump(message, jumpToNumber);
        message.react("👌");
        const JumpedSuccessfullyEmbed = new MessageEmbed()
            .setColor(3092790)
            .setDescription(
                `Jumped ${queueLength - songs.length} The Track Successfully!`
            );
        return message.channel.send({ embeds: [JumpedSuccessfullyEmbed] });
    },
};
