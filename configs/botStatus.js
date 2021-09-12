const { version } = require("../package.json");

module.exports.status = (client) => {
    return [
        {
            text: `Five Square Co.`,
            type: "WATCHING",
        },
        {
            text: "Feature Rich Bot Template by FiveSquareCo.",
            type: "PLAYING",
        },
        {
            text: `Version ${version}`,
            type: "PLAYING",
        },
        {
            text: `${client.users.cache.size} Users`,
            type: "WATCHING",
        },
        {
            text: `/help `,
            type: "WATCHING",
        },
    ];
};
module.exports.interval = 300000;
