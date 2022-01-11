const { MessageEmbed } = require("discord.js");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const { working, commands_logs_channel_id } = require("../../configs/features.json").mod_logs;
module.exports = {
    name: "lock",
    cooldown: 3000,
    description: "Lock the channel to prevent everyone from talking",
    requiredPermission: ["MANAGE_CHANNELS"],
    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "Channel to lock",
            required: false,
        },
        {
            name: "role",
            type: "ROLE",
            description: "Specfic role to lock the channel",
            required: false,
        },
        {
            name: "reason",
            type: "STRING",
            description: "Reason to lock the channel",
            required: false,
        },
    ],
    run: async (interaction, args) => {
        const channel = args.get("channel")?.channel || interaction.channel;
        const moderator = interaction.user;
        if (channel.type != "GUILD_TEXT") {
            return errorMessageEmbed(interaction, "Please mention a vaid Text channel to lock!", "SC");
        }
        if (channel.topic && channel.topic?.startsWith("LOCKED")) {
            return errorMessageEmbed(interaction, "This channel is alredy Locked!", "SC");
        }
        const role = args.get("role")?.role || interaction.guild.roles.cache.find((r) => r.name.toLowerCase().trim() === "@everyone");
        channel.permissionOverwrites.edit(role, { SEND_MESSAGES: false });
        interaction.reply({ content: "Locked" });
        interaction.deleteReply();
        const reason = args.get("reason")?.value || "No reason";
        const lockedChannelEmbed = new MessageEmbed().setAuthor(interaction.guild.name).setTitle(":lock: Locked").setDescription(`This channel is been locked for ${role.name}\n**Moderator :** ${interaction.user.username}\n**Reason :** ${reason}`).setColor(3092790).setTimestamp();
        channel.setTopic(`LOCKED ${channel.topic || interaction.guild.name}`);
        channelLockedModlogs(interaction, moderator, channel, reason);
        return channel.send({ embeds: [lockedChannelEmbed] });
    },
};

const channelLockedModlogs = (interaction, moderator, lockedChannel, reason) => {
    if (!working || commands_logs_channel_id === "channel_id_here") return;
    const channel = interaction.guild.channels.cache.get(commands_logs_channel_id);
    const date = `<t:${(new Date() / 1000).toFixed()}:R>`;
    const lockedEmbed = new MessageEmbed()
        .setAuthor("Mod Logs")
        .setColor(3092790)
        .setDescription(`${moderator.tag} locked <#${lockedChannel.id}> on ${date}`)
        .addField("Moderator", `${moderator.tag} - ${moderator.id}`, true)
        .addField("Channel", `${lockedChannel.name} - ${lockedChannel.id}`, true)
        .addField("Reason", reason)
        .setTimestamp();
    channel.send({ embeds: [lockedEmbed] });
};
