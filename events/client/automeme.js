const axios = require("axios");
const { MessageEmbed } = require("discord.js");
const getRandomUA = require("../../utils/functions/getRandomUA");
const { sub_reddit } = require("../../configs/features.json").auto_meme;

module.exports = async (client, channelId, interval) => {
    const channel = await client.channels.fetch(channelId);
    setInterval(async () => {
        const { data } = await axios(
            `https://meme-api.herokuapp.com/gimme/${sub_reddit}/3`,
            {
                headers: {
                    "User-Agent": getRandomUA(),
                },
            }
        );
        const memesArray = data.memes.filter((meme) => meme.nsfw === false);
        const memeData = memesArray[0];
        const memeEmbed = new MessageEmbed()
            .setColor(3092790)
            .setAuthor(`${client.user?.username} Memes`)
            .setImage(memeData.url)
            .setDescription(`**[${memeData.title}](${memeData.url})**`)
            .setFooter(`👍 ${memeData.ups}`)
            .setTimestamp();
        channel.send({ embeds: [memeEmbed] });
    }, interval);
};
