const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({}); //auto assuming GEMINI_API_KEY is the env name. otw need to pass it in as params

const MODEL = "gemini-2.5-flash";

function buildPrompt(userQuery) {
    return `
        You are an intent classification engine for a Steam Statistics Chatbot.

        Your task:
        1. Identify the user's intent
        2. Extract required parameters if needed

        You MUST return ONLY a valid JSON object.
        No explanation. No extra text.

        ---

        OUTPUT FORMAT:

        {
        "intent": "<INTENT_NAME>",
        "game": "<game name if applicable or null>"
        }

        ---

        AVAILABLE INTENTS:

        GET_TOP_PLAYED_GAMES
        GET_TOTAL_ACCOUNT_PLAYTIME
        GET_TOTAL_GAME_COUNT
        GET_RECENTLY_PLAYED_GAMES
        GET_GAME_PLAYTIME_BY_NAME
        GET_PROFILE_SUMMARY
        GET_GAME_RECOMMENDATIONS
        GET_FRIENDS_CURRENT_ACTIVITY
        FALLBACK_UNKNOWN_INTENT

        ---

        INTENT DEFINITIONS:

        GET_TOP_PLAYED_GAMES
        User asks for most played games.

        GET_TOTAL_ACCOUNT_PLAYTIME
        User asks for total playtime across all games.

        GET_TOTAL_GAME_COUNT
        User asks for number of owned games.

        GET_RECENTLY_PLAYED_GAMES
        User asks about recent activity.

        GET_GAME_PLAYTIME_BY_NAME
        User asks about playtime for a specific game.

        GET_PROFILE_SUMMARY
        User asks about their Steam profile.

        GET_GAME_RECOMMENDATIONS
        User asks what they should play or for recommendations.

        GET_FRIENDS_CURRENT_ACTIVITY
        User asks what their friends are playing.

        FALLBACK_UNKNOWN_INTENT
        Anything unrelated.

        ---

        EXAMPLES:

        User: what are my top games
        Response:
        {
        "intent": "GET_TOP_PLAYED_GAMES",
        "game": null
        }

        User: how much have i played gta 5
        Response:
        {
        "intent": "GET_GAME_PLAYTIME_BY_NAME",
        "game": "GTA 5"
        }

        User: suggest a game
        Response:
        {
        "intent": "GET_GAME_RECOMMENDATIONS",
        "game": null
        }

        User: hello
        Response:
        {
        "intent": "FALLBACK_UNKNOWN_INTENT",
        "game": null
        }

        ---

        Now classify this:

        User Query: ${userQuery}
    `;
}

async function generateText(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
        });

        return response.text?.trim() || null;

    } catch (error) {
        console.error("Gemini generation failed:", error.message);
        return null;
    }
}

async function returnIntent(userQuery) {
    const prompt = buildPrompt(userQuery);
    const raw = await generateText(prompt);

    try {
        return JSON.parse(raw);
    } catch (err) {
        return {
            intent: "FALLBACK_UNKNOWN_INTENT",
            game: null
        };
    }
}


async function getRecommendationsFromGemini(topGames) {
    const prompt = `
        You are a game recommendation engine.

        A user frequently plays these games:
        ${topGames.join(", ")}

        Recommend 3 Steam games they might like.

        Return ONLY a simple list of game names.
        No explanation.
    `;

    const response = await generateText(prompt);

    return response;
}


module.exports = { returnIntent , getRecommendationsFromGemini };