const afkUsersDB = require("../../schemas/afkSchema");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "afk",
    cooldown: 3000,
    description: "hi",
    options: [
        {
            name: "set",
            type: "SUB_COMMAND",
            description:
                "Set an AFK status shown when you're mentioned, and display in nickname.",
            options: [
                {
                    name: "reason",
                    type: "STRING",
                    description: "The reason you are going afk.",
                    required: true,
                },
            ],
        },
        {
            name: "stats",
            type: "SUB_COMMAND",
            description: "hoi",
        },
        {
            name: "remove",
            type: "SUB_COMMAND",
            description: "bye",
        },
    ],
    run: async (interaction, args) => {
        const subcommand = args._subcommand;
        if (subcommand === "set") {
            const afkChecks = await isAlreadyAFK(interaction);
            if (afkChecks.afk) {
                return interaction.reply({
                    ephemeral: true,
                    embeds: [afkChecks.embed],
                });
            }
            const user = interaction.member;
            const reason = args.get("reason").value;
            const setUserAFK = await afkUsersDB.findOneAndUpdate(
                {
                    userId: user.id,
                    guildId: interaction.guild.id,
                },
                {
                    userId: user.id,
                    guildId: interaction.guild.id,
                    reason,
                    time: new Date(),
                },
                {
                    upsert: true,
                    new: true,
                }
            );
            user.setNickname(
                `[AFK] ${user.nickname || user.user.username}`,
                "Set the user AFK in bot's database and channed nickname."
            ).catch((e) => null);
            const youAreAfkReplyEmbed = new MessageEmbed()
                .setColor(interaction.client.colors.SUCCESS)
                .setDescription(
                    `I've added you to AFK list | **Reason :** ${setUserAFK.reason}`
                );

            interaction.reply({ embeds: [youAreAfkReplyEmbed] });
        }
        if (subcommand === "stats") {
            isAlreadyAFK(interaction.member.id, interaction.guild.id);
        }   
    },
};

/* Utils/Functions */
const isAlreadyAFK = async (interaction) => {
    const results = await afkUsersDB.find({
        userId: interaction.member.id,
        guildId: interaction.guild.id,
    });
    if (!results[0]) {
        return { embed: null, afk: false };
    }
    return {
        embed: new MessageEmbed()
            .setColor(interaction.client.colors.ERROR)
            .setDescription(":expressionless: You are already AFK."),
        afk: true,
        results
    };
};
