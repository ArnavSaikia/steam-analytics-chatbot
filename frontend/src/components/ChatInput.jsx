import { useState } from "react";

function ChatInput({ onSend }) {

    const [message, setMessage] = useState("");

    const handleSend = () => {

        if (!message.trim()) return;

        onSend(message);
        setMessage("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="w-full flex items-center gap-3 p-4 bg-white border-t">

            <input
                type="text"
                placeholder="Ask about Steam stats..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-babyPink"
            />

            <button
                onClick={handleSend}
                className="px-5 py-3 bg-babyPink rounded-xl hover:opacity-90 transition"
            >
                Send
            </button>

        </div>
    );
}

export default ChatInput;