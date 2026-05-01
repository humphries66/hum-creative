import React, { useState } from 'react';
import VariantA from './components/VariantA.jsx';
import VariantB from './components/VariantB.jsx';
import FullyBooked from './components/FullyBooked.jsx';
import {
  useTweaks, TweaksPanel, TweakSection, TweakRadio,
  TweakColor, TweakToggle, TweakSlider,
} from './components/TweaksPanel.jsx';

// ── Archive-mode gate ──────────────────────────────────────────────────────────
// To permanently switch the home page back to the full portfolio,
// delete this block and the `if (!archiveMode) ...` early return below.
// To temporarily preview the portfolio: visit /?archive=true
const archiveMode =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('archive') === 'true';

const TWEAK_DEFAULTS = {
  variant: 'A — Maximalist Editorial',
  accent: '#bed230',
  dark: false,
  showGrain: true,
  grainOpacity: 80,
  showTicker: true,
  tickerSpeed: 40,
  showStamps: true,
  showNotes: true,
  heroScale: 0.95,
  letterSpacing: 0,
  cardHoverScale: 1.02,
  cardHoverYOffset: 8,
  cardRotationOnHover: 0,
  pulseIntensity: 1,
  enableGlitch: false,
  enableBounce: false,
  enableSpin: false,
  enableFloat: false,
  enableShake: false,
};

export default function App() {
  // If the archive query param is not set, show only the FullyBooked landing page.
  // (To swap back permanently, see the comment by `archiveMode` at the top of this file.)
  if (!archiveMode) return <FullyBooked />;
  return <Portfolio />;
}

function Portfolio() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = useState('home');
  const [caseId, setCaseId] = useState(1);

  const isB = t.variant.startsWith('B');

  React.useEffect(() => {
    document.body.style.letterSpacing = t.letterSpacing ? `${t.letterSpacing}em` : '';
  }, [t.letterSpacing]);

  // Scroll to top on page change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <>
      <div className="fade" key={t.variant + page}>
        {!isB
          ? <VariantA t={t} page={page} setPage={setPage} setCaseId={setCaseId} />
          : <VariantB t={t} page={page} setPage={setPage} setCaseId={setCaseId} />
        }
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Variant" />
        <TweakRadio
          label=""
          value={t.variant}
          options={['A — Maximalist Editorial', 'B — Type Specimen']}
          onChange={v => setTweak('variant', v)}
        />

        <TweakSection label="Page" />
        <TweakRadio
          label=""
          value={page}
          options={['home', 'work', 'studio', 'journal', 'contact']}
          onChange={v => setPage(v)}
        />

        <TweakSection label="Color" />
        <TweakColor label="Accent" value={t.accent} onChange={v => setTweak('accent', v)} />
        {!isB && <TweakToggle label="Dark mode" value={t.dark} onChange={v => setTweak('dark', v)} />}

        <TweakSection label="Texture & Motion" />
        <TweakToggle label="Grain overlay" value={t.showGrain} onChange={v => setTweak('showGrain', v)} />
        <TweakSlider label="Grain opacity" value={t.grainOpacity} min={0} max={80} unit="%" onChange={v => setTweak('grainOpacity', v)} />
        <TweakToggle label="Ticker" value={t.showTicker} onChange={v => setTweak('showTicker', v)} />
        <TweakSlider label="Ticker speed" value={t.tickerSpeed} min={10} max={120} unit="s" onChange={v => setTweak('tickerSpeed', v)} />

        {!isB && <>
          <TweakSection label="Hero (Variant A)" />
          <TweakSlider label="Hero scale" value={t.heroScale} min={0.6} max={1.4} step={0.05} onChange={v => setTweak('heroScale', v)} />
          <TweakToggle label="Fully Booked stamp" value={t.showStamps} onChange={v => setTweak('showStamps', v)} />
          <TweakToggle label="Found notes" value={t.showNotes} onChange={v => setTweak('showNotes', v)} />
        </>}

        {isB && <>
          <TweakSection label="Brutalist Animations" />
          <TweakToggle label="Bounce" value={t.enableBounce} onChange={v => setTweak('enableBounce', v)} />
          <TweakToggle label="Spin" value={t.enableSpin} onChange={v => setTweak('enableSpin', v)} />
          <TweakToggle label="Float" value={t.enableFloat} onChange={v => setTweak('enableFloat', v)} />
          <TweakToggle label="Shake" value={t.enableShake} onChange={v => setTweak('enableShake', v)} />
          <TweakToggle label="Glitch" value={t.enableGlitch} onChange={v => setTweak('enableGlitch', v)} />
        </>}

        <TweakSection label="Type" />
        <TweakSlider label="Letter-spacing" value={t.letterSpacing} min={-0.02} max={0.05} step={0.005} unit="em" onChange={v => setTweak('letterSpacing', v)} />
      </TweaksPanel>
    </>
  );
}
