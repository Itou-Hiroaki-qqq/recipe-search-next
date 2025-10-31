import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email, password }: { email: string; password: string } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "メールアドレスとパスワードは必須です。" }, { status: 400 });
        }

        // 既に同じメールがあれば拒否
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "このメールアドレスは既に登録されています。" }, { status: 400 });
        }

        // パスワードをハッシュ化
        const hashed = await hash(password, 10);

        // ユーザー作成
        const user = await prisma.user.create({
            data: {
                email,
                password: hashed,
            },
        });

        return NextResponse.json({ message: "登録が完了しました。", userId: user.id }, { status: 201 });
    } catch (error) {
        console.error("REGISTER Error:", error);
        return NextResponse.json({ error: "登録処理に失敗しました。" }, { status: 500 });
    }
}
