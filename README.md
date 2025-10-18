# SlomSlomV2

A mobile-first PWA demo (React + TypeScript + Vite) with two mini apps: Tap Counter and Mini Roulette.

Quick start

1. Install dependencies

```powershell
npm i
```

2. Run dev server

```powershell
npm run dev
```

Tests

```powershell
npm run test
```

Build

```powershell
npm run build
```

Deploy (Netlify)

Build and publish the `dist` folder. Netlify ready via `netlify.toml` which redirects all routes to `index.html` for SPA routing.

PWA install

- Android/Chrome: open site → menu → "Add to Home screen".
- iOS/Safari: open site → Share → "Add to Home Screen". Note: iOS support is limited; using the install prompt and manifest improves experience.

Troubleshooting

- If icons don't appear, verify the `public` files exist and rebuild.
- To enable husky locally: `npx husky install` and commit the `.husky` folder.

Files created/edited (high level)

- `package.json` — scripts + deps
- `vite.config.ts` — Vite + PWA plugin
- `tailwind.config.js`, `postcss.config.js`, `src/index.css`
- `index.html`, `tsconfig.json`
- `src/main.tsx`, `src/routes.tsx`, `src/App.tsx`
- `src/components/Header.tsx`, `src/components/Header.test.tsx`
- `src/pages/{Home,Counter,Roulette}.tsx`
- `src/lib/{haptics,audio}.ts`
- `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/pwa-512x512-maskable.png`
- `.eslintrc.cjs`, `.prettierrc`, `.editorconfig`
- `.github/workflows/ci.yml`, `netlify.toml`, `.husky/pre-commit`, `vitest.config.ts`

