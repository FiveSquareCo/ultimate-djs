const { MessageEmbed, Team, User } = require("discord.js");
const { expire } = require("../../utils/functions/redis");
const { auto_meme } = require("../../configs/features.json");
const { status, interval } = require("../../configs/botStatus");
const { colors, main_guild_id } = require("../../configs/config.json");
module.exports = async (client) => {
    /* Regestring Slash Commands */
    registerSlashCommands(client);
    /* Redis Expire */
    expire(async (message) => {
        const det = message.split("-");
        const userId = det[1];
        const guildId = det[2];
        const guild = client.guilds.cache.get(guildId);
        const member = await guild.members.fetch(userId);
        const role = guild.roles.cache.find((r) => r.name === "Muted");
        member.roles.remove(role);
        const unmutedUserEmbed = new MessageEmbed()
            .setDescription(
                `You were Unmuted automatically in **${guild.name}**`
            )
            .setColor(3092790);
        member.send({ embeds: [unmutedUserEmbed] }).catch((e) => null);
    });
    /* Events  */
    if (auto_meme.working && auto_meme.channel_id != "channel_id_here") {
        client.emit("automeme", auto_meme.channel_id, auto_meme.interval);
    }
    /* Bot Owners/Dev Setup */
    client.devs = [];
    const application = await client.application.fetch();
    const { owner } = application;
    if (owner instanceof Team) {
        owner.members.map((u) => {
            client.devs.push(u.id);
        });
    } else {
        client.devs.push(owner.id);
    }
    console.log("Bot is up");
    /* Status  */
    const statusOptions = status(client);
    const randomStatus = () => {
        const status = Math.floor(Math.random() * statusOptions.length);
        client.user.setActivity(statusOptions[status].text, {
            type: statusOptions[status].type,
        });
    };

    /* Client Global Variables */
    client.colors = colors;
    setInterval(randomStatus, interval);
};

const registerSlashCommands = async (client) => {
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
