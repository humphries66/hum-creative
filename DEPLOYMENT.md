# Deployment & site-mode notes

The home page at **humcreative.co** currently shows a minimal "fully booked" landing page with an inquiry form (email + project type). The full portfolio is still built and deployed — it's just hidden behind a query parameter.

---

## Previewing the full portfolio

Add `?archive=true` to the URL:

> https://humcreative.co/?archive=true

This shows the full Variant A / Variant B portfolio with all sections (work, studio, journal, contact) and the Tweaks panel. Same URL works locally during dev: `http://localhost:5173/?archive=true`.

There's also a near-invisible "·" link in the bottom-right corner of the landing page footer that links to the same URL. Hover over the footer to find it.

---

## Swapping the home page back to the full portfolio (permanent)

When you're ready to take down the "fully booked" landing and republish the full site as the home page:

1. Open `src/App.jsx`.
2. Delete (or comment out) these two blocks:
   - The `archiveMode` constant near the top of the file (the lines after the comment block "Archive-mode gate")
   - The early return inside `App()`:
     ```js
     if (!archiveMode) return <FullyBooked />;
     ```
   - You can also remove the `import FullyBooked from './components/FullyBooked.jsx';` line since it'll be unused.
3. Change `App` so it just returns `<Portfolio />` (or just rename `Portfolio` back to `App` and delete the wrapper — either works).
4. Commit, push, open a PR, merge. Netlify auto-deploys in ~2 minutes.

### Quickest possible swap (no code-shape change):
Just change this one line near the top of `src/App.jsx`:
```js
const archiveMode = ... .get('archive') === 'true';
```
to:
```js
const archiveMode = true;
```
That's it. The full portfolio is now the home page; the FullyBooked component is no longer reachable. Commit, push, merge.

---

## Putting the landing page back up later

Reverse the change above (set `archiveMode` back to the URL-param check, or `git revert` the swap commit). One commit toggles between modes.

---

## One-time Netlify setup for the new inquiry form

The landing page submits to a **separate** Netlify form named `inquiry` (the existing contact form is unchanged). After the first deploy that includes this code:

1. Go to **app.netlify.com** → **humco** project → **Forms** (left sidebar).
2. You should see two forms listed: `contact` and `inquiry`.
3. Click `inquiry` → **Add notification** → **Email notification**.
4. Enter `jared@humcreative.co` → save.

From then on, every inquiry form submission emails you the visitor's email address and selected project type.

The existing `contact` form notifications continue to work unchanged.

---

## File layout summary

- `src/components/FullyBooked.jsx` — the new minimal landing page (self-contained, doesn't import any portfolio components)
- `src/App.jsx` — routing decision (FullyBooked vs Portfolio)
- `src/components/VariantA.jsx`, `VariantB.jsx`, `Primitives.jsx`, `data.js`, `TweaksPanel.jsx` — unchanged from the original portfolio implementation
- `index.html` — declares both Netlify forms (`contact` and `inquiry`)
