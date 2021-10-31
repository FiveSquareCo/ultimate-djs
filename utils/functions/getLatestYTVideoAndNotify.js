const { default: axios } = require("axios");
const { redis } = require("./redis");
const {
    youtube_notifications: { notification_channel_id },
} = require("../../configs/features.json");
module.exports = async (channels, client) => {
    for (const channel of channels) {
        const { data: channelFeed } = await axios(
            `https://feed2json.org/convert?url=https://www.youtube.com/feeds/videos.xml?channel_id=${channel}&minify=on`
        );
        const channel_name = channelFeed.title;
        const latestVideo = channelFeed.items[0];
        if (
            new Date().getDay() != new Date(latestVideo.date_published).getDay()
        )
            return;
        const id = latestVideo.url.split("=")[1];
        const redisClient = await redis();
        try {
            redisClient.get(`ytv-${id}`, async (err, result) => {
                if (err) {
                    console.error(err);
                    redisClient.quit();
                } else if (!result) {
                    const redisClient2 = await redis();
                    try {
                        const redisKey = `ytv-${id}`;
                        redisClient2.set(redisKey, "true", "EX", 86400);
                    } finally {
                        redisClient2.quit();
                    }
                    const dChannel =
                        client.channels.cache.get(notification_channel_id) ||
                        (await client.channels.fetch(notification_channel_id));
                    dChannel.send({
                        content: `Hey, **${channel_name}** just posted a new video\n${latestVideo.url}`,
                    });
                    redisClient.quit();
                }
            });
        } finally {
            redisClient.quit();
        }
    }
};
