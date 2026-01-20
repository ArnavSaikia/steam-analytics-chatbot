## 🏛️ Comprehensive Project Specification: SteamStat AI

**An Autonomous Data Retrieval System utilizing Generative Intent Classification**

The **Intelligent Steam Statistics Chatbot** is a sophisticated integration of modern AI and traditional RESTful API consumption. It is designed to solve the problem of "Data Friction"—the difficulty users face when navigating complex menus to find specific personal metrics. By replacing navigation with conversation, the system provides a frictionless path to personal gaming insights.

---

### Detailed System Architecture & Data Flow

The system follows a **N-Tier Architecture**, separating the presentation layer from the logic and data layers to ensure maintainability and scalability.

1. **Request Ingestion (Frontend):** The user enters a natural language query into a responsive web interface. This interface manages the WebSocket or HTTP connection to the backend.
2. **Semantic Analysis (The Brain):** The raw string is sent to the **Gemini API**. Gemini acts as a "Semantic Parser," identifying the user's goal (the Intent) and extracting entities (like game names or timeframes).
3. **Logical Verification (The Filter):** The backend receives the intent (e.g., `FETCH_TOP_GAMES`). Before execution, a **Rule-Based Validation** layer checks if the user has a linked Steam ID and if the intent is within the "Allowed Actions" registry.
4. **Service Integration (The Executor):** The **Task Execution Module** triggers a specific Python function. This function constructs a signed request to the **Steam Web API**, handles the handshake, and receives the raw JSON payload.
5. **Data Synthesis (The Formatter):** Raw data (often messy and containing Unix timestamps or raw minute counts) is processed into human-readable strings or Markdown tables before being returned to the UI.

---

### Deep Dive: The Task Execution Framework

In Software Engineering, "Task Execution" is often the most critical part of a middleware application. In this project, it is handled via a **Command Pattern** logic.

| Component | Technical Functionality |
| --- | --- |
| **Intent Dispatcher** | A central controller that maps Gemini's output to a specific internal Python method. |
| **Data Sanitization** | A process that converts Steam's raw data (e.g., playtime in minutes) into a more relatable format (e.g., hours and days). |
| **Conditional Logic** | The system must decide what to do if data is missing. For example, if a user asks for "Recently Played" but hasn't played in two weeks, the executor must return a "No recent activity" status rather than an error. |

---

### Security and Robustness Protocols

A project involving personal user data and third-party APIs requires a rigorous security posture:

* **Cryptographic User Security:** User passwords never exist in the database as plain text. We utilize **Bcrypt** or **Argon2** for one-way hashing with unique salts, protecting against rainbow table attacks.
* **API Key Isolation:** The Steam and Gemini API keys are stored in a `.env` file or a secret management service. They are never hard-coded or exposed to the client-side JavaScript.
* **Graceful Degradation:**
* **Private Profile Handling:** If the Steam API returns a 403 (Forbidden) because a profile is private, the system delivers a user-friendly guide on how to update Steam privacy settings.
* **Rate Limiting:** The backend implements logic to prevent "API hammering," ensuring the system stays within Steam's daily request quotas.



---

### The Database Schema

The system relies on a relational database (SQLite/MySQL) to maintain the link between the web application's users and their Steam identities.

* **Users Table:** Stores `user_id`, `username`, `email`, and `password_hash`.
* **Profiles Table:** Stores `steam_64_id`, `steam_nickname`, and `last_queried_timestamp`. This separation allows a single user to potentially link multiple gaming accounts in the future.

---

### Future Research and Scaling

To evolve this from a laboratory project to a production-grade tool, the following vectors are considered:

1. **Asynchronous Processing:** Using **Celery or Redis** to handle data fetching. This ensures the chatbot remains responsive even if the Steam API is slow to respond.
2. **Predictive Modeling:** Moving beyond descriptive statistics (what happened) to predictive analytics (e.g., "Based on your trends, you will likely finish this game in 20 more hours").
3. **Multimodal Output:** Enhancing the chatbot to generate dynamic charts and graphs using libraries like **Plotly** or **Chart.js** directly within the chat bubble.

---

### Practical Example of Logic Flow

**User Input:** *"Tell me if I've played CS:GO recently."*

1. **Gemini Intent:** `CHECK_GAME_ACTIVITY` | **Entity:** `Counter-Strike`
2. **Validator:** Confirms user is logged in and Steam ID is present.
3. **Executor:** * Calls `get_recently_played_games(steam_id)`.
* Iterates through the list to find a name match for "Counter-Strike".
* Calculates the difference between the current date and the `last_played` timestamp.


4. **Response:** *"Yes! You last played Counter-Strike 2 yesterday for about 3 hours."*

