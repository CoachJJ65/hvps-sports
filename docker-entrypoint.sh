#!/bin/sh
set -e

mkdir -p ./prisma/db

echo "Initializing Prisma schema (non-destructive)..."
npx prisma db push --skip-generate

echo "Seeding (idempotent upserts only)..."
npx tsx prisma/seed.ts || echo "Seed skipped (already present or non-fatal)."

echo "Starting HVPS Sports..."
exec npx tsx server.ts
