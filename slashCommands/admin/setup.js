const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require("discord.js");
const { tickets } = require("../../configs/features.json");
const { successEmbed } = require("../../utils/embeds/");
module.exports = {
    name: "setup",
    description: "Setup the bot for your server/change bot settings.",
    requiredPermission: ["ADMINISTRATOR"],
    options: [
        {
            name: "ticket",
            description: "Add ticket feature to server.",
            type: "SUB_COMMAND",
        },
    ],
    run: async (interaction, args) => {
        const subcommand = args._subcommand;
        switch (subcommand) {
            case "ticket":
                await ticketSetup(interaction);
                break;
        }
    },
};

async function ticketSetup(interaction) {
    const channel = await interaction.guild.channels.fetch(tickets.menu_channel_id);
    const menuEmbed = new MessageEmbed().setColor(3092790).setAuthor({ name: "Support" }).setDescription("Select the category of your problem to create ticket.");
    let menu = new MessageSelectMenu().setMaxValues(1).setMinValues(1).setCustomId(`TICKET_MENU`).setPlaceholder("Selcet category").addOptions(tickets.menu);
    channel
        .send({
            embeds: [menuEmbed],
            components: [new MessageActionRow().addComponents(menu)],
        })
        .then((msg) => {
            const messageLink = `https://discord.com/channels/${interaction.guild.id}/${channel.id}/${msg.id}`;
            return successEmbed(interaction, `Successfully configured ticket system | [click here to redirect](${messageLink})`);
        });
}
