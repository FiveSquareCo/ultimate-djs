const { readdirSync } = require("fs");

module.exports = (client) => {
    ["client", "server", "private"].forEach((dir) => loadEventDir(dir, client, false));
    ["music"].forEach((dir) => loadEventDir(dir, client, true));
};

const loadEventDir = (dirs, client, isDistube) => {
    const eventFiles = readdirSync(`./events/${dirs}`).filter((file) => file.endsWith(".js"));
    for (const file of eventFiles) {
        const event = require(`../events/${dirs}/${file}`);
        const eventName = file.split(".")[0];
        isDistube ? client.player.on(eventName, event.bind(null, client)) : client.on(eventName, event.bind(null, client));
    }
};
