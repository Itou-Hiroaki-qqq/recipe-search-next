import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId')

    if (!categoryId) {
        return NextResponse.json({ error: 'カテゴリーIDが指定されていません。' }, { status: 400 })
    }

    const appId = process.env.RAKUTEN_APP_ID
    if (!appId) {
        return NextResponse.json({ error: '楽天APIのAPP IDが未設定です。' }, { status: 500 })
    }

    const apiUrl = `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?format=json&applicationId=${appId}&categoryId=${encodeURIComponent(
        categoryId
    )}`

    try {
        const res = await fetch(apiUrl)
        const json = await res.json()

        const recipes = (json.result || []).map((item: any) => ({
            title: item.recipeTitle,
            url: item.recipeUrl,
            imageUrl: item.foodImageUrl,
            description: item.recipeDescription || '説明文がありません', 
        }))

        return NextResponse.json(recipes)
    } catch (err) {
        console.error('楽天APIエラー:', err)
        return NextResponse.json({ error: '楽天APIの呼び出しに失敗しました。' }, { status: 500 })
    }
}
