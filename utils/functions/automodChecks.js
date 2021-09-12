module.exports = (message, userList, rolesList, channelList, categoryList) => {
    if (
        userList.includes(message.member.id) ||
        channelList.includes(message.channelId) ||
        categoryList.includes(message.channel.parentId) ||
        rolesList.some((role) => message.member.roles.cache.has(role))
    ) {
        return true;
    }

    return false;
};
