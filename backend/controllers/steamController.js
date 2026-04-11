const steamService = require("../utils/steamUtils");
const axios = require('axios')
const { getRecommendationsFromGemini } = require("../services/geminiService");

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

//GET_TOTAL_GAME_COUNT
const getTotalGameCount = async (req, res) => {
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

        res.json({
            total_games: games.length,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getRecentlyPlayedGames = async (req, res) => {
    try {
        const user = req.user;

        if (!user.steamId) {
            return res.status(400).json({ message: "Steam not linked" });
        }

        const response = await axios.get(
            "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/",
            {
                params: {
                    key: process.env.STEAM_API_KEY,
                    steamid: user.steamId,
                },
            }
        );

        const games = response.data.response.games || [];

        if (!games.length) {
            return res.json({ message: "No recent activity in last 2 weeks" });
        }

        const formatted = games.map(game => ({
            name: game.name,
            playtime_2weeks_hours: (game.playtime_2weeks / 60).toFixed(1),
            playtime_total_hours: (game.playtime_forever / 60).toFixed(1),
        }));

        res.json({
            count: formatted.length,
            recent_games: formatted,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//GET_GAME_PLAYTIME_BY_NAME
const getGamePlaytimeByName = async (req, res) => {
    try {
        const user = req.user;
        const { game } = req.query;

        if (!user.steamId) {
            return res.status(400).json({ message: "Steam not linked" });
        }

        if (!game) {
            return res.status(400).json({ message: "Game name is required" });
        }

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

        const games = response.data.response.games || [];

        if (!games.length) {
            return res.json({ message: "No games found or profile is private" });
        }

        const query = game.toLowerCase();

        // Basic matching
        const matchedGame = games.find(g =>
            g.name.toLowerCase().includes(query)
        );

        if (!matchedGame) {
            return res.status(404).json({ message: "Game not found in library" });
        }

        res.json({
            name: matchedGame.name,
            playtime_hours: (matchedGame.playtime_forever / 60).toFixed(1),
            playtime_minutes: matchedGame.playtime_forever,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//GET_PROFILE_SUMMARY
const getProfileSummary = async (req, res) => {
    try {
        const user = req.user;

        if (!user.steamId) {
            return res.status(400).json({ message: "Steam not linked" });
        }

        const response = await axios.get(
            "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
            {
                params: {
                    key: process.env.STEAM_API_KEY,
                    steamids: user.steamId,
                },
            }
        );

        const players = response.data.response.players;

        if (!players.length) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const profile = players[0];

        res.json({
            name: profile.personaname,
            avatar: profile.avatarfull,
            profile_url: profile.profileurl,
            visibility: profile.communityvisibilitystate === 3 ? "Public" : "Private",
            last_seen: profile.lastlogoff
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//GET_GAME_RECOMMENDATIONS
//func works but need to change the gemini key in env. it has expired
const getGameRecommendations = async (req, res) => {
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
                    include_appinfo: true,
                },
            }
        );

        const games = response.data.response.games || [];

        if (!games.length) {
            return res.json({ message: "No games found" });
        }

        // Get top 5 games
        const topGames = games
            .sort((a, b) => b.playtime_forever - a.playtime_forever)
            .slice(0, 5)
            .map(g => g.name);

        const recommendations = await getRecommendationsFromGemini(topGames);

        res.json({
            based_on: topGames,
            recommendations
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = { getTopPlayedGames, getTotalAccountPlaytime, getTotalGameCount, getRecentlyPlayedGames, getGamePlaytimeByName, getProfileSummary, getGameRecommendations};
