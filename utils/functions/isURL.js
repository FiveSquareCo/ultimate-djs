module.exports = (link) => {
    return link.match(/(https|http)(:\/\/)(\S)+/g) ? true : false;
};
