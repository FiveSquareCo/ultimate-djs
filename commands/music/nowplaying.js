const noplayersEmbed = require("../../utils/embeds/noPlayersEmbed");
const getMs = require("../../utils/functions/getMS");
const path = require("path");
const firstLetterCapital = require("../../utils/functions/firstLetterCapital");

const Canvas = require("canvas");
const { MessageAttachment, MessageEmbed } = require("discord.js");

module.exports = {
    name: "nowplaying",
    aliases: ["np", "current", "cs", "playing"],
    category: "music",
    run: async (message) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue || !queue.songs[0]) {
            return noplayersEmbed(message);
        }
        const currentSong = queue.songs[0];
        const songArtistName = currentSong.uploader.name;
        const percentageCompleted = Math.floor(
            (getMs(queue.formattedCurrentTime) /
                getMs(currentSong.formattedDuration)) *
                100
        );
        Canvas.registerFont(
            path.join(__dirname + "../../../assets/ManropeRegular.ttf"),
            {
                family: "Manrope",
            }
        );
        const progressTrack = (percentageCompleted / 100) * 300;
        const canvas = Canvas.createCanvas(600, 150);
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        const songThumbnail = await Canvas.loadImage(
            `https://img.youtube.com/vi/${currentSong.id}/mqdefault.jpg`
        );
        ctx.drawImage(songThumbnail, 30, 15, 120, 120);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 20px Manrope";
        ctx.fillText(`${currentSong.name.substring(0, 31)}...`, 170, 40);
        ctx.fillStyle = "#F1F1F1";
        ctx.font = "14px Manrope";
        ctx.fillText(`By ${songArtistName}`, 170, 70);
        ctx.fillStyle = "#F1F1F1";
        ctx.font = "14px Manrope";
        ctx.fillText(
            `On ${firstLetterCapital(message.client.user.username)} Music`,
            170,
            90
        );
        ctx.fillStyle = "#B3B3B3";
        ctx.font = "14px Manrope";
        ctx.fillText(queue.formattedCurrentTime, 170, 130);
        ctx.fillStyle = "#B3B3B3";
        ctx.font = "10px Manrope";
        ctx.fillText(currentSong.formattedDuration, 430, 130);
        ctx.rect(170, 170, 300, 4);
        ctx.fillStyle = "#E8E8E8";
        ctx.fillRect(170, 110, 300, 4);
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(170, 110, progressTrack, 4);
        const attachment = new MessageAttachment(
            canvas.toBuffer(),
            "nowplaying.png"
        );
        const nowPlayingEmbed = new MessageEmbed()
            .setColor(3092790)
            .setImage("attachment://nowplaying.png")
            .setAuthor("Now Playing");
        message.channel.send({
            embeds: [nowPlayingEmbed],
            files: [attachment],
        });
    },
};
