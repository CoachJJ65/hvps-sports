# Coolify deployment — HVPS Sports

Coolify pulls from GitHub (`CoachJJ65/hvps-sports`) and builds the `Dockerfile`. The local `.env` is **not** copied into the container.

## 1. Push

```bash
git add Dockerfile docker-entrypoint.sh .dockerignore .gitattributes COOLIFY.md
git commit -m "chore: add Coolify Docker deployment"
git push
```

## 2. Create the application in Coolify

1. Open your Coolify dashboard.
2. New resource → **Application** → GitHub `CoachJJ65/hvps-sports`, branch `main`.
3. Build pack: **Dockerfile** (auto-detected).
4. Port: **3000**.
5. Enable **Websockets** on the proxy (Socket.IO uses `/api/socketio`).

## 3. Environment variables

Add these in Coolify → Environment Variables, then save and redeploy:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `file:./prisma/db/custom.db` |
| `NEXTAUTH_SECRET` | long random string (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | public HTTPS URL, e.g. `https://sports.yourdomain.com` |
| `PORT` | `3000` |
| `XAI_API_KEY` | same Grok key as local `.env` |
| `XAI_MODEL` | `grok-4.6` |

Mark `XAI_API_KEY` and `NEXTAUTH_SECRET` as **secret**.

`NEXTAUTH_URL` must match the public domain Coolify assigns (or your custom domain). Wrong URL breaks sign-in and the PWA.

## 4. Persistent SQLite volume

Containers are ephemeral. Mount the database directory:

1. Application → **Storages** → Add volume
2. Name: `hvps-sports-db`
3. Destination path: `/app/prisma/db`
4. Save and **redeploy**

Mount the directory, not the `.db` file. SQLite writes WAL/journal files next to the database.

## 5. Domain / PWA

- Assign a domain (or Coolify generated URL).
- HTTPS is required for installable PWA and service worker.
- After the first deploy, `/api/health` should return `"ok": true` and `"ai.configured": true` if `XAI_API_KEY` is set.

## 6. Seeded admin

First boot upserts `admin@hvps.local` / `changeme-admin`. Change that password before real use.
