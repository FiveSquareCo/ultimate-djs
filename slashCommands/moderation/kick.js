const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const successMessageEmbed = require("../../utils/embeds/sucessEmbed");
const { MessageEmbed } = require("discord.js");
const { working, commands_logs_channel_id } = require("../../configs/features.json").mod_logs;

module.exports = {
    name: "kick",
    cooldown: 3000,
    description: "Kick a user",
    requiredPermission: ["KICK_MEMBERS"],
    options: [
        {
            name: "member",
            type: "USER",
            description: "The @member to kick",
            required: true,
        },
        {
            name: "reason",
            type: "STRING",
            description: "Reason to kick the user",
            required: false,
        },
    ],
    run: async (interaction, args) => {
        const reason = args.get("reason")?.value || "No reason given.";
        const { user: moderator, member: mod } = interaction;
        const { user, member } = args.get("member");
        if (member.roles.highest.position >= mod.roles.highest.position) {
            return errorMessageEmbed(interaction, "Cannot ban the user | **Reason :** the member's role is highr than yours");
        }
        if (!member.kickable) {
            return errorMessageEmbed(interaction, "I cannot take this action due to lack of permissions.");
        }
        const userEmbed = new MessageEmbed().setColor(15548997).setDescription(`You were kicked in **${interaction.guild.name}** |  **Reason:** ${reason}`);
        await member.user.send({ embeds: [userEmbed] }).catch((e) => null);
        member.kick({ reason });
        kickModlogGen(interaction, moderator, user, reason);
        return successMessageEmbed(interaction, `**${user.tag}** has been kicked! | **Reason:** ${reason}`);
    },
};

const kickModlogGen = (interaction, moderator, member, reason) => {
    if (!working || commands_logs_channel_id === "channel_id_here") return;
    const channel = interaction.guild.channels.cache.get(commands_logs_channel_id);
    const banDate = `<t:${(new Date() / 1000).toFixed()}:R>`;
    const banLogsEmbed = new MessageEmbed()
        .setAuthor("Mod Logs")
        .setDescription(`${moderator.tag} kicked ${member.tag} on ${banDate}`)
        .setColor(3092790)
        .setTimestamp()
        .addField("Moderator", `${moderator.tag} - ${moderator.id}`, true)
        .addField("Member", `${member.tag} - ${member.id}`, true)
        .addField("Reaosn", reason);
    return channel.send({ embeds: [banLogsEmbed] });
};
