const { noMusicAroundYouEmbed, errorEmbed, successEmbed } = require("../../utils/embeds");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "search",
    aliases: ["find"],
    category: "music",
    description: "Skips the current song in queue.",
    run: async (message, args) => {
        const player = message.client.player;
        const queue = player.getQueue(message);
        if (!args.length) {
            message.react("❌");
            return errorEmbed(message, "You need to provide a search key.");
        }
        message.react("👌");
        const results = await player.search(args.join(" "), {
            limit: 7,
            safeSearch: true,
        });
        let desc = ``;
        results.forEach((result, index) => {
            desc += `${index + 1}. [${result.name}](${result.url})\nDuration: ${result.formattedDuration} | Views: ${result.views}\n\n`;
        });

        const resultsEmbed = new MessageEmbed()
            .setTitle(`Search results: ${args.join(" ")}`)
            .setColor(3092790)
            .setThumbnail(results[0].thumbnail)
            .setFooter({ text: `Req. by ${message.author.tag}` })
            .setTimestamp()
            .setDescription(desc);
        const searchResultsMessage = await message.reply({
            embeds: [resultsEmbed],
        });
        const filter = (m) => m.author.id === message.author.id;
        searchResultsMessage.channel
            .awaitMessages({ filter, max: 1, time: 60000 })
            .then((collected) => {
                if (!collected.size) {
                    searchResultsMessage.edit({ embeds: [new MessageEmbed().setColor(3092790).setDescription("Search results expired.")] });
                    return;
                }
                if (collected.first().content.toLowerCase() === "end" || collected.first().content.toLowerCase() === "stop") {
                    return successEmbed(message, "Search cancelled.");
                }
                const number = parseInt(collected.first().content);
                if (!number || number > 7) {
                    message.react("❌");
                    searchResultsMessage.edit({ embeds: [new MessageEmbed().setColor(3092790).setDescription("Search results expired.")] });
                    return errorEmbed(message, "Send a vaild number or number less than 7.");
                }
                player.play(message, results[number - 1].url);
            })
            .catch((collected) => {
                null;
            });
    },
};
