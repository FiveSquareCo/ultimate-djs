const { default: axios } = require("axios");
const { MessageEmbed } = require("discord.js");
const errorMessageEmbed = require("../../utils/embeds/errorEmbed");

module.exports = {
    name: "userinfo",
    aliases: ["ui", "aboutuser"],
    cooldown: 3000,
    description: "give users ping",
    category: "misc",
    run: async (message, [id]) => {
        const user =
            message.mentions.users.first() ||
            message.client.users.cache.get(id) ||
            message.author;
        if (!user) {
            return errorMessageEmbed(
                message,
                "Please mentions a valid user/user id"
            );
        }
        const member = message.guild.members.cache.get(user.id);
        const { data } = await axios.get(
            `https://discord.com/api/users/${user.id}`,
            {
                headers: {
                    Authorization: `Bot ${message.client.token}`,
                },
            }
        );
        const time = `<t:${(
            new Date(member.joinedTimestamp) / 1000
        ).toFixed()}:R>`;
        const cTime = `<t:${(
            new Date(member.user.createdTimestamp) / 1000
        ).toFixed()}:R>`;
        const boostedOn = `<t:${(
            new Date(member.premiumSince) / 1000
        ).toFixed()}:R>`;
        const userInfoEmbed = new MessageEmbed()
            .setAuthor("User Information")
            .setTimestamp()
            .setColor(member.displayHexColor || 3092790)
            .setThumbnail(
                member.user.displayAvatarURL({ dynamic: true, size: 512 })
            )
            .setDescription(
                `:white_small_square: **Tag :** ${
                    member.user.tag
                }\n :white_small_square: **Id :** ${
                    user.id
                } \n :white_small_square: **Nickname**: ${
                    member.nickname || "Not available"
                } \n :white_small_square: **Presence :** ${
                    member.presence?.status
                } \n :white_small_square: **Account created :** ${cTime} \n:white_small_square: **Joined server :** ${time} \n :white_small_square: **Highest role :** <@&${
                    member.roles.highest.id
                }>\n :white_small_square: **Roles count:** ${
                    member.roles.cache.size - 1
                } \n:white_small_square: **Banner :** ${
                    data.banner ? "" : "No banner"
                }`
            );
        if (data.banner) {
            const extenstion = data.banner.startsWith("a_") ? ".gif" : ".png";
            const url = `https://cdn.discordapp.com/banners/${user.id}/${data.banner}${extenstion}?size=512`;
            userInfoEmbed.setImage(url);
        }
        message.reply({
            embeds: [userInfoEmbed],
        });
    },
};
