# MEMORY

## プロジェクト概要
楽天レシピAPIを使った食材検索Webアプリ。ログインユーザーはお気に入り保存可能。

## 技術スタック
- Next.js 16 (App Router) / React 19 / Tailwind CSS 4
- NextAuth.js (Credentials + JWT)
- PostgreSQL (Supabase) + Prisma
- Vercelデプロイ

## 作業履歴

### 2026-03-23: Supabase自動停止防止のVercel Cronヘルスチェック追加
- `src/app/api/health/route.ts` を新規作成（DBに `SELECT 1` を送るだけの軽量API）
- `vercel.json` を新規作成（毎日UTC 0:00に `/api/health` を自動呼び出し）
- `.gitignore` に `.claude/settings.local.json` を追加

## メモ
- Supabase無料プランは7日間アクセスなしで自動停止される
- Vercel Cron Jobs はHobbyプラン（無料）で利用可能（100 cron/プロジェクト、最短1日1回）
