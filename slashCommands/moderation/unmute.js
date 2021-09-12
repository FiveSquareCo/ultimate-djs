const { redis } = require("../../utils/functions/redis");
const successMessageEmbed = require("../../utils/embeds/sucessEmbed");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "unmute",
    cooldown: 3000,
    description: "Mute",
    requiredPermission: "MANAGE_ROLES",
    options: [
        {
            name: "member",
            type: "USER",
            description: "The guild member to kick",
            required: true,
        },
        {
            name: "reason",
            type: "STRING",
            description: "Time",
            required: true,
        },
    ],
    run: async (interaction, args) => {
        const reason = args.get("reason")?.value || "No reason";
        const { user } = args.get("member");
        const redisClient = await redis();
        const member = await interaction.guild.members.fetch(user.id);
        try {
            redisClient.get(
                `muted-${user.id}-${interaction.guild.id}`,
                (err, result) => {
                    if (err) {
                        console.log(err);
                    } else if (result) {
                        const role = interaction.guild.roles.cache.find(
                            (role) => role.name === "Muted"
                        );
                        if (role) {
                            member.roles.remove(role);
                            successMessageEmbed(
                                interaction,
                                `**${user.tag}** has been Unmuted | **Reason:** ${reason}`
                            );
                            const unmutedUserEmbed = new MessageEmbed()
                                .setDescription(
                                    `You were Unmuted manually in **${interaction.guild.name}** | **Reson :** ${reason}`
                                )
                                .setColor(3092790);
                            user.send({ embeds: [unmutedUserEmbed] });
                        }
                    }
                }
            );
            redisClient.del(`muted-${user.id}-${interaction.guild.id}`);
        } finally {
            redisClient.quit();
        }
    },
};
