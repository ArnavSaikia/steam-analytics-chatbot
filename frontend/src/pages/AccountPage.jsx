import { useState , useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

function AccountPage() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [username, setUsername] = useState("SquigglyNoodle67"); // placeholder
    const [steamId, setSteamId] = useState("123456789"); // placeholder
    const [editing, setEditing] = useState(false);
    const [tempSteamId, setTempSteamId] = useState(steamId);
    const [error, setError] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("")

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/user/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if(!response.ok) return;

            setUsername(data.username);
            setSteamId(data.steamId);

            if(data.steamProfile) setAvatarUrl(data.steamProfile.avatar);
        };

        fetchProfile();
    }, [])

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/user/steam`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                steamInput: tempSteamId,
            })
        });
        const data = await res.json();

        console.log(data);

        if(!res.ok) {
            setEditing(false);
            setError(data.message);
            return 
        }

        setSteamId(data.steamId);
        setEditing(false);
        setError("");
        if (data.profile?.avatar) {
            setAvatarUrl(data.profile.avatar);
        }
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
                            {avatarUrl && (
                                <AvatarImage src={avatarUrl} alt="Steam Avatar" />
                            )}
                            <AvatarFallback className="bg-violet-600 text-white text-xl">
                                {username?.[0]}
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