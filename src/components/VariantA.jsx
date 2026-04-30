import React, { useState } from 'react';
import { Eyebrow, Btn, Underline, Grain, FoundNote } from './Primitives.jsx';
import { WORK, JOURNAL, SERVICES, QUOTES, PRESS } from './data.js';

// ── Logo SVG ──────────────────────────────────────────────────────────────────
const HumLogo = ({ height = 48, light = false }) => (
  <svg viewBox="0 0 668.45 430.29" style={{ height, width: 'auto', display: 'block' }}>
    <defs><style>{`
      .hum-a1 { fill: ${light ? '#f6f5ed' : '#252926'}; }
      .hum-a2 { fill: #bed230; }
    `}</style></defs>
    <g>
      <path className="hum-a1" d="M358.43,272.46v-69.1c0-54.89,25.47-80.8,63.67-80.8s63.23,25.91,63.23,80.8v69.1h28.1v-69.1c0-54.89,25.47-80.8,63.67-80.8s63.23,25.91,63.23,80.8v69.1h28.1v-69.1c0-73.77-38.2-107.59-91.34-107.59-35.13,0-65.43,16.69-77.73,52.26-12.29-35.57-42.59-52.26-77.28-52.26-53.57,0-91.78,33.81-91.78,107.59v.44h0v68.66h28.11Z"/>
      <path className="hum-a2" d="M330.29,323.41c-.25,54.39-27.82,80.09-68.48,80.09s-68.24-25.7-68.48-80.09h-28.11c.26,73.27,40.57,106.87,96.59,106.87s96.33-33.6,96.6-106.87h-28.11Z"/>
      <path className="hum-a1" d="M28.1,272.46v-82.76c0-52.69,27.66-78.6,68.5-78.6s68.5,25.91,68.5,80.8v80.57h28.2v-68.66h-.09v-11.9c0-73.77-40.4-107.59-96.61-107.59-29.42,0-51.82,8.78-68.5,36.01V0H0v272.46h28.1Z"/>
      <path className="hum-a1" d="M.68,296.99c0-5.93,4.69-10.55,10.61-10.55,4.89,0,8.93,3.15,10.2,7.58h-4.07c-1.06-2.3-3.36-3.83-6.13-3.83-3.83,0-6.78,2.98-6.78,6.81s2.95,6.81,6.78,6.81c2.68,0,4.92-1.47,6.04-3.66h4.1c-1.33,4.33-5.31,7.4-10.14,7.4-5.93,0-10.61-4.63-10.61-10.55"/>
      <path className="hum-a1" d="M72.64,286.67h6.66c3.66,0,6.63,2.74,6.63,6.4s-2.51,5.72-4.54,6.28l4.07,7.96h-4.07l-3.66-7.58h-1.27v7.58h-3.83v-20.64ZM79.3,296.31c1.77,0,2.8-1.47,2.8-3.24s-1.03-2.98-2.8-2.98h-2.83v6.22h2.83Z"/>
      <polygon className="hum-a1" points="140.92 290.42 140.92 294.63 148.11 294.63 148.11 298.38 140.92 298.38 140.92 303.57 149.23 303.57 149.23 307.31 137.08 307.31 137.08 286.67 149.23 286.67 149.23 290.42 140.92 290.42"/>
      <path className="hum-a1" d="M212.79,302.83h-7.78l-1.59,4.48h-3.92l7.49-20.64h3.83l7.49,20.64h-3.92l-1.59-4.48ZM211.52,299.23l-2.62-7.37-2.62,7.37h5.25Z"/>
      <polygon className="hum-a1" points="279.03 290.42 273.72 290.42 273.72 307.31 269.89 307.31 269.89 290.42 264.58 290.42 264.58 286.67 279.03 286.67 279.03 290.42"/>
      <rect className="hum-a1" x="329.73" y="286.67" width="3.83" height="20.64"/>
      <polygon className="hum-a1" points="402.78 286.67 395.29 307.31 391.46 307.31 383.97 286.67 388.19 286.67 393.38 301.5 398.57 286.67 402.78 286.67"/>
      <polygon className="hum-a1" points="457.02 290.42 457.02 294.63 464.22 294.63 464.22 298.38 457.02 298.38 457.02 303.57 465.33 303.57 465.33 307.31 453.19 307.31 453.19 286.67 465.33 286.67 465.33 290.42 457.02 290.42"/>
      <path className="hum-a1" d="M573.97,296.99c0-5.93,4.69-10.55,10.61-10.55,4.89,0,8.93,3.15,10.2,7.58h-4.07c-1.06-2.3-3.36-3.83-6.13-3.83-3.83,0-6.78,2.98-6.78,6.81s2.95,6.81,6.78,6.81c2.68,0,4.92-1.47,6.04-3.66h4.1c-1.33,4.33-5.31,7.4-10.14,7.4-5.93,0-10.61-4.63-10.61-10.55"/>
      <path className="hum-a1" d="M645.78,296.99c0-5.93,4.69-10.55,10.61-10.55s10.61,4.63,10.61,10.55-4.69,10.55-10.61,10.55-10.61-4.63-10.61-10.55M663.17,296.99c0-3.83-2.95-6.81-6.78-6.81s-6.78,2.98-6.78,6.81,2.95,6.81,6.78,6.81,6.78-2.98,6.78-6.81"/>
    </g>
  </svg>
);

// ── Stat ──────────────────────────────────────────────────────────────────────
const Stat = ({ n, label, ink, accent }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, borderBottom: '1px dotted currentColor', paddingBottom: 6 }}>
    <span style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 300, fontSize: 32, color: ink, lineHeight: 1 }}>{n}</span>
    <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' }}>{label}</span>
  </div>
);

// ── Nav ───────────────────────────────────────────────────────────────────────
const NavA = ({ t, page, setPage, ink, paper, accent }) => {
  const links = [['work','Work'],['studio','Studio'],['journal','Journal'],['contact','Contact']];
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, background: paper, borderBottom: `1px solid ${ink}22` }}>
      <div style={{
        background: ink, color: paper, fontFamily: "'Alternate Gothic No3', sans-serif",
        fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
        padding: '8px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span><span style={{ color: accent }}>▬</span> Vol. VIII · Iss. 04 · Spring MMXXVI</span>
        <span style={{ display: 'flex', gap: 28 }}>
          <span>Ojai, CA · 67°F · Clear</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </span>
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px' }}>
        <HumLogo height={48} onClick={() => setPage('home')} style={{ cursor: 'pointer' }} />
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {links.map(([k, label], i) => (
            <a key={k} onClick={() => setPage(k)} style={{
              fontFamily: "'Alternate Gothic No3', sans-serif",
              fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase',
              cursor: 'pointer', color: ink,
              borderBottom: page === k ? `2px solid ${accent}` : '2px solid transparent',
              padding: '4px 0',
              display: 'inline-flex', gap: 6, alignItems: 'baseline',
            }}>
              <sup style={{ fontSize: 8, color: accent, fontWeight: 600 }}>{String(i+1).padStart(2,'0')}</sup>
              {label}
            </a>
          ))}
          <Btn variant="accent" size="sm" onClick={() => setPage('contact')}>Start a Project →</Btn>
        </div>
      </nav>
    </div>
  );
};

// ── Hero ──────────────────────────────────────────────────────────────────────
const HeroA = ({ t, setPage, ink, paper, slate, accent, rule }) => {
  const heroSize = t.heroScale;
  const fontSize = `clamp(${56*heroSize}px, ${9*heroSize}vw, ${156*heroSize}px)`;
  return (
    <section style={{ padding: '60px 32px 80px', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', left: 32, top: 60, width: 18,
        writingMode: 'vertical-rl', transform: 'rotate(180deg)',
        fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11,
        letterSpacing: '0.34em', textTransform: 'uppercase', color: slate,
      }}>Folio I · Hum.Co · MMXXVI · Issue Spring</div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        borderTop: `2px solid ${ink}`, paddingTop: 12, marginLeft: 80,
        fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11,
        letterSpacing: '0.22em', textTransform: 'uppercase', color: ink,
      }}>
        <span><span style={{ color: accent }}>●</span> No. 001 — The Studio</span>
        <span>For founders, operators, directors</span>
        <span>Read time · 4 min</span>
        <span>Ledger 2018–2026</span>
      </div>

      <div style={{ marginLeft: 80, marginTop: 40, position: 'relative' }}>
        <Eyebrow>Creative Consulting · Est. MMXVIII</Eyebrow>
        <h1 style={{
          fontFamily: "'Ivy Presto Display', serif", fontWeight: 200,
          fontSize, lineHeight: 0.92, letterSpacing: '-0.025em',
          margin: '24px 0 0', color: ink, position: 'relative',
        }}>
          A studio for<br />
          brands that<br />
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.15em', flexWrap: 'wrap' }}>
            would rather be{' '}
            <em style={{ fontWeight: 300, color: accent, fontStyle: 'italic' }}>felt</em>
          </span><br />
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.15em', flexWrap: 'wrap' }}>
            than{' '}
            <span style={{ position: 'relative' }}>
              <Underline color={accent} size={Math.max(8, heroSize*16)}>shouted</Underline>
              <span style={{
                position: 'absolute', right: -40, top: -10,
                fontFamily: "'Michigan Signature', cursive", fontSize: 32, color: ink, opacity: 0.7,
                transform: 'rotate(-8deg)',
              }}>(quietly)</span>
            </span>.
          </span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 60, marginTop: 56, alignItems: 'start' }}>
          <p style={{ fontFamily: "'Ivy Presto Headline', serif", fontWeight: 300, fontSize: 22, lineHeight: 1.5, color: slate, maxWidth: 580 }}>
            We&rsquo;re Hum — a small creative practice helping founders, operators,
            and directors build brands with a quiet kind of confidence.
            We work slowly. On purpose. We say no a lot.
          </p>
          <div style={{ borderLeft: `1px solid ${rule}`, paddingLeft: 18, fontFamily: "'Ivy Presto Text', serif", fontSize: 14, color: slate, lineHeight: 1.5 }}>
            <Eyebrow size={11}>What we do</Eyebrow>
            <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>— Brand strategy</li>
              <li>— Identity systems</li>
              <li>— Packaging & print</li>
              <li>— Editorial websites</li>
              <li>— Art direction</li>
            </ul>
          </div>
          <div style={{ borderLeft: `1px solid ${rule}`, paddingLeft: 18, fontFamily: "'Ivy Presto Text', serif", fontSize: 14, color: slate, lineHeight: 1.5 }}>
            <Eyebrow size={11}>By the numbers</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              <Stat n="24" label="Engagements" ink={ink} accent={accent} />
              <Stat n="08" label="Years quietly" ink={ink} accent={accent} />
              <Stat n="03" label="People in the studio" ink={ink} accent={accent} />
              <Stat n="∞" label="Cups of coffee" ink={ink} accent={accent} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 48, flexWrap: 'wrap', alignItems: 'center' }}>
          <Btn variant="primary" size="lg" onClick={() => setPage('contact')}>Start a Project →</Btn>
          <Btn variant="secondary" size="lg" onClick={() => setPage('work')}>See Selected Work</Btn>
          <span style={{ fontFamily: "'Michigan Signature', cursive", fontSize: 22, color: slate, marginLeft: 12 }}>or just say hi —</span>
        </div>
      </div>

      {t.showStamps && (
        <div style={{
          position: 'absolute', right: 60, top: 140, width: 220, height: 220,
          border: `2px solid ${accent}`, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'rotate(-12deg)', zIndex: 4,
        }}>
          <div style={{ position: 'absolute', inset: 8, border: `1px solid ${accent}`, borderRadius: '50%' }} />
          <div style={{ textAlign: 'center', fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, lineHeight: 1.3 }}>
            <div style={{ fontFamily: "'Ivy Presto Display', serif", fontSize: 56, lineHeight: 1, color: accent, fontWeight: 300, fontStyle: 'italic' }}>fully</div>
            <div style={{ fontFamily: "'Ivy Presto Display', serif", fontSize: 56, lineHeight: 1, color: accent, fontWeight: 300 }}>booked</div>
            <div style={{ marginTop: 6 }}>through Q3 · MMXXVI</div>
          </div>
        </div>
      )}
      {t.showNotes && (
        <FoundNote rotate={3} top={460} right={120} width={220} color={accent}>
          we said no to <br />40 briefs last year. <br />still standing.
        </FoundNote>
      )}
    </section>
  );
};

// ── Ticker ────────────────────────────────────────────────────────────────────
const TickerA = ({ t, ink, paper, accent }) => {
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `@keyframes feature-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
      .feature-listening { animation: feature-bounce 2.2s ease-in-out infinite; }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const features = [
    { title: 'LISTENING', subtitle: 'we hear you loud & clear', svg: '/assets/human4.svg', className: 'feature-listening' },
    { title: 'NAMING', subtitle: 'words that actually mean something', svg: '/assets/human2.svg', className: '' },
    { title: 'IDENTITY', subtitle: 'the visual language of you', svg: '/assets/human3.svg', className: '' },
  ];

  return (
    <div style={{ background: ink, overflow: 'hidden', padding: '80px 40px', borderTop: `1px solid ${accent}30`, borderBottom: `1px solid ${accent}30`, position: 'relative' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '80px', maxWidth: '1400px', margin: '0 auto' }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', textAlign: 'center' }}>
            <div className={f.className} style={{ width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.75 }}>
              <img src={f.svg} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'invert(1) saturate(0)' }} alt="" />
            </div>
            <div style={{ fontFamily: "'Ivy Presto Display', serif", fontSize: 52, fontWeight: 300, color: accent, letterSpacing: '-0.02em', lineHeight: 1.1, fontStyle: 'italic' }}>{f.title}</div>
            <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: 14, fontWeight: 400, color: accent, opacity: 0.65, letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.4, maxWidth: '240px' }}>{f.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Index (work ledger) ───────────────────────────────────────────────────────
const IndexA = ({ t, ink, paper, slate, accent, rule, setPage, setCaseId }) => (
  <section style={{ padding: '100px 32px 60px', position: 'relative' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: `2px solid ${ink}`, paddingTop: 16, marginBottom: 48 }}>
      <Eyebrow>The Index · Selected & Recent</Eyebrow>
      <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: slate }}>24 Total · 4 Visible</span>
    </div>
    <h2 style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 300, fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 1.0, letterSpacing: '-0.02em', margin: '0 0 60px', maxWidth: 1100 }}>
      Four projects we&rsquo;re <em style={{ fontWeight: 300, color: accent }}>still</em> thinking about<br />
      &mdash; <span style={{ fontFamily: "'Michigan Signature', cursive", fontSize: '0.6em', color: slate }}>and one we shouldn&rsquo;t be.</span>
    </h2>
    <div style={{ borderTop: `1px solid ${rule}` }}>
      {WORK.map((item, idx) => (
        <article key={item.id} onClick={() => { setCaseId(item.id); setPage('case'); }}
          style={{ display: 'grid', gridTemplateColumns: '80px 280px 1fr 200px 120px 24px', gap: 32, alignItems: 'center', padding: '24px 0', borderBottom: `1px solid ${rule}`, cursor: 'pointer', transition: 'all 220ms cubic-bezier(0.22,0.61,0.36,1)' }}
          onMouseEnter={e => { e.currentTarget.style.background = `${accent}15`; e.currentTarget.style.paddingLeft = '12px'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.paddingLeft = '0'; }}>
          <span style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 200, fontStyle: 'italic', fontSize: 56, lineHeight: 1, color: ink }}>{item.num}</span>
          <div style={{ aspectRatio: '4/3', background: item.grad, position: 'relative', overflow: 'hidden' }}>
            <Grain opacity={0.45} blend="multiply" />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 14, fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: paper }}>{item.kind}</div>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 300, fontSize: 44, lineHeight: 1.05, margin: 0, letterSpacing: '-0.02em' }}>{item.title}</h3>
            <p style={{ fontFamily: "'Ivy Presto Text', serif", fontStyle: 'italic', fontSize: 16, color: slate, margin: '6px 0 0' }}>{item.tag}</p>
          </div>
          <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: slate }}>{item.loc}</span>
          <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ink, textAlign: 'right' }}>{item.year}</span>
          <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 18, color: ink, textAlign: 'right' }}>→</span>
        </article>
      ))}
    </div>
    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
      <Btn variant="tertiary" onClick={() => setPage('work')}>All Work (24) →</Btn>
    </div>
  </section>
);

// ── Manifesto ─────────────────────────────────────────────────────────────────
const ManifestoA = ({ t, accent }) => {
  const lines = [['We','work','slowly'],['on','purpose.'],['We','say','no','a lot.'],['We','rewrite','until',"it's",'true.']];
  return (
    <section style={{ background: '#252926', color: '#f6f5ed', position: 'relative', overflow: 'hidden', padding: '120px 32px' }}>
      <Grain opacity={0.5} blend="screen" />
      <video autoPlay loop muted playsInline style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, pointerEvents: 'none' }} src="/assets/walkingman.mp4" />
      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(246,245,237,0.3)', paddingTop: 14, marginBottom: 48 }}>
          <Eyebrow inverse>Manifesto · Read aloud</Eyebrow>
          <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(246,245,237,0.6)' }}>012 / Recited Daily</span>
        </div>
        <div style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 200, fontSize: 'clamp(56px, 8vw, 132px)', lineHeight: 0.95, letterSpacing: '-0.025em' }}>
          {lines.map((line, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              {line.map((w, j) => (
                <span key={j} style={{
                  display: 'inline-block', marginRight: '0.2em',
                  color: (w === 'slowly' || w === 'no' || w === 'true.') ? accent : '#f6f5ed',
                  fontStyle: (w === 'slowly' || w === 'true.') ? 'italic' : 'normal',
                  fontWeight: (w === 'slowly' || w === 'no' || w === 'true.') ? 300 : 200,
                }}>{w}</span>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40, marginTop: 80, paddingTop: 32, borderTop: '1px solid rgba(246,245,237,0.18)' }}>
          {[
            ['I.', 'Listen first. Read fifteen years of reviews. Sit in the tasting room. Take notes by hand.'],
            ['II.', 'Make the brief better than they wrote it. Then question that one too. The brief is never the brief.'],
            ['III.', 'Ship it. Then redesign it. Then ship it again. Then leave it alone.'],
          ].map(([num, text]) => (
            <div key={num}>
              <div style={{ fontFamily: "'Ivy Presto Display', serif", fontStyle: 'italic', fontWeight: 200, fontSize: 80, lineHeight: 1, color: accent }}>{num}</div>
              <p style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 17, lineHeight: 1.55, color: 'rgba(246,245,237,0.78)', marginTop: 16 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Services ──────────────────────────────────────────────────────────────────
const ServicesA = ({ t, ink, paper, slate, accent, rule }) => (
  <section style={{ padding: '100px 32px', position: 'relative' }}>
    <div style={{ borderTop: `2px solid ${ink}`, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48 }}>
      <Eyebrow>Five Things We Do</Eyebrow>
      <span style={{ fontFamily: "'Michigan Signature', cursive", fontSize: 22, color: slate }}>— and one or two we don&rsquo;t.</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0 }}>
      {SERVICES.map(([name, desc], i) => (
        <div key={name} style={{
          padding: '24px 20px 32px',
          borderLeft: i === 0 ? `1px solid ${rule}` : 'none',
          borderRight: `1px solid ${rule}`, borderTop: `1px solid ${rule}`, borderBottom: `1px solid ${rule}`,
          minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          transition: 'background 220ms, color 220ms', cursor: 'pointer',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = ink; e.currentTarget.style.color = paper; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ink; }}>
          <div>
            <div style={{ fontFamily: "'Ivy Presto Display', serif", fontStyle: 'italic', fontWeight: 200, fontSize: 64, lineHeight: 1, color: accent }}>0{i+1}</div>
            <h3 style={{ fontFamily: "'Ivy Presto Headline', serif", fontWeight: 400, fontSize: 26, lineHeight: 1.15, margin: '40px 0 12px' }}>{name}</h3>
            <p style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 14, lineHeight: 1.55, opacity: 0.75 }}>{desc}</p>
          </div>
          <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.55, marginTop: 24 }}>See engagements →</div>
        </div>
      ))}
    </div>
  </section>
);

// ── Quotes ────────────────────────────────────────────────────────────────────
const QuotesA = ({ t, ink, paper, linen, slate, accent, rule }) => (
  <section style={{ padding: '100px 32px', background: linen, position: 'relative' }}>
    <div style={{ borderTop: `2px solid ${ink}`, paddingTop: 14, marginBottom: 48 }}>
      <Eyebrow>Said about us · By people we like</Eyebrow>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
      {QUOTES.map((q, i) => (
        <figure key={i} style={{ margin: 0, position: 'relative', padding: '28px 4px' }}>
          <div style={{ fontFamily: "'Ivy Presto Display', serif", fontStyle: 'italic', fontWeight: 200, fontSize: 120, lineHeight: 0.6, color: accent, position: 'absolute', top: -8, left: -8 }}>&ldquo;</div>
          <blockquote style={{ fontFamily: "'Ivy Presto Headline', serif", fontWeight: 300, fontSize: 22, lineHeight: 1.4, color: ink, margin: '0 0 24px', paddingLeft: 24 }}>{q.q}</blockquote>
          <figcaption style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ink, paddingLeft: 24, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 20, height: 2, background: accent }} />
            {q.who} · {q.role}
          </figcaption>
        </figure>
      ))}
    </div>
    <div style={{ marginTop: 80, paddingTop: 24, borderTop: `1px solid ${rule}` }}>
      <Eyebrow>As mentioned in</Eyebrow>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, marginTop: 18 }}>
        {PRESS.map(p => (
          <span key={p} style={{ fontFamily: "'Ivy Presto Display', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 28, color: slate, opacity: 0.85 }}>{p}</span>
        ))}
      </div>
    </div>
  </section>
);

// ── Journal preview ───────────────────────────────────────────────────────────
const JournalA = ({ t, ink, paper, linen, slate, accent, rule, setPage }) => (
  <section style={{ padding: '100px 32px', position: 'relative' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: `2px solid ${ink}`, paddingTop: 14, marginBottom: 48 }}>
      <Eyebrow>From the Journal · Long-form & otherwise</Eyebrow>
      <Btn variant="tertiary" onClick={() => setPage('journal')}>All essays →</Btn>
    </div>
    <h2 style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 300, fontSize: 'clamp(40px, 5vw, 76px)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 56px', maxWidth: 800 }}>
      Thinking <em style={{ fontWeight: 300 }}>out loud</em>, mostly about restraint.
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 32 }}>
      {JOURNAL.slice(0,3).map((entry, i) => (
        <article key={entry.id} style={{
          background: i === 0 ? '#252926' : paper, color: i === 0 ? paper : ink,
          padding: i === 0 ? '40px 36px' : '28px 30px 32px',
          border: i === 0 ? 'none' : `1px solid ${rule}`,
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
          minHeight: i === 0 ? 480 : 360,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          {i === 0 && <Grain opacity={0.4} blend="screen" />}
          <div style={{ position: 'relative' }}>
            <Eyebrow inverse={i===0}>{entry.issue} · {entry.read}</Eyebrow>
            <h3 style={{ fontFamily: i === 0 ? "'Ivy Presto Display', serif" : "'Ivy Presto Headline', serif", fontWeight: i === 0 ? 200 : 400, fontSize: i === 0 ? 56 : 24, lineHeight: 1.1, margin: '20px 0 16px', letterSpacing: '-0.015em' }}>{entry.title}</h3>
            <p style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: i === 0 ? 18 : 15, lineHeight: 1.55, opacity: i === 0 ? 0.85 : 0.7 }}>{entry.excerpt}</p>
          </div>
          <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 14, borderTop: `1px solid ${i === 0 ? 'rgba(246,245,237,0.2)' : rule}`, position: 'relative' }}>
            <span>{entry.date}</span>
            <span>Read essay →</span>
          </div>
        </article>
      ))}
    </div>
  </section>
);

// ── CTA ───────────────────────────────────────────────────────────────────────
const CTAa = ({ t, accent, setPage }) => (
  <section style={{ background: accent, padding: '120px 32px', position: 'relative', overflow: 'hidden' }}>
    <Grain opacity={0.35} blend="multiply" />
    <img src="/assets/motif-smile.svg" style={{ position: 'absolute', right: -40, bottom: -40, width: 320, opacity: 0.6, pointerEvents: 'none' }} alt="" />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '2px solid #252926', paddingTop: 14 }}>
      <Eyebrow>Booking · Q4 MMXXVI</Eyebrow>
      <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' }}>2 spots · Apply by July</span>
    </div>
    <h2 style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 200, fontSize: 'clamp(56px, 9vw, 168px)', lineHeight: 0.92, letterSpacing: '-0.025em', margin: '40px 0 0', color: '#252926', maxWidth: 1400 }}>
      Tell us the <em style={{ fontWeight: 300 }}>whole</em> thing.<br />
      We&rsquo;ll write back <em style={{ fontWeight: 300 }}>by Tuesday</em>.
    </h2>
    <div style={{ marginTop: 48, display: 'flex', gap: 16, alignItems: 'center' }}>
      <Btn variant="primary" size="lg" onClick={() => setPage('contact')}>Start the conversation →</Btn>
      <Btn variant="secondary" size="lg" onClick={() => setPage('studio')}>Read about the studio</Btn>
    </div>
  </section>
);

// ── Work page ─────────────────────────────────────────────────────────────────
const WorkAllA = ({ t, ink, paper, slate, accent, rule, setCaseId, setPage }) => (
  <section style={{ padding: '60px 32px 100px' }}>
    <Eyebrow>Selected & Archive — All Engagements MMXVIII–MMXXVI</Eyebrow>
    <h1 style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 200, fontSize: 'clamp(56px, 8vw, 128px)', lineHeight: 0.95, letterSpacing: '-0.025em', margin: '20px 0 60px' }}>
      All work, <em style={{ fontWeight: 300, color: accent }}>twenty-four</em> engagements.
    </h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
      {[...WORK, ...WORK].map((item, idx) => (
        <article key={idx} onClick={() => { setCaseId(item.id); setPage('case'); }} style={{ cursor: 'pointer', position: 'relative' }}>
          <div style={{ aspectRatio: '4/5', background: item.grad, position: 'relative', overflow: 'hidden' }}>
            <Grain opacity={0.45} blend="multiply" />
            <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', color: paper }}>Case {item.num}</div>
            <div style={{ position: 'absolute', bottom: 16, right: 16, fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', color: paper, opacity: 0.7 }}>{item.year}</div>
          </div>
          <div style={{ padding: '20px 4px 8px' }}>
            <h3 style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 300, fontSize: 26, margin: 0 }}>{item.title}</h3>
            <p style={{ fontFamily: "'Ivy Presto Text', serif", fontStyle: 'italic', fontSize: 14, color: slate, margin: '6px 0 0' }}>{item.tag}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

// ── Studio page ───────────────────────────────────────────────────────────────
const StudioA = ({ t, ink, paper, linen, slate, accent, rule }) => (
  <section style={{ padding: '60px 32px 100px' }}>
    <Eyebrow>The Studio · Three people, one back garden</Eyebrow>
    <h1 style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 200, fontSize: 'clamp(48px, 7vw, 112px)', lineHeight: 0.95, letterSpacing: '-0.025em', margin: '20px 0 60px' }}>
      A small <em style={{ fontWeight: 300, color: accent }}>practice</em>, quietly run.
    </h1>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 80, maxWidth: 1100 }}>
      <p style={{ fontFamily: "'Ivy Presto Headline', serif", fontWeight: 300, fontSize: 24, lineHeight: 1.5, color: slate }}>
        Hum is three people in a back-garden studio in Ojai. We take on four or five engagements a year and say no to most of what comes through the door. We like it that way.
      </p>
      <div style={{ borderLeft: `1px solid ${rule}`, paddingLeft: 24 }}>
        <Eyebrow size={11}>Studio Hours</Eyebrow>
        <p style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 15, color: slate, lineHeight: 1.6, marginTop: 12 }}>
          Mon–Thu, 9–5. Fridays we walk. We don&rsquo;t check email after six. We don&rsquo;t Slack. We will, however, pick up the phone.
        </p>
      </div>
    </div>
  </section>
);

// ── Journal page ──────────────────────────────────────────────────────────────
const JournalAllA = ({ t, ink, paper, linen, slate, accent, rule }) => (
  <section style={{ padding: '60px 32px 100px' }}>
    <Eyebrow>The Journal · All essays</Eyebrow>
    <h1 style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 200, fontSize: 'clamp(48px, 7vw, 112px)', lineHeight: 0.95, letterSpacing: '-0.025em', margin: '20px 0 60px' }}>
      Thinking <em style={{ fontWeight: 300, color: accent }}>out loud</em>.
    </h1>
    <div>
      {JOURNAL.map(entry => (
        <article key={entry.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 200px', gap: 40, padding: '32px 0', borderTop: `1px solid ${rule}`, alignItems: 'baseline', cursor: 'pointer' }}>
          <span style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 200, fontStyle: 'italic', fontSize: 32, color: ink }}>{entry.issue}</span>
          <div>
            <h3 style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 300, fontSize: 38, lineHeight: 1.1, margin: 0 }}>{entry.title}</h3>
            <p style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 16, color: slate, marginTop: 8 }}>{entry.excerpt}</p>
          </div>
          <span style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: slate, textAlign: 'right' }}>{entry.date} · {entry.read}</span>
        </article>
      ))}
    </div>
  </section>
);

// ── Contact page ──────────────────────────────────────────────────────────────
const ContactA = ({ t, ink, paper, linen, slate, accent, rule }) => {
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
    <section style={{ padding: '60px 32px 100px', minHeight: 700 }}>
      <Eyebrow>Start a Project · We read every message</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, marginTop: 40, maxWidth: 1300 }}>
        <div>
          <h1 style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 200, fontSize: 'clamp(48px, 7vw, 108px)', lineHeight: 0.95, letterSpacing: '-0.025em', margin: 0 }}>
            Tell us the<br /><em style={{ fontWeight: 300, color: accent }}>whole</em><br />thing.
          </h1>
          <p style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 17, lineHeight: 1.6, color: slate, marginTop: 32, maxWidth: 380 }}>
            We read every message personally. We take on four or five engagements a year. Tell us what you&rsquo;re making, why you&rsquo;re making it, and what &ldquo;done&rdquo; looks like.
          </p>
          <div style={{ marginTop: 40 }}>
            <Eyebrow size={11}>Studio</Eyebrow>
            <p style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 15, color: slate, marginTop: 8 }}>
              Ojai, California<br />jared@humcreative.co<br />+1 805 555 0188
            </p>
          </div>
        </div>
        {sent ? (
          <div style={{ fontFamily: "'Ivy Presto Display', serif", fontWeight: 200, fontSize: 48, lineHeight: 1.1 }}>
            Thank you. We&rsquo;ll be in touch within <em style={{ fontWeight: 300, color: accent }}>two business days</em>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <input type="hidden" name="form-name" value="contact" />
            {[
              ['name', 'Your name', 'Margot Ellery', false],
              ['project', 'What are you building?', 'A tasting room. A rebrand. A whisper.', false],
              ['budget', 'Rough budget', 'Helpful but not required', false],
              ['tell', 'Tell us a little', "What's the brief? What's keeping you up?", true],
            ].map(([k, label, ph, ta]) => (
              <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Eyebrow size={11}>{label}</Eyebrow>
                {ta
                  ? <textarea rows={4} name={k} placeholder={ph} onChange={e => setForm(f => ({...f, [k]: e.target.value}))} value={form[k]}
                      style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 18, color: ink, background: 'transparent', border: 'none', borderBottom: `1px solid ${ink}50`, padding: '10px 0', outline: 'none', resize: 'vertical' }} />
                  : <input name={k} placeholder={ph} onChange={e => setForm(f => ({...f, [k]: e.target.value}))} value={form[k]}
                      style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 18, color: ink, background: 'transparent', border: 'none', borderBottom: `1px solid ${ink}50`, padding: '10px 0', outline: 'none' }} />
                }
              </label>
            ))}
            <div><Btn variant="primary" size="lg">Send it over →</Btn></div>
          </form>
        )}
      </div>
    </section>
  );
};

// ── Footer ────────────────────────────────────────────────────────────────────
const FooterA = ({ t, ink, paper, accent, setPage }) => (
  <footer style={{ background: '#252926', color: '#f6f5ed', padding: '80px 32px 32px', position: 'relative', overflow: 'hidden' }}>
    <Grain opacity={0.4} blend="screen" />
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: 48, cursor: 'pointer' }} onClick={() => setPage('home')}>
        <HumLogo height="clamp(140px, 20vw, 360px)" light />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48, paddingBottom: 60, borderBottom: '1px solid rgba(246,245,237,0.18)' }}>
        <p style={{ fontFamily: "'Ivy Presto Text', serif", fontStyle: 'italic', fontSize: 18, lineHeight: 1.5, color: 'rgba(246,245,237,0.7)', maxWidth: 360 }}>
          A small creative practice. Ojai, California. Available for four or five projects a year. Currently booking Q4 MMXXVI.
        </p>
        {[
          ['Studio', ['About', 'Approach', 'Services', 'Hiring (no)']],
          ['Work', ['Selected', 'Archive', 'Recognitions', 'Press']],
          ['Elsewhere', ['Instagram', 'Are.na', 'Journal RSS', 'Newsletter']],
        ].map(([title, links]) => (
          <div key={title}>
            <div style={{ fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, marginBottom: 20 }}>{title}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {links.map(l => <li key={l} style={{ fontFamily: "'Ivy Presto Text', serif", fontSize: 16, cursor: 'pointer' }}>{l}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', fontFamily: "'Alternate Gothic No3', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(246,245,237,0.5)' }}>
        <span>© Hum Creative Co. MMXXVI</span>
        <span>A quiet studio, loudly recommended.</span>
        <span>Made by hand · Ojai · CA</span>
      </div>
    </div>
  </footer>
);

// ── Root component ────────────────────────────────────────────────────────────
export default function VariantA({ t, page, setPage, setCaseId }) {
  const accent = t.accent || '#bed230';
  const ink = t.dark ? '#f6f5ed' : '#252926';
  const paper = t.dark ? '#1a1c1a' : '#f6f5ed';
  const linen = t.dark ? '#252926' : '#ebe8d8';
  const slate = t.dark ? 'rgba(246,245,237,0.65)' : '#5d6962';
  const rule = t.dark ? 'rgba(246,245,237,0.18)' : 'rgba(37,41,38,0.18)';

  return (
    <div style={{ background: paper, color: ink, minHeight: '100vh', position: 'relative' }}>
      {t.showGrain && <Grain opacity={t.grainOpacity / 100} blend={t.dark ? 'screen' : 'multiply'} />}
      <NavA t={t} page={page} setPage={setPage} ink={ink} paper={paper} accent={accent} />
      {page === 'home' && <>
        <HeroA t={t} setPage={setPage} ink={ink} paper={paper} slate={slate} accent={accent} rule={rule} />
        {t.showTicker && <TickerA t={t} ink={ink} paper={paper} accent={accent} />}
        <IndexA t={t} ink={ink} paper={paper} slate={slate} accent={accent} rule={rule} setPage={setPage} setCaseId={setCaseId} />
        <ManifestoA t={t} accent={accent} />
        <ServicesA t={t} ink={ink} paper={paper} slate={slate} accent={accent} rule={rule} />
        <QuotesA t={t} ink={ink} paper={paper} linen={linen} slate={slate} accent={accent} rule={rule} />
        <JournalA t={t} ink={ink} paper={paper} linen={linen} slate={slate} accent={accent} rule={rule} setPage={setPage} />
        <CTAa t={t} accent={accent} setPage={setPage} />
      </>}
      {page === 'work' && <WorkAllA t={t} ink={ink} paper={paper} slate={slate} accent={accent} rule={rule} setCaseId={setCaseId} setPage={setPage} />}
      {page === 'studio' && <StudioA t={t} ink={ink} paper={paper} linen={linen} slate={slate} accent={accent} rule={rule} />}
      {page === 'journal' && <JournalAllA t={t} ink={ink} paper={paper} linen={linen} slate={slate} accent={accent} rule={rule} />}
      {page === 'contact' && <ContactA t={t} ink={ink} paper={paper} linen={linen} slate={slate} accent={accent} rule={rule} />}
      <FooterA t={t} ink={ink} paper={paper} accent={accent} setPage={setPage} />
    </div>
  );
}
