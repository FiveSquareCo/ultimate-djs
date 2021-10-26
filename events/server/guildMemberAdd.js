const { redis } = require("../../utils/functions/redis");
const { MessageEmbed } = require("discord.js");
const { working, join_logs_channel_id } =
    require("../../configs/features.json").mod_logs;
const { welcome } = require("../../configs/features.json");
module.exports = async (client, member) => {
    const { id, guild } = member;
    console.log(client.invites);
    /* Welcome Message/Role */
    if (welcome.working === true) {
        if (welcome.role_to_give != "role_id_here") {
            // const welcomeRole = member.guild.roles.cache.get(welcome.role_to_give) || member;
            member.roles.add(welcome.role_to_give).catch((e) => null);
        }
    }
    /* Mute on rejoin */
    const redisClient = await redis();
    try {
        redisClient.get(`muted-${id}-${guild.id}`, (err, result) => {
            if (err) {
                console.log(err);
            } else if (result) {
                const role = guild.roles.cache.find(
                    (role) => role.name === "Muted"
                );
                if (role) {
                    member.roles.add(role);
                }
            }
        });
    } finally {
        redisClient.quit();
    }
    /* Invite Logger */
    member.guild.invites.fetch().then(async (guildInvites) => {
        const ei = client.invites[``];
    });
    /* Logs */
    if (working && join_logs_channel_id != "channel_id_here") {
        const date = `<t:${(
            new Date(member.joinedTimestamp) / 1000
        ).toFixed()}:R>`;
        const joined = `<t:${(
            new Date(member.user.createdTimestamp) / 1000
        ).toFixed()}:R>`;
        const channel = client.channels.cache.get(join_logs_channel_id);
        const embed = new MessageEmbed()
            .setColor(3092790)
            .setAuthor("Join Logs")
            .setDescription(`${member.user.tag} Joined on ${date}`)
            .setTimestamp()
            .addField("User", `${member.user.tag} - ${member.id}`)
            .addField("Joined on", `${date}`, true)
            .addField("Created on", `${joined}`, true);
        channel.send({ embeds: [embed] });
    }
};
