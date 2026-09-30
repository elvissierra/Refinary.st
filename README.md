# Refinery.st

CAD, 3D printing, and product design services site for Elvis Sierra. Single-page
Astro + Tailwind site, deployed to Cloudflare Workers (static assets plus server
routes) through Workers Builds.

## Structure

- `src/layouts/Layout.astro` — shared page shell, meta tags, fonts.
- `src/components/` — one component per page section: `Nav`, `Hero`, `Services`,
  `Products`, `Work`, `About`, `Contact`, `Footer`.
- `src/pages/index.astro` — assembles the sections above.
- `public/images/products/` and `public/images/work/` — drop in real photos here,
  named to match the `image` path in `Products.astro` / `Work.astro`. Until an
  image exists at that path, the section shows an "Image coming soon" fallback.

## Before going live

1. **Contact form**: `src/components/Contact.astro` posts to a placeholder
   Formspree endpoint. Create a form at https://formspree.io/forms and replace
   `FORMSPREE_ENDPOINT` with your real endpoint URL.
2. **Product/work photos**: replace the placeholder images referenced in
   `Products.astro` and `Work.astro` with real product and build photos.
3. **Custom domain** (optional): the site is served from the free `workers.dev` URL.
   To use your own domain, add it under the Worker's Domains tab in Cloudflare.

## Commands

| Command           | Action                                       |
| :----------------- | :------------------------------------------- |
| `npm install`      | Install dependencies                         |
| `npm run dev`       | Start local dev server at `localhost:4321`   |
| `npm run build`     | Build production site to `./dist/`           |
| `npm run preview`   | Preview the production build locally         |

## Deployment

The Worker is named `refinery-st` (see `wrangler.jsonc`). Pushing to `main`
triggers a Cloudflare Workers Build that runs `npm run build` and
`npx wrangler deploy`. Enable the `workers.dev` route on the Worker's Domains tab
to make the site reachable.
