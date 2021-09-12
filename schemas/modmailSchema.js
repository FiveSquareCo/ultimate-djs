const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
};

const modmailSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    channelId: reqString,
    conversation: [String],
});
module.exports = mongoose.model("modmail", modmailSchema);
