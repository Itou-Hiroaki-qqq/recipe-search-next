'use client'

import LayoutClient from './layout.client'
import categoryMap from '@/data/categoryMap.json'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

type Recipe = {
  title: string
  imageUrl: string
  url: string
  description: string
}

function toHiragana(str: string): string {
  return str.replace(/[ァ-ヶ]/g, match =>
    String.fromCharCode(match.charCodeAt(0) - 0x60)
  )
}

function HomePageContent() {
  const [keyword, setKeyword] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  const searchRecipes = async () => {
    if (!keyword.trim()) {
      alert('食材を入力してください。')
      return
    }

    setLoading(true)

    const hiraganaKeyword = toHiragana(keyword.trim())

    const matchedKey = Object.keys(categoryMap).find(key => {
      const normalizedKey = toHiragana(key)
      return normalizedKey.includes(hiraganaKeyword)
    })

    const categoryId = matchedKey
      ? (categoryMap as Record<string, string>)[matchedKey]
      : null

    if (!categoryId) {
      alert(`カテゴリIDが登録されていない食材です: ${keyword}`)
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/search?categoryId=${encodeURIComponent(categoryId)}`)
      const data = await response.json()
      setRecipes(data)
    } catch (err) {
      console.error('検索エラー:', err)
      alert('検索に失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = async (recipe: Recipe) => {
    if (!session?.user?.id) {
      alert('ログインが必要です。')
      return
    }

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: recipe.title,
          url: recipe.url,
          imageUrl: recipe.imageUrl,
          description: recipe.description,
          userId: session.user.id,
        }),
      })

      if (res.ok) {
        alert('お気に入りに追加しました。')
      } else if (res.status === 409) {
        alert('このレシピはすでにお気に入りに追加されています。')
      } else {
        alert('追加に失敗しました。')
      }
    } catch {
      alert('通信エラーが発生しました。')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">簡単レシピ検索</h1>

      <div className="flex justify-end items-center mb-4 gap-4">
        {session && (
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm text-red-600 underline hover:text-red-800"
          >
            ログアウト
          </button>
        )}
        <Link
          href="/favorites"
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          お気に入り一覧を見る →
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="食材名を入力"
          className="grow border rounded p-2 placeholder:text-gray-400"
          onKeyDown={(e) => e.key === 'Enter' && searchRecipes()}
        />
        <button
          onClick={searchRecipes}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          検索
        </button>
      </div>

      {loading ? (
        <p className="text-center">検索中...</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recipes.map((recipe, index) => (
            <li key={index} className="border p-4 rounded shadow space-y-2">
              <a
                href={recipe.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:underline"
              >
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
                <p className="text-xl font-medium mb-2">{recipe.title}</p>
                <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
              </a>
              <button
                onClick={() => addToFavorites(recipe)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
              >
                お気に入りに追加
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function HomePage() {
  return (
    <LayoutClient>
      <HomePageContent />
    </LayoutClient>
  )
}
