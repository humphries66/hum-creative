# Portfolio images — status: COMPLETE

All 26 image slots on the site are filled. Sourced from Upwork on Aug 6, 2026 by
resolving each portfolio download URL to its signed S3 original in a logged-in
browser, then downloading and converting to JPG (max 2400px, quality 85).

Originals were 1920–3840px PNGs. Total folder weight ~14 MB.

## Naming contract

The page references these filenames directly. To swap any image, drop a
replacement at the same path — no code change needed. To add a new one, add the
`<figure class="asset">` block in `dist/index.html` and match the filename here.

| File | What it is | Project |
|---|---|---|
| `01-hof-deck.jpg` | Pitch deck cover (rendered from HOF3.pdf) | 01 Decatur Music Hall of Fame |
| `02-bloompop-composite.jpg` | Can hero + product collage + 6-pack | 02 BloomPop |
| `03-sheriff-01.jpg` | Primary logo lockup | 03 Dougherty County Sheriff |
| `03-sheriff-02.jpg` | Badge variations / scale study | 03 |
| `03-sheriff-03.jpg` | Billboard mockup | 03 |
| `03-sheriff-04.jpg` | Challenge coin + patrol car | 03 |
| `03-sheriff-05.jpg` | Wordmark on black | 03 |
| `04-dcc-01.jpg` | Run Club banner graphic | 04 Decatur City Church |
| `04-dcc-02.jpg` | Run Club t-shirt | 04 |
| `04-dcc-03.jpg` | Serve rack card mailer | 04 |
| `05-belay-01.jpg` | Website mockup | 05 BELAY web |
| `05-belay-04.jpg` | Executive's Guide lead magnet cover | 05 |
| `05-belay-05.jpg` | Paid ad variant collage | 05 |
| `06-secret-01.jpg` | Wordmark, keyhole motif | 06 The Secret Show |
| `06-secret-02.jpg` | Website + screen mockups | 06 |
| `06-secret-03.jpg` | Mural signage on hoarding | 06 |
| `06-secret-04.jpg` | Social promo posters | 06 |
| `06-secret-05.jpg` | Velvet curtain sign, in context | 06 |
| `07-porchfest-01.jpg` | Primary logo | 07 Porchfest |
| `07-porchfest-02.jpg` | Apparel + A-frame signage + mugs | 07 |
| `07-porchfest-03.jpg` | Event day photography | 07 |
| `07-porchfest-04.jpg` | Logo variations on black | 07 |
| `07-porchfest-05.jpg` | Overprint stack + vintage badge | 07 |
| `08-deck-01.jpg` | Delegation into Dollars — cover | 08 BELAY decks |
| `08-deck-02.jpg` | Summit 2025 — cover | 08 |
| `08-deck-03.jpg` | Lisa Seal, 2026 Vision — cover | 08 |
| `08-deck-04.jpg` | Positioning Statement — cover | 08 |
| `08-deck-05.jpg` | Strategy Sales Deck — cover | 08 |

Project 04 also embeds two YouTube videos (`QhXLwxceORY`, `_BeJUkYsGME`) — no
local files involved.

## Covers that open a PDF

Six covers are wrapped in `<a class="doc-link" target="_blank">` and open the
real, full document from `dist/assets/docs/`. These covers are rendered from
page 1 of the PDF itself via
`sips -s format jpeg -s formatOptions 88 --resampleHeightWidthMax 2000` — re-run
that if a PDF is ever replaced, so cover and document stay in sync.

| Cover | Opens | Pages |
|---|---|---|
| `01-hof-deck.jpg` | `docs/decatur-hall-of-fame.pdf` | 11 |
| `05-belay-04.jpg` | `docs/executives-guide-saving-10-hours.pdf` | 8 |
| `08-deck-01.jpg` | `docs/delegation-into-dollars.pdf` | 14 |
| `08-deck-02.jpg` | `docs/summit-2025-closing-talk.pdf` | 15 |
| `08-deck-03.jpg` | `docs/lisa-seal-2026-vision.pdf` | 17 |
| `08-deck-04.jpg` | `docs/positioning-statement.pdf` | 4 |
| `08-deck-05.jpg` | `docs/strategy-sales-deck.pdf` | 20 |

Page counts are hardcoded in each `figcaption`. Update them if a PDF changes.

The PDFs are served with `Content-Type: application/pdf` and **no**
`Content-Disposition` header, so browsers open them inline in their own PDF
viewer rather than downloading. Do not add a `Content-Disposition: attachment`
rule in `netlify.toml` — that would turn every cover into a download.

## What happens when you click an asset

Two behaviours, decided by whether the figure is wrapped in a PDF link:

- **The 7 covers listed above** open their full PDF in a new tab.
- **The other 21 images** open in the lightbox (`main.js`), which shows them
  uncropped. Thumbnails use `object-fit: cover`, so several — the BloomPop and
  BELAY ad composites especially — are meaningfully cropped in the grid.
- **The 2 YouTube embeds** do neither; they play in place.

The lightbox picks up its images automatically from
`.asset` figures that have no `a.doc-link`, so adding an image needs no JS
change. Its caption and `n / total` counter are read from the figure's
`<figcaption>`. Controls: click or Escape to close, arrow keys, on-screen
chevrons, and horizontal swipe on touch.

If you ever want a currently-lightboxed image to open a PDF instead, wrap it in
`a.doc-link` and it leaves the lightbox set on its own.

## Caption accuracy

The scraped source descriptions did not reliably match the actual files —
several were shifted by one position within a project. Every caption on the page
was set by looking at the image itself, not by trusting the source notes. If you
add assets later, verify the same way.

## Not used on the page

These exist on Upwork but were left out to keep each project tight. Grab them
the same way (open the URL in a logged-in browser, then download the S3 original
it redirects to) if you want to add them:

- Sheriff, sixth asset — `.../files/6e3676e4-b5ed-4f49-979a-d7e2a7505336`
- DCC, fourth asset — `.../files/1986a5c7-ac91-4794-a5e6-9dabd5b795cf`
- BELAY web, three more — `.../files/1c360dc2-aaa6-431b-93b4-bea44514d8f0`,
  `.../files/f90ee26d-48ea-4e7d-9116-4fa5e13e7919`,
  `.../files/ac4e947d-7f47-447a-83ff-1c4b6a0044a8` (Outsourced Accounting guide)
- BELAY decks, two more — `.../files/6963c1c9-96d2-4406-a948-6c9de4eb4cf2`
  (F1D — Lisa Seal V3), `.../files/d887ef98-f62b-471d-83eb-a6ad1cc8b587`
  (Jared Strategy Sales Deck V1)

URL prefix for all of the above:
`https://www.upwork.com/att/download/portfolio/persons/uid/2059279400302930747/profile/projects/`
