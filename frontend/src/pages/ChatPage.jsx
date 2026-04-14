import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

function ChatPage() {
    const [messages, setMessages] = useState([
        { sender: "bot", message: "Hi! I'm your Steam analytics assistant." },
        { sender: "user", message: "What were the most played games?" },
    ]);

    const [input, setInput] = useState("");

    const chats = [
        { id: 1, title: "Steam Stats Chat" },
        { id: 2, title: "Weekly Trends" },
    ];

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages((prev) => [
            ...prev,
            { sender: "user", message: input },
            { sender: "bot", message: "[Placeholder bot response]" },
        ]);

        setInput("");
    };

    return (
        <div className="h-screen flex bg-gradient-to-br from-black via-zinc-900 to-zinc-950 text-white">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/10 backdrop-blur-xl bg-white/5 p-4">
                <h2 className="text-lg font-semibold mb-4 text-violet-400">Chats</h2>
                <div className="space-y-2">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className="p-2 rounded-lg hover:bg-white/10 cursor-pointer transition"
                        >
                            {chat.title}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="border-b border-white/10 p-4 backdrop-blur-xl bg-white/5">
                    <h1 className="text-lg font-semibold text-violet-400">
                        Steam Analytics Chat
                    </h1>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {msg.sender === "bot" && (
                                <Avatar>
                                    <AvatarFallback>B</AvatarFallback>
                                </Avatar>
                            )}

                            <div
                                className={`max-w-xs px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10 ${msg.sender === "user"
                                        ? "bg-violet-600/30"
                                        : "bg-white/10"
                                    }`}
                            >
                                {msg.message}
                            </div>

                            {msg.sender === "user" && (
                                <Avatar>
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                </ScrollArea>

                <Separator className="bg-white/10" />

                {/* Input */}
                <div className="p-4 flex gap-2 backdrop-blur-xl bg-white/5">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask something..."
                        className="bg-white/10 border-white/10 focus-visible:ring-violet-500"
                    />
                    <Button
                        onClick={handleSend}
                        className="bg-violet-600 hover:bg-violet-700"
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
