const steamService = require("../services/steamService");

const getSteamSummary = async (req, res) => {
    const { steamId } = req.params;

    if (!steamId) {
        return res.status(400).json({ message: "Steam ID is required" });
    }

    try {
        const games = await steamService.getOwnedGames(steamId);

        if (games.length === 0) {
            return res.json({
                totalGames: 0,
                totalPlaytimeHours: 0,
                mostPlayedGame: null
            });
        }

        let totalPlaytimeMinutes = 0;
        let mostPlayedGame = games[0];

        for (const game of games) {
            totalPlaytimeMinutes += game.playtime_forever;

            if (game.playtime_forever > mostPlayedGame.playtime_forever) {
                mostPlayedGame = game;
            }
        }

        res.json({
            totalGames: games.length,
            totalPlaytimeHours: Math.round(totalPlaytimeMinutes / 60),
            mostPlayedGame: {
                name: mostPlayedGame.name,
                playtimeHours: Math.round(mostPlayedGame.playtime_forever / 60)
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch Steam data",
            error: err.message
        });
    }
};

module.exports = {
    getSteamSummary
};
