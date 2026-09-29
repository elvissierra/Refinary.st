# Refinery.st

CAD, 3D printing, and product design services site for Elvis Sierra. Single-page
Astro + Tailwind site, deployed to GitHub Pages via GitHub Actions.

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
3. **Custom domain**: this site is configured for `https://refinary.st.io/`.
   The `public/CNAME` file keeps the domain attached to GitHub Pages. Its DNS
   record must be a CNAME pointing to `elvissierra.github.io`.

## Commands

| Command           | Action                                       |
| :----------------- | :------------------------------------------- |
| `npm install`      | Install dependencies                         |
| `npm run dev`       | Start local dev server at `localhost:4321`   |
| `npm run build`     | Build production site to `./dist/`           |
| `npm run preview`   | Preview the production build locally         |

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes it to `https://refinary.st.io/`. Enable Pages
in the repo settings with source set to "GitHub Actions" for this to work.
