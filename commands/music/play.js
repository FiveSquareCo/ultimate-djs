const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "play",
    aliases: ["p"],
    cooldown: 3000,
    description: "give users ping",
    category: "music",
    run: async (message, args) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (queue?.paused && !args.length) {
            message.react("▶️");
            player.resume(message);
            const resumedMusicEmbed = new MessageEmbed()
                .setColor(3092790)
                .setDescription("Resumed the music!");
            return message.channel.send({ embeds: [resumedMusicEmbed] });
        }
        if (!args.length) {
            message.react("❌");
            const noSongTextEmbed = new MessageEmbed()
                .setColor(15548997)
                .setDescription(
                    ":x: Please Enter Song name or Song Link to play."
                );
            return message.channel.send({ embeds: [noSongTextEmbed] });
        }
        if (args[0] === "ytp") {
            if (!args[1]) {
                message.react("❌");
                const noPlaylistID = new MessageEmbed()
                    .setColor(15548997)
                    .setDescription(":x: Please Enter Youtube Playlist ID");
                return message.channel.send({ embeds: [noPlaylistID] });
            }
            const playListURL = `https://www.youtube.com/playlist?list=${args[1]}`;
            message.react("👌");
            return player.play(message, playListURL);
        }
        message.react("👌");
        player.play(message, args.join(" "));
    },
};
