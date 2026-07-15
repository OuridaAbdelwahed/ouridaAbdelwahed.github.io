# Abdelwahed Ourida — Portfolio

A static, immersive portfolio built with Astro, React, TypeScript, Tailwind CSS, Motion, GSAP, Lenis, Three.js, and React Three Fiber.

## Local development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm run preview
```

## Architecture

- Astro renders all portfolio content as static HTML.
- React islands are limited to navigation, the hero water shader, the procedural data field, copy feedback, certificate dialogs, and global motion orchestration.
- Typed content lives in `src/data` and every entry is rendered on the home page.
- The WebGL hero uses two perfectly aligned 1200×1600 textures. Pointer velocity drives ripple displacement and refraction; touch, keyboard, reduced-motion, and no-WebGL fallbacks are included.
- GSAP and ScrollTrigger handle section choreography and timeline progression. Motion handles menus, dialog state, feedback, and small interactions. Lenis provides opt-out smooth scrolling.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys `dist`.

1. Push the repository to GitHub with `main` as the deployment branch.
2. In **Settings → Pages**, select **GitHub Actions** as the source.
3. For a normal project page, the workflow derives the production URL and repository base path automatically.
4. For a custom domain or a user/organization root site, create these repository Actions variables:
   - `SITE_URL`: the full origin, for example `https://portfolio.example.com`
   - `BASE_PATH`: `/` for a custom/root domain, or `/repository-name` for a project page
5. If using a custom domain, add the domain in GitHub Pages settings and add a `public/CNAME` file containing only that domain.

For a local production-path test:

```powershell
$env:SITE_URL='https://username.github.io/repository'
$env:BASE_PATH='/repository'
npm run build
```

## Source-of-truth notes

The portfolio only exposes information found in the previous site or supplied CV. GitHub, LinkedIn, repository, and live-demo URLs were not present, so none were invented. Add verified URLs to `src/data/personal.ts` and `src/data/projects.ts` when available.
