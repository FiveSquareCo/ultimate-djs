const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
};

const reqNum = {
    type: Number,
    default: 0,
};
const automodSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    strikes: reqNum,
});
module.exports = mongoose.model("automods", automodSchema);
