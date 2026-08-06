# Project Context

## What This Is
Marketing and portfolio site for HUM, a creative consultancy. Primary goal: establish
credibility and convert warm visitors into discovery calls. Not a brochure. A proof of taste.

## The Client
Decision-makers at mid-size companies (50–500 employees) who are spending contract
dollars instead of hiring. They're looking for a partner who thinks, not just executes.
They arrive already somewhat curious. The site's job is to confirm they're in the right place.

## Services (Lead With These)
- Brand strategy
- Creative direction

## Pages
- Home
- Work (portfolio)
- Services
- About
- Contact

## Voice and Tone
Spartan. Confident without being loud. No buzzwords. No "we help brands tell their story."
Write like someone who has nothing to prove. Short sentences. Direct address. Active voice.

## Visual Direction
Minimal. Lots of white space. Typography-forward. Restrained color palette. No gradients,
no hero carousels, no stock photography. If something doesn't need to be there, it isn't.

## Stack
- Plain HTML / CSS / vanilla JS
- Tailwind CSS via CDN (no build step)
- Output in /dist

## File Structure
/dist
  index.html
  work.html
  services.html
  about.html
  contact.html
  /assets
    /images
    /fonts

## Rules
- Mobile-first
- No inline styles
- No frameworks (React, Vue, etc.)
- No stock photography
- JS only where interaction is genuinely necessary
- Every page needs a single clear CTA pointing toward contact
- Do not change global nav or footer structure without asking

## Deploy Target
Netlify via GitHub. Auto-deploys on push to main. Branch: main.