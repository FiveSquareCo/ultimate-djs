module.exports = {
    name: "ping",
    aliases: ["la"],
    cooldown: 3000,
    description: "give users ping",
    category: "misc",
    requiredPermission: "ADMINISTRATOR",
    run: async (message) => {
        message.reply("pong");
    },
};
