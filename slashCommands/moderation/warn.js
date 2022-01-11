const { MessageEmbed } = require("discord.js");
const warningsDB = require("../../schemas/warningSchema");
const successMessageEmbed = require("../../utils/embeds/sucessEmbed");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const generateId = require("../../utils/functions/randomIdGen");

module.exports = {
    name: "warn",
    cooldown: 3000,
    description: "Warn a member",
    requiredPermission: ["MANAGE_MESSAGES"],
    options: [
        {
            name: "member",
            type: "USER",
            description: "The @member to warn",
            required: true,
        },
        {
            name: "reason",
            type: "STRING",
            description: "why you want to kick the member",
            required: false,
        },
    ],
    run: async (interaction, args) => {
        const guildId = interaction.guildId;
        const reason = args.get("reason")?.value || "No reason";
        const { user } = args.get("member");
        const userId = user.id;
        if (user.bot || user.id === interaction.user.id) {
            return errorMessageEmbed(interaction, "You cannot warn this user!", "SC");
        }
        const warning = {
            id: generateId(13),
            moderator: interaction.user.id,
            timestamp: new Date(),
            reason,
        };
        await warningsDB.findOneAndUpdate(
            { guildId, userId },
            {
                guildId,
                userId,
                $push: {
                    warnings: warning,
                },
            },
            { upsert: true, new: true }
        );
        successMessageEmbed(interaction, `**${user.tag}** has been warned! | **Reason:** ${reason}`);
        const userEmbed = new MessageEmbed().setColor(15548997).setDescription(`You were warned in **${interaction.guild.name}** |  **Reason:** ${reason}`);
        user.send({ embeds: [userEmbed] }).catch();
    },
};
