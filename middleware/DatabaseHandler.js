const mongoose = require("mongoose");
module.exports = async (client) => {
    /* MongoDB */
    const results = {
        0: "Disconnected",
        1: "Connected",
        2: "Connecting",
        3: "Disconnecting",
    };
    await mongoose.connect(process.env.MONGO_URL, {
        keepAlive: true,
        useNewUrlParser: true,
    });

    const { connection } = mongoose;
    console.log("Database:" + results[connection.readyState] || "Unknown");
    // /* RedisDB */
    // client.redis = redis.createClient({
    //     url: process.env.REDIS_URL,
    // });

    // client.redis.on("error", (err) => {
    //     console.error("Redis Error:", err);
    //     client.redis.quit();
    // });

    // client.redis.on("ready", () => {
    //     console.log("Redis Connected");
    // });
};
