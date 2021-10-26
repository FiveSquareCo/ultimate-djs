const { MessageEmbed } = require("discord.js");

module.exports = (message) => {
    const queue = message.client.player.getQueue(message);
    const { channel } = message.member.voice;
    if (!channel) {
        message.react("❌");
        const notInVoiceChannelEmbed = new MessageEmbed()
            .setColor(15548997)
            .setDescription(
                ":x: You need to join a Voice Channel to use this command."
            );
        message.channel.send({ embeds: [notInVoiceChannelEmbed] });
        return false;
    }
    if (
        queue &&
        queue.playing &&
        channel.id != message.guild.me.voice.channel.id
    ) {
        message.react("❌");
        const notInSameVoiceChannelEmbed = new MessageEmbed()
            .setColor(15548997)
            .setDescription(
                `:x: You are not in a voice channel where music is being played,\nPlease Join <#${message.guild.me.voice.channel.id}> To use Music Commands.`
            );
        message.channel.send({ embeds: [notInSameVoiceChannelEmbed] });
        return false;
    }
    return true;
};
