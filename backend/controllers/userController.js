const axios = require("axios");
const User = require("../models/userModel");

const linkSteam = async (req, res) => {
    try {
        const { steamInput } = req.body;

        if (!steamInput) {
            return res.status(400).json({ message: "Steam ID or URL required" });
        }

        let steamId64;

        // full url
        if (steamInput.includes("steamcommunity.com")) {
            const parts = steamInput.split("/").filter(Boolean);
            const lastPart = parts[parts.length - 1];

            // detect /id/ vs /profiles/
            if (steamInput.includes("/profiles/")) {
                steamId64 = lastPart;
            } else {
                // resolve vanity url
                const response = await axios.get(
                    "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/",
                    {
                        params: {
                            key: process.env.STEAM_API_KEY,
                            vanityurl: lastPart,
                        },
                    }
                );

                if (response.data.response.success !== 1) {
                    return res.status(400).json({ message: "Invalid Steam vanity URL" });
                }

                steamId64 = response.data.response.steamid;
            }
        }

        // normal raw id
        else {
            steamId64 = steamInput;
        }

        //check if user exists
        const playerRes = await axios.get(
            "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
            {
                params: {
                    key: process.env.STEAM_API_KEY,
                    steamids: steamId64,
                },
            }
        );

        const players = playerRes.data.response.players;

        if (!players.length) {
            return res.status(404).json({ message: "Steam user not found" });
        }

        const profile = players[0];

        //save to db
        const user = await User.findById(req.user._id);
        user.steamId = steamId64;
        await user.save();

        res.json({
            message: "Steam account linked successfully",
            steamId: steamId64,
            profile: {
                name: profile.personaname,
                avatar: profile.avatarfull,
            },
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const returnProfile = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let steamProfile = null;

        if (user.steamId) {
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

            if (players.length > 0) {
                const profile = players[0];

                steamProfile = {
                    name: profile.personaname,
                    avatar: profile.avatarfull,
                };
            }
        }

        return res.status(200).json({
            username: user.username,
            steamId: user.steamId,
            steamProfile, // null if not linked or not found
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { linkSteam , returnProfile };