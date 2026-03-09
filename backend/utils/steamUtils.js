const axios = require("axios");

const STEAM_API_BASE = "https://api.steampowered.com";
const API_KEY = process.env.STEAM_API_KEY;

const getOwnedGames = async (steamId) => {
    const response = await axios.get(
        `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v0001/`,
        {
            params: {
                key: API_KEY,
                steamid: steamId,
                include_appinfo: true,
                include_played_free_games: true
            }
        }
    );

    return response.data.response.games || [];
};

const getProfileSummary = async (steamId) => {
    const response = await axios.get(
        `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/`,
        {
            params: {
                key: API_KEY,
                steamids: steamId
            }
        }
    );

    return response.data.response.players?.[0] || null;
};

const getRecentlyPlayed = async (steamId) => {
    const response = await axios.get(
        `${STEAM_API_BASE}/IPlayerService/GetRecentlyPlayedGames/v0001/`,
        {
            params: {
                key: API_KEY,
                steamid: steamId
            }
        }
    );

    return response.data.response.games || [];
};

const getAchievementSummary = async (steamId, appId) => {
    const response = await axios.get(
        `${STEAM_API_BASE}/ISteamUserStats/GetPlayerAchievements/v0001/`,
        {
            params: {
                key: API_KEY,
                steamid: steamId,
                appid: appId
            }
        }
    );

    return response.data.playerstats || null;
};

const validateSteamId = async (steamId) => {
    const profile = await getProfileSummary(steamId);
    return profile !== null;
};

module.exports = {
    getOwnedGames,
    getProfileSummary,
    getRecentlyPlayed,
    getAchievementSummary,
    validateSteamId
};