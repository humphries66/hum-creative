# Project Context

## What This Is
Marketing and portfolio site for HUM, a creative consultancy. Primary goal: establish
credibility and convert warm visitors into discovery calls. Not a brochure. A proof of taste.

## The Client
Decision-makers at mid-size companies (50–500 employees) who are spending contract
dollars instead of hiring. They're looking for a partner who thinks, not just executes.
They arrive already somewhat curious. The site's job is to confirm they're in the right place.

## Work We Ask About
The contact form's project types are the honest list of what HUM takes on:
brand identity, packaging, campaign, website, something else.

## Voice and Tone
Spartan. Confident without being loud. No buzzwords. No "we help brands tell their story."
Write like someone who has nothing to prove. Short sentences. Direct address. Active voice.

## Visual Direction
Editorial and deliberately printed-feeling, not minimal-corporate: newsprint ground,
heavy display type, halftone and spray texture, visible grit. Typography carries the
page. Colour is restrained in *count*, not in volume — ink and paper, with coral and
chartreuse doing the accent work.

- No stock photography. The studio frames are a real shoot.
- No gradients.
- Motion is scroll-driven or a hard cut, never ambient loops (the hero's neon
  flicker is the one exception, and it is disabled under `prefers-reduced-motion`).

Palette tokens live at the top of `dist/assets/css/site.css` — use them, don't
hard-code hex:
`--ink #252926` `--paper #f6f5ed` `--newsprint #fcf6f0` `--linen` `--ash` `--slate`
`--coral #ff785a` `--chartreuse #bed230` `--acid #d2f024`

Faces: Ivy Presto Display / Text, Alternate Gothic No.3D, Michigan Signature,
plus Jacquard 24 from Google Fonts.

## Structure — this is a ONE-PAGE site
There are no separate work/services/about/contact pages. `dist/index.html` is the
whole site; the nav links are in-page anchors.

- `#work` — the project rail
- `#studio` — "Why people want to work with hum", the photo column
- `#contact` — the inquiry form

`dist/portfolio/` is a separate standalone static page, served at `/portfolio`.

## Stack
- Hand-authored HTML / CSS / vanilla JS. **No build step and no npm** — there is no
  `package.json` in this repo, by design (see `DEPLOYMENT.md`).
- **No Tailwind, no framework.** All styling is `dist/assets/css/site.css`.
- `dist/` is the source, not a build output. Edit it directly.

## File Structure
```
dist/
  index.html              the whole site
  assets/
    css/site.css          all styling
    js/site.js            scroll choreography, studio slideshow, form submit
    fonts/                the 5 faces actually used
    img/                  hero art, textures, studio frames, logo
  portfolio/              standalone graphic-design portfolio
netlify.toml              publish dist verbatim, command = "" (do not remove)
devserver.py              local preview: `python3 devserver.py` -> :5181
DEPLOYMENT.md             deploy, forms, and rollback notes — read before changing either
```

## Rules
- Mobile-first
- No inline styles
- No frameworks (React, Vue, etc.)
- No stock photography
- JS only where interaction is genuinely necessary
- One clear CTA, pointing at `#contact`
- Do not change global nav or footer structure without asking
- **Do not rename the Netlify forms or their fields.** `inquiry` and `contact` are
  keyed to notification routing in the Netlify dashboard; renaming silently breaks
  delivery. See `DEPLOYMENT.md`.
- Preview with `devserver.py`, not `python3 -m http.server` — the wrapper sends
  `Cache-Control: no-store` so CSS edits actually show up.

## Deploy Target
Netlify via GitHub. Auto-deploys on push to main, ~2 minutes. Branch: main.
Netlify publishes `dist/` verbatim; there is no build. Rollback procedure is in
`DEPLOYMENT.md`.
