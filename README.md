# IdeaForge

IdeaForge is a mobile-first PWA for turning rough ideas into clear, buildable next steps. It stores ideas locally in IndexedDB, supports voice capture in compatible browsers, can download Markdown build plans, and can use Gemini through the Vercel API function for structured refinement.

## Run locally

```bash
npm install
npm run dev
```

The app works without an API key. To enable AI refinement locally, copy `.env.example` to `.env.local` and add `GEMINI_API_KEY`.

## Deploy to Vercel

This repository is already configured as the `idea-forge` Vercel project. Push to `main` or deploy with the Vercel CLI. Add `GEMINI_API_KEY` under Vercel Project Settings → Environment Variables if AI refinement is wanted.

### Enable Google Drive sync

The app targets `05_IdeaForge_Vault/00_Inbox` (`19xBQ2fY7xsVhgcAEkxZ1VH1zG_oqMugm`). For the simplest server-side setup:

1. Create a Google Cloud service account and enable the Google Drive API.
2. Share the `00_Inbox` folder with the service account email as an Editor.
3. Add the downloaded service-account JSON as `GDRIVE_SERVICE_ACCOUNT_JSON` in Vercel Project Settings → Environment Variables.
4. Add `GDRIVE_FOLDER_ID` with the folder ID above, then redeploy.

The API also supports OAuth credentials through `GDRIVE_CLIENT_ID`, `GDRIVE_CLIENT_SECRET`, and `GDRIVE_REFRESH_TOKEN`. Until credentials are added, **Sync to Drive** downloads a Markdown plan locally instead.

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
