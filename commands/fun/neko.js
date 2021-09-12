const axios = require("axios");
const getRandomUA = require("../../utils/functions/getRandomUA");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "neko",
    run: async (message) => {
        const { data } = await axios("https://neko-love.xyz/api/v1/neko", {
            headers: {
                "User-Agent": getRandomUA(),
            },
        });
        const jokeEmbed = new MessageEmbed()
            .setColor(3092790)
            .setImage(data.url);
        message.reply({ embeds: [jokeEmbed] });
    },
};
