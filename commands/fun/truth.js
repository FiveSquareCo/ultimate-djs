const axios = require("axios");
const getRandomUA = require("../../utils/functions/getRandomUA");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "truth",
    cooldown: "5000",
    run: async (message) => {
        const { data } = await axios(
            "https://api.truthordarebot.xyz/api/truth",
            {
                headers: {
                    "User-Agent": getRandomUA(),
                },
            }
        );
        const jokeEmbed = new MessageEmbed()
            .setColor(3092790)
            .setDescription(data.slip.advice);
        message.reply({ embeds: [jokeEmbed] });
    },
};
