module.exports = {
    name: "strikes",
    cooldown: 3000,
    description: "Hello",
    requiredPermission: "MANAGE_MESSAGES",
    options: [
        {
            name: "user",
            type: "USER",
            description: "The Input",
            required: true,
        },
    ],
    run: async (interaction, args) => {
        console.log(args.get("user"));
        await interaction.reply({ content: "Hello" });
    },
};
