const { MessageEmbed } = require("discord.js");
const { working, leave_logs_channel_id } =
    require("../../configs/features.json").mod_logs;
module.exports = (client, member) => {
    /* Logs */
    if (working && leave_logs_channel_id != "channel_id_here") {
        const date = `<t:${(
            new Date(member.joinedTimestamp) / 1000
        ).toFixed()}:R>`;
        const joined = `<t:${(
            new Date(member.user.createdTimestamp) / 1000
        ).toFixed()}:R>`;
        const left = `<t:${(new Date() / 1000).toFixed()}:R>`;
        const channel = client.channels.cache.get(join_logs_channel_id);
        const embed = new MessageEmbed()
            .setColor(3092790)
            .setAuthor("Leave Logs")
            .setDescription(`${member.user.tag} left on ${left}`)
            .setTimestamp()
            .addField("User", `${member.user.tag} - ${member.id}`)
            .addField("Joined on", `${date}`, true)

            .addField("Created on", `${joined}`, true)
            .addField("Left on", `${left}`, true);
        channel.send({ embeds: [embed] });
    }
};
