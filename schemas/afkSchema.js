const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
};

const afkSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    reason: reqString,
    time: reqString,
});
module.exports = mongoose.model("afks", afkSchema);
