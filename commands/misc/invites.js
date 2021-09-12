module.exports = {
    name: "invites",
    run: async (message, args) => {
        const { guild } = message;
        const user =
            message.mentions.users.first() ||
            (args[0] && (await message.client.users.fetch(args[0]))) ||
            message.author;
        const invites = await guild.invites.fetch();
        let invsOfUser = 0;
        invites.forEach((inv) => {
            const { uses, inviter } = inv;
            if (inviter.tag === user.tag) {
                invsOfUser += uses;
            }
            // message.channel.send({
            //     content: `${inviter.tag} has ${uses} invites!`,
            // });
        });
        message.reply(`${user.tag} has ${invsOfUser} invites.`);
    },
};
