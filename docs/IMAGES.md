# Specimen images – single source of truth

So images work on **both** GitHub Pages (`/rock-project/`) and Vercel (`/`), all rock/specimen image URLs are resolved **at runtime** from the current deploy path.

## Rule

- **Never** use a build-time base or a raw `rock.imageUrl` for display.
- **Always** use:
  - `getRockImageUrl(rock)` when showing a rock/specimen image.
  - `getFallbackImageUrl()` when you need the fallback image URL (e.g. in `OptimizedImage` when `src` is empty or on error).

## Where it lives

- **`src/constants/index.ts`**
  - `getBase()` – returns `/rock-project/` or `/` from `window.location.pathname`.
  - `getFallbackImageUrl()` – full URL for `images/specimens/fallback.jpg`.
  - `getRockImageUrl(rock)` – full URL for a rock (handles missing `imageUrl`, relative paths, absolute paths, full URLs).
  - `specimenImage(name)` – returns **relative path only** `images/specimens/{name}.jpg` for use in **demo data**. Demo data does not get a base; the URL is resolved when rendered via `getRockImageUrl(rock)`.

## Demo data

- `demoSpecimens.ts` and `demoData.ts` set `imageUrl: specimenImage('amethyst')` etc.  
- `specimenImage()` returns only the path (e.g. `images/specimens/amethyst.jpg`).  
- At render time, components pass the rock to `getRockImageUrl(rock)`, which prepends `getBase()` so the URL is correct for the current deploy.

## Adding a new place that shows a rock image

1. Import: `import { getRockImageUrl } from '@/constants'`
2. Use: `src={getRockImageUrl(rock)}` (or `getRockImageUrl(trade.targetRock)` etc.)
3. Do **not** use `rock.imageUrl || FALLBACK_IMAGE_URL` or any other base/constant for the `<img src>`.

## Assets

- Files live in `public/images/specimens/*.jpg` (and are copied to `docs/images/specimens/` on build).
- Names must match what you pass to `specimenImage()` (e.g. `amethyst.jpg`, `rose-quartz.jpg`, `fallback.jpg`).
