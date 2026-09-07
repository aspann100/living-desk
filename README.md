# Living Desk

A warm paper/wood portfolio desk — folders, sticky notes, and an Interview tray.

## Stack

Next.js App Router · TypeScript · Tailwind · Motion · @dnd-kit · Zustand · MDX content

## Run locally

```bash
bun install
bun run dev
```

Open http://localhost:3000

```bash
bun run build
```

## Routes

- `/` — desk
- `/work/warm-intake` — case study
- `/?open=warm-intake` — restore case window on the desk

## Notes

- No Apple traffic-light chrome
- Design tokens live in `src/app/globals.css`
- Exact UI copy in `src/lib/labels.ts`
