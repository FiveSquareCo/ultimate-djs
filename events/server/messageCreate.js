const { MessageEmbed, Client, Message } = require("discord.js");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const musicCommandChecks = require("../../utils/functions/musicCommandChecks");
const { suggestions, chat_ranking, restricted_channels, crosspost } = require("../../configs/features.json");
const { prefix } = require("../../configs/config.json");
const automodValidator = require("../../utils/functions/automodValidator");
const { working: automodWorking } = require("../../configs/automod.json").general;
const checker = require("../../utils/functions/automodChecks");
/**
 *
 * @param {Client} client
 * @param {Message} message
 * @returns
 */

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === "GUILD_TEXT") {
        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.messageCommands.get(commandName) || client.messageCommands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) {
            if (automodWorking) {
                antiSpam.message(message);
                if ((await automodValidator(message)) === true) {
                    return;
                }
            }
            textChannelEvents(message);
            return;
        }
        if (client.commandCooldowns.has(`${message.author.id}_${command.name}`)) {
            return errorMessageEmbed(message, "Chill! This command has cooldown.");
        }
        if (command.requiredPermission) {
            if (!message.member.permissions.has(command.requiredPermission)) {
                return errorMessageEmbed(message, `You don't have permissions to run this command\n :small_blue_diamond: Required permission: \`${command.requiredPermission}\``);
            }
        }
        if (command.category === "music") {
            if (musicCommandChecks(message) === true) {
                command.run(message, args, client);
            }
        } else {
            command.run(message, args, client);
        }
        if (command.cooldown) {
            client.commandCooldowns.set(`${message.author.id}_${command.name}`, Date.now() + command.cooldown);
            setTimeout(() => {
                client.commandCooldowns.delete(`${message.author.id}_${command.name}`, Date.now() + command.cooldown);
            }, command.cooldown);
        }
    }
    if (message.channel.type === "GUILD_NEWS") {
        if (crosspost.working) {
            message.crosspost();
        }
    }
};

const textChannelEvents = async (message) => {
    /* Suggestions */
    if (suggestions.working && message.channelId === suggestions.channel_id) {
        message.client.emit("suggestion", message);
    }
    /* Chat Ranking */
    if (chat_ranking.working && !checker(message, chat_ranking.ignored_users, chat_ranking.ignored_roles, chat_ranking.ignored_channels, chat_ranking.ignored_categories)) {
        message.client.emit("messageRanking", message);
    }
    /* AFK */
    if (message.mentions.users) {
        message.client.emit("afk", message);
    }
    /* Restricted Channels */
    if (restricted_channels.working && message.attachments.size === 0) {
        if (restricted_channels.image_ristricted_channels.includes(message.channelId) || restricted_channels.videos_ristricted_channels.includes(message.channelId)) {
            message.client.emit("restrictedChannels", message);
        }
    }
};
