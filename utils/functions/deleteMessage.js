module.exports = (message, timeout) => {
    setTimeout(() => message.delete(), timeout);
};
