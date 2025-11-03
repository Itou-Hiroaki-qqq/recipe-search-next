"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

// --- useSearchParams() を使う部分を別コンポーネントに分離 ---
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
            callbackUrl,
        });

        if (res?.error) {
            setError("ログインに失敗しました。メールアドレスまたはパスワードをご確認ください。");
        } else {
            router.push(callbackUrl);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-4">
            <h1 className="text-xl font-bold mb-4">ログイン</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Email</label>
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
                {error && <p className="text-red-500">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    ログイン
                </button>
            </form>
            <div className="text-sm mt-4">
                新規ユーザー登録はこちら →{" "}
                <a
                    href="/signup"
                    className="text-blue-600 underline hover:text-blue-800"
                >
                    登録ページへ
                </a>
            </div>
        </div>
    );
}

// --- Suspense でラップしてエラーを回避 ---
export default function LoginPage() {
    return (
        <Suspense fallback={<div className="text-center mt-20">読み込み中...</div>}>
            <LoginForm />
        </Suspense>
    );
}
