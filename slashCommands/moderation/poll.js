const { defalut_ping_role_id, default_channel_id } = require("../../configs/features.json").polls;
const { MessageEmbed } = require("discord.js");
const { working, commands_logs_channel_id } = require("../../configs/features.json").mod_logs;
const successMessageEmbed = require("../../utils/embeds/sucessEmbed");
module.exports = {
    name: "poll",
    description: "Start a poll (max 8 choices)",
    requiredPermission: ["MENTION_EVERYONE"],
    options: [
        {
            name: "title",
            type: "STRING",
            description: "Title for the poll",
            required: true,
        },
        {
            name: "choice1",
            type: "STRING",
            description: "Choice 1",
            required: true,
        },
        {
            name: "choice2",
            type: "STRING",
            description: "Choice 2",
            required: true,
        },
        {
            name: "choice3",
            type: "STRING",
            description: "Choice 3",
            required: false,
        },
        {
            name: "choice4",
            type: "STRING",
            description: "Choice 4",
            required: false,
        },
        {
            name: "choice5",
            type: "STRING",
            description: "Choice 5",
            required: false,
        },
        {
            name: "choice6",
            type: "STRING",
            description: "Choice 6",
            required: false,
        },
        {
            name: "choice7",
            type: "STRING",
            description: "Choice 7",
            required: false,
        },
        {
            name: "choice8",
            type: "STRING",
            description: "Choice 8",
            required: false,
        },
    ],
    run: async (interaction, args) => {
        const emojisToReact = ["1️⃣", "2️⃣"];
        const pollOptions = [`1️⃣ ${args.get("choice1").value}`, `2️⃣ ${args.get("choice2").value}`];
        const role = interaction.guild.roles.cache.get(defalut_ping_role_id);

        const channel = interaction.guild.channels.cache.get(default_channel_id);
        if (args.get("choice3")) {
            pollOptions.push(`3️⃣ ${args.get("choice1").value}`);
            emojisToReact.push("3️⃣");
        }
        if (args.get("choice4")) {
            pollOptions.push(`4️⃣ ${args.get("choice4").value}`);
            emojisToReact.push("4️⃣");
        }
        if (args.get("choice5")) {
            pollOptions.push(`5️⃣ ${args.get("choice5").value}`);
            emojisToReact.push("5️⃣");
        }
        if (args.get("choice6")) {
            pollOptions.push(`6️⃣ ${args.get("choice6").value}`);
            emojisToReact.push("6️⃣");
        }
        if (args.get("choice7")) {
            pollOptions.push(`7️⃣ ${args.get("choice6").value}`);
            emojisToReact.push("7️⃣");
        }
        if (args.get("choice8")) {
            pollOptions.push(`8️⃣ ${args.get("choice6").value}`);
            emojisToReact.push("8️⃣");
        }
        let description = "";
        pollOptions.forEach((pollOption) => {
            description += `${pollOption} \n\n`;
        });
        const title = args.get("title").value;
        const pollEmbed = new MessageEmbed().setAuthor("Poll").setTitle(title).setDescription(description).setColor(3092790).setTimestamp().setFooter("vote for your favorite option");
        let link = "";
        await channel.send({ content: ` || <@&${role.id}> ||`, embeds: [pollEmbed] }).then((message) => {
            link += `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`;
            emojisToReact.forEach((emoji) => {
                message.react(emoji);
            });
        });
        pollModlogs(interaction, interaction.user, channel, role, {
            title,
            options: pollOptions,
            link,
        });

        successMessageEmbed(interaction, `Poll sent | [Link](${link})`);
    },
};

const pollModlogs = (interaction, moderator, channel, role, pollData) => {
    if (!working || commands_logs_channel_id === "channel_id_here") return;
    const logschannel = interaction.guild.channels.cache.get(commands_logs_channel_id);
    const date = `<t:${(new Date() / 1000).toFixed()}:R>`;
    const pollsModlogEmbed = new MessageEmbed()
        .setAuthor("Mod Logs")
        .setColor(3092790)
        .setDescription(`${moderator.tag} created a poll in <#${channel.id}> on ${date}`)
        .addField("Moderator", `${moderator.tag} - ${moderator.id}`, true)
        .addField("Channel", `${channel.name} - ${channel.id}`, true)
        .addField("Role Pinged", `${role.name} - ${role.id} - <@&${role.id}>`)
        .addField("Poll Info", `> **Title :** ${pollData.title}\n> **Options :** ${pollData.options.join(", ")}`)
        .addField("Link", `[click here](${pollData.link})`)
        .setTimestamp();
    logschannel.send({ embeds: [pollsModlogEmbed] });
};
