const { MessageEmbed } = require("discord.js");
const warningsDB = require("../../schemas/warningSchema");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const { working, commands_logs_channel_id } = require("../../configs/features.json").mod_logs;
const successMessageEmbed = require("../../utils/embeds/sucessEmbed");

module.exports = {
    name: "delwarn",
    cooldown: 3000,
    description: "Remove a warn of a user.",
    requiredPermission: ["MANAGE_MESSAGES"],
    options: [
        {
            name: "id",
            type: "STRING",
            description: "The warn id to remove.",
            required: true,
        },
    ],
    run: async (interaction, args) => {
        const guildId = interaction.guildId;
        const warnId = args.get("id").value;
        const moderator = interaction.user;
        const results = await warningsDB.findOneAndUpdate(
            {
                guildId,
                "warnings.id": warnId,
            },
            {
                $pull: {
                    warnings: { id: warnId },
                },
            }
        );
        if (!results || !results.warnings.length) {
            return errorMessageEmbed(interaction, "Please provide a valid warn id!", "SC");
        }
        await delWarnModLog(interaction, moderator, results);
        return successMessageEmbed(interaction, `Deleted warn (${results.warnings[0].id}) for **${interaction.client.users.cache.get(results.userId).tag}**`);
    },
};

const delWarnModLog = async (interaction, moderator, results) => {
    if (!working || commands_logs_channel_id === "channel_id_here") return;
    const channel = interaction.guild.channels.cache.get(commands_logs_channel_id);
    const user = interaction.client.users.cache.get(results.userId);
    const wMod = interaction.client.users.cache.get(results.warnings[0].moderator);
    const date = `<t:${(new Date() / 1000).toFixed()}:R>`;
    const givenDate = `<t:${(new Date(results.warnings[0].timestamp) / 1000).toFixed()}:R>`;
    const warnEmbed = new MessageEmbed()
        .setColor(3092790)
        .setTimestamp()
        .setDescription(`${moderator.tag} deleted 1 warn for ${user.tag} on ${date}`)
        .addField("Moderator", `${moderator.tag} - ${moderator.id}`, true)
        .addField("Member", `${user.tag} - ${user.id}`, false)
        .addField("Warning", `> **Id :** ${results.warnings[0].id}\n> **Given by ** ${wMod.tag} - ${wMod.id}\n> **Given on :** ${givenDate}\n> **Reason :** ${results.warnings[0].reason}`)
        .setAuthor("Mod Logs");

    channel.send({ embeds: [warnEmbed] });
};
