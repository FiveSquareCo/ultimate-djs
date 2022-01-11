const automodStrikesDB = require("../../schemas/automodSchema");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const successMessageEmbed = require("../../utils/embeds/sucessEmbed");

module.exports = {
    name: "strikes",
    cooldown: 5000,
    description: "Hello",
    requiredPermission: ["MANAGE_MESSAGES"],
    options: [
        {
            name: "view",
            type: "SUB_COMMAND",
            description: "See the number of stikes for a user.",
            options: [
                {
                    name: "member",
                    type: "USER",
                    description: "The @member to see strikes",
                    required: true,
                },
            ],
        },
        {
            name: "remove",
            type: "SUB_COMMAND",
            description: "Remove number of strikes of a user.",
            options: [
                {
                    name: "member",
                    type: "USER",
                    description: "The @member to remove strikes",
                    required: true,
                },
                {
                    name: "number",
                    type: "NUMBER",
                    description: "Number of strikes to remove (default: 1)",
                    required: false,
                },
                {
                    name: "reason",
                    type: "STRING",
                    description: "Reason for removing strikes",
                    required: false,
                },
            ],
        },
    ],
    run: async (interaction, args) => {
        const subcommand = args._subcommand;
        if (subcommand === "view") {
            const { user, member } = args.get("member");
            const results = await automodStrikesDB.findOne({
                userId: user.id,
                guildId: interaction.guild.id,
            });
            if (!results) {
                return successMessageEmbed(interaction, `**0** automod strikes for **${user.tag}**`);
            }
            return successMessageEmbed(interaction, `**${results.strikes}** automod strikes for **${user.tag}**`);
        } else if (subcommand === "remove") {
            const numberOfStrikes = args.get("number")?.value || 1;
            const reason = args.get("reason")?.value || "No reason";
            const { user, member } = args.get("member");
            const results = await automodStrikesDB.findOne({
                userId: user.id,
                guildId: interaction.guild.id,
            });
            if (!results || results.strikes === 0) {
                return errorMessageEmbed(interaction, `${user.tag} don't have any strikes!`);
            }
            if (results.strikes < numberOfStrikes) {
                return errorMessageEmbed(interaction, `Can't remove ${numberOfStrikes} strike(s) from ${user.tag} as they only have ${results.strikes}`);
            }
            if (results.strikes === numberOfStrikes) {
                await automodStrikesDB.deleteOne({
                    userId: user.id,
                    guildId: interaction.guild.id,
                });
                return successMessageEmbed(interaction, `Removed ${numberOfStrikes} strike(s) from **${user.tag}**`);
            }
            const res = await automodStrikesDB.updateOne({ userId: user.id, guildId: interaction.guild.id }, { $inc: { strikes: -numberOfStrikes } }, { new: true });
            return successMessageEmbed(interaction, `Removed ${numberOfStrikes} strike(s) from **${user.tag}**, they now have **${res.strikes}**`);
        }
    },
};
