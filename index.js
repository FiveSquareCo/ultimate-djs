const { config } = require("dotenv");

const { Client, Intents, Collection } = require("discord.js");

/* IIFE */
(async () => {
    // const intents = [
    //     Intents.FLAGS.GUILDS,
    //     Intents.FLAGS.GUILD_MESSAGES,
    //     Intents.FLAGS.GUILD_MEMBERS,
    //     Intents.FLAGS.GUILD_VOICE_STATES,
    //     Intents.FLAGS.DIRECT_MESSAGES,
    //     Intents.FLAGS.C
    // ];
    const intents = 32767;
    // const intents = ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"];

    const FSXClient = new Client({
        intents,
        partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
    });

    config();

    FSXClient.messageCommands = new Collection();
    FSXClient.slashCommands = new Collection();
    FSXClient.commandCooldowns = new Collection();

    [
        "MusicHandler",
        "CommandHandler",
        "EventHandler",
        "DatabaseHandler",
        "SlashHandler",
    ].forEach((handler) => {
        require(`./middleware/${handler}`)(FSXClient);
    });
    // process.on("unhandledRejection", (reason, p) => {
    //     console.log(" [antiCrash] :: Unhandled Rejection/Catch");
    //     // console.log(reason, p);
    // });
    // process.on("uncaughtException", (err, origin) => {
    //     console.log(" [antiCrash] :: Uncaught Exception/Catch");
    //     // console.log(err, origin);
    // });
    // process.on("uncaughtExceptionMonitor", (err, origin) => {
    //     console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
    //     // console.log(err, origin);
    // });
    // process.on("multipleResolves", (type, promise, reason) => {
    //     console.log(" [antiCrash] :: Multiple Resolves");
    //     //console.log(type, promise, reason);
    // });
    FSXClient.login(process.env.DISCORD_TOKEN);
})();
