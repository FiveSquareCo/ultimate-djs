const { MessageEmbed } = require("discord.js");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const { working, commands_logs_channel_id } = require("../../configs/features.json").mod_logs;

module.exports = {
    name: "unlock",
    cooldown: 3000,
    description: "lock a channel",
    requiredPermission: ["MANAGE_CHANNELS"],
    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The Input",
            required: false,
        },
        {
            name: "role",
            type: "ROLE",
            description: "Hoi",
            required: false,
        },
    ],
    run: async (interaction, args) => {
        const moderator = interaction.user;
        const channel = args.get("channel")?.channel || interaction.channel;
        if (channel.type != "GUILD_TEXT") {
            return errorMessageEmbed(interaction, "Please mention a vaid Text channel to lock!", "SC");
        }
        if (!channel.topic || !channel.topic.startsWith("LOCKED")) {
            return errorMessageEmbed(interaction, "This channel is not Locked!", "SC");
        }
        const role = args.get("role")?.role || interaction.guild.roles.cache.find((r) => r.name.toLowerCase().trim() === "@everyone");
        channel.permissionOverwrites.edit(role, { SEND_MESSAGES: true });
        interaction.reply({ content: "Un locked" });
        interaction.deleteReply();
        const unlockedChannelEmbed = new MessageEmbed().setAuthor(interaction.guild.name).setTitle(":unlock: Unlocked").setDescription(`This channel is been unlocked for ${role.name}\n**Moderator :** ${interaction.user.username}`).setColor(3092790).setTimestamp();
        const topic = channel.topic;
        channel.setTopic(topic.replace("LOCKED", ""));
        channelLockedModlogs(interaction, moderator, channel);
        return channel.send({ embeds: [unlockedChannelEmbed] });
    },
};

const channelLockedModlogs = (interaction, moderator, lockedChannel) => {
    if (!working || commands_logs_channel_id === "channel_id_here") return;
    const channel = interaction.guild.channels.cache.get(commands_logs_channel_id);
    const date = `<t:${(new Date() / 1000).toFixed()}:R>`;
    const lockedEmbed = new MessageEmbed()
        .setAuthor("Mod Logs")
        .setColor(3092790)
        .setDescription(`${moderator.tag} unlocked <#${lockedChannel.id}> on ${date}`)
        .addField("Moderator", `${moderator.tag} - ${moderator.id}`, true)
        .addField("Channel", `${lockedChannel.name} - ${lockedChannel.id}`, true)
        .setTimestamp();
    channel.send({ embeds: [lockedEmbed] });
};
