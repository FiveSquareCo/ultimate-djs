const axios = require("axios");
const getRandomUA = require("../../utils/functions/getRandomUA");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "advice",
    run: async (message) => {
        const { data } = await axios("https://api.adviceslip.com/advice", {
            headers: {
                "User-Agent": getRandomUA(),
            },
        });
        const jokeEmbed = new MessageEmbed()
            .setColor(3092790)
            .setDescription(data.slip.advice);
        message.reply({ embeds: [jokeEmbed] });
    },
};
