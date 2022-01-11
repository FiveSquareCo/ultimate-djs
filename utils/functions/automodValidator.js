const { badwords, links: linksMod, mass_mentions, mass_emojis, general } = require("../../configs/automod.json");
const { automod_logs_channel_id, working } = require("../../configs/features.json").mod_logs;
const badWordsList = require("../../configs/badwords.json");
const automodError = require("../../utils/embeds/automodVoilate");
const isURL = require("./isURL");
const automodChecker = require("./automodChecks");
const createBin = require("../../utils/functions/createBin");
const automodDB = require("../../schemas/automodSchema");
const getSeconds = require("../../utils/functions/getSeconds");
const firstLetterCapital = require("../../utils/functions/firstLetterCapital");
const { MessageEmbed } = require("discord.js");
module.exports = async (message) => {
    if (generalAutomod(message) === true) return;
    if (massemojiAutomod(message) === true) {
        dbChecker(message);
        return { voilated: true, type: "mass_emoji" };
    } else if (badwordsAutomod(message) === true) {
        dbChecker(message);
        return { voilated: true, type: "badwords" };
    } else if (linksAutomod(message) === true) {
        dbChecker(message);
        return { voilated: true, type: "links" };
    } else if (massmentionAutomod(message) === true) {
        dbChecker(message);
        return { voilated: true, type: "mass_mention" };
    }
};
const badwordsAutomod = (message) => {
    let bwl = badwords.blacklisted_words;
    if (!badwords.blacklisted_words.length) {
        bwl = badWordsList;
    }
    if (badwords.working) {
        if (automodChecker(message, badwords.ignored_users, badwords.ignored_roles, badwords.ignored_channels, badwords.ignored_categories)) {
            return;
        }
        let badwordThings = {
            wordUsed: "",
            usedOrNo: false,
        };
        message.content.split(" ").forEach((word) => {
            if (bwl.includes(word.toLowerCase())) {
                badwordThings.wordUsed = word;
                badwordThings.usedOrNo = true;
            }
        });
        if (badwordThings.usedOrNo) {
            automodError(message, `**${message.member.user.tag}** Don't use badwords!`);
            automodLogsGenerator(message, {
                name: "badwords",
                wordUsed: badwordThings.wordUsed,
            });
            message.delete();
            return true;
        }
    }
    return false;
};

const linksAutomod = (message) => {
    if (automodChecker(message, linksMod.ignored_users, linksMod.ignored_roles, linksMod.ignored_channels, linksMod.ignored_categories)) {
        return;
    }
    let link = {
        linkUsed: "",
        usedOrNo: false,
    };

    if (isURL(message.content)) {
        linksMod.whitelisted_links.forEach((lk) => {
            if (message.content.includes(lk.toLocaleLowerCase())) {
                link.usedOrNo = true;
            }
        });
        if (!link.usedOrNo) {
            automodError(message, `**${message.member.user.tag}** Don't send links here!`);
            automodLogsGenerator(message, {
                name: "links",
                linkUsed: link.linkUsed,
            });
            message.delete();
            return true;
        }
    }
    return false;
};

const massmentionAutomod = async (message) => {
    if (automodChecker(message, mass_mentions.ignored_users, mass_mentions.ignored_roles, mass_mentions.ignored_channels, mass_mentions.ignored_categories)) {
        return;
    }
    const userMentions = message.mentions.users;
    const roleMentions = message.mentions.roles;
    const channelMentions = message.mentions.channels;
    if (userMentions.size > mass_mentions.max_users_mentions || roleMentions.size > mass_mentions.max_roles_mentions || channelMentions.size > mass_mentions.max_channels_mentions) {
        automodError(message, `**${message.member.user.tag}** Don't mention more than ${mass_mentions.max_users_mentions} Users/Roles/Channels.`);
        if (message.content.length > 50) {
            const cont = await createBin(message.content, "", "");
            automodLogsGenerator(message, {
                name: "mass mention",
                content: cont,
            });
        } else {
            automodLogsGenerator(message, {
                name: "mass mention",
                content: message.content,
            });
        }

        message.delete();
        return true;
    }
    return false;
};

const massemojiAutomod = (message) => {
    if (automodChecker(message, mass_emojis.ignored_users, mass_emojis.ignored_roles, mass_emojis.ignored_channels, mass_emojis.ignored_categories)) {
        return;
    }
    const aa = message.content.match(/<:.+?:\d+>/g) || [];
    const na = message.content.match(/<a:.+?:\d+>/g) || [];
    const emojisArray = [...aa, ...na];
    if (emojisArray.length > mass_emojis.max_emojis) {
        automodError(message, `**${message.member.user.tag}** Don't send more than ${mass_emojis.max_emojis} in one message.`);
        automodLogsGenerator(message, {
            name: "mass emoji",
            emojisLen: emojisArray.length,
        });
        message.delete();
        return true;
    }
    return false;
};

const capitalLettersAutomod = (str) => {
    str.replace(/[a-z]/g, "");
};

const generalAutomod = (message) => {
    if (automodChecker(message, general.ignored_users, general.ignored_roles, general.ignored_channels, general.ignored_categories)) {
        return true;
    }
};

const dbChecker = async (message) => {
    const guildId = message.guildId;
    const userId = message.author.id;
    const punishments = general.punishments;
    const results = await automodDB.findOneAndUpdate(
        { guildId, userId },
        {
            guildId,
            userId,
            $inc: {
                strikes: 1,
            },
        },
        {
            upsert: true,
            new: true,
        }
    );
    const pun = punishments.find((obj) => obj.strikes === results.strikes);
    if (pun) {
        switch (pun.type) {
            case "mute":
                const interaction = message;
                const data = {
                    interaction,
                    member: message.member,
                    seconds: getSeconds(pun.duration, pun.durationType),
                    reason: `${pun.strikes} strikes of automod.`,
                    type: "Automod",
                    duration: pun.duration,
                    durationType: pun.durationType,
                };
                interaction.client.emit("mute", data);
                break;
            case "kick":
                message.member.kick().catch();
                break;
            case "ban":
                break;
        }
    }
};

const automodLogsGenerator = (message, automod) => {
    if (working && automod_logs_channel_id != "channel_id_here") {
        const channel = message.client.channels.cache.get(automod_logs_channel_id);
        const date = `<t:${(new Date(message.createdTimestamp) / 1000).toFixed()}:R>`;
        const embed = new MessageEmbed().setAuthor("Automod Logs").setColor(3092790).setDescription(`${message.author.tag} violated ${automod.name} at ${date}`).setTimestamp().addField("User", `${message.author.tag} - ${message.author.id}`);
        switch (automod.name) {
            case "badwords":
                embed.addField("Automod", firstLetterCapital(automod.wordUsed), true);
                embed.addField("Word used", automod.wordUsed, true);
                break;
            case "links":
                embed.addField("Automod", firstLetterCapital(automod.name), true);
                embed.addField("Link used", `${message.content.match(/(https|http)(:\/\/)(\S)+/g)[0]}`, true);
                break;
            case "mass mention":
                embed.addField("Automod", firstLetterCapital(automod.name), true);
                embed.addField("Content", automod.content, true);
                break;
            case "mass emoji":
                embed.addField("Automod", firstLetterCapital(automod.name), true);
                embed.addField("Emojis count", `${automod.emojisLen}`, true);
                break;
        }
        channel.send({ embeds: [embed] });
    }
};
