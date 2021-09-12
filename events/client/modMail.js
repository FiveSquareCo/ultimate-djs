const { working, category_id, role_to_ping_on_ticket_create } =
    require("../../configs/features.json").mod_mail;
const { main_guild_id } = require("../../configs/config.json");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const modmailDB = require("../../schemas/modmailSchema");
// const shortenUrl = require("../../utils/functions/shortenURL");

module.exports = async (client, message) => {
    if (!working || category_id === "category_id_here") return;
    const guild = client.guilds.cache.get(main_guild_id);
    const results = await modmailDB.findOne({
        guildid: guild.id,
        userId: message.author.id,
    });
    if (!results) {
        return newModmail(guild, message);
    }
    const channel = guild.channels.cache.get(results.channelId);
    const messageUpdate = `**${message.author.tag}** -- ${message.content}`;
    if (message.attachments.size > 0) {
        const attachment = message.attachments.first();
        messageUpdate += attachment.url;
    }
    await modmailDB.findOneAndUpdate(
        { guildId: guild.id, userId: message.author.id },
        {
            guildId: guild.id,
            userId: message.author.id,
            channelId: channel.id,
            $push: {
                conversation: messageUpdate,
            },
        },
        {
            upsert: true,
        }
    );
    channel.send({ content: messageUpdate });
};

const newModmail = async (guild, message) => {
    const channel = await guild.channels.create(message.author.tag, {
        type: "GUILD_TEXT",
        parent: category_id,
        topic: `${message.author.id}`,
    });

    const modMailChannelEmbed = new MessageEmbed()
        .setAuthor("Ticket Created")
        .setDescription(
            `**${message.author.tag}** needs your help!\nTo close this ticket react with ❌ `
        )
        .setColor(4437378)
        .setFooter("Created on")
        .setTimestamp();
    const closeTicketButton = new MessageButton()
        .setCustomId(`MODMAIL_${channel.id}`)
        .setLabel("❌ Close")
        .setStyle("DANGER");
    const buttons = new MessageActionRow().addComponents([closeTicketButton]);
    channel
        .send({
            embeds: [modMailChannelEmbed],
            components: [buttons],
            content: `|| <@${role_to_ping_on_ticket_create}> ||`,
        })
        .then(async (msg) => await msg.pin());
    const authorReplyEmbed = new MessageEmbed()
        .setDescription(
            "Hi! We've received your message. A moderator will be with you as soon as possible. Please provide as much detail and information as you can, if you haven't already. Thanks!"
        )
        .setColor(4437378);
    await message.author.send({ embeds: [authorReplyEmbed] });
    let messageUpdate = `**${message.author.tag}** -- ${message.content}`;
    if (message.attachments.size > 0) {
        const attachment = message.attachments.first();
        messageUpdate += attachment.url;
    }
    await modmailDB.findOneAndUpdate(
        { guildId: guild.id, userId: message.author.id },
        {
            guildId: guild.id,
            userId: message.author.id,
            channelId: channel.id,
            $push: {
                conversation: messageUpdate,
            },
        },
        {
            upsert: true,
        }
    );
    channel.send({ content: messageUpdate });
};
