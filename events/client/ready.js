const { MessageEmbed, Team } = require("discord.js");
const { expire } = require("../../utils/functions/redis");
const {
    auto_meme,
    youtube_notifications,
} = require("../../configs/features.json");
const { status, interval } = require("../../configs/botStatus");
const { colors } = require("../../configs/config.json");
const {
    getLatestVideoAndNotify,
    registerSlashCommands,
} = require("../../utils/functions/index");
const cron = require("node-cron");
module.exports = async (client) => {
    /* Regestring Slash Commands */
    registerSlashCommands(client);
    /* Redis Expire */
    expire(async (message) => {
        const det = message.split("-");
        const userId = det[1];
        const guildId = det[2];
        const guild = client.guilds.cache.get(guildId);
        const member = await guild.members.fetch(userId);
        const role = guild.roles.cache.find((r) => r.name === "Muted");
        member.roles.remove(role);
        const unmutedUserEmbed = new MessageEmbed()
            .setDescription(
                `You were Unmuted automatically in **${guild.name}**`
            )
            .setColor(3092790);
        member.send({ embeds: [unmutedUserEmbed] }).catch((e) => null);
    });
    /* Events  */
    if (auto_meme.working && auto_meme.channel_id != "channel_id_here") {
        client.emit("automeme", auto_meme.channel_id, auto_meme.interval);
    }
    /* Bot Owners/Dev Setup */
    client.devs = [];
    const application = await client.application.fetch();
    const { owner } = application;
    if (owner instanceof Team) {
        owner.members.map((u) => {
            client.devs.push(u.id);
        });
    } else {
        client.devs.push(owner.id);
    }
    console.log("Bot is up");
    /* Status  */
    const statusOptions = status(client);
    const randomStatus = () => {
        const status = Math.floor(Math.random() * statusOptions.length);
        client.user.setActivity(statusOptions[status].text, {
            type: statusOptions[status].type,
        });
    };

    /* Client Global Variables */
    client.prefix = "+";
    client.colors = colors;
    setInterval(randomStatus, interval);

    /* Sheduled Functions */
    cron.schedule("*/15 * * * *", async () => {
        if (
            youtube_notifications.working === true &&
            youtube_notifications.yt_channel_ids.length != 0 &&
            youtube_notifications.notification_channel_id != "channel_id_here"
        ) {
            await getLatestVideoAndNotify(
                youtube_notifications.yt_channel_ids,
                client
            );
        }
    });
};
