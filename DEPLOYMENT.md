# Deployment & site notes

The home page at **humcreative.co** is the "pulp" one-pager: hand-authored
static HTML in `/dist`. The graphic-design portfolio lives alongside it at
**/portfolio** and is unchanged.

---

## How it deploys

Netlify publishes `dist/` verbatim. **There is no build step.**

`netlify.toml` sets `command = ""` deliberately. A `[build]` block with no
`command` key falls back to the build command configured in the Netlify UI,
which may still be `npm run build`; the empty string guarantees nothing runs.

This used to be load-bearing in a much scarier way: `package.json` ran
`vite build`, `vite.config.js` set no `outDir`, and Vite's default `outDir` is
`dist` - so a build silently replaced the hand-authored site with the retired
React app. Those files have been removed (tag `react-app-final`), so a stray
build command now fails instead of destroying the site. Keep the line anyway.

Push to `main` → auto-deploy in ~2 minutes.

---

## DNS - it is fine, do not "fix" it

**humcreative.co is registered at Squarespace** (backend registrar Tucows /
OpenSRS) and its DNS is served by Squarespace. Netlify hosts the site but does
**not** hold the DNS zone.

The delegation lists six nameservers in two naming styles:

```
dns1.p02.nsone.net  dns2.p02.nsone.net
dns3.p02.nsone.net  dns4.p02.nsone.net
ns01.squarespacedns.com  ns02.squarespacedns.com
```

**This looks wrong and is not.** Squarespace DNS runs on NS1 Connect, and
Squarespace's own default nameserver set includes both `.nsone.net` and
`.squarespacedns.com` hostnames. All six are Squarespace's. One provider, one
zone.

Recorded here because it fooled me once: `nsone.net` also appears in Netlify
DNS (Netlify resells NS1 too), so it is easy to conclude the domain is split
between two providers and start "consolidating" it. It is not split. Two commit
messages from 2026-08-26 assert otherwise - they are wrong, and this section is
the correction. Proof it is a single zone:

- Every record type and subdomain returns byte-identical answers from both
  nameserver sets.
- All six report the **same SOA serial** (`1700590234`) and the same primary,
  `dns1.p01.nsone.net`. Independently managed zones would not share a serial.

### Live records - anything here will break something

| record | value | if lost |
|---|---|---|
| apex `A` | `75.2.60.5` (Netlify) | site offline |
| apex `MX` x5 | Google Workspace | **email stops** |
| `www` `CNAME` | `humco.netlify.app` | www dead |
| `mail` `MX` x2 | Mailgun | transactional mail dead |
| `mail` `TXT` | `v=spf1 include:mailgun.org ~all` | Mailgun mail to spam |
| `google._domainkey` | Google DKIM key | outbound signing breaks |
| `_dmarc` | `v=DMARC1; p=none;` | policy lost |
| `_domainconnect` | Squarespace | domain-connect breaks |

Zone is **unsigned** (no DNSSEC). Domain carries `clientUpdateProhibited`, so
any nameserver change needs unlocking at the registrar first. TTLs: MX and
`www` 4h.

### Auditing this zone

Use explicit record types. **Never `ANY`** - these nameservers refuse `ANY`
(RFC 8482), so an `ANY` sweep returns nothing and looks like a clean result
while hiding every record.

```bash
for T in A AAAA MX TXT CNAME NS SOA CAA; do
  echo "$T @nsone:  $(dig @dns1.p02.nsone.net    humcreative.co $T +short | sort | tr '\n' ' ')"
  echo "$T @sqsp :  $(dig @ns01.squarespacedns.com humcreative.co $T +short | sort | tr '\n' ' ')"
done
```

### Known gap, not yet addressed

There is **no SPF record on the apex**. Google Workspace sends as
`@humcreative.co` but no `v=spf1` TXT is published; DKIM and DMARC are both
present. Nothing is being rejected (`p=none`), so this is a deliverability
improvement rather than an outage. It is one TXT record in the Squarespace DNS
panel, and should be done on its own so any change in mail behaviour has an
unambiguous cause.

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
devserver.py              local preview of dist/ on :5181, no-store headers
```

### The retired React/Vite app - removed

`src/`, `public/`, `index.html` (root), `package.json`, `package-lock.json` and
`vite.config.js` held the pre-pulp React site, including the old `FullyBooked`
landing and the `?archive=true` portfolio. They were deleted once it was
confirmed nothing in `dist/` referenced them.

They are recoverable from the annotated tag `react-app-final`:

```
git checkout react-app-final -- src public index.html package.json package-lock.json vite.config.js
```

Note there is no `npm` in this project any more, and nothing needs one:
`devserver.py` is plain Python (`python3 devserver.py`, serves `dist/` on
:5181 with no-store headers) and Netlify publishes `dist/` verbatim.
