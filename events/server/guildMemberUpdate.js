const { nickname_logs_channel_id, working } = require("../../configs/features.json").mod_logs;
const { MessageEmbed } = require("discord.js");

module.exports = (client, oldMember, newMember) => {
    console.log(oldMember.communicationDisabledUntil);
    console.log(newMember.communicationDisabledUntil);
    if (!working) return;
    if (nickname_logs_channel_id != "channel_id_here") {
        const channel = client.channels.cache.get(nickname_logs_channel_id);
        if (oldMember.nickname != newMember.nickname) {
            const embed = new MessageEmbed()
                .setAuthor({ name: "Nickname Logs" })
                .setTimestamp()
                .setColor(3092790)
                .setDescription(`${oldMember.user.tag} changed their nickname from ${oldMember.nickname} to ${newMember.nickname}`)
                .addField("User", `${oldMember.user.tag} - ${oldMember.id}`)
                .addField("Old Nickname", `${oldMember.nickname}`, true)
                .setFooter("null = no nickname")
                .addField("New Nickname", `${newMember.nickname}`, true);
            channel.send({ embeds: [embed] });
        }
    }
};
