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
        const game = req.query.game || req.intentData?.game;

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
                    include_played_free_games: true,
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


//GET_FRIENDS_CURRENT_ACTIVITY
const getFriendsCurrentActivity = async (req, res) => {
    try {
        const user = req.user;

        if (!user.steamId) {
            return res.status(400).json({ message: "Steam not linked" });
        }

        // Step 1: Get friends
        const friendsRes = await axios.get(
            "https://api.steampowered.com/ISteamUser/GetFriendList/v1/",
            {
                params: {
                    key: process.env.STEAM_API_KEY,
                    steamid: user.steamId,
                },
            }
        );

        const friends = friendsRes.data.friendslist?.friends || [];

        if (!friends.length) {
            return res.json({
                message: "No friends found or friends list is private"
            });
        }

        // Limit for safety
        const limitedFriends = friends.slice(0, 10);
        const friendIds = limitedFriends.map(f => f.steamid);

        // Step 2: Get profile data (ONE CALL)
        const summaryRes = await axios.get(
            "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
            {
                params: {
                    key: process.env.STEAM_API_KEY,
                    steamids: friendIds.join(","),
                },
            }
        );

        const players = summaryRes.data.response.players || [];

        // Map steamId → profile
        const profileMap = {};
        players.forEach(p => {
            profileMap[p.steamid] = {
                name: p.personaname,
                avatar: p.avatarfull,
            };
        });

        const results = [];

        // Step 3: Fetch recent games per friend
        for (const friendId of friendIds) {
            try {
                const recentRes = await axios.get(
                    "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/",
                    {
                        params: {
                            key: process.env.STEAM_API_KEY,
                            steamid: friendId,
                        },
                    }
                );

                const games = recentRes.data.response.games || [];

                if (games.length > 0) {
                    results.push({
                        steamid: friendId,
                        name: profileMap[friendId]?.name || "Unknown",
                        avatar: profileMap[friendId]?.avatar || null,
                        recent_games: games.slice(0, 2).map(g => ({
                            name: g.name,
                            playtime_2weeks_hours: (g.playtime_2weeks / 60).toFixed(1),
                        })),
                    });
                }

            } catch (err) {
                continue; // ignore private profiles
            }
        }

        if (!results.length) {
            return res.json({
                message: "No recent activity found for friends"
            });
        }

        res.json({
            count: results.length,
            friends_activity: results,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//FALLBACK_UNKNOWN_INTENT
const fallbackUnknownIntent = async (req, res) => {
    try {
        res.json({
            message: "Sorry, I didn't understand that request.",
            supported_queries: [
                "Show my top played games",
                "How many games do I own?",
                "What is my total playtime?",
                "What have I played recently?",
                "How much have I played GTA V?",
                "Show my Steam profile",
                "Recommend me a game",
                "What are my friends playing?"
            ]
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = { getTopPlayedGames, getTotalAccountPlaytime, getTotalGameCount, getRecentlyPlayedGames, getGamePlaytimeByName, getProfileSummary, getGameRecommendations, getFriendsCurrentActivity, fallbackUnknownIntent};
