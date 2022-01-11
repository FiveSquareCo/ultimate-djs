const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
};

const reqNumber = {
    type: Number,
    required: true,
};

const afkSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    reason: reqString,
    time: reqNumber,
});
module.exports = mongoose.model("afks", afkSchema);
