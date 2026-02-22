# Svelte Template

Lightweight single-spa Svelte template with MVP structure and shared design system helpers.

## Scripts
- `pnpm run serve` - dev server (rollup + livereload)
- `pnpm run build` - build SystemJS bundle for single-spa

## Structure
- `src/main.ts` single-spa lifecycles + standalone mount
- `src/Root.svelte` UI entry
- `src/mvp/*` model / presenter / usecase / service

## Notes
- Output bundle: `dist/org-playground-svelte.js`
- Uses SystemJS format for single-spa import maps
