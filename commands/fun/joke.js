const axios = require("axios");
const getRandomUA = require("../../utils/functions/getRandomUA");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "joke",
    run: async (message) => {
        const { data } = await axios(
            "https://official-joke-api.appspot.com/jokes/random",
            {
                headers: {
                    "User-Agent": getRandomUA(),
                },
            }
        );
        const jokeEmbed = new MessageEmbed()
            .setColor(3092790)
            .setDescription(`**${data.setup}**\n${data.punchline}`);
        message.reply({ embeds: [jokeEmbed] });
    },
};
