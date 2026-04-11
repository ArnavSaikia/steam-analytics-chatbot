const steamService = require("../utils/steamUtils");
const axios = require('axios')

//GET_TOP_PLAYED_GAMES
const getTopPlayedGames = async (req, res) => {
    try {
        const user = req.user;

        if (!user.steamId) {
            return res.status(400).json({ message: "Steam not linked" });
        }

        // Fetch owned games
        const response = await axios.get(
            "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/",
            {
                params: {
                    key: process.env.STEAM_API_KEY,
                    steamid: user.steamId,
                    include_appinfo: true,
                },
            }
        );

        let games = response.data.response.games || [];

        if (!games.length) {
            return res.json({ message: "No games found or profile is private" });
        }

        // Sort by playtime (descending)
        games.sort((a, b) => b.playtime_forever - a.playtime_forever);

        // Limit results (default top 5)
        const limit = parseInt(req.query.limit) || 5;

        const topGames = games.slice(0, limit).map(game => ({
            name: game.name,
            playtime_hours: (game.playtime_forever / 60).toFixed(1),
        }));

        res.json({
            count: topGames.length,
            topGames,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//GET_TOTAL_ACCOUNT_PLAYTIME
const getTotalAccountPlaytime = async (req, res) => {
    try {
        const user = req.user;

        if (!user.steamId) {
            return res.status(400).json({ message: "Steam not linked" });
        }

        const response = await axios.get(
            "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/",
            {
                params: {
                    key: process.env.STEAM_API_KEY,
                    steamid: user.steamId,
                },
            }
        );

        const games = response.data.response.games || [];

        if (!games.length) {
            return res.json({ message: "No games found or profile is private" });
        }

        const totalMinutes = games.reduce(
            (sum, game) => sum + (game.playtime_forever || 0),
            0
        );

        const totalHours = (totalMinutes / 60).toFixed(1);

        res.json({
            total_playtime_hours: totalHours,
            total_playtime_minutes: totalMinutes,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getTopPlayedGames, getTotalAccountPlaytime };
