"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("パスワードが一致しません。");
            return;
        }

        setLoading(true);

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "登録に失敗しました。");
            setLoading(false);
            return;
        }

        const signInRes = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (signInRes?.error) {
            setError("ログインに失敗しました。");
            setLoading(false);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-4">
            <h1 className="text-xl font-bold mb-4">新規登録</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">メールアドレス</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block mb-1">パスワード</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block mb-1">パスワード（確認）</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full border rounded p-2"
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    disabled={loading}
                >
                    {loading ? "登録中…" : "登録する"}
                </button>
            </form>
            <p className="text-sm text-center mt-4">
                すでに登録済みの方は{" "}
                <a href="/login" className="text-blue-600 underline hover:text-blue-800">
                    ログインはこちら
                </a>
            </p>
        </div>
    );
}
