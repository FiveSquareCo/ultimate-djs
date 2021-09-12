const chatRankingDB = require("../../schemas/chatRankSchema");
const { MessageEmbed } = require("discord.js");
const deleteAfterTimeout = require("../../utils/functions/deleteMessage");
const levelIgnoreChecks = require("../../utils/functions/automodChecks");
const {
    xp_per_message,
    levels,
    working,
    level_up_notification,
    ignored_categories,
    ignored_users,
    ignored_channels,
    ignored_roles,
} = require("../../configs/features.json").chat_ranking;

module.exports = async (client, message) => {
    if (message.author.bot || message.content.length < 13) return;
    if (
        levelIgnoreChecks(
            message,
            ignored_users,
            ignored_roles,
            ignored_channels,
            ignored_categories
        )
    )
        return;
    const guildId = message.guildId;
    const userId = message.author.id;
    const result = await chatRankingDB.findOneAndUpdate(
        {
            guildId,
            userId,
        },
        {
            guildId,
            userId,
            $inc: {
                xp: xp_per_message,
                messages: 1,
            },
        },
        {
            upsert: true,
            new: true,
        }
    );
    let { xp, level } = result;
    const xpToLevel = (level) => level * level * 100;
    const needed = xpToLevel(level);
    const addRoleByLevel = (level) => {
        const levelReward = levels.find((obj) => obj.level === level);
        if (!levelReward) return;
        const role = message.guild.roles.cache.get(levelReward.reward_role_id);
        const member = message.guild.members.cache.get(userId);
        member.roles.add(role);
    };
    if (xp >= needed) {
        ++level;
        xp -= needed;
        if (
            (working && levels[0].reward_role_id != "reward_role_id") === true
        ) {
            addRoleByLevel(level);
        }
        if (level_up_notification.message_reply.working) {
            if (level_up_notification.message_reply.embed) {
                const replyEmbed = new MessageEmbed()
                    .setDescription(
                        `GG! You just reached ${level} level, keep grinding!`
                    )
                    .setColor(3092790);
                message
                    .reply({ embeds: [replyEmbed] })
                    .then((m) => deleteAfterTimeout(m, 3000));
            } else {
                message
                    .reply(
                        `GG! You just reached ${level} level, keep grinding!`
                    )
                    .then((m) => deleteAfterTimeout(m, 3000));
            }
        }
        await chatRankingDB.updateOne(
            {
                guildId,
                userId,
            },
            {
                level,
                xp,
            }
        );
    }
};
