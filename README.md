# IdeaForge

IdeaForge is a mobile-first PWA for turning rough ideas into clear, buildable next steps. It stores ideas locally in IndexedDB, supports voice capture in compatible browsers, can download Markdown build plans, and can use Gemini through the Vercel API function for structured refinement.

## Run locally

```bash
npm install
npm run dev
```

The app works without an API key. To enable AI refinement locally, copy `.env.example` to `.env.local` and add `GEMINI_API_KEY`.

## Deploy to Vercel

This repository is already configured as the `idea-forge` Vercel project. Push to `main` or deploy with the Vercel CLI. Add `GEMINI_API_KEY` under Vercel Project Settings → Environment Variables if AI refinement is wanted. Google Drive sync is not enabled; use **Download Plan** to save a Markdown copy.

## Use it on iPhone

1. Open the deployed URL in Safari: `https://idea-forge-wheat.vercel.app`
2. Tap Share → **Add to Home Screen** → Add.
3. Launch IdeaForge from the new Home Screen icon.

Ideas are currently saved in the browser on the device where they are created. They do not automatically sync between iPhone and desktop yet.

## Checks

```bash
npm run build -- --emptyOutDir=false
npm audit --omit=dev
```
