function ChatMessage({ message, sender }) {

    const isUser = sender === "user";

    return (
        <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>

            <div
                className={`max-w-[65%] px-4 py-3 rounded-2xl shadow-md text-sm
        ${isUser
                        ? "bg-babyPink text-gray-900"
                        : "bg-pastelBlue text-gray-900"
                    }`}
            >
                {message}
            </div>

        </div>
    );
}

export default ChatMessage;