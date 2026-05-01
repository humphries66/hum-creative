import React, { useState } from 'react';

// ── Logo (copied inline to keep this component self-contained) ────────────────
const HumLogo = ({ height = 80 }) => (
  <svg viewBox="0 0 668.45 430.29" style={{ height, width: 'auto', display: 'block' }}>
    <defs><style>{`
      .fb-1 { fill: #252926; }
      .fb-2 { fill: #bed230; }
    `}</style></defs>
    <g>
      <path className="fb-1" d="M358.43,272.46v-69.1c0-54.89,25.47-80.8,63.67-80.8s63.23,25.91,63.23,80.8v69.1h28.1v-69.1c0-54.89,25.47-80.8,63.67-80.8s63.23,25.91,63.23,80.8v69.1h28.1v-69.1c0-73.77-38.2-107.59-91.34-107.59-35.13,0-65.43,16.69-77.73,52.26-12.29-35.57-42.59-52.26-77.28-52.26-53.57,0-91.78,33.81-91.78,107.59v.44h0v68.66h28.11Z"/>
      <path className="fb-2" d="M330.29,323.41c-.25,54.39-27.82,80.09-68.48,80.09s-68.24-25.7-68.48-80.09h-28.11c.26,73.27,40.57,106.87,96.59,106.87s96.33-33.6,96.6-106.87h-28.11Z"/>
      <path className="fb-1" d="M28.1,272.46v-82.76c0-52.69,27.66-78.6,68.5-78.6s68.5,25.91,68.5,80.8v80.57h28.2v-68.66h-.09v-11.9c0-73.77-40.4-107.59-96.61-107.59-29.42,0-51.82,8.78-68.5,36.01V0H0v272.46h28.1Z"/>
      <path className="fb-1" d="M.68,296.99c0-5.93,4.69-10.55,10.61-10.55,4.89,0,8.93,3.15,10.2,7.58h-4.07c-1.06-2.3-3.36-3.83-6.13-3.83-3.83,0-6.78,2.98-6.78,6.81s2.95,6.81,6.78,6.81c2.68,0,4.92-1.47,6.04-3.66h4.1c-1.33,4.33-5.31,7.4-10.14,7.4-5.93,0-10.61-4.63-10.61-10.55"/>
      <path className="fb-1" d="M72.64,286.67h6.66c3.66,0,6.63,2.74,6.63,6.4s-2.51,5.72-4.54,6.28l4.07,7.96h-4.07l-3.66-7.58h-1.27v7.58h-3.83v-20.64ZM79.3,296.31c1.77,0,2.8-1.47,2.8-3.24s-1.03-2.98-2.8-2.98h-2.83v6.22h2.83Z"/>
      <polygon className="fb-1" points="140.92 290.42 140.92 294.63 148.11 294.63 148.11 298.38 140.92 298.38 140.92 303.57 149.23 303.57 149.23 307.31 137.08 307.31 137.08 286.67 149.23 286.67 149.23 290.42 140.92 290.42"/>
      <path className="fb-1" d="M212.79,302.83h-7.78l-1.59,4.48h-3.92l7.49-20.64h3.83l7.49,20.64h-3.92l-1.59-4.48ZM211.52,299.23l-2.62-7.37-2.62,7.37h5.25Z"/>
      <polygon className="fb-1" points="279.03 290.42 273.72 290.42 273.72 307.31 269.89 307.31 269.89 290.42 264.58 290.42 264.58 286.67 279.03 286.67 279.03 290.42"/>
      <rect className="fb-1" x="329.73" y="286.67" width="3.83" height="20.64"/>
      <polygon className="fb-1" points="402.78 286.67 395.29 307.31 391.46 307.31 383.97 286.67 388.19 286.67 393.38 301.5 398.57 286.67 402.78 286.67"/>
      <polygon className="fb-1" points="457.02 290.42 457.02 294.63 464.22 294.63 464.22 298.38 457.02 298.38 457.02 303.57 465.33 303.57 465.33 307.31 453.19 307.31 453.19 286.67 465.33 286.67 465.33 290.42 457.02 290.42"/>
      <path className="fb-1" d="M573.97,296.99c0-5.93,4.69-10.55,10.61-10.55,4.89,0,8.93,3.15,10.2,7.58h-4.07c-1.06-2.3-3.36-3.83-6.13-3.83-3.83,0-6.78,2.98-6.78,6.81s2.95,6.81,6.78,6.81c2.68,0,4.92-1.47,6.04-3.66h4.1c-1.33,4.33-5.31,7.4-10.14,7.4-5.93,0-10.61-4.63-10.61-10.55"/>
      <path className="fb-1" d="M645.78,296.99c0-5.93,4.69-10.55,10.61-10.55s10.61,4.63,10.61,10.55-4.69,10.55-10.61,10.55-10.61-4.63-10.61-10.55M663.17,296.99c0-3.83-2.95-6.81-6.78-6.81s-6.78,2.98-6.78,6.81,2.95,6.81,6.78,6.81,6.78-2.98,6.78-6.81"/>
    </g>
  </svg>
);

const ink = '#252926';
const paper = '#f6f5ed';
const slate = '#5d6962';
const accent = '#bed230';

const PROJECT_TYPES = [
  'Brand strategy',
  'Identity',
  'Packaging',
  'Editorial',
  'Art direction',
  'Other',
];

export default function FullyBooked() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ email: '', project_type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'inquiry', ...form }).toString(),
      });
    } catch (_) {}
    setSent(true);
  };

  return (
    <div style={{
      background: paper, color: ink, minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      padding: '48px 32px',
    }}>
      {/* Top: logo */}
      <header style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <HumLogo height={56} />
      </header>

      {/* Centered content */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        maxWidth: 720, width: '100%', margin: '0 auto', padding: '60px 0',
      }}>
        {/* Eyebrow */}
        <div style={{
          fontFamily: "'Alternate Gothic No3', sans-serif",
          fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: ink, display: 'inline-flex', alignItems: 'center', gap: 10,
          marginBottom: 32,
        }}>
          <span style={{ display: 'inline-block', width: 28, height: 2, background: accent }} />
          Currently · MMXXVI
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Ivy Presto Display', serif", fontWeight: 200,
          fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 1.0, letterSpacing: '-0.025em',
          margin: 0, color: ink,
        }}>
          We&rsquo;re <em style={{ fontWeight: 300, fontStyle: 'italic', color: accent }}>fully booked</em> through the year.
        </h1>

        {/* Subtext */}
        <p style={{
          fontFamily: "'Ivy Presto Text', serif", fontSize: 19, lineHeight: 1.55,
          color: slate, margin: '32px 0 0', maxWidth: 560,
        }}>
          We take on four or five engagements a year. Leave your details and we&rsquo;ll reach out when a spot opens.
        </p>

        {/* Form / thank you */}
        <div style={{ marginTop: 48 }}>
          {sent ? (
            <div style={{
              fontFamily: "'Ivy Presto Display', serif", fontWeight: 300, fontStyle: 'italic',
              fontSize: 32, lineHeight: 1.2, color: ink,
            }}>
              Thank you — we&rsquo;ll be in <span style={{ color: accent }}>touch</span>.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 520,
            }}>
              <input type="hidden" name="form-name" value="inquiry" />

              {/* Email */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{
                  fontFamily: "'Alternate Gothic No3', sans-serif",
                  fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ink,
                }}>Your email</span>
                <input
                  type="email" name="email" required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@studio.com"
                  style={{
                    fontFamily: "'Ivy Presto Text', serif", fontSize: 18, color: ink,
                    background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${ink}50`, padding: '10px 0', outline: 'none',
                  }}
                />
              </label>

              {/* Project type */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{
                  fontFamily: "'Alternate Gothic No3', sans-serif",
                  fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ink,
                }}>Project type</span>
                <select
                  name="project_type" required
                  value={form.project_type}
                  onChange={e => setForm(f => ({ ...f, project_type: e.target.value }))}
                  style={{
                    fontFamily: "'Ivy Presto Text', serif", fontSize: 18, color: ink,
                    background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${ink}50`, padding: '10px 0', outline: 'none',
                    appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='%23252926' d='M0 0h10L5 6z'/></svg>")`,
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center',
                  }}
                >
                  <option value="" disabled>Select one —</option>
                  {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>

              {/* Submit */}
              <div style={{ marginTop: 12 }}>
                <button type="submit" style={{
                  fontFamily: "'Alternate Gothic No3', sans-serif",
                  fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase',
                  background: accent, color: ink, border: 'none',
                  padding: '18px 36px', cursor: 'pointer',
                  transition: 'opacity 200ms',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Send →
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        paddingTop: 32, borderTop: `1px solid ${ink}18`,
        fontFamily: "'Alternate Gothic No3', sans-serif",
        fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: slate,
      }}>
        <span>Hum Creative Co. · Ojai, California</span>
        <span>jared@humcreative.co</span>
        {/* Hidden archive link — barely visible until hover */}
        <a
          href="?archive=true"
          title="Preview portfolio"
          style={{
            color: slate, opacity: 0.25, cursor: 'pointer',
            textDecoration: 'none', fontSize: 14, transition: 'opacity 200ms',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.25'}
        >·</a>
      </footer>
    </div>
  );
}
