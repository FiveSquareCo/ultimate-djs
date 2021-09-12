const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
};

const reqNum = {
    type: Number,
    default: 0,
};
const chatRankSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    messages: reqNum,
    xp: reqNum,
    level: reqNum,
});
module.exports = mongoose.model("chatRanking", chatRankSchema);
