const { main_guild_id } = require("../../configs/config.json");

module.exports = async (client) => {
    const slashCommandsArray = [];
    await client.slashCommands.forEach((command) => {
        const cmd = {
            name: command.name,
            description: command.description || "This is default description.",
            options: command.options || [],
        };
        slashCommandsArray.push(cmd);
    });
    const guild = client.guilds.cache.get(main_guild_id);

    await guild.commands.set(slashCommandsArray);
};
