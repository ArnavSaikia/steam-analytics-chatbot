import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

function AccountPage() {
    const [username] = useState("Arnav"); // placeholder
    const [steamId, setSteamId] = useState("123456789"); // placeholder
    const [editing, setEditing] = useState(false);
    const [tempSteamId, setTempSteamId] = useState(steamId);
    const [error, setError] = useState("");

    const handleSave = () => {
        // placeholder validation
        if (tempSteamId.length < 5) {
            setError("Invalid Steam ID");
            return;
        }

        setSteamId(tempSteamId);
        setEditing(false);
        setError("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-950 px-4 text-white">
            <Card className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-violet-400">
                        Account
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Avatar + Name */}
                    <div className="flex flex-col items-center gap-3">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-violet-600 text-white text-xl">
                                {username[0]}
                            </AvatarFallback>
                        </Avatar>
                        <p className="text-lg font-medium">{username}</p>
                    </div>

                    {/* Steam ID */}
                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">Steam ID</label>

                        {!editing ? (
                            <div className="flex items-center justify-between bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                                <span>{steamId}</span>
                                <Pencil
                                    className="h-4 w-4 cursor-pointer text-violet-400"
                                    onClick={() => setEditing(true)}
                                />
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Input
                                    value={tempSteamId}
                                    onChange={(e) => setTempSteamId(e.target.value)}
                                    className="bg-white/10 border-white/10 focus-visible:ring-violet-500"
                                />
                                <Button
                                    onClick={handleSave}
                                    className="bg-violet-600 hover:bg-violet-700"
                                >
                                    Save
                                </Button>
                            </div>
                        )}

                        {/* Hidden error box */}
                        <div
                            className={`text-sm text-red-400 transition-all ${error ? "opacity-100 mt-1" : "opacity-0 h-0 overflow-hidden"
                                }`}
                        >
                            {error}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default AccountPage;