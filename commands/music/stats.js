const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "stats",
    aliases: ["sts"],
    cooldown: 3000,
    description: "give users ping",
    category: "music",
    run: async (message, args) => {
        const currentSong = message.client.player.getQueue(message).songs[0];
        const songStatsEmbed = new MessageEmbed()
            .setAuthor("Song Stats")
            .setFooter(`Req. by. ${message.author.tag}`)
            .setTimestamp()
            .setColor(3092790)
            .setThumbnail(currentSong.thumbnail)
            .setTitle(currentSong.name)
            .setDescription(
                `:small_blue_diamond: **Added to Queue by :** ${
                    currentSong.user.tag
                }\n\n****Stats :***\n:small_blue_diamond: **Views :** ${
                    currentSong.views
                }\n:small_blue_diamond: **Likes :** ${
                    currentSong.likes
                }\n:small_blue_diamond: **Duration :** ${
                    currentSong.formattedDuration
                }\n:small_blue_diamond: **Publisher :** [${
                    currentSong.uploader.name
                }](${
                    currentSong.uploader.url
                })\n:small_blue_diamond: **Live :** ${
                    currentSong.isLive ? "Yes" : "No"
                }\n\n****Note :*** *All the stats are taken from youtube*`
            );
        message.channel.send({ embeds: [songStatsEmbed] });
    },
};
