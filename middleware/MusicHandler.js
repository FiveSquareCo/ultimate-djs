const { default: Distube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
module.exports = (client) => {
    client.player = new Distube(client, {
        leaveOnEmpty: false,
        leaveOnFinish: false,
        leaveOnStop: false,
        youtubeDL: true,
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        updateYouTubeDL: true,
        plugins: [new SpotifyPlugin()],
    });

    client.playerStatus = (queue, type) => {
        const statusOptions = {
            volume: queue.volume,
            filter: queue.filter || "None",
            loop: queue.repeatMode
                ? queue.repeatMode == 2
                    ? "Queue"
                    : "Track"
                : "None",
            autoplay: queue.autoplay ? "On" : "Off",
        };
        const statusText = `**Volume  :**  ${statusOptions.volume} | **Filters  :**  ${statusOptions.filter} | **Loop  :**  ${statusOptions.loop} | **Autoplay  :**  ${statusOptions.autoplay}`;
        return type ? statusOptions : statusText;
    };
};
