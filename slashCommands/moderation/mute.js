const getSeconds = require("../../utils/functions/getSeconds");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const { working, commands_logs_channel_id } = require("../../configs/features.json").mod_logs;
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "mute",
    cooldown: 3000,
    description: "Mute a member in the server",
    requiredPermission: ["MANAGE_ROLES"],
    options: [
        {
            name: "member",
            type: "USER",
            description: "The @member to mute",
            required: true,
        },
        {
            name: "duration",
            type: "NUMBER",
            description: "Duration of mute",
            required: true,
        },
        {
            name: "type",
            type: "STRING",
            description: "Duration type of mute",
            required: true,
            choices: [
                { name: "minutes", value: "minutes" },
                { name: "hours", value: "hours" },
                { name: "days", value: "days" },
                { name: "weeks", value: "weeks" },
                { name: "permanent", value: "permanent" },
            ],
        },
        {
            name: "reason",
            type: "STRING",
            description: "Reason of the mute",
            required: false,
        },
    ],
    run: async (interaction, args) => {
        const { user } = args.get("member");
        const durationType = args.get("type").value;
        const duration = args.get("duration").value;
        const { user: moderator, member: mod } = interaction;
        const member = await interaction.guild.members.fetch(user.id);
        const reason = args.get("reason")?.value || "No reason";
        if (member.roles.highest >= mod.roles.highest) {
            return errorMessageEmbed(interaction, "You cannout mute member higher than you!");
        }

        const data = {
            interaction,
            member,
            seconds: getSeconds(duration, durationType),
            reason,
            type: "Command",
            duration,
            durationType,
        };
        muteModlogGen(interaction, moderator, user, reason, `${duration} ${durationType}`);
        interaction.client.emit("mute", data);
    },
};

const muteModlogGen = (interaction, moderator, member, reason, time) => {
    if (!working || commands_logs_channel_id === "channel_id_here") return;
    const channel = interaction.guild.channels.cache.get(commands_logs_channel_id);
    const date = `<t:${(new Date() / 1000).toFixed()}:R>`;
    const mutedEmbed = new MessageEmbed()
        .setAuthor("Mod Logs")
        .setColor(3092790)
        .setDescription(`${moderator.tag} muted ${member.tag} on ${date} for ${time}`)
        .setFields(
            {
                name: "Moderator",
                value: `${moderator.tag} - ${moderator.id}`,
                inline: true,
            },
            {
                name: "Member",
                value: `${member.tag} - ${member.id}`,
                inline: true,
            },
            {
                name: "Mute info",
                value: `> **Reason :** ${reason}\n> **Time :** ${time}`,
            }
        )

        .setTimestamp();
    channel.send({ embeds: [mutedEmbed] });
};
