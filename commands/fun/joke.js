const axios = require("axios");
const getRandomUA = require("../../utils/functions/getRandomUA");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "joke",
    run: async (message) => {
        const { data } = await axios(
            "https://v2.jokeapi.dev/joke/Any?amount=3",
            {
                headers: {
                    "User-Agent": getRandomUA(),
                },
            }
        );
        const jokesArray = data.jokes.filter((joke) => joke.safe === true);
        const jokeData = jokesArray[0];
        const jokeEmbed = new MessageEmbed()
            .setColor(3092790)
            .setDescription(
                `**${jokeData.setup}**\n ${
                    jokeData.delivery ? jokeData.delivery : ""
                }`
            );
        message.reply({ embeds: [jokeEmbed] });
    },
};
