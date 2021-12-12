const {
    noMusicAroundYouEmbed,
    errorEmbed,
    successEmbed,
} = require("../../utils/embeds");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "search",
    aliases: ["find"],
    category: "music",
    description: "Skips the current song in queue.",
    run: async (message, args) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        const results = await player.search(args.join(" "), {
            limit: 7,
            safeSearch: true,
        });
        let desc = ``;
        results.forEach((result, index) => {
            desc += `${index + 1}. [${result.name}](${result.url})\nDuration: ${
                result.formattedDuration
            } | Views: ${result.views}\n\n`;
        });

        const resultsEmbed = new MessageEmbed()
            .setTitle(`Search results: ${args.join(" ")}`)
            .setColor(3092790)
            .setThumbnail(results[0].thumbnail)
            .setFooter(`Req. by ${message.author.tag}`)
            .setTimestamp()
            .setDescription(desc);
        const searchResultsMessage = await message.channel.send({
            embeds: [resultsEmbed],
        });
        const filter = (m) => m.author.id === message.author.id;
        searchResultsMessage.channel
            .awaitMessages({ filter, max: 1, time: 180000 })
            .then((collected) => {
                if (
                    collected.first().content.toLowerCase() ===
                    ("end" || "stop")
                ) {
                    return successEmbed(message, "Search cancelled.");
                }
                const number = parseInt(collected.first().content);
                if (!number) {
                    return;
                }
                console.log(number);
                player.play(message, results[number].url);
            })
            .catch((collected) => {
                console.log(collected);
            });
    },
};
