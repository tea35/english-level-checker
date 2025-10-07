# ベースイメージとしてNode.jsの最新LTS版を使用
FROM node:20-alpine

WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# Prismaスキーマをコピーしてクライアントを生成
COPY prisma ./prisma/
RUN npx prisma generate

# 残りのプロジェクトファイルをコピー
COPY . .

# Next.jsが使用するポートを公開
EXPOSE 3000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]
