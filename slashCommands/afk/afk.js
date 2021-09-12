module.exports = {
    name: "afk",
    cooldown: 3000,
    description:
        "Set an AFK status shown when you're mentioned, and display in nickname.",
    options: [
        {
            name: "set",
            type: "SUB_COMMAND",
            description: "The Input",
            options: [
                {
                    name: "reason",
                    type: "STRING",
                    description: "why not",
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
            const reason = args.get("reason").value;
        }
    },
};
