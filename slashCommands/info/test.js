module.exports = {
    name: "test",
    cooldown: 3000,
    description: "Hello",
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
