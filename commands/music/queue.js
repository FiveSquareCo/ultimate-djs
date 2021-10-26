const firstLetterCapital = require("../../utils/functions/firstLetterCapital");
const noPlayersEmbed = require("../../utils/embeds/noPlayersEmbed");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "queue",
    aliases: ["que", "q", "songlist"],
    category: "music",
    run: async (message, args) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!queue) {
            return noPlayersEmbed(message);
        }

        const emojiList = ["⏪", "⏩"];
        const songsArray = [...queue.songs];
        const currentSong = songsArray.shift();
        const nowPlaying = `**Now Playing  :**\n[${currentSong.name.substring(
            0,
            36
        )}](${currentSong.url})\nDuration: ${
            currentSong.formattedDuration
        } | Requested by: <@${currentSong.user.id}>\n`;
        const n = 10;
        if (queue.songs.length < n) {
            let ComingNextDesc = "";
            songsArray.forEach((song) => {
                ComingNextDesc += `:small_blue_diamond:  [${song.name.substring(
                    0,
                    38
                )}...](${song.url})\n Duration: ${
                    song.formattedDuration
                } | Requested by: <@${song.user.id}>\n\n`;
            });
            const queueEmbed = new MessageEmbed()
                .setAuthor(
                    `${firstLetterCapital(message.client.user.username)} Queue`
                )
                .setColor(3092790)
                .setThumbnail(currentSong.thumbnail)
                .setDescription(
                    `${message.client.playerStatus(
                        queue,
                        false
                    )}\n **Total Duration: ** ${
                        queue.formattedDuration
                    } | **Total Songs: **${
                        queue.songs.length
                    } \n\n ${nowPlaying}\n **Coming Next  :**\n${
                        ComingNextDesc ? ComingNextDesc : "No songs next"
                    }`
                );
            return message.channel.send({ embeds: [queueEmbed] });
        }
        const result = new Array(Math.ceil(songsArray.length / n))
            .fill()
            .map((_) => songsArray.splice(0, n));
        const pages = [];
        const mainEmbed = new MessageEmbed()
            .setAuthor(
                `${firstLetterCapital(message.client.user.username)} Queue`
            )
            .setColor(3092790)
            .setThumbnail(currentSong.thumbnail)
            .setDescription(
                `${message.client.playerStatus(
                    queue,
                    false
                )}\n **Total Duration: ** ${
                    queue.formattedDuration
                } | **Total Songs: **${
                    queue.songs.length
                } \n\n ${nowPlaying}\n Note: React Below to see all songs in Queue`
            );
        pages.push(mainEmbed);
        let i;
        for (i = 0; i < result.length; i++) {
            let description = "";
            result[i].forEach((song) => {
                description += `:small_blue_diamond:  [${song.name.substring(
                    0,
                    38
                )}...](${song.url})\n Duration: ${
                    song.formattedDuration
                } | Requested by: <@${song.user.id}>\n\n`;
            });
            const embed = new MessageEmbed()
                .setAuthor(
                    `${firstLetterCapital(message.client.user.username)} Queue`
                )
                .setColor(3092790)
                .setDescription(description);
            pages.push(embed);
        }
        let page = 0;
        const curPage = await message.channel.send({
            embeds: [
                pages[page].setFooter(`Page ${page + 1} / ${pages.length}`),
            ],
        });
        for (const emoji of emojiList) await curPage.react(emoji);
        const filter = (reaction, user) =>
            emojiList.includes(reaction.emoji.name) &&
            user.id === message.author.id;
        const reactionCollector = curPage.createReactionCollector(filter, {
            time: 120000,
        });
        reactionCollector.on("collect", (reaction) => {
            reaction.users.remove(message.author);
            switch (reaction.emoji.name) {
                case emojiList[0]:
                    page = page > 0 ? --page : pages.length - 1;
                    break;
                case emojiList[1]:
                    page = page + 1 < pages.length ? ++page : 0;
                    break;
                default:
                    break;
            }
            curPage.edit({
                embeds: [
                    pages[page].setFooter(`Page ${page + 1} / ${pages.length}`),
                ],
            });
        });
        reactionCollector.on("end", () => {
            const timedOutEmbed = new MessageEmbed()
                .setAuthor(
                    `${firstLetterCapital(message.client.user.username)} Queue`
                )
                .setThumbnail(message.client.user.displayAvatarURL())
                .setDescription(
                    "**Queue Message Timeout**\n\n> Use ` +queue ` For list of Songs in queue \n > Use `+play <queue> to play songs` \n\n ***Note:** All The commands are case insensitive"
                )
                .setColor(3092790)
                .setFooter(
                    `v${message.client.version} (Stable) | Made with ❤ in India`
                );
            if (!curPage.deleted) {
                curPage.reactions.removeAll();
                curPage.edit({ embeds: [timedOutEmbed] });
            }
        });
    },
};
