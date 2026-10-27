# Nyan Lin Tun — Works

A Markdown-driven portfolio built with Next.js, React, Tailwind CSS, and Base UI. The whole site lives under **https://nyanlintun.me/works/**. It does not own the domain root.

This repository serves only `/works/`. A future `/projects/` site belongs to a separate repository and deployment, like the existing `/Referrals/` site. There is no nested `/works/projects/` page.

## Edit the website without changing code

| What you want to change                           | File to edit                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Name, headline, introduction, description, footer | [content/README.md](content/README.md)                                               |
| AlphaSense experience                             | [content/works/2025-alphasense.md](content/works/2025-alphasense.md)                 |
| WS Audiology experience                           | [content/works/2023-ws-audiology.md](content/works/2023-ws-audiology.md)             |
| True Digital Group experience                     | [content/works/2022-true-digital-group.md](content/works/2022-true-digital-group.md) |
| CARRO experience                                  | [content/works/2021-carro.md](content/works/2021-carro.md)                           |
| Rinda experience                                  | [content/works/2016-rinda.md](content/works/2016-rinda.md)                           |

The opening `---` block holds labels and dates. The text below it is regular Markdown: paragraphs, bullet lists, bold text, and links. The root README you are reading is documentation; **content/README.md** supplies the website introduction.

To add work, create another `.md` file in `content/works/`:

```markdown
---
title: Your project or company
role: Your contribution
start: '2026-01'
end: present
url: https://example.com
mark: N
status: In progress
---

Explain the work in a short paragraph.

- What you contributed.
- A useful outcome or lesson.
```

Use quoted `YYYY-MM` dates; `end` can also be `present`. Entries are sorted by their start date, newest first. `url` and `status` are optional. `icon` optionally references a local favicon, such as `/companies/alphasense.png`, stored in `public/companies/`. Without an icon, `mark` supplies a short monogram beside the title. `draft: true` only removes the current-work accent; it does **not** hide the entry.

### Company favicon sources

Icons are local copies of the favicon assets declared by the official company websites, retrieved on October 27, 2026. Their colors and proportions are preserved; no third-party favicon service is used.

| Company            | Official page                                   | Favicon asset                                                                                                                                     |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| AlphaSense         | [alpha-sense.com](https://www.alpha-sense.com/) | [apple-touch-icon.png](https://www.alpha-sense.com/apple-touch-icon.png)                                                                          |
| WS Audiology       | [wsa.com](https://www.wsa.com/)                 | [favicon.svg](https://www.wsa.com/favicon.svg)                                                                                                    |
| True Digital Group | [truedigital.com](https://www.truedigital.com/) | [Official CDN icon](https://tdg-assets.sgp1.cdn.digitaloceanspaces.com/wp-content/uploads/2025/03/b9500a_bb8c68781edd467bbce2bbca2d2ca190mv2.png) |
| CARRO              | [carro.sg/about](https://carro.sg/about)        | [favicon-new.png](https://carro.sg/assets/img/favicon-new.png?webp)                                                                               |
| Rinda              | [rinda.co](https://rinda.co/)                   | [favicon.png](https://rinda.co/images/favicon.png)                                                                                                |

For links inside Markdown, use a full URL (including `https://nyanlintun.me/works/` for this site's pages) or a path beginning `/works/`. Existing sibling sites such as `/Referrals/` can be linked with their full URL.

### How edits reach the website

1. Edit a Markdown file, locally or using GitHub's file editor.
2. In local development, save and refresh the page. For the production preview, rebuild and refresh.
3. Commit the edit. The workflow checks and builds all changes, including Markdown.
4. Push to `main` to deploy the updated site automatically to **https://nyanlintun.me/works/** after all checks pass. Pull requests and other branches validate and save a preview artifact without publishing.

Content is rendered during the build. Visitors receive the text in HTML without waiting for a separate README download.

## Preview locally

The theme button in the header switches between light and dark mode. The site follows the system appearance by default and saves explicit choices under `nyanlintun-works-theme` in local storage. The `next-themes` initializer applies the saved theme before painting; both themes use the same layout and icon dimensions. Colors are defined together in `src/app/globals.css` using CSS `light-dark()` values.

Use Node 22.14+ and npm:

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:4321/works/**.

To review exactly the static files intended for GitHub Pages:

```sh
npm run check
npm run build
npm test
npm run preview
```

The production preview is **http://127.0.0.1:4322/works/**. Stop it with Ctrl+C. Its small local server mounts `out/` at `/works/`, matching GitHub Pages rather than pretending the site lives at `/`.

The scripts use Next.js’s supported Webpack builder because Turbopack’s local worker port binding is restricted in this environment. This affects the build tool, not the generated site or hosting.

## Code quality and formatting

ESLint uses Next.js’s recommended Core Web Vitals, React, React Hooks, and TypeScript rules. Prettier handles formatting separately, including CSS, Markdown, and Tailwind class ordering. EditorConfig provides consistent indentation and line endings across editors.

TypeScript 7 runs `npm run check`. The `typescript` dependency supplies the TypeScript 6 API for ESLint and tools that still require it, following [Microsoft’s documented side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0). Both versions are pinned in the lockfile.

```sh
npm run lint          # Check code quality; warnings fail the check
npm run lint:fix      # Apply safe automatic lint fixes
npm run format       # Format source and content files
npm run format:check # Check formatting without changing files
```

Configuration lives in `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, and `.editorconfig`. Generated output, dependency files, and `next-env.d.ts` are excluded from formatting. Enable your editor’s Prettier integration for formatting on save using the project configuration.

GitHub validation runs linting, formatting checks, TypeScript checks, the production build, and export tests. All checks must pass before an artifact is uploaded. The deployment job publishes successful `main` builds to GitHub Pages; pull requests and other branches only validate.

## GitHub Pages deployment

The repository origin is `git@github.com:nyan-lin-tun/works.git`.

- `next.config.ts` uses `output: 'export'`, `basePath: '/works'`, and `trailingSlash: true`.
- Publish the **contents of `out/`**, not a nested `out/works/` directory.
- `out/index.html` will be served at `https://nyanlintun.me/works/`; assets use `/works/_next/`.
- The account's existing custom domain should stay on the account/root Pages repository. Leave the **works repository's custom-domain setting blank**, so it inherits the account domain.
- Do not add a `CNAME` file here and do not change DNS for this project site.
- `public/.nojekyll` is included for static-file compatibility.
- `.github/workflows/validate.yml` validates the site and deploys `main` through GitHub Actions. Only the deployment job has Pages write and OIDC permissions.
- The `github-pages` environment records deployment history. To roll back, revert the relevant commit on `main` and push; the workflow will rebuild and redeploy.

The account/root Pages repository already owns `nyanlintun.me`. This project inherits that domain with its own `/works/` path. Its repository custom-domain setting remains blank; the root site, sibling sites, and DNS settings are managed separately.

References: [GitHub project-site custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages#using-a-custom-domain-across-multiple-repositories), [Next.js basePath](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [static exports](https://nextjs.org/docs/app/guides/static-exports).
