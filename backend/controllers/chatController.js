const { returnIntent } = require("../services/geminiService");

const steamController = require("./steamController");

// made the function.....not sure it work yet cause api key
const chatHandler = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Step 1: Get intent from Gemini
        const intentData = await returnIntent(message);

        if (!intentData || !intentData.intent) {
            return res.json({
                message: "Could not understand request"
            });
        }

        const { intent, game } = intentData;
        console.log(intent,game)

        // Inject game into req.query if needed
        if (game) {
            req.intentData = { game }; // attach to a custom property
        }
        console.log(req.intentData)

        // Step 2: Route to correct handler
        switch (intent) {

            case "GET_TOP_PLAYED_GAMES":
                return steamController.getTopPlayedGames(req, res);

            case "GET_TOTAL_ACCOUNT_PLAYTIME":
                return steamController.getTotalAccountPlaytime(req, res);

            case "GET_TOTAL_GAME_COUNT":
                return steamController.getTotalGameCount(req, res);

            case "GET_RECENTLY_PLAYED_GAMES":
                return steamController.getRecentlyPlayedGames(req, res);

            case "GET_GAME_PLAYTIME_BY_NAME":
                if (!req.intentData?.game && !req.query.game) {
                    return res.json({ message: "Please specify a game name" });
                }
                return steamController.getGamePlaytimeByName(req, res);

            case "GET_PROFILE_SUMMARY":
                return steamController.getProfileSummary(req, res);

            case "GET_GAME_RECOMMENDATIONS":
                return steamController.getGameRecommendations(req, res);

            case "GET_FRIENDS_CURRENT_ACTIVITY":
                return steamController.getFriendsCurrentActivity(req, res);

            case "FALLBACK_UNKNOWN_INTENT":
            default:
                return steamController.fallbackUnknownIntent(req, res);
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { chatHandler };