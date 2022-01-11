const { redis } = require("../../utils/functions/redis");
const successMessageEmbed = require("../../utils/embeds/sucessEmbed");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    name: "unmute",
    cooldown: 3000,
    description: "Unmute a muted member in server",
    requiredPermission: ["MANAGE_ROLES"],
    options: [
        {
            name: "member",
            type: "USER",
            description: "The @member to unmute",
            required: true,
        },
        {
            name: "reason",
            type: "STRING",
            description: "Reason for unmute",
            required: true,
        },
    ],
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {*} args
     */
    run: async (interaction, args) => {
        const reason = args.get("reason")?.value || "No reason";
        const { member } = args.get("member");
        const isMuted = member.isCommunicationDisabled();
        if (!isMuted) {
            return await errorMessageEmbed(interaction, "The mentioned member is not muted/timed out.");
        }
        member.timeout(null, reason);
        const userEmbed = new MessageEmbed().setColor(3092790).setDescription(`You were UnMuted in **${interaction.guild.name}** by Moderator |  **reason:** ${reason}`);
        member.user.send({ embeds: [userEmbed] });
        return successMessageEmbed(interaction, `**${member.user.tag}** Has been unmuted | **reason:** ${reason}`);
    },
};
