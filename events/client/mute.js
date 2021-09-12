const { redis } = require("../../utils/functions/redis");
const successMessageEmbed = require("../../utils/embeds/sucessEmbed");
const { MessageEmbed } = require("discord.js");
module.exports = async (client, data) => {
    const role = data.interaction.guild.roles.cache.find(
        (role) => role.name === "Muted"
    );
    if (role) {
        data.member.roles.add(role);
    }
    const { user } = data.member;
    const type = data.type === "Command" ? "Moderator" : "Automod";
    const redisClient = await redis();
    try {
        const redisKey = `muted-${user.id}-${data.interaction.guild.id}`;

        if (data.seconds >= 0) {
            redisClient.set(redisKey, "true", "EX", data.seconds);
        } else {
            redisClient.set(redisKey, "true");
        }
    } finally {
        redisClient.quit();
    }
    successMessageEmbed(
        data.interaction,
        `**${user.tag}** has been Muted for ${data.duration} ${data.durationType} | **reason:** ${data.reason}`
    );
    const userEmbed = new MessageEmbed()
        .setColor(15548997)
        .setDescription(
            `You were Muted in **${data.interaction.guild.name}** by ${type} for ${data.duration} ${data.durationType} |  **reason:** ${data.reason}`
        );
    user.send({ embeds: [userEmbed] }).catch();
};
