# Deployment & site notes

The home page at **humcreative.co** is the "pulp" one-pager: hand-authored
static HTML in `/dist`. The graphic-design portfolio lives alongside it at
**/portfolio** and is unchanged.

---

## How it deploys

Netlify publishes `dist/` verbatim. **There is no build step.**

`netlify.toml` sets `command = ""` deliberately. A `[build]` block with no
`command` key falls back to the build command still configured in the Netlify
UI (`npm run build`) - that would run `vite build`, whose default `outDir` is
also `dist`, and overwrite the hand-authored site with the old React app.
Do not remove that line while `package.json` and `vite.config.js` still exist.

Push to `main` → auto-deploy in ~2 minutes.

---

## Forms - do not rename these

Both forms are Netlify Forms. Routing is **not** in the code: each form's email
notification is configured in the Netlify dashboard and keyed on the form's
**name**. Renaming a form, or renaming its fields, silently breaks delivery.

| Form | Fields | Notification |
|---|---|---|
| `inquiry` | `email`, `project_type`, `project_description` | jared@humcreative.co |
| `contact` | `name`, `project`, `budget`, `tell` | pre-existing |

- `inquiry` is the live form in the contact section of `dist/index.html`.
- `contact` is no longer rendered anywhere, so it is declared as a `hidden`
  form at the bottom of `dist/index.html` purely to keep Netlify's registration
  and its existing notification alive. Deleting that stub retires the form.

The form posts via `fetch` so the visitor stays on the page. If JS is absent or
the request fails, it degrades to a normal POST and the visitor is shown a
fallback address rather than losing the inquiry.

---

## File layout

```
dist/
  index.html              the pulp home page
  assets/
    css/site.css          all styling (no framework, no inline styles)
    js/site.js            scroll choreography + form submit
    fonts/                the 5 faces actually used
    img/                  hero artwork, newsprint texture, portrait, logo
  portfolio/              the graphic-design portfolio, unchanged
netlify.toml              publish dist, no build
```

### Still in the repo but no longer deployed

`src/`, `index.html` (root), `package.json`, `package-lock.json`,
`vite.config.js` - the retired React/Vite app, including the old `FullyBooked`
landing and the `?archive=true` portfolio. Nothing serves these now. They are
safe to delete; the full history is on `origin/main` before the pulp rebuild.
