const { MessageEmbed } = require("discord.js");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");
const musicCommandChecks = require("../../utils/functions/musicCommandChecks");
const {
    suggestions,
    chat_ranking,
    restricted_channels,
} = require("../../configs/features.json");
const { prefix } = require("../../configs/config.json");
const automodValidator = require("../../utils/functions/automodValidator");
const { working: automodWorking } =
    require("../../configs/automod.json").general;
const checker = require("../../utils/functions/automodChecks");

module.exports = async (client, message) => {
    if (message.author.bot) return;
    switch (message.channel.type) {
        case "GUILD_TEXT":
            /* Automod */
            if (!message.content.startsWith(prefix)) {
                if (automodWorking) {
                    if ((await automodValidator(message)) === true) {
                        break;
                    }
                }
                textChannelEvents(message);
            }

            /* Events */

            /* Command Handler */
            const escapeRegex = (str) =>
                str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const prefixRegex = new RegExp(
                `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
            );
            let matchedPrefix;
            try {
                const [, mp] = message.content.match(prefixRegex);
                if (mp) {
                    matchedPrefix = mp;
                }
            } catch (e) {
                null;
            }
            if (!prefixRegex.test(message.content)) return;
            const args = message.content
                .slice(matchedPrefix.length)
                .split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command =
                client.messageCommands.get(commandName) ||
                client.messageCommands.find(
                    (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
                );

            if (!command && matchedPrefix != prefix) {
                const mentionedReplyEmbed = new MessageEmbed()
                    .setColor(client.embedColor)
                    .setAuthor(client.user.username)
                    .setDescription(
                        `:small_orange_diamond: Prefix For this Server is ${prefix}\n\n > Use \`${prefix}help\` For all Commands List!`
                    )
                    .setTimestamp();
                return message.channel.send({ embeds: [mentionedReplyEmbed] });
            }
            if (command) {
                if (
                    client.commandCooldowns.has(
                        `${message.author.id}_${command.name}`
                    )
                ) {
                    return errorMessageEmbed(
                        message,
                        "Chill! This command has cooldown."
                    );
                }
                if (command.requiredPermission) {
                    if (
                        !message.member.permissions.has(
                            command.requiredPermission
                        )
                    ) {
                        return errorMessageEmbed(
                            message,
                            `You don't have permissions to run this command\n :small_blue_diamond: Required permission: \`${command.requiredPermission}\``
                        );
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
                    client.commandCooldowns.set(
                        `${message.author.id}_${command.name}`,
                        Date.now() + command.cooldown
                    );
                    setTimeout(() => {
                        client.commandCooldowns.delete(
                            `${message.author.id}_${command.name}`,
                            Date.now() + command.cooldown
                        );
                    }, command.cooldown);
                }
            }
            break;
        case "GUILD_NEWS":
            message.crosspost();
            break;
        case "DM":
            message.client.emit("modMail", message);
    }
};

const textChannelEvents = async (message) => {
    /* Suggestions */
    if (suggestions.working && message.channelId === suggestions.channel_id) {
        message.client.emit("suggestion", message);
    }
    /* Chat Ranking */
    if (
        chat_ranking.working &&
        !checker(
            message,
            chat_ranking.ignored_users,
            chat_ranking.ignored_roles,
            chat_ranking.ignored_channels,
            chat_ranking.ignored_categories
        )
    ) {
        message.client.emit("messageRanking", message);
    }
    /* AFK */
    if (message.mentions.users) {
        message.client.emit("afk", message);
    }
    /* Restricted Channels */
    if (restricted_channels.working && message.attachments.size === 0) {
        if (
            restricted_channels.image_ristricted_channels.includes(
                message.channelId
            ) ||
            restricted_channels.videos_ristricted_channels.includes(
                message.channelId
            )
        ) {
            message.client.emit("restrictedChannels", message);
        }
    }
};
