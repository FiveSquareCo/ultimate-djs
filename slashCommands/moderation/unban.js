const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const successMessageEmbed = require("../../utils/embeds/sucessEmbed");
const { MessageEmbed } = require("discord.js");
const { working, commands_logs_channel_id } = require("../../configs/features.json").mod_logs;
module.exports = {
    name: "unban",
    description: "Unban a member from the server",
    requiredPermission: ["BAN_MEMBERS"],
    options: [
        {
            name: "member",
            description: "The member ID to unban",
            type: "STRING",
            required: true,
        },
    ],
    run: async (interaction, args) => {
        const member = args.get("member").value;
        const moderator = interaction.member;
        const banned = await interaction.guild.bans.fetch();
        if (!banned.has(member)) {
            return errorMessageEmbed(interaction, "User was not banned or give id is not valid");
        }
        interaction.guild.members.unban(member).then(async (user) => {
            await unbanModlogGen(interaction, moderator, user);
            successMessageEmbed(interaction, `Unbanned ${user.tag} from server`);
        });
    },
};

const unbanModlogGen = (interaction, moderator, member) => {
    if (!working || commands_logs_channel_id === "channel_id_here") return;
    const channel = interaction.guild.channels.cache.get(commands_logs_channel_id);
    const banDate = `<t:${(new Date() / 1000).toFixed()}:R>`;
    const banLogsEmbed = new MessageEmbed()
        .setAuthor("Mod Logs")
        .setDescription(`${moderator.user.tag} un banned ${member.tag} on ${banDate}`)
        .setColor(3092790)
        .setTimestamp()
        .addField("Moderator", `${moderator.user.tag} - ${moderator.id}`, true)
        .addField("Member", `${member.tag} - ${member.id}`, true);
    return channel.send({ embeds: [banLogsEmbed] });
};
