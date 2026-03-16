import { useState } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";

function ChatPage() {

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            message: "Hi! I'm your Steam analytics assistant. Ask me anything about games or player stats."
        },
        {
            sender: "user",
            message: "What were the most played games on Steam this week?"
        },
        {
            sender: "bot",
            message: "The top titles right now are Counter-Strike 2, Dota 2, PUBG: Battlegrounds, and Apex Legends."
        }
    ]);

    const handleSend = (text) => {

        const newMessage = {
            sender: "user",
            message: text
        };

        setMessages(prev => [...prev, newMessage]);
    };

    return (
        <div className="h-screen flex flex-col">

            <div className="bg-white shadow-sm px-6 py-4">
                <h1 className="text-lg font-semibold">
                    Steam Analytics Chat
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

                {messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        message={msg.message}
                        sender={msg.sender}
                    />
                ))}

            </div>

            <ChatInput onSend={handleSend} />

        </div>
    );
}

export default ChatPage;