const mongoose = require("mongoose");

const voiceJ2CSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    invites: {
        type: [String],
    },
    voiceChannelId: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("jointocreate", voiceJ2CSchema);
