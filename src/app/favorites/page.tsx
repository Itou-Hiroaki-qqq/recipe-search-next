'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Favorite = {
    id: number
    title: string
    url: string
    imageUrl: string
    description?: string
}

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Favorite[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFavorites = async () => {
            const res = await fetch('/api/favorites')
            const data = await res.json()
            setFavorites(data)
            setLoading(false)
        }

        fetchFavorites()
    }, [])

    const removeFavorite = async (id: number) => {
        const res = await fetch(`/api/favorites?id=${id}`, {
            method: 'DELETE',
        })
        if (res.ok) {
            setFavorites((prev) => prev.filter((f) => f.id !== id))
            alert('削除しました。')
        } else {
            alert('削除に失敗しました。')
        }
    }

    if (loading) {
        return <p className="text-center">読み込み中...</p>
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-6">お気に入りレシピ一覧</h1>

            <div className="mb-6 text-right">
                <Link
                    href="/"
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                    ← トップページに戻る
                </Link>
            </div>

            {favorites.length === 0 ? (
                <p className="text-center">お気に入りはまだ登録されていません。</p>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map((fav) => (
                        <li key={fav.id} className="border p-4 rounded shadow space-y-2">
                            <a
                                href={fav.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:underline"
                            >
                                <div className="relative w-full h-48 mb-2">
                                    <Image
                                        src={fav.imageUrl}
                                        alt={fav.title}
                                        fill
                                        className="object-cover rounded"
                                        sizes="(max-width: 640px) 100vw, 50vw"
                                    />
                                </div>
                                <p className="text-xl font-medium mb-2">{fav.title}</p>
                                <p className="text-sm text-gray-600 mb-2">{fav.description}</p>
                            </a>

                            <button
                                onClick={() => removeFavorite(fav.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                            >
                                お気に入りから削除
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
