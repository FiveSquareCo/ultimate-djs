const { Client } = require("discord.js");
const { main_guild_id } = require("../../configs/config.json");

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
    const slashCommandsArray = [];
    await client.slashCommands.forEach((command) => {
        const cmd = {
            name: command.name,
            description: command.description || "This is default description.",
            options: command.options || [],
            requiredPermission: command.requiredPermission,
        };
        slashCommandsArray.push(cmd);
    });
    const guild = client.guilds.cache.get(main_guild_id);

    await guild.commands.set(slashCommandsArray);
};
