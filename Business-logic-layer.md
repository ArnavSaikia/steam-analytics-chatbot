Q1. Core Functional Modules of the BLL

The Business Logic Layer (BLL) serves as the mediator between the WebUI and the Data Access Layer (Steam API and MongoDB).
Intent Detection Module (IntentDetectionService)
Function: Processes natural language queries from the chatbot UI to identify the user's specific goal, such as fetching playtime or finding a friend.
Interaction: Receives text from the ChatController and utilizes the GeminiAPIService to return a structured intent to the backend.

Steam Data Aggregator (SteamAPIService)
Function: Communicates with the external Steam Web API to fetch raw statistics, including hours played and recently played games.
Interaction: Triggered by the ChatController based on the detected intent to pull raw data required for the user's request.
Task Orchestrator (TaskExecutionService)
Function: Coordinates the sequence of operations, such as ensuring chat history is stored in MongoDB while simultaneously fetching live API data.
Interaction: Acts as the functional bridge ensuring the "Backend processes query" step leads to a valid response for the UI.

Q2. Business Logic Implementation Details

A) Implementation of Business Rules
Business rules define the specific conditions the application follows to perform various operations.
Access Control: The AuthMiddleware enforces the rule that only authenticated users with a valid JWT can query private Steam statistics or save chat history.
Operational Rules: The ChatController follows a rule where if the IntentDetectionService cannot identify a valid query, it triggers a fallback response instead of calling the Steam API to prevent unnecessary overhead.

B) Validation Logic
Validation logic ensures that all data entering the system is correct, consistent, and properly formatted before processing.
Input Validation: The ValidationMiddleware checks the user’s chatbot input to ensure it is not empty and fits within character limits before it reaches the core services.
API Integrity: The SteamAPIService validates that the provided SteamID is in the correct 64-bit numerical format before attempting to fetch data from the external API.

C) Data Transformation
Data transformation converts information from the data layer into a format usable by the Presentation Layer (UI).
Raw to Conversational: The DataProcessingService takes raw JSON data (e.g., playtime in minutes) and transforms it into a user-friendly conversational string (e.g., "You have played CS2 for 45 hours").

Presentation Formatting: Results are structured specifically for "Response displays" so the frontend can render icons, lists, or statistics within the chat window rather than showing raw database objects.
