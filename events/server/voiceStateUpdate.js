const joinToCreateDB = require("../../schemas/voiceJ2CSchema");
const { MessageEmbed } = require("discord.js");
const { working, channel_id, channels_type } =
    require("../../configs/features.json").join_to_create;
const {
    working: modLogsWorking,
    voice_join_leave_move_logs_channel_id,
    server_mute_defean_logs_channel_id,
} = require("../../configs/features.json").mod_logs;
module.exports = async (client, oldState, newState) => {
    const user = await client.users.fetch(newState.id);
    const member = newState.guild.members.cache.get(user.id);
    const guildId = newState.guild.id || oldState.guild.id;
    const role = member.guild.roles.cache.find(
        (role) => role.name === "@everyone"
    );
    /* Logs */
    if (modLogsWorking) {
        if (voice_join_leave_move_logs_channel_id != "channel_id_here") {
            const channel = client.channels.cache.get(
                voice_join_leave_move_logs_channel_id
            );
            if (!oldState.channel && newState.channel) {
                const embed = new MessageEmbed()
                    .setAuthor("Voice Logs")
                    .setDescription(
                        `${newState.member.user.tag} joined <#${newState.channel.id}>`
                    )
                    .addField(
                        "User",
                        `${newState.member.user.tag} - ${newState.member.id}`
                    )
                    .setColor(3092790)
                    .setTimestamp();
                channel.send({ embeds: [embed] });
            }
            if (oldState.channel && !newState.channel) {
                const embed = new MessageEmbed()
                    .setAuthor("Voice Logs")
                    .setDescription(
                        `${newState.member.user.tag} left <#${oldState.channel.id}>`
                    )
                    .addField(
                        "User",
                        `${newState.member.user.tag} - ${newState.member.id}`
                    )
                    .setColor(3092790)
                    .setTimestamp();
                channel.send({ embeds: [embed] });
            }
            if (
                oldState.channel &&
                newState.channel &&
                oldState.channel != newState.channel
            ) {
                const embed = new MessageEmbed()
                    .setAuthor("Voice Logs")
                    .setDescription(
                        `${newState.member.user.tag} moved from <#${oldState.channel.id}> to <#${oldState.channel.id}>`
                    )
                    .addField(
                        "User",
                        `${newState.member.user.tag} - ${newState.member.id}`
                    )
                    .addField(
                        "Old Channel",
                        `${oldState.channel.name} - ${oldState.channel.id}`,
                        true
                    )
                    .addField(
                        "New Channel",
                        `${newState.channel.name} - ${newState.channel.id}`,
                        true
                    )
                    .setColor(3092790)
                    .setTimestamp();
                channel.send({ embeds: [embed] });
            }
        }
        if (server_mute_defean_logs_channel_id != "channel_id_here") {
            const channel = client.channels.cache.get(
                server_mute_defean_logs_channel_id
            );
            if (!oldState.serverDeaf && newState.serverDeaf) {
                const guildAuditLogs =
                    (await newState.guild.fetchAuditLogs({ type: 24 })) ||
                    (await newState.guild.fetchAuditLogs({ type: 24 }));
                const entry = guildAuditLogs.entries.first();
                if (entry.changes[0].key === "deaf") {
                    const embed = new MessageEmbed()
                        .setColor(3092790)
                        .setTimestamp()
                        .setDescription(
                            `${entry.executor.tag} Server deafened ${newState.member.user.tag} in <#${newState.channel.id}>`
                        )
                        .addField(
                            "Channel",
                            `${newState.channel.name} - ${newState.channel.id}`
                        )
                        .addField(
                            "Moderator",
                            `${entry.executor.tag} - ${entry.executor.id}`,
                            true
                        )
                        .addField(
                            "User",
                            `${newState.member.user.tag} - ${newState.member.id}`,
                            true
                        )
                        .setAuthor("Voice Logs");
                    channel.send({ embeds: [embed] });
                }
            }
            if (oldState.serverDeaf && !newState.serverDeaf) {
                const guildAuditLogs =
                    (await newState.guild.fetchAuditLogs({ type: 24 })) ||
                    (await newState.guild.fetchAuditLogs({ type: 24 }));
                const entry = guildAuditLogs.entries.first();
                if (entry.changes[0].key === "deaf") {
                    const embed = new MessageEmbed()
                        .setColor(3092790)
                        .setTimestamp()
                        .setDescription(
                            `${entry.executor.tag} Server undeafened ${newState.member.user.tag} in <#${newState.channel.id}>`
                        )
                        .addField(
                            "Channel",
                            `${newState.channel.name} - ${newState.channel.id}`
                        )
                        .addField(
                            "Moderator",
                            `${entry.executor.tag} - ${entry.executor.id}`,
                            true
                        )
                        .addField(
                            "User",
                            `${newState.member.user.tag} - ${newState.member.id}`,
                            true
                        )
                        .setAuthor("Voice Logs");
                    channel.send({ embeds: [embed] });
                }
            }
            if (!oldState.serverMute && newState.serverMute) {
                const guildAuditLogs =
                    (await newState.guild.fetchAuditLogs({ type: 24 })) ||
                    (await newState.guild.fetchAuditLogs({ type: 24 }));
                const entry = guildAuditLogs.entries.first();
                if (entry.changes[0].key === "mute") {
                    const embed = new MessageEmbed()
                        .setColor(3092790)
                        .setTimestamp()
                        .setDescription(
                            `${entry.executor.tag} Server muted ${newState.member.user.tag} in <#${newState.channel.id}>`
                        )
                        .addField(
                            "Channel",
                            `${newState.channel.name} - ${newState.channel.id}`
                        )
                        .addField(
                            "Moderator",
                            `${entry.executor.tag} - ${entry.executor.id}`,
                            true
                        )
                        .addField(
                            "User",
                            `${newState.member.user.tag} - ${newState.member.id}`,
                            true
                        )
                        .setAuthor("Voice Logs");
                    channel.send({ embeds: [embed] });
                }
            }
            if (oldState.serverMute && !newState.serverMute) {
                const guildAuditLogs =
                    (await newState.guild.fetchAuditLogs({ type: 24 })) ||
                    (await newState.guild.fetchAuditLogs({ type: 24 }));
                const entry = guildAuditLogs.entries.first();
                if (entry.changes[0].key === "mute") {
                    const embed = new MessageEmbed()
                        .setColor(3092790)
                        .setTimestamp()
                        .setDescription(
                            `${entry.executor.tag} Server unmuted ${newState.member.user.tag} in <#${newState.channel.id}>`
                        )
                        .addField(
                            "Channel",
                            `${newState.channel.name} - ${newState.channel.id}`
                        )
                        .addField(
                            "Moderator",
                            `${entry.executor.tag} - ${entry.executor.id}`,
                            true
                        )
                        .addField(
                            "User",
                            `${newState.member.user.tag} - ${newState.member.id}`,
                            true
                        )
                        .setAuthor("Voice Logs");
                    channel.send({ embeds: [embed] });
                }
            }
        }
    }

    /* Join to create */

    if (working && !oldState.channel && newState.channel.id === channel_id) {
        const channel = await newState.guild.channels.create(
            `J2C_${user.tag}`,
            {
                type: "GUILD_VOICE",
                parent: newState.channel.parent,
                userLimit: 3,
            }
        );
        if (channels_type === "PRIVATE") {
            channel.permissionOverwrites.edit(role, {
                CONNECT: false,
                VIEW_CHANNEL: true,
            });
        }
        member.voice.setChannel(channel);
        const results = await joinToCreateDB.findOneAndUpdate(
            { guildId, userId: user.id },
            {
                guildId,
                user: user.id,
                voiceChannelId: channel.id,
            },
            { upsert: true, new: true }
        );
    } else if (!newState.channel && oldState.channel.name.startsWith("J2C")) {
        const results = await joinToCreateDB.findOne({
            voiceChannelId: oldState.channelId,
        });
        if (results.userId === user.id) {
            await joinToCreateDB
                .findOneAndDelete({
                    guildId,
                    userId: user.id,
                    voiceChannelId: oldState.channelId,
                })
                .catch((e) => {
                    console.log(e);
                });
            oldState.channel.delete();
        }
    }
};

const embedGen = () => {
    return;
};
