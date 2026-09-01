# RangeWatch

RangeWatch is a wildlife intelligence console for conservation field teams. It pulls together camera-trap stills, population index counts, ranger reports, collar GPS, and habitat scenes for a fictional 1,840 km² landscape: **Mopane Ridge Conservancy** on the Zambezi–Kafue corridor.

The product is a working operations desk, not a training-model zoo. Camera analysis uses a deterministic vision pipeline (pixel features + catalogue matching). Population lines use Holt linear exponential smoothing on 24 months of survey index data.

## What you can do

- **Operations dashboard** — elephant estimate, 12-month projection, live cameras, sector map, recent sightings, open alerts.
- **AI camera-trap analysis** — upload a still or run a demo frame. Output includes species, confidence, group size, known individuals, humans, vehicles, and threat flags.
- **Population prediction** — switch species, read current vs previous vs +12 month forecast with a prediction band.
- **Threat desk** — filter poaching, vehicles, humans, snares, fire, encroachment, collars, and fence events; click a sector on the map.
- **Habitat** — NDVI, water index, burned area, charcoal encroachment.
- **Endangered species** — IUCN status, known individuals, and notes for eight monitored taxa.

Demo trap frames live in `public/samples/` (elephant herd, rhino, lion, night vehicle, thermal humans, snare).

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43180](http://127.0.0.1:43180).

## GitHub: WildlifeConversationCommandCenter

Create a public GitHub repository named **WildlifeConversationCommandCenter**, then push this project:

```bash
git remote add github https://github.com/<your-user>/WildlifeConversationCommandCenter.git
git branch -M main
git push -u github main
```

If you started this project in Cursor without a GitHub remote yet, use the **Create repo** control in the agent view, then rename the repository to `WildlifeConversationCommandCenter` in GitHub settings if needed.

## Deploy on Vercel

This is a standard Next.js App Router app. No environment variables, database, or secrets are required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_GITHUB_USER/WildlifeConversationCommandCenter&project-name=wildlife-conversation-command-center&framework=nextjs)

Or from the CLI, logged into the Vercel account that should own the deployment:

```bash
npx vercel --yes --prod
```

The production URL will look like `https://wildlife-conversation-command-center.vercel.app` (Vercel may append a suffix if the name is taken).

Anonymous preview deploys (`vercel deploy --temporary`) expire in about an hour unless you [claim](https://vercel.com/docs/deployments/claim-deployments) them into your Vercel account.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts.

No database or API keys are required. Swap `/api/analyze` for a real detector (MegaDetector, SpeciesNet, or a custom model) when you have weights and labelled field photos.
