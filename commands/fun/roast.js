module.exports = {
    name: "roast",
    cooldown: 3000,
    run: async (message, args) => {
        const user =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.fetch(args[0]))) ||
            message.author;
        const answers = [
            "Sup normie?",
            "Hey idiot",
            "whats up noob",
            "Did i ask?",
            "I dont care",
            "Another idiot",
            "The king of loosers",
            "BOOMER",
            "Novice",
            "Normie be like",
            "Sup edot",
            "Man you should see a mental doctor",
            "I am calling FBI now",
            "I gotta say you are pretty dumb",
        ];
        const answer = answers[Math.floor(Math.random() * answers.length)];

        message.channel.send(`${user.username}, ${answer}`);
    },
};
