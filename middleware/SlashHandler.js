const { readdirSync } = require("fs");

module.exports = (client) => {
    const commandsDirArray = [];
    readdirSync("./slashCommands", {
        withFileTypes: true,
    }).filter((directory) => {
        if (directory.isDirectory()) {
            commandsDirArray.push(directory.name);
        }
    });
    const loadCommandsDir = (dirs) => {
        const commandFiles = readdirSync(`./slashCommands/${dirs}`).filter(
            (file) => file.endsWith(".js")
        );

        for (const file of commandFiles) {
            const fileName = file.replace(".js", "");
            const command = require(`../slashCommands/${dirs}/${fileName}`);
            if (command.name) {
                client.slashCommands.set(command.name, command);
            } else {
                continue;
            }
        }
    };
    commandsDirArray.forEach((dir) => loadCommandsDir(dir));
};
