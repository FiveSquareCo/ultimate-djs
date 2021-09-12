module.exports = (length) => {
    let generatedString = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        generatedString += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return generatedString;
};
