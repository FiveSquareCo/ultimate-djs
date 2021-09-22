const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
};

const voiceRankingSchema = new mongoose.Schema({
    userId: reqString,
    guildId: reqString,
    time: Number,
    level:{
        type:Number,
        default:0
    },
    totalTime:Number,
});
const voiceTimerSchema = new mongoose.Schema({
    userId: reqString,
    guildId: reqString,
    start: Number,
});

const voiceRankingDB = mongoose.model("voice rankings", voiceRankingSchema);
const voiceTimersDB = mongoose.model("voice timers", voiceTimerSchema);

module.exports = {
    voiceTimersDB,
    voiceRankingDB,
};
