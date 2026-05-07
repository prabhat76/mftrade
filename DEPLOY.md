# MFTrade — Vercel Deployment Guide

## How URLs map to environments

| Branch    | Vercel URL                              | Angular Config | Mocks |
|-----------|-----------------------------------------|----------------|-------|
| `main`    | https://mftrade.vercel.app              | production     | No    |
| `develop` | https://mftrade-dev.vercel.app          | development    | Yes   |
| `sit`     | https://mftrade-sit.vercel.app          | sit            | No    |
| `staging` | https://mftrade-stage.vercel.app        | stage          | No    |
| `pat`     | https://mftrade-pat.vercel.app          | pat            | No    |

---

## One-time Vercel setup (do this once per environment)

### Step 1 — Install Vercel CLI
```bash
npm i -g vercel
vercel login
```

### Step 2 — Create 5 separate Vercel projects (one per env)
```bash
# Run each from the repo root, pick "No" for auto-detection, set output to dist/mftrade/browser

vercel project add mftrade-prod
vercel project add mftrade-dev
vercel project add mftrade-sit
vercel project add mftrade-stage
vercel project add mftrade-pat
```

### Step 3 — Get your IDs
```bash
vercel project ls
# Note the Project ID for each, and your Org/Team ID from:
vercel whoami
```

### Step 4 — Add GitHub Secrets
Go to your repo → Settings → Secrets → Actions, add:

| Secret Name                  | Value                        |
|------------------------------|------------------------------|
| `VERCEL_TOKEN`               | From vercel.com/account/tokens |
| `VERCEL_ORG_ID`              | Your team/personal org ID    |
| `VERCEL_PROJECT_ID_PROD`     | Project ID for mftrade-prod  |
| `VERCEL_PROJECT_ID_DEV`      | Project ID for mftrade-dev   |
| `VERCEL_PROJECT_ID_SIT`      | Project ID for mftrade-sit   |
| `VERCEL_PROJECT_ID_STAGE`    | Project ID for mftrade-stage |
| `VERCEL_PROJECT_ID_PAT`      | Project ID for mftrade-pat   |

### Step 5 — Set custom domains (optional)
In Vercel dashboard for each project:
- `mftrade-prod`  → add `mftrade.com`
- `mftrade-sit`   → add `sit.mftrade.com`
- `mftrade-stage` → add `stage.mftrade.com`
- `mftrade-pat`   → add `pat.mftrade.com`

---

## How SPA routing works on Vercel

The `vercel.json` rewrite rule:
```json
{ "source": "/(.*)", "destination": "/index.html" }
```
catches every URL (e.g. `/mutual-funds/detail/120503`) and serves `index.html`.
Angular Router then takes over client-side. Without this, a hard refresh on any route returns 404.

---

## Manual deploy (without CI)

```bash
# Build for the target env first
npm run build:sit

# Deploy that build to the sit project
VERCEL_PROJECT_ID=<sit-project-id> \
VERCEL_ORG_ID=<your-org-id> \
npx vercel deploy dist/mftrade/browser --token=<your-token> --yes
```

---

## Local env commands

```bash
npm start            # dev  (mock data, localhost:4200)
npm run start:sit    # sit
npm run start:stage  # stage
npm run start:pat    # pat
npm run start:prod   # production
```
