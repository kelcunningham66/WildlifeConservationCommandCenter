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

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts.

No database or API keys are required. Swap `/api/analyze` for a real detector (MegaDetector, SpeciesNet, or a custom model) when you have weights and labelled field photos.
