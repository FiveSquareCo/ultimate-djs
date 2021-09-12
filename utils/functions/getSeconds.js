module.exports = (duration, durationType) => {
    const durations = {
        minutes: 60,
        hours: 60 * 60,
        days: 60 * 60 * 24,
        weeks: 60 * 60 * 24 * 7,
        permanent: -1,
    };
    return duration * durations[durationType];
};
