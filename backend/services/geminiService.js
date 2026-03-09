const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({}); //auto assuming GEMINI_API_KEY is the env name. otw need to pass it in as params

const MODEL = "gemini-2.5-flash";

function buildPrompt(userQuery){
    return `
        You are an intent classification engine for a Steam Statistics Chatbot.

        Your only task is to analyze a user's message and classify it into exactly one predefined intent.

        You must follow these rules strictly:

        1. You must return ONLY the intent name.
        2. Do NOT explain your answer.
        3. Do NOT include extra words.
        4. Do NOT include punctuation, JSON, or formatting.
        5. Do NOT include quotes.
        6. Your response must exactly match one of the predefined intent names.
        7. If the message does not match any intent, return UNKNOWN.

        You are NOT a chatbot. You are ONLY an intent classifier.

        ---

        CONTEXT:

        The chatbot allows users to query their Steam gaming statistics. The system retrieves data using the Steam Web API.

        Users may ask about:

        - Their Steam profile information
        - Games they own
        - Total playtime
        - Most played game
        - Recently played games
        - Achievement statistics
        - Validation of their Steam ID

        ---

        PREDEFINED INTENTS:

        GET_PROFILE_SUMMARY
        GET_OWNED_GAMES_SUMMARY
        GET_RECENTLY_PLAYED
        GET_ACHIEVEMENT_SUMMARY
        VALIDATE_STEAM_ID
        HELP
        UNKNOWN

        ---

        INTENT DEFINITIONS:

        GET_PROFILE_SUMMARY
        User wants profile information such as username, avatar, or profile details.

        GET_OWNED_GAMES_SUMMARY
        User wants statistics about owned games, total games, total playtime, or most played game.

        GET_RECENTLY_PLAYED
        User wants to know recently played games or recent activity.

        GET_ACHIEVEMENT_SUMMARY
        User wants achievement statistics for a game or overall achievements.

        VALIDATE_STEAM_ID
        User wants to check, verify, or confirm their Steam ID.

        HELP
        User is asking what the bot can do or how to use it.

        UNKNOWN
        Message does not match any supported intent.

        ---

        EXAMPLES:

        User: how many games do i own
        Response: GET_OWNED_GAMES_SUMMARY

        User: show my steam profile
        Response: GET_PROFILE_SUMMARY

        User: what did i play recently
        Response: GET_RECENTLY_PLAYED

        User: check if this steam id is valid
        Response: VALIDATE_STEAM_ID

        User: what can you do
        Response: HELP

        User: hello
        Response: UNKNOWN

        ---

        Remember:

        Return ONLY the intent name.
        Nothing else.

        ---

        Now respond to this user query abiding by the aforementioned instruction:-
        User Query: ${userQuery}
        `
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

async function returnIntent(userQuery){
    const prompt = buildPrompt(userQuery);
    return await generateText(prompt);
}


module.exports = { returnIntent };