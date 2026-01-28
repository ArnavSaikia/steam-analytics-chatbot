# 🎮 Intelligent Steam Statistics Chatbot

## 📌 Project Overview

The Intelligent Steam Statistics Chatbot reduces “data friction” by allowing users to retrieve Steam gaming statistics using conversational queries instead of navigating through multiple pages.

The system:

- Authenticates users
- Stores Steam IDs securely
- Detects query intent using Gemini API
- Executes predefined tasks using rule-based logic
- Retrieves data from the Steam Web API
- Displays formatted statistics and visualizations

---

## 🧩 Core Features

### 🔐 User Authentication

- User registration
- Secure login and logout
- Password hashing (bcrypt/argon2)
- Role-based access (Guest vs Registered)

### 👤 User Profile Management

- Save and update Steam ID
- Link Steam account to user profile

### 💬 Chatbot Interface

Users can ask natural language queries such as:

- “How much have I played Elden Ring?”
- “Show my most played games.”
- “How many games do I own?”
- “Show my recent activity.”

### 🧠 Intent Detection

- Uses Gemini API to classify user queries into predefined intents
- Intent is validated using modular rule-based logic before execution

### ⚙️ Task Execution Automation

Each detected intent triggers a predefined task:

- Fetch total playtime
- Retrieve most played games
- Fetch recently played games
- Calculate playtime for a specific game
- Generate statistics summary
- Recommend similar games

Task execution is deterministic and modular, allowing new query types to be added easily.

### 📊 Charts and Data Visualization

The system generates visual summaries such as:

- Bar charts for playtime per game
- Pie charts for genre distribution
- Overall playtime summaries

### 🎯 Game Recommendations (Rule-Based)

Recommendations are generated based on:

- Most played genres
- Frequently played game types
- Playtime patterns

(No predictive AI — recommendations follow predefined logical rules.)

---

## 🏗️ System Architecture Overview

The system follows a clean separation of concerns:

1. **Presentation Layer**
   - Web-based chatbot interface

2. **Intent Detection Layer**
   - Gemini API classifies user intent

3. **Validation Layer**
   - Rule-based logic checks allowed actions and user authentication

4. **Task Execution Module**
   - Maps intent to internal functions

5. **External Integration**
   - Steam Web API for user statistics

6. **Formatting & Response Layer**
   - Processes raw JSON data
   - Converts minutes to hours
   - Generates charts
   - Sends formatted response

---

## 🔄 Example Logic Flow

User Input:
“Have I played CS2 recently?”

1. Gemini detects intent: CHECK_RECENT_ACTIVITY
2. System validates that user is logged in and Steam ID exists
3. Task execution module calls Steam API
4. System processes timestamps and playtime
5. Chatbot returns formatted response

Example Output:
“You last played Counter-Strike 2 yesterday for 3 hours.”

---

## 🗄️ Database Schema

### Users Table

- user_id
- username
- email
- password_hash

### Profiles Table

- user_id (foreign key)
- steam_64_id
- last_updated

---

## 🔐 Security Practices

- Passwords stored as hashed values
- API keys stored securely (not hard-coded)
- Only authenticated users can query personal stats
- Graceful handling of private Steam profiles
- Error handling for API rate limits

---

## 🎭 Actors in the System (UML Perspective)

- Guest User (limited access)
- Registered User (full access)
- Admin (optional, if implemented)

External APIs (Steam API, Gemini API) are not modeled as actors in UML diagrams because they do not initiate interaction.

---

## 🚀 Future Enhancements

- Export charts as images
- Add more query types
- Add query history tracking
- Improve recommendation logic
- Support additional gaming platforms

---

## 📚 Academic Context

This project demonstrates:

- Use Case modeling
- Role-based system design
- Modular rule-based logic
- API integration
- Behavioral analysis of software systems
- Clear system boundary definition

It is designed to be aligned with Software Engineering requirements, focusing on clarity, modularity, and maintainability rather than overuse of AI.

---

## 📦 Feature Summary

- Authentication system
- Role-based access (Guest vs Registered)
- Steam API integration
- Gemini-based intent detection
- Rule-based task execution
- Steam statistics retrieval
- Charts and visualizations
- Rule-based recommendations
- Error handling and validation

---
