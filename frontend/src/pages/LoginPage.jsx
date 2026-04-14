import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function LoginPage() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: email, // too lazy to change this shit
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);

            console.log("Login success", data);

            // redirect to chat later
        } catch (err) {
            console.error(err.message);
        }        
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-950 px-4 text-white">
            <Card className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-violet-400">Steam Analytics</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Login to access your analytics chatbot
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Username</label>
                            <Input
                                placeholder="SquigglyNoodle67"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/10 border-white/10 focus-visible:ring-violet-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white/10 border-white/10 focus-visible:ring-violet-500"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-violet-600 hover:bg-violet-700"
                        >
                            Login
                        </Button>
                    </form>

                    <p className="text-center text-sm text-zinc-500 mt-6">
                        Don't have an account?
                        <span className="text-violet-400 cursor-pointer ml-1">
                            Sign up
                        </span>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginPage;
