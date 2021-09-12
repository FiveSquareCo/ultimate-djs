const axios = require("axios");
const getRandomUA = require("../../utils/functions/getRandomUA");

module.exports = {
    name: "kidnap",
    run: async (message, args) => {
        const user =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.fetch(args[0]))) ||
            message.author;
        const { data } = await axios("https://nekobot.xyz/api/imagegen", {
            params: {
                type: "kidnap",
                image: user.displayAvatarURL(),
            },
            headers: {
                "User-Agent": getRandomUA(),
            },
        });
        console.log(data);
    },
};
