const axios = require("axios");

const STEAM_API_URL =
    "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/";

const getOwnedGames = async (steamId) => {
    const response = await axios.get(STEAM_API_URL, {
        params: {
            key: process.env.STEAM_API_KEY,
            steamid: steamId,
            include_appinfo: true,
            include_played_free_games: true
        }
    });

    return response.data.response.games || [];
};

module.exports = {
    getOwnedGames
};
