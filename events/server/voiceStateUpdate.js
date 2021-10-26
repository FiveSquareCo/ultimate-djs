const joinToCreateDB = require("../../schemas/voiceJ2CSchema");
const { MessageEmbed } = require("discord.js");
const { working, channel_id, channels_type } =
    require("../../configs/features.json").join_to_create;
const ms = require("ms");
module.exports = async (client, oldState, newState) => {
    const user = await client.users.fetch(newState.id);
    const member = newState.guild.members.cache.get(user.id);
    const guildId = newState.guild.id || oldState.guild.id;
    const role = member.guild.roles.cache.find(
        (role) => role.name === "@everyone"
    );
    /* Ranking */

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
