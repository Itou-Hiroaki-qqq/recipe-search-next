# 簡単レシピ検索（recipe-search-next）

楽天レシピAPIを利用し、**食材名**から人気レシピを検索できるWebアプリです。ログインしたユーザーは気に入ったレシピをお気に入りに保存できます。

## 主な機能

- **レシピ検索** … 食材名を入力すると、楽天レシピAPIのカテゴリ別ランキングから該当レシピを表示（ひらがな・カタカナ対応）
- **ユーザー認証** … メールアドレス・パスワードでの新規登録・ログイン（NextAuth / JWT）
- **お気に入り** … レシピをお気に入りに追加・一覧表示・削除（PostgreSQLで永続化）

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | [Next.js](https://nextjs.org) 16（App Router） |
| UI | React 19, [Tailwind CSS](https://tailwindcss.com) 4 |
| 認証 | [NextAuth.js](https://next-auth.js.org)（Credentials + JWT） |
| DB・ORM | [PostgreSQL](https://www.postgresql.org) + [Prisma](https://www.prisma.io) |
| 外部API | [楽天レシピAPI](https://webservice.rakuten.co.jp/document/recipe-category-ranking/)（カテゴリ別ランキング） |

## 必要環境

- Node.js 18+
- PostgreSQL（ローカルまたはクラウド）
- 楽天APIアプリID（[楽天ウェブサービス](https://webservice.rakuten.co.jp/)で無料取得）

## セットアップ

### 1. リポジトリのクローンと依存関係のインストール

```bash
git clone <このリポジトリのURL>
cd recipe-search-next
npm install
```

### 2. 環境変数の設定

プロジェクト直下に `.env` を作成し、以下を設定してください。

```env
# データベース（PostgreSQL）
DATABASE_URL="postgresql://ユーザー名:パスワード@ホスト:5432/DB名"

# NextAuth（任意の長いランダム文字列）
NEXTAUTH_SECRET="your-secret-key"

# 楽天API（楽天ウェブサービスで取得したアプリID）
RAKUTEN_APP_ID="your-rakuten-app-id"
```

### 3. データベースのマイグレーション

```bash
npx prisma migrate dev
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。未ログインの場合はログイン画面にリダイレクトされます。

## 利用可能なスクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動（`next dev --webpack`） |
| `npm run build` | 本番用ビルド |
| `npm run start` | 本番サーバー起動（ビルド後に実行） |

## プロジェクト構成（抜粋）

```
recipe-search-next/
├── prisma/
│   └── schema.prisma    # User, Favorite モデル定義
├── src/
│   ├── app/
│   │   ├── page.tsx           # トップ（要ログイン → 検索画面）
│   │   ├── home-page-content.tsx  # 検索UI・お気に入り追加
│   │   ├── login/page.tsx     # ログイン
│   │   ├── register/page.tsx  # 新規登録
│   │   ├── favorites/page.tsx # お気に入り一覧
│   │   └── api/
│   │       ├── search/route.ts      # 楽天レシピAPI検索
│   │       ├── favorites/route.ts   # お気に入り CRUD
│   │       └── auth/                # 登録・NextAuth
│   ├── data/
│   │   └── categoryMap.json   # 食材名 → 楽天カテゴリID
│   └── lib/
│       ├── auth.ts            # NextAuth 設定
│       └── prisma.ts          # Prisma クライアント
├── package.json
└── README.md
```

## 検索の仕組み

1. ユーザーが食材名（例: にんじん）を入力
2. `categoryMap.json` で食材名（ひらがな正規化）に対応する楽天レシピのカテゴリIDを取得
3. `/api/search?categoryId=...` が楽天レシピAPI（CategoryRanking）を呼び出し
4. 取得したレシピ一覧を表示し、ログイン中は「お気に入りに追加」可能

## ライセンス

このプロジェクトはプライベート利用を想定しています。楽天APIの利用規約に従ってご利用ください。
