const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const sucessMessageEmbed = require("../../utils/embeds/sucessEmbed");
const { suggestionsStatusMessages } = require("../../configs/constants.json");
const { MessageEmbed } = require("discord.js");
const { working, commands_logs_channel_id } = require("../../configs/features.json").mod_logs;
const { working: suggWorking, channel_id } = require("../../configs/features.json").suggestions;
module.exports = {
    name: "suggestion",
    description: "Reply to a suggestion in server",
    requiredPermission: ["MANAGE_CHANNELS"],
    options: [
        {
            name: "suggestion",
            type: "STRING",
            description: "Message id of the suggestion",
            required: true,
        },
        {
            name: "status",
            type: "STRING",
            description: "Stats of suggestion to set",
            choices: [
                {
                    name: "Accept",
                    value: "ACCEPTED",
                },
                {
                    name: "Reject",
                    value: "DENIED",
                },
            ],
            required: true,
        },
        {
            name: "reason",
            description: "Reason for setting the particular status",
            type: "STRING",
            required: true,
        },
    ],
    run: async (interaction, args) => {
        if (!suggWorking) {
            return errorMessageEmbed(interaction, "This command/feature is Disabled");
        }
        const suggestionMessageId = args.get("suggestion").value;
        const status = args.get("status");
        const newStatus = suggestionsStatusMessages[status.value];
        const reason = args.get("reason").value;
        const channel = interaction.guild.channels.cache.get(channel_id);
        if (!channel) {
            return errorMessageEmbed(interaction, "There is no suggestion channel exits! contact bot maker to change settings.", "SC");
        }
        const message = await channel.messages.fetch(suggestionMessageId, false, true);
        if (!message) {
            return errorMessageEmbed(interaction, "The suggestion with given id doesnot exists.", "SC");
        }
        const link = `https://discord.com/channels/${interaction.guild.id}/${channel.id}/${suggestionMessageId}`;
        const oldEmbed = message.embeds[0];
        let id = "";
        if (oldEmbed.footer.text.includes("suggestion by")) {
            id = oldEmbed.footer.text.replace("suggestion by", "").trim();
        } else {
            id = oldEmbed.footer.text.replace("Last reply on", "").trim();
        }
        const suggStatus = status.value === "ACCEPTED" ? "Accepted" : "Rejected";
        const embed = new MessageEmbed()
            .setColor(newStatus.color)
            .setDescription(oldEmbed.description)
            .setFooter(`${id} Last reply on`)
            .setTimestamp()
            .setAuthor(oldEmbed.author.name, oldEmbed.author.iconURL)
            .setTitle(`Suggestion ${suggStatus}`)
            .addFields({ name: "Status", value: newStatus.text }, { name: `Reason from ${interaction.user.tag}`, value: reason });
        message.edit({ embeds: [embed] }).then((m) => {
            message.reactions.removeAll();
        });
        const user = await interaction.client.users.fetch(id);
        const dmEmbed = new MessageEmbed().setColor(newStatus.color).setDescription(`Your suggestion in **${interaction.guild.name}** has been ${suggStatus}.`).addField("Your Suggestion", oldEmbed.description, true).addField("Reason", reason, true).setFooter("Thanks for your suggestion");
        user.send({ embeds: [dmEmbed] });
        suggestionModlogEbed(
            interaction,
            interaction.user,
            user,
            {
                sugg: oldEmbed.description,
                status: suggStatus,
                reason,
            },
            link
        );
        return sucessMessageEmbed(interaction, `Replied for the [suggestion](${link}) by **${oldEmbed.author.name}**`);
    },
};

const suggestionModlogEbed = (interaction, moderator, member, suggestion, link) => {
    if (!working || commands_logs_channel_id === "channel_id_here") return;
    const channel = interaction.guild.channels.cache.get(commands_logs_channel_id);
    const date = `<t:${(new Date() / 1000).toFixed()}:R>`;
    const suggestionlogEmbed = new MessageEmbed()
        .setAuthor("Mod logs")
        .setColor(3092790)
        .setTimestamp()
        .setDescription(`${moderator.tag} replied to suggestion by ${member.tag} on ${date}`)
        .addField("Moderator", `${moderator.tag} - ${moderator.id}`, true)
        .addField("Suggester", `${member.tag} - ${member.id}`, true)
        .addField("Suggestion", `> **Suggestion :** ${suggestion.sugg}\n> **Status :**${suggestion.status}\n> **Reason :** ${suggestion.reason}`)
        .addField("Link", `[click here](${link})`);
    channel.send({ embeds: [suggestionlogEmbed] });
};
