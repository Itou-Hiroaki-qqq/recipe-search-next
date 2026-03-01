import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// お気に入り追加（POST）
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: '認証されていません。' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { title, url, imageUrl, description } = body
        const userId = Number(session.user.id)

        if (!title || !url || !imageUrl) {
            return NextResponse.json({ error: '必要なデータが不足しています。' }, { status: 400 })
        }

        const existing = await prisma.favorite.findFirst({
            where: { userId, url },
        })

        if (existing) {
            return NextResponse.json({ error: 'このレシピはすでにお気に入りに追加されています。' }, { status: 409 })
        }

        const newFavorite = await prisma.favorite.create({
            data: { title, url, imageUrl, description, userId },
        })

        return NextResponse.json(newFavorite, { status: 201 })
    } catch (error) {
        console.error('POST Error:', error)
        return NextResponse.json({ error: 'お気に入り登録に失敗しました。' }, { status: 500 })
    }
}

// お気に入り削除（DELETE）
export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'IDが指定されていません。' }, { status: 400 })
    }

    try {
        await prisma.favorite.delete({
            where: { id: Number(id) },
        })
        return NextResponse.json({ message: '削除成功' })
    } catch (error) {
        console.error('DELETE Error:', error)
        return NextResponse.json({ error: '削除に失敗しました。' }, { status: 500 })
    }
}

// お気に入り一覧取得（GET）
export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: '認証されていません。' }, { status: 401 })
    }

    const favorites = await prisma.favorite.findMany({
        where: { userId: Number(session.user.id) },
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(favorites)
}
