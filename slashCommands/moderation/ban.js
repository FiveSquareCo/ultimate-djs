const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const successMessageEmbed = require("../../utils/embeds/sucessEmbed");
const { MessageEmbed } = require("discord.js");
const { working, commands_logs_channel_id } = require("../../configs/features.json").mod_logs;
module.exports = {
    name: "ban",
    cooldown: 3000,
    description: "Ban a member from the server",
    requiredPermission: ["BAN_MEMBERS"],
    options: [
        {
            name: "member",
            type: "USER",
            description: "The @member to ban",
            required: true,
        },
        {
            name: "reason",
            type: "STRING",
            description: "Reason for the ban",
            required: false,
        },
    ],
    run: async (interaction, args) => {
        const member = args.get("member");
        const reason = args.get("reason")?.value || "No reason given.";
        const moderator = interaction.member;
        if (member.member.roles.highest.position >= moderator.roles.highest.position) {
            return errorMessageEmbed(interaction, "Cannot ban the user | **Reason :** the member's role is highr than yours");
        }
        if (!member.member.bannable) {
            return errorMessageEmbed(interaction, "I cannot ban users with role higher than me!");
        }
        const userEmbed = new MessageEmbed().setColor(15548997).setDescription(`You were banned in **${interaction.guild.name}** |  **Reason:** ${reason}`);
        member.user.send({ embeds: [userEmbed] }).catch((e) => null);
        member.member.ban({ reason });
        banModlogGen(interaction, moderator, member, reason);
        successMessageEmbed(interaction, `Banned **${member.user.tag}** from server | **Reason :** ${reason}`);
    },
};

const banModlogGen = (interaction, moderator, member, reason) => {
    if (!working || commands_logs_channel_id === "channel_id_here") return;
    const channel = interaction.guild.channels.cache.get(commands_logs_channel_id);
    const banDate = `<t:${(new Date() / 1000).toFixed()}:R>`;
    const banLogsEmbed = new MessageEmbed()
        .setAuthor("Mod Logs")
        .setDescription(`${moderator.user.tag} banned ${member.user.tag} on ${banDate}`)
        .setColor(3092790)
        .setTimestamp()
        .addField("Moderator", `${moderator.user.tag} - ${moderator.id}`, true)
        .addField("Member", `${member.user.tag} - ${member.user.id}`, true)
        .addField("Reason", reason);
    channel.send({ embeds: [banLogsEmbed] });
};
