module.exports = (link) => {
    return link.match(/(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/) ? true : false;
};
