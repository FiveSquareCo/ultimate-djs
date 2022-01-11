require("dotenv").config();
const logs = require("discord-logs");

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

    FSXClient.REDIS_URL = process.env.REDIS_URL;
    FSXClient.messageCommands = new Collection();
    FSXClient.slashCommands = new Collection();
    FSXClient.commandCooldowns = new Collection();

    ["MusicHandler", "CommandHandler", "EventHandler", "DatabaseHandler", "SlashHandler"].forEach((handler) => {
        require(`./middleware/${handler}`)(FSXClient);
    });

    FSXClient.login(process.env.DISCORD_TOKEN);
    logs(FSXClient);
    /* Setup Error Handlers */
    /* Checking for Redis URL and Redis Features */
    if (!FSXClient.REDIS_URL || FSXClient.REDIS_URL === "REDIS_CONNECTION_URL_HERE") {
        console.log("hi");
    }
})();
