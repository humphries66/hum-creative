import React from 'react';

export const Eyebrow = ({ children, inverse, accent = true, size = 13 }) => (
  <div style={{
    fontFamily: "'Alternate Gothic No3', sans-serif",
    fontSize: size, letterSpacing: '0.22em', textTransform: 'uppercase',
    color: inverse ? 'rgba(246,245,237,0.7)' : '#252926',
    display: 'inline-flex', alignItems: 'center', gap: 10,
  }}>
    {accent && <span style={{ display: 'inline-block', width: 28, height: 2, background: '#bed230' }} />}
    {children}
  </div>
);

export const Btn = ({ variant = 'primary', children, onClick, style, size = 'md' }) => {
  const sizes = {
    sm: { padding: '10px 18px', fontSize: 11 },
    md: { padding: '16px 28px', fontSize: 13 },
    lg: { padding: '20px 36px', fontSize: 14 },
  };
  const base = {
    fontFamily: "'Alternate Gothic No3', sans-serif",
    letterSpacing: '0.22em', textTransform: 'uppercase',
    border: 'none', cursor: 'pointer',
    transition: 'all 200ms cubic-bezier(0.22,0.61,0.36,1)',
    ...sizes[size],
    ...style,
  };
  const variants = {
    primary:      { background: '#252926', color: '#f6f5ed' },
    secondary:    { background: 'transparent', color: '#252926', border: '1px solid #252926' },
    tertiary:     { background: 'transparent', color: '#252926', padding: `${sizes[size].padding.split(' ')[0]} 4px`, borderBottom: '2px solid #bed230' },
    accent:       { background: '#bed230', color: '#252926' },
    inverse:      { background: '#f6f5ed', color: '#252926' },
    inverseAccent:{ background: '#bed230', color: '#252926' },
    ghost:        { background: 'transparent', color: '#f6f5ed', border: '1px solid rgba(246,245,237,0.4)' },
  };
  return (
    <button
      style={{ ...base, ...variants[variant] }}
      onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >{children}</button>
  );
};

export const Underline = ({ children, color = '#bed230', size = 10 }) => (
  <span style={{
    backgroundImage: `linear-gradient(${color},${color})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `100% ${size}px`,
    backgroundPosition: '0 88%',
    paddingBottom: 2,
  }}>{children}</span>
);

export const Grain = ({ opacity = 0.45, blend = 'multiply', heavy = false }) => (
  <div style={{
    position: 'absolute', inset: 0,
    backgroundImage: `url('/assets/grain${heavy ? '-heavy' : ''}.svg')`,
    opacity, mixBlendMode: blend, pointerEvents: 'none',
  }} />
);

export const Marquee = ({ children, speed = 40, color = '#252926', bg = 'transparent', size = 80, weight = 'normal', font = "'Ivy Presto Display', serif", italic = false, border = true, padding = '20px 0' }) => {
  const items = Array.isArray(children) ? children : [children];
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div style={{
      overflow: 'hidden', background: bg, color,
      borderTop: border ? '1px solid currentColor' : 'none',
      borderBottom: border ? '1px solid currentColor' : 'none',
      padding,
    }}>
      <div style={{
        display: 'inline-flex', whiteSpace: 'nowrap',
        animation: `marquee ${speed}s linear infinite`,
        gap: '0.8em',
      }}>
        {repeated.map((c, i) => (
          <span key={i} style={{
            fontFamily: font, fontWeight: weight, fontSize: size,
            fontStyle: italic ? 'italic' : 'normal',
            lineHeight: 1, letterSpacing: '-0.02em',
            display: 'inline-flex', alignItems: 'center', gap: '0.4em',
          }}>
            {c}
            <span style={{ color: '#bed230', fontStyle: 'normal' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export const FoundNote = ({ children, rotate = -2, top, left, right, bottom, width = 200, color = '#f6f5ed' }) => (
  <div style={{
    position: 'absolute', top, left, right, bottom, width,
    background: color, padding: '14px 16px',
    fontFamily: "'Michigan Signature', cursive", fontSize: 22, lineHeight: 1.2,
    color: '#252926', transform: `rotate(${rotate}deg)`,
    boxShadow: '0 6px 20px -8px rgba(37,41,38,0.4), 0 1px 0 rgba(0,0,0,0.05)',
    zIndex: 5,
  }}>
    {children}
  </div>
);
