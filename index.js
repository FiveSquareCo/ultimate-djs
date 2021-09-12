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

    FSXClient.login(process.env.DISCORD_TOKEN);
})();
