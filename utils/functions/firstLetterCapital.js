module.exports = (string) => {
    return string.replace(/^\w/, (c) => c.toUpperCase());
};
