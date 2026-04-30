import React, { useState, useEffect } from 'react';
import { Grain } from './Primitives.jsx';
import { WORK, JOURNAL, SERVICES, QUOTES, PRESS } from './data.js';

// ── Logo SVG (dark on chartreuse / dark on ink) ───────────────────────────────
const HumLogoB = ({ height = 40, fill = '#252926' }) => (
  <svg viewBox="0 0 668.45 430.29" style={{ height, width: 'auto', display: 'block' }}>
    <defs><style>{`.hum-b { fill: ${fill}; }`}</style></defs>
    <g>
      <path className="hum-b" d="M358.43,272.46v-69.1c0-54.89,25.47-80.8,63.67-80.8s63.23,25.91,63.23,80.8v69.1h28.1v-69.1c0-54.89,25.47-80.8,63.67-80.8s63.23,25.91,63.23,80.8v69.1h28.1v-69.1c0-73.77-38.2-107.59-91.34-107.59-35.13,0-65.43,16.69-77.73,52.26-12.29-35.57-42.59-52.26-77.28-52.26-53.57,0-91.78,33.81-91.78,107.59v.44h0v68.66h28.11Z"/>
      <path className="hum-b" d="M330.29,323.41c-.25,54.39-27.82,80.09-68.48,80.09s-68.24-25.7-68.48-80.09h-28.11c.26,73.27,40.57,106.87,96.59,106.87s96.33-33.6,96.6-106.87h-28.11Z"/>
      <path className="hum-b" d="M28.1,272.46v-82.76c0-52.69,27.66-78.6,68.5-78.6s68.5,25.91,68.5,80.8v80.57h28.2v-68.66h-.09v-11.9c0-73.77-40.4-107.59-96.61-107.59-29.42,0-51.82,8.78-68.5,36.01V0H0v272.46h28.1Z"/>
      <path className="hum-b" d="M.68,296.99c0-5.93,4.69-10.55,10.61-10.55,4.89,0,8.93,3.15,10.2,7.58h-4.07c-1.06-2.3-3.36-3.83-6.13-3.83-3.83,0-6.78,2.98-6.78,6.81s2.95,6.81,6.78,6.81c2.68,0,4.92-1.47,6.04-3.66h4.1c-1.33,4.33-5.31,7.4-10.14,7.4-5.93,0-10.61-4.63-10.61-10.55"/>
      <path className="hum-b" d="M72.64,286.67h6.66c3.66,0,6.63,2.74,6.63,6.4s-2.51,5.72-4.54,6.28l4.07,7.96h-4.07l-3.66-7.58h-1.27v7.58h-3.83v-20.64ZM79.3,296.31c1.77,0,2.8-1.47,2.8-3.24s-1.03-2.98-2.8-2.98h-2.83v6.22h2.83Z"/>
      <polygon className="hum-b" points="140.92 290.42 140.92 294.63 148.11 294.63 148.11 298.38 140.92 298.38 140.92 303.57 149.23 303.57 149.23 307.31 137.08 307.31 137.08 286.67 149.23 286.67 149.23 290.42 140.92 290.42"/>
      <path className="hum-b" d="M212.79,302.83h-7.78l-1.59,4.48h-3.92l7.49-20.64h3.83l7.49,20.64h-3.92l-1.59-4.48ZM211.52,299.23l-2.62-7.37-2.62,7.37h5.25Z"/>
      <polygon className="hum-b" points="279.03 290.42 273.72 290.42 273.72 307.31 269.89 307.31 269.89 290.42 264.58 290.42 264.58 286.67 279.03 286.67 279.03 290.42"/>
      <rect className="hum-b" x="329.73" y="286.67" width="3.83" height="20.64"/>
      <polygon className="hum-b" points="402.78 286.67 395.29 307.31 391.46 307.31 383.97 286.67 388.19 286.67 393.38 301.5 398.57 286.67 402.78 286.67"/>
      <polygon className="hum-b" points="457.02 290.42 457.02 294.63 464.22 294.63 464.22 298.38 457.02 298.38 457.02 303.57 465.33 303.57 465.33 307.31 453.19 307.31 453.19 286.67 465.33 286.67 465.33 290.42 457.02 290.42"/>
      <path className="hum-b" d="M573.97,296.99c0-5.93,4.69-10.55,10.61-10.55,4.89,0,8.93,3.15,10.2,7.58h-4.07c-1.06-2.3-3.36-3.83-6.13-3.83-3.83,0-6.78,2.98-6.78,6.81s2.95,6.81,6.78,6.81c2.68,0,4.92-1.47,6.04-3.66h4.1c-1.33,4.33-5.31,7.4-10.14,7.4-5.93,0-10.61-4.63-10.61-10.55"/>
      <path className="hum-b" d="M645.78,296.99c0-5.93,4.69-10.55,10.61-10.55s10.61,4.63,10.61,10.55-4.69,10.55-10.61,10.55-10.61-4.63-10.61-10.55M663.17,296.99c0-3.83-2.95-6.81-6.78-6.81s-6.78,2.98-6.78,6.81,2.95,6.81,6.78,6.81,6.78-2.98,6.78-6.81"/>
    </g>
  </svg>
);

const pillBtn = (accent, ink, filled) => ({
  fontFamily: "'Alternate Gothic No3', sans-serif",
  fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase',
  padding: '14px 28px', borderRadius: 999, cursor: 'pointer',
  background: filled ? accent : 'transparent',
  color: filled ? ink : accent,
  border: `1px solid ${accent}`, fontWeight: 400,
});

// ── Brutalist animation styles ─────────────────────────────────────────────────
const BrutalistStyles = ({ t }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'brutalist-styles';
    style.textContent = `
      @keyframes brutalistBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-${(t.cardHoverYOffset || 8) * 2}px); } }
      @keyframes brutalistSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes brutalistFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-24px); } }
      @keyframes brutalistShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
      @keyframes brutalistGlitch { 0%, 100% { clip-path: inset(0); } 20% { clip-path: inset(40% 0 61% 0); } 40% { clip-path: inset(92% 0 1% 0); } 60% { clip-path: inset(43% 0 1% 0); } 80% { clip-path: inset(25% 0 58% 0); } }
      .brutalist-bounce { animation: brutalistBounce 1.6s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }
      .brutalist-spin { animation: brutalistSpin 4s linear infinite; }
      .brutalist-float { animation: brutalistFloat 3.2s ease-in-out infinite; }
      .brutalist-shake { animation: brutalistShake 0.4s ease-in-out infinite; }
      .brutalist-glitch { animation: brutalistGlitch 0.8s steps(4, end) infinite; }
    `;
    document.head.appendChild(style);
    return () => { const el = document.getElementById('brutalist-styles'); if (el) el.remove(); };
  }, [t.cardHoverYOffset]);
  return null;
};

const getAnimClass = (t) => {
  if (t?.enableBounce) return 'brutalist-bounce';
  if (t?.enableSpin)   return 'brutalist-spin';
  if (t?.enableFloat)  return 'brutalist-float';
  if (t?.enableShake)  return 'brutalist-shake';
  if (t?.enableGlitch) return 'brutalist-glitch';
  return '';
};

// ── Nav ────────────────────────────────────────────────────────────────────────
const NavB = ({ t, page, setPage, accent, ink, paper }) => {
  const links = [['work','Work'],['studio','Studio'],['journal','Journal'],['contact','Contact']];
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: ink, padding: '20px 32px', borderBottom: `2px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ cursor: 'pointer' }} onClick={() => setPage('home')}>
        <HumLogoB height={40} fill={accent} />
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {links.map(([k, label]) => (
          <a key={k} onClick={() => setPage(k)} style={{
            fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase',
            cursor: 'pointer', padding: '8px 18px', borderRadius: 999,
            color: page === k ? ink : accent,
            background: page === k ? accent : 'transparent',
            border: `1px solid ${accent}`, transition: 'all 200ms',
          }}>{label}</a>
        ))}
        <button onClick={() => setPage('contact')} style={{ marginLeft: 12, fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '12px 22px', borderRadius: 999, background: accent, color: ink, border: 'none', cursor: 'pointer' }}>Start a Project →</button>
      </div>
    </nav>
  );
};

// ── Hero ──────────────────────────────────────────────────────────────────────
const HeroB = ({ t, setPage, accent, ink, paper }) => (
  <section style={{ padding: '40px 32px 60px', position: 'relative' }}>
    <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 'clamp(140px, 28vw, 480px)', lineHeight: 0.82, letterSpacing: '-0.02em', color: accent, fontWeight: 400, textTransform: 'uppercase', textAlign: 'center', margin: '20px 0 0' }}>
      HUM<span style={{ color: paper }}>.</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
      <div style={{ background: accent, color: ink, padding: '14px 48px', borderRadius: 999, fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 32, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        CREATIVE&nbsp;CO
      </div>
    </div>
    <div style={{ textAlign: 'center', marginTop: 32, maxWidth: 880, marginLeft: 'auto', marginRight: 'auto', fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 16, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent }}>
      24 EXACTING ENGAGEMENTS · ONE QUIET STUDIO · FULL CREATIVE LICENCE INCLUDED.
    </div>
    <div style={{ maxWidth: 1280, margin: '80px auto 0', padding: '0 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, borderTop: `1px solid ${accent}40`, paddingTop: 32 }}>
        <h1 style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 200, fontSize: 'clamp(44px, 5.4vw, 88px)', lineHeight: 1.0, letterSpacing: '-0.02em', color: accent, margin: 0 }}>
          A studio for brands that would rather be <em style={{ fontWeight: 300, fontStyle: 'italic', color: paper }}>felt</em> than shouted.
        </h1>
        <div>
          <p style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 17, lineHeight: 1.6, color: paper, opacity: 0.8, maxWidth: 460 }}>
            We&rsquo;re Hum — a small creative practice helping founders, operators, and directors build brands with a quiet kind of confidence. We work slowly, on purpose. We say no a lot.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
            <button onClick={() => setPage('contact')} style={pillBtn(accent, ink, true)}>Start a Project →</button>
            <button onClick={() => setPage('work')} style={pillBtn(accent, ink, false)}>Selected Work</button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── Ticker ─────────────────────────────────────────────────────────────────────
const TickerB = ({ t, accent, ink }) => (
  <div style={{ background: accent, color: ink, padding: '24px 0', overflow: 'hidden', borderTop: `2px solid ${ink}`, borderBottom: `2px solid ${ink}` }}>
    <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', gap: '0.6em', animation: `marquee ${t.tickerSpeed}s linear infinite` }}>
      {[...Array(8)].flatMap((_, i) => ['LISTENING', 'NAMING', 'IDENTITY', 'PACKAGING', 'EDITORIAL', 'DIRECTION'].map((w, j) => (
        <span key={`${i}-${j}`} style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 64, letterSpacing: '-0.01em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.4em' }}>
          {w}<span style={{ fontSize: 32 }}>★</span>
        </span>
      )))}
    </div>
  </div>
);

// ── Card ───────────────────────────────────────────────────────────────────────
const Card = ({ style, bg, accent, item, setPage, setCaseId, darkText, children, t }) => (
  <article
    className={getAnimClass(t)}
    onClick={() => { setCaseId(item.id); setPage('case'); }}
    style={{ ...style, background: bg, padding: 28, position: 'relative', cursor: 'pointer', overflow: 'hidden', transition: 'all 220ms cubic-bezier(0.22,0.61,0.36,1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    onMouseEnter={e => { e.currentTarget.style.transform = `translateY(${-(t?.cardHoverYOffset || 4)}px) scale(${t?.cardHoverScale || 1.02}) rotate(${t?.cardRotationOnHover || 0}deg)`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1) rotate(0deg)'; }}
  >
    <Grain opacity={0.25} blend={darkText ? 'multiply' : 'screen'} />
    <div style={{ position: 'relative' }}>{children}</div>
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 24, paddingTop: 12, borderTop: `1px solid ${darkText ? '#25292640' : '#bed23040'}`, fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: darkText ? '#252926' : accent }}>
      <span>Case {item.num} · {item.kind}</span>
      <span>{item.year}</span>
    </div>
  </article>
);

// ── Specimen Grid ──────────────────────────────────────────────────────────────
const SpecimenGridB = ({ t, accent, ink, paper, setPage, setCaseId }) => {
  const cards = [
    { ...WORK[0], specimen: 'MEADOW', layout: 'huge' },
    { ...WORK[1], specimen: 'NORTH', layout: 'list' },
    { ...WORK[2], specimen: 'Hudson', layout: 'serif' },
    { ...WORK[3], specimen: 'FLORIN', layout: 'condensed' },
    { ...WORK[4], specimen: 'B&Bee', layout: 'script' },
  ];
  return (
    <section style={{ padding: '80px 32px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32, borderTop: `1px solid ${accent}40`, paddingTop: 16 }}>
        <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent }}>▬ Selected Engagements · The Specimen Grid</div>
        <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: paper, opacity: 0.6 }}>5 of 24 visible</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 8 }}>
        <Card style={{ gridColumn: 'span 6', aspectRatio: '1/1' }} bg={ink} accent={accent} item={cards[0]} setPage={setPage} setCaseId={setCaseId} t={t}>
          <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 'clamp(80px, 11vw, 200px)', color: accent, fontWeight: 400, lineHeight: 0.92, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>MEADOW<br />& OAK</div>
        </Card>
        <Card style={{ gridColumn: 'span 6', aspectRatio: '1/1' }} bg={ink} accent={accent} item={cards[1]} setPage={setPage} setCaseId={setCaseId} t={t}>
          <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, opacity: 0.6, marginBottom: 18 }}>INTRODUCING</div>
          <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 'clamp(38px, 4.6vw, 76px)', color: accent, lineHeight: 1.0, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>PORTLAND ·<br />BROOKLYN ·<br />OJAI · MARFA<br />SONOMA · NYC<br />HUDSON ·</div>
        </Card>
        <Card style={{ gridColumn: 'span 4', aspectRatio: '4/5' }} bg={accent} accent={ink} item={cards[2]} setPage={setPage} setCaseId={setCaseId} darkText t={t}>
          <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase', color: ink, opacity: 0.7, marginBottom: 12 }}>INTRODUCING</div>
          <div style={{ fontFamily: "'Ivy Presto Display', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(60px, 8vw, 132px)', color: ink, lineHeight: 0.95, letterSpacing: '-0.02em' }}>Hudson<br />Press</div>
          <div style={{ fontFamily: "'Ivy Presto Text', serif", fontStyle: 'italic', fontSize: 14, color: ink, marginTop: 24 }}>A Hand drawn Serif Typeface<br />by Hum Creative Co.</div>
        </Card>
        <Card style={{ gridColumn: 'span 4', aspectRatio: '4/5' }} bg={ink} accent={accent} item={cards[3]} setPage={setPage} setCaseId={setCaseId} t={t}>
          <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 'clamp(80px, 10vw, 180px)', color: accent, lineHeight: 0.88, letterSpacing: '-0.02em', textTransform: 'uppercase', fontWeight: 400 }}>FLOR<br />IN</div>
          <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, opacity: 0.6, marginTop: 16 }}>A DISPLAY HOTEL · MARFA TX</div>
        </Card>
        <Card style={{ gridColumn: 'span 4', aspectRatio: '4/5' }} bg={ink} accent={accent} item={cards[4]} setPage={setPage} setCaseId={setCaseId} t={t}>
          <div style={{ fontFamily: "'Michigan Signature', cursive", fontSize: 'clamp(80px, 11vw, 200px)', color: accent, lineHeight: 0.95 }}>Bramble<br />&amp; Bee</div>
          <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, opacity: 0.7, marginTop: 18 }}>A handwritten apothecary</div>
        </Card>
        <Card style={{ gridColumn: 'span 4', aspectRatio: '1/1' }} bg={accent} accent={ink} item={cards[0]} setPage={setPage} setCaseId={setCaseId} darkText t={t}>
          <div style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(48px, 6vw, 100px)', color: ink, lineHeight: 0.92, letterSpacing: '-0.02em' }}>Brand<br />strategy<br />is our<br />practice</div>
        </Card>
        <Card style={{ gridColumn: 'span 8', aspectRatio: '21/9' }} bg={ink} accent={accent} item={cards[1]} setPage={setPage} setCaseId={setCaseId} t={t}>
          <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 'clamp(120px, 16vw, 320px)', color: accent, lineHeight: 0.88, letterSpacing: '-0.03em', textTransform: 'uppercase', fontWeight: 400 }}>QUIETLY,<br />LOUDLY.</div>
        </Card>
      </div>
      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => setPage('work')} style={pillBtn(accent, ink, true)}>ALL WORK (24) →</button>
      </div>
    </section>
  );
};

// ── Manifesto ─────────────────────────────────────────────────────────────────
const ManifestoB = ({ t, accent, ink, paper }) => (
  <section style={{ padding: '120px 32px', background: accent, color: ink, position: 'relative', overflow: 'hidden' }}>
    <Grain opacity={0.3} blend="multiply" />
    <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 14, letterSpacing: '0.32em', textTransform: 'uppercase', color: ink, opacity: 0.7 }}>★ THE MANIFESTO ★ READ ALOUD ★</div>
      <h2 style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 'clamp(80px, 14vw, 280px)', lineHeight: 0.82, letterSpacing: '-0.025em', textTransform: 'uppercase', fontWeight: 400, color: ink, margin: '32px 0' }}>
        WORK<br />SLOWLY<br /><em style={{ fontFamily: "'Ivy Presto Display', serif", fontStyle: 'italic', fontWeight: 200 }}>on purpose.</em>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 60, textAlign: 'left' }}>
        {[
          ['I.', 'LISTEN FIRST', 'Read fifteen years of reviews. Sit in the tasting room. Take notes by hand.'],
          ['II.', 'QUESTION THE BRIEF', 'Make it better than they wrote it. The brief is never the brief.'],
          ['III.', 'SHIP. THEN LEAVE IT.', 'Redesign once. Maybe twice. Then leave it alone, on purpose.'],
        ].map(([n, h, body]) => (
          <div key={n}>
            <div style={{ fontFamily: "'Ivy Presto Display', serif", fontStyle: 'italic', fontWeight: 200, fontSize: 80, lineHeight: 1, color: ink }}>{n}</div>
            <h3 style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 22, letterSpacing: '0.18em', textTransform: 'uppercase', color: ink, margin: '16px 0 8px' }}>{h}</h3>
            <p style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 16, lineHeight: 1.55, color: ink, opacity: 0.8 }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Services ──────────────────────────────────────────────────────────────────
const ServicesB = ({ t, accent, ink, paper }) => (
  <section style={{ padding: '100px 32px', background: ink, color: accent, position: 'relative' }}>
    <div style={{ borderTop: `1px solid ${accent}40`, paddingTop: 16, marginBottom: 48, display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent }}>▬ FIVE THINGS WE DO</span>
      <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, opacity: 0.6 }}>&amp; A FEW WE DON&apos;T</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
      {SERVICES.map(([name, desc], i) => (
        <div key={name} style={{ background: ink, border: `1px solid ${accent}`, padding: '32px 22px', minHeight: 360, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 220ms', color: accent }}
          onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = ink; }}
          onMouseLeave={e => { e.currentTarget.style.background = ink; e.currentTarget.style.color = accent; }}>
          <div>
            <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 96, lineHeight: 1, fontWeight: 400, letterSpacing: '-0.04em' }}>{String(i+1).padStart(2,'0')}</div>
            <h3 style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 22, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 400, margin: '40px 0 12px' }}>{name}</h3>
            <p style={{ fontFamily: "'Ivy Presto Text', serif", fontStyle: 'italic', fontSize: 14, lineHeight: 1.55, opacity: 0.85 }}>{desc}</p>
          </div>
          <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.6 }}>See engagements →</div>
        </div>
      ))}
    </div>
  </section>
);

// ── Quotes ─────────────────────────────────────────────────────────────────────
const QuotesB = ({ t, accent, ink, paper }) => (
  <section style={{ padding: '100px 32px', background: ink, position: 'relative' }}>
    <div style={{ borderTop: `1px solid ${accent}40`, paddingTop: 16, marginBottom: 48 }}>
      <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent }}>▬ SAID ABOUT US · BY PEOPLE WE LIKE</span>
    </div>
    {QUOTES.map((q, i) => (
      <figure key={i} style={{ margin: 0, padding: '40px 0', borderTop: `1px solid ${accent}30`, display: 'grid', gridTemplateColumns: '120px 1fr 240px', gap: 40, alignItems: 'baseline' }}>
        <span style={{ fontFamily: "'Ivy Presto Display', serif", fontStyle: 'italic', fontWeight: 200, fontSize: 96, lineHeight: 0.8, color: accent }}>&ldquo;{String(i+1).padStart(2,'0')}</span>
        <blockquote style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 200, fontSize: 'clamp(28px, 3.4vw, 56px)', lineHeight: 1.15, letterSpacing: '-0.015em', color: accent, margin: 0 }}>{q.q}</blockquote>
        <figcaption style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, opacity: 0.7, textAlign: 'right' }}>{q.who}<br /><span style={{ opacity: 0.6 }}>{q.role}</span></figcaption>
      </figure>
    ))}
    <div style={{ marginTop: 60, paddingTop: 24, borderTop: `1px solid ${accent}40`, overflow: 'hidden' }}>
      <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', gap: '1em', animation: `marquee ${t.tickerSpeed * 1.4}s linear infinite` }}>
        {[...PRESS, ...PRESS, ...PRESS].map((p, i) => (
          <span key={i} style={{ fontFamily: "'Ivy Presto Display', serif", fontStyle: 'italic', fontWeight: 200, fontSize: 56, color: accent, opacity: 0.9 }}>
            {p}<span style={{ color: paper, fontStyle: 'normal', margin: '0 0.4em' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  </section>
);

// ── Journal preview ────────────────────────────────────────────────────────────
const JournalB = ({ t, accent, ink, paper, setPage }) => (
  <section style={{ padding: '100px 32px', background: ink, position: 'relative' }}>
    <div style={{ borderTop: `1px solid ${accent}40`, paddingTop: 16, marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent }}>▬ THE JOURNAL · LATEST ESSAYS</span>
      <button onClick={() => setPage('journal')} style={pillBtn(accent, ink, false)}>All Essays →</button>
    </div>
    <h2 style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 'clamp(64px, 10vw, 160px)', lineHeight: 0.88, letterSpacing: '-0.02em', textTransform: 'uppercase', fontWeight: 400, color: accent, margin: '0 0 60px' }}>THINKING<br />OUT LOUD.</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
      {JOURNAL.slice(0,3).map((entry, i) => (
        <article key={entry.id} style={{ background: i === 1 ? accent : ink, color: i === 1 ? ink : accent, border: `1px solid ${accent}`, padding: '32px 28px', minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
          <Grain opacity={0.2} blend={i === 1 ? 'multiply' : 'screen'} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.7 }}>{entry.issue} · {entry.read}</div>
            <h3 style={{ fontFamily: i === 1 ? "'Alternate Gothic No3', sans-serif" : "'Ivy Presto Display', serif", fontWeight: i === 1 ? 400 : 300, fontStyle: i === 1 ? 'normal' : 'italic', fontSize: i === 1 ? 36 : 32, lineHeight: 1.05, letterSpacing: '-0.015em', textTransform: i === 1 ? 'uppercase' : 'none', margin: '20px 0 16px' }}>{entry.title}</h3>
            <p style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 15, lineHeight: 1.55, opacity: 0.8 }}>{entry.excerpt}</p>
          </div>
          <div style={{ position: 'relative', marginTop: 24, paddingTop: 14, borderTop: `1px solid ${i === 1 ? '#25292640' : '#bed23040'}`, fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
            <span>{entry.date}</span><span>READ →</span>
          </div>
        </article>
      ))}
    </div>
  </section>
);

// ── CTA ───────────────────────────────────────────────────────────────────────
const CTAb = ({ t, accent, ink, paper, setPage }) => (
  <section style={{ padding: '120px 32px', background: ink, textAlign: 'center', position: 'relative' }}>
    <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 14, letterSpacing: '0.32em', textTransform: 'uppercase', color: accent, opacity: 0.7 }}>★ NOW BOOKING · Q4 MMXXVI ★ TWO SPOTS ★</div>
    <h2 style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 'clamp(96px, 18vw, 360px)', lineHeight: 0.85, letterSpacing: '-0.03em', textTransform: 'uppercase', fontWeight: 400, color: accent, margin: '32px 0' }}>
      START<br />SOMETHING<br /><em style={{ fontFamily: "'Ivy Presto Display', serif", fontStyle: 'italic', fontWeight: 200, color: paper }}>quiet.</em>
    </h2>
    <button onClick={() => setPage('contact')} style={{ ...pillBtn(accent, ink, true), fontSize: 18, padding: '20px 48px' }}>Tell us the whole thing →</button>
  </section>
);

// ── Work page ─────────────────────────────────────────────────────────────────
const WorkAllB = ({ t, accent, ink, paper, setCaseId, setPage }) => (
  <section style={{ padding: '40px 32px 100px' }}>
    <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, opacity: 0.7 }}>▬ ALL ENGAGEMENTS · MMXVIII–MMXXVI</div>
    <h1 style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 'clamp(80px, 12vw, 200px)', lineHeight: 0.88, textTransform: 'uppercase', color: accent, margin: '20px 0 60px', fontWeight: 400, letterSpacing: '-0.02em' }}>ALL WORK<span style={{ color: paper }}>.</span></h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
      {[...WORK, ...WORK].map((item, idx) => (
        <article key={idx}
          className={getAnimClass(t)}
          onClick={() => { setCaseId(item.id); setPage('case'); }}
          style={{ aspectRatio: '4/5', background: idx % 3 === 1 ? accent : ink, color: idx % 3 === 1 ? ink : accent, border: `1px solid ${accent}`, padding: 24, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', transition: 'all 220ms cubic-bezier(0.22,0.61,0.36,1)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = `translateY(${-(t?.cardHoverYOffset || 4)}px) scale(${t?.cardHoverScale || 1.02}) rotate(${t?.cardRotationOnHover || 0}deg)`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1) rotate(0deg)'; }}>
          <Grain opacity={0.2} blend={idx % 3 === 1 ? 'multiply' : 'screen'} />
          <div style={{ position: 'relative', fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' }}>CASE {item.num} · {item.kind}</div>
          <div style={{ position: 'relative', fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 'clamp(40px, 5vw, 80px)', lineHeight: 0.92, textTransform: 'uppercase', fontWeight: 400, letterSpacing: '-0.02em' }}>{item.title}</div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            <span>{item.loc}</span><span>{item.year}</span>
          </div>
        </article>
      ))}
    </div>
  </section>
);

// ── Studio page ────────────────────────────────────────────────────────────────
const StudioB = ({ t, accent, ink, paper }) => (
  <section style={{ padding: '40px 32px 100px' }}>
    <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, opacity: 0.7 }}>▬ THE STUDIO · THREE PEOPLE · ONE GARDEN</div>
    <h1 style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 'clamp(80px, 14vw, 240px)', lineHeight: 0.88, textTransform: 'uppercase', color: accent, margin: '20px 0 60px', fontWeight: 400, letterSpacing: '-0.025em' }}>
      A SMALL<br /><em style={{ fontFamily: "'Ivy Presto Display', serif", fontStyle: 'italic', fontWeight: 200, color: paper }}>practice,</em><br />QUIETLY RUN.
    </h1>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 80, maxWidth: 1100 }}>
      <p style={{ fontFamily: "'Ivy Presto Headline', serif", fontWeight: 300, fontSize: 24, lineHeight: 1.5, color: accent }}>
        Hum is three people in a back-garden studio in Ojai. We take on four or five engagements a year and say no to most of what comes through the door. We like it that way.
      </p>
      <div style={{ borderLeft: `1px solid ${accent}40`, paddingLeft: 24 }}>
        <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, opacity: 0.7 }}>STUDIO HOURS</div>
        <p style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 15, color: accent, opacity: 0.8, lineHeight: 1.6, marginTop: 12 }}>Mon–Thu, 9–5. Fridays we walk. We don&rsquo;t check email after six. We don&rsquo;t Slack. We will, however, pick up the phone.</p>
      </div>
    </div>
  </section>
);

// ── Journal page ───────────────────────────────────────────────────────────────
const JournalAllB = ({ t, accent, ink, paper }) => (
  <section style={{ padding: '40px 32px 100px' }}>
    <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, opacity: 0.7 }}>▬ THE JOURNAL · ALL ESSAYS</div>
    <h1 style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 'clamp(80px, 14vw, 240px)', lineHeight: 0.88, textTransform: 'uppercase', color: accent, margin: '20px 0 60px', fontWeight: 400, letterSpacing: '-0.025em' }}>THINKING<br />OUT LOUD.</h1>
    {JOURNAL.map(entry => (
      <article key={entry.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 200px', gap: 40, padding: '32px 0', borderTop: `1px solid ${accent}30`, alignItems: 'baseline', cursor: 'pointer', color: accent }}>
        <span style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 200, fontStyle: 'italic', fontSize: 32 }}>{entry.issue}</span>
        <div>
          <h3 style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 32, textTransform: 'uppercase', letterSpacing: '-0.01em', fontWeight: 400, lineHeight: 1.05, margin: 0 }}>{entry.title}</h3>
          <p style={{ fontFamily: "'Ivy Presto Text', serif", fontStyle: 'italic', fontSize: 16, opacity: 0.8, marginTop: 8 }}>{entry.excerpt}</p>
        </div>
        <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.7, textAlign: 'right' }}>{entry.date} · {entry.read}</span>
      </article>
    ))}
  </section>
);

// ── Contact page ───────────────────────────────────────────────────────────────
const ContactB = ({ t, accent, ink, paper }) => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', project: '', budget: '', tell: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'contact', ...form }).toString(),
      });
    } catch (_) {}
    setSent(true);
  };

  return (
    <section style={{ padding: '40px 32px 100px', minHeight: 700 }}>
      <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, opacity: 0.7 }}>▬ START A PROJECT</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, marginTop: 40, maxWidth: 1300 }}>
        <div>
          <h1 style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 'clamp(80px, 12vw, 200px)', lineHeight: 0.88, textTransform: 'uppercase', color: accent, margin: 0, fontWeight: 400, letterSpacing: '-0.025em' }}>
            TELL US<br />THE<br /><em style={{ fontFamily: "'Ivy Presto Display', serif", fontStyle: 'italic', fontWeight: 200, color: paper }}>whole</em><br />THING.
          </h1>
          <p style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 17, lineHeight: 1.6, color: accent, opacity: 0.8, marginTop: 32, maxWidth: 380 }}>
            We read every message personally. We take on four or five engagements a year. Tell us what you&rsquo;re making, why you&rsquo;re making it, and what &ldquo;done&rdquo; looks like.
          </p>
          <p style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 15, color: accent, opacity: 0.7, marginTop: 24 }}>
            jared@humcreative.co
          </p>
        </div>
        {sent ? (
          <div style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 200, fontSize: 48, lineHeight: 1.1, color: accent }}>
            Thank you. We&rsquo;ll be in touch within <em style={{ fontStyle: 'italic', color: paper }}>two business days</em>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <input type="hidden" name="form-name" value="contact" />
            {[
              ['name', 'YOUR NAME', 'Margot Ellery', false],
              ['project', 'WHAT ARE YOU BUILDING?', 'A tasting room. A rebrand. A whisper.', false],
              ['budget', 'ROUGH BUDGET', 'Helpful but not required', false],
              ['tell', 'TELL US A LITTLE', "What's the brief?", true],
            ].map(([k, label, ph, ta]) => (
              <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', color: accent, opacity: 0.7 }}>{label}</span>
                {ta
                  ? <textarea rows={4} name={k} placeholder={ph} value={form[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
                      style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 18, color: accent, background: 'transparent', border: 'none', borderBottom: `1px solid ${accent}40`, padding: '10px 0', outline: 'none', resize: 'vertical' }} />
                  : <input name={k} placeholder={ph} value={form[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
                      style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 18, color: accent, background: 'transparent', border: 'none', borderBottom: `1px solid ${accent}40`, padding: '10px 0', outline: 'none' }} />
                }
              </label>
            ))}
            <div><button style={{ ...pillBtn(accent, ink, true), fontSize: 14, padding: '18px 36px' }}>SEND IT OVER →</button></div>
          </form>
        )}
      </div>
    </section>
  );
};

// ── Footer ─────────────────────────────────────────────────────────────────────
const FooterB = ({ t, accent, ink, paper, setPage }) => (
  <footer style={{ background: accent, color: ink, padding: '80px 32px 32px', position: 'relative', overflow: 'hidden' }}>
    <Grain opacity={0.3} blend="multiply" />
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: 48, cursor: 'pointer' }} onClick={() => setPage('home')}>
        <HumLogoB height="clamp(140px, 20vw, 400px)" fill={ink} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48, paddingBottom: 48, borderBottom: `1px solid ${ink}40` }}>
        <p style={{ fontFamily: "'Ivy Presto Text', serif", fontStyle: 'italic', fontSize: 18, lineHeight: 1.5, color: ink, maxWidth: 360 }}>
          A small creative practice. Ojai, California. Available for four or five projects a year. Currently booking Q4 MMXXVI.
        </p>
        {[
          ['Studio', ['About', 'Approach', 'Services', 'Hiring (no)']],
          ['Work', ['Selected', 'Archive', 'Recognitions', 'Press']],
          ['Elsewhere', ['Instagram', 'Are.na', 'Journal RSS', 'Newsletter']],
        ].map(([title, links]) => (
          <div key={title}>
            <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: ink, marginBottom: 20 }}>{title}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {links.map(l => <li key={l} style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 16, cursor: 'pointer' }}>{l}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ink, opacity: 0.7 }}>
        <span>© HUM CREATIVE CO. MMXXVI</span>
        <span>A QUIET STUDIO, LOUDLY RECOMMENDED.</span>
        <span>MADE BY HAND · OJAI · CA</span>
      </div>
    </div>
  </footer>
);

// ── Root component ─────────────────────────────────────────────────────────────
export default function VariantB({ t, page, setPage, setCaseId }) {
  const accent = t.accent || '#bed230';
  const ink = '#252926';
  const paper = '#f6f5ed';

  return (
    <div style={{ background: ink, color: accent, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <BrutalistStyles t={t} />
      {t.showGrain && <Grain opacity={t.grainOpacity / 100} blend="screen" heavy />}
      <NavB t={t} page={page} setPage={setPage} accent={accent} ink={ink} paper={paper} />
      {page === 'home' && <>
        <HeroB t={t} setPage={setPage} accent={accent} ink={ink} paper={paper} />
        {t.showTicker && <TickerB t={t} accent={accent} ink={ink} />}
        <SpecimenGridB t={t} accent={accent} ink={ink} paper={paper} setPage={setPage} setCaseId={setCaseId} />
        <ManifestoB t={t} accent={accent} ink={ink} paper={paper} />
        <ServicesB t={t} accent={accent} ink={ink} paper={paper} />
        <QuotesB t={t} accent={accent} ink={ink} paper={paper} />
        <JournalB t={t} accent={accent} ink={ink} paper={paper} setPage={setPage} />
        <CTAb t={t} accent={accent} ink={ink} paper={paper} setPage={setPage} />
      </>}
      {page === 'work' && <WorkAllB t={t} accent={accent} ink={ink} paper={paper} setCaseId={setCaseId} setPage={setPage} />}
      {page === 'studio' && <StudioB t={t} accent={accent} ink={ink} paper={paper} />}
      {page === 'journal' && <JournalAllB t={t} accent={accent} ink={ink} paper={paper} />}
      {page === 'contact' && <ContactB t={t} accent={accent} ink={ink} paper={paper} />}
      <FooterB t={t} accent={accent} ink={ink} paper={paper} setPage={setPage} />
    </div>
  );
}
