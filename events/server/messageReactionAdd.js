const reactioRoles = require("../../configs/features.json").reaction_roles;
module.exports = async (client, reaction, user) => {
    if (user.bot) return;
    if (!reactioRoles.working) return;
    const ch = reactioRoles.roles[reaction.message.id];
    if (!ch) return;
    let emojiData = "";
    if (reaction.emoji.id) {
        emojiData = reaction.emoji.id;
    } else {
        emojiData = reaction.emoji.name;
    }
    console.log(emojiData);
    const role = ch[emojiData];
    if (!role || role === "role_id") return;
    const guildMember =
        reaction.message.guild.members.cache.get(user.id) ||
        (await message.guild.members.fetch(user.id));
    guildMember.roles.add(role).catch((e) => null);
};
