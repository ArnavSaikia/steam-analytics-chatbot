import { useState } from "react";

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log({
            email,
            password
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold">
                        Steam Analytics
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Login to access your analytics chatbot
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >

                    <div>
                        <label className="text-sm text-gray-600">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-babyPink"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-babyPink"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-babyPink rounded-xl font-medium hover:opacity-90 transition"
                    >
                        Login
                    </button>

                </form>

                <div className="my-6 flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                <button
                    className="w-full py-3 border rounded-xl hover:bg-gray-50 transition"
                >
                    Continue with Google
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?
                    <span className="text-babyPink cursor-pointer ml-1">
                        Sign up
                    </span>
                </p>

            </div>

        </div>
    );
}

export default LoginPage;   