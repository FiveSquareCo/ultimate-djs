const axios = require("axios");
const getRandomUA = require("../../utils/functions/getRandomUA");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "fact",
    run: async (message) => {
        const { data } = await axios(
            "https://useless-facts.sameerkumar.website/api",
            {
                headers: {
                    "User-Agent": getRandomUA(),
                },
            }
        );
        const jokeEmbed = new MessageEmbed()
            .setColor(3092790)
            .setDescription(data.data);
        message.reply({ embeds: [jokeEmbed] });
    },
};
