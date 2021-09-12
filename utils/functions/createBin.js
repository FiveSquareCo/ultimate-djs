const { default: axios } = require("axios");
const getRandomUA = require("./getRandomUA");

module.exports = async (content, title, description) => {
    const { data } = await axios({
        method: "POST",
        url: "https://sourceb.in/api/bins",
        data: {
            files: [{ content }],
            title,
            description,
        },
        headers: {
            "User-Agent": getRandomUA(),
        },
    });
    return `https://sourceb.in/${data.key}`;
};
