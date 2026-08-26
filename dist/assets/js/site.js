/* =========================================================================
   Hum Creative Co. - scroll choreography + inquiry form
   Two jobs, no library. Everything here degrades to a working page if it
   never runs (see the .no-js rules in site.css).
   ========================================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. One-shot reveals ------------------------------------------------
     Each element gets .is-in once, the first time it crosses into view, and
     is then dropped from the observer. Nothing re-triggers on scroll back up
     - a printed page doesn't un-print itself. */
  var targets = document.querySelectorAll('.reveal, .reason, .misreg');

  if (reduced || !('IntersectionObserver' in window)) {
    // Show everything immediately; the reduced-motion CSS neutralises transforms.
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, {
      // Fire slightly before the element is fully on screen so the motion
      // reads as the page settling rather than as a delayed pop.
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.12
    });

    // The hero mark is deliberately absent - it animates in pure CSS so that
    // above-the-fold content never waits on this observer.
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* ---- 2. Nav settles onto the page once the hero is behind it ---------- */
  var nav = document.getElementById('nav');
  var hero = document.querySelector('.hero');

  if (nav && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      nav.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, { rootMargin: '-60px 0px 0px 0px' }).observe(hero);
  }

  /* ---- 3. Studio texture --------------------------------------------------
     The clip is authored as a true loop, so the <video loop> attribute handles
     the seam on its own - no crossfade, no rAF, nothing running per frame.
     (An earlier non-looping source needed two copies dissolved against each
     other; if the clip is ever swapped for one that pops at the seam, that is
     the problem to solve, not a bug here.)

     It is the heaviest asset on the page, so nothing is fetched until the
     section is actually approaching the viewport. */
  var texWrap = document.querySelector('.studio__texture');

  if (texWrap && 'IntersectionObserver' in window) {
    var tex = texWrap.querySelector('.studio__tex');
    var TEX_SRC = '/assets/img/texture-bg.mp4';
    var loaded = false;

    var start = function () {
      if (!loaded) {
        loaded = true;
        // preload="none" in the markup keeps this off the initial page load.
        // Flipping it here is what actually starts the fetch - without it a
        // reduced-motion visitor (who never calls play) would get no frame.
        tex.preload = 'auto';
        tex.src = TEX_SRC;
      }
      if (reduced) return;              // motion off: first frame only, no playback
      tex.play().catch(function () {}); // autoplay refusal is not fatal - a
                                        // paused frame still reads as texture
    };

    new IntersectionObserver(function (entries) {
      entries[0].isIntersecting ? start() : tex.pause();
    }, { rootMargin: '200px 0px' }).observe(document.querySelector('.studio'));
  }

  /* ---- 3b. Studio rapid-cut sequence --------------------------------------
     Eleven frames from one shoot, hard cut every 400ms. Not a carousel: no
     controls, no crossfade, and no pause at the loop seam - frame 11 is
     followed immediately by frame 1.

     Every frame is decoded BEFORE the first cut. At 400ms a browser has no
     time to fetch a frame on demand, so starting early would show gaps; the
     markup omits loading="lazy" for the same reason. If a decode fails the
     sequence simply never starts and frame 1 stays up, which is the same
     resting state as reduced motion.

     Cutting is gated on the section being near the viewport, like the texture
     video above it. That is invisible to a reader - it only stops the timer
     running against a section nobody is looking at. */
  var slides = document.getElementById('studio-slides');

  if (slides) {
    var frames = slides.querySelectorAll('.studio__slide');
    var CUT_MS = 400;

    if (frames.length > 1 && !reduced) {
      var decodes = Array.prototype.map.call(frames, function (img) {
        // decode() rejects on failure; complete images resolve immediately
        return img.decode ? img.decode().catch(function () {})
                          : Promise.resolve();
      });

      Promise.all(decodes).then(function () {
        var i = 0, timer = null;

        var tick = function () {
          frames[i].classList.remove('is-on');
          i = (i + 1) % frames.length;   // wraps with no extra delay
          frames[i].classList.add('is-on');
        };

        var run = function () { if (!timer) timer = setInterval(tick, CUT_MS); };
        var halt = function () { clearInterval(timer); timer = null; };

        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (entries) {
            entries[0].isIntersecting ? run() : halt();
          }, { rootMargin: '200px 0px' }).observe(slides);
        } else {
          run();
        }
      });
    }
  }

  /* ---- 4. Logo colour cycle -----------------------------------------------
     The mark advances through four inks as the reader scrolls, holds wherever
     it is when scrolling stops, and continues from that held colour when
     scrolling resumes. Hovering the logo animates it without scrolling.

     Phase is driven by ABSOLUTE scroll distance, not by scrollY. Tying it to
     position would run the colours backwards on an upward scroll; distance
     means any scrolling - either direction - moves the cycle forward. It also
     gives the hold-on-stop behaviour for free: no scroll events, no phase
     change, no timer to manage. */
  var mark = document.querySelector('.nav__logo-mark');

  if (mark) {
    /* Swap, reorder, or drop stops freely - everything below reads .length.
       Note #e1ff19 is ~1.06:1 on the newsprint nav, so the fine CREATIVE CO
       lettering washes out at that end of the cycle while the heavy strokes
       still read as a hue shift. That is intended. If it ever wants reining in,
       either drop that stop from this array or give .nav__logo-mark a
       `stroke: #383838; stroke-width: 2;` to hold the silhouette. */
    var STOPS = ['#383838', '#e1ff19', '#7ca982', '#ff785a'];
    var SCROLL_PER_CYCLE = 2600; // px of scrolling for one full trip through
    var HOVER_CYCLE_MS   = 4200; // ms for one full trip while hovering

    var phase = 0;               // position in the cycle, [0, STOPS.length)
    var lastY = window.pageYOffset;
    var queued = false;

    /* sRGB is the wrong space to cross-fade in: #383838 -> #e1ff19 passes
       through muddy olive (#626a30, #8c9c28) at the midpoints. OKLab keeps the
       ramp clean, and it is small enough not to warrant a dependency. */
    function srgbToLinear(c) {
      c /= 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
    function linearToSrgb(c) {
      c = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
      return Math.max(0, Math.min(255, Math.round(c * 255)));
    }
    function hexToOklab(hex) {
      var r = srgbToLinear(parseInt(hex.slice(1, 3), 16));
      var g = srgbToLinear(parseInt(hex.slice(3, 5), 16));
      var b = srgbToLinear(parseInt(hex.slice(5, 7), 16));
      var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
      var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
      var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
      return [
        0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
      ];
    }
    function oklabToHex(L, A, B) {
      var l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3);
      var m = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3);
      var s = Math.pow(L - 0.0894841775 * A - 1.2914855480 * B, 3);
      return '#' +
        [ 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
         -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
         -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s]
        .map(function (v) {
          var h = linearToSrgb(v).toString(16);
          return h.length < 2 ? '0' + h : h;
        }).join('');
    }

    var LAB = STOPS.map(hexToOklab);

    function paint() {
      queued = false;
      var n = LAB.length;
      var i = Math.floor(phase) % n;
      var a = LAB[i], b = LAB[(i + 1) % n], t = phase - Math.floor(phase);
      mark.style.setProperty('--logo-ink', oklabToHex(
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t
      ));
    }

    function advance(by) {
      var n = LAB.length;
      phase = (phase + by) % n;
      if (phase < 0) phase += n;
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    }

    if (reduced) {
      // Motion off: settle on the first stop and wire up nothing.
      mark.style.setProperty('--logo-ink', STOPS[0]);
    } else {
      paint();

      window.addEventListener('scroll', function () {
        var y = window.pageYOffset;
        advance(Math.abs(y - lastY) / SCROLL_PER_CYCLE * LAB.length);
        lastY = y;
      }, { passive: true });

      /* Hover runs its own clock so the mark still animates on a page that is
         not being scrolled. The rAF exists only while the pointer is over the
         logo - at rest, nothing is scheduled. */
      var hoverRaf = null, hoverLast = 0;
      var link = mark.closest('.nav__logo') || mark;

      var tick = function (now) {
        advance((now - hoverLast) / HOVER_CYCLE_MS * LAB.length);
        hoverLast = now;
        hoverRaf = requestAnimationFrame(tick);
      };
      link.addEventListener('pointerenter', function () {
        if (hoverRaf === null) { hoverLast = performance.now(); hoverRaf = requestAnimationFrame(tick); }
      });
      link.addEventListener('pointerleave', function () {
        if (hoverRaf !== null) { cancelAnimationFrame(hoverRaf); hoverRaf = null; }
      });
    }
  }

  /* ---- 5. Shout band ------------------------------------------------------
     Three rows drift right as the band crosses the viewport, each at its own
     rate. The stagger is the effect - equal speeds read as one solid block
     sliding, not as parallax.

     Motion is loaded with a DYNAMIC import inside a catch, deliberately. This
     file also owns the inquiry form below, and a static `import` at the top of
     a module means one unreachable CDN takes down the reveals, the nav, the
     video, the logo cycle AND the form. Scoped this way, a CDN failure costs
     the drift and nothing else: the band keeps the static offsets set in
     site.css and still looks composed.

     Motion hands these to native ScrollTimeline where the browser supports it,
     so the drift runs on the compositor rather than off scroll events. */
  var band = document.querySelector('.shout');

  if (band && !reduced) {
    // [from, to] px per row. Monotonically decreasing travel, matching the
    // reference: the top row moves most, the bottom row barely drifts. Row 1
    // is slow on purpose - it carries the green line, which needs to sit near
    // centre long enough to be read rather than sweep past.
    // Every range must END negative: at maximum drift the row's left edge has
    // to still sit outside the band, or a wedge of bare coral shows on the left.
    var RANGES = [
      [-460, -20],
      [-300, -170],   // row 1 is overwritten below - see the centring note
      [-240, -20]
    ];

    var hit  = band.querySelector('.shout__word--hit');
    var rows = band.querySelectorAll('.shout__row');
    var motionRef = null;   // the library, once it lands
    var row1Stop  = null;   // cleanup for row 1's current scroll binding

    function bindRow(row, i) {
      var range = RANGES[i] || RANGES[RANGES.length - 1];
      return motionRef.scroll(
        motionRef.animate(row, { x: [range[0], range[1]] }, { ease: 'linear' }),
        {
          target: band,
          // The band's whole pass through the viewport, so the travel is
          // spread across the time it is actually on screen.
          offset: ['start end', 'end start']
        }
      );
    }

    /* Row 1 carries the green line. A fixed offset only ever centres it at one
       viewport width, so derive it from where the phrase actually sits, and give
       it only a small drift either side of centre - it should linger and be read,
       not sweep past.

       This MUST be recomputed rather than measured once, for two reasons that
       both put the phrase off-screen on a phone:

       1. The gothic face loads with font-display:swap. Measured before the swap,
          the fallback metrics put offsetLeft ~233px too far right (measured), so
          the phrase lands hard off the LEFT edge once the real font settles.
       2. innerWidth is baked in, so resizing a desktop window down to phone width
          leaves the desktop offset in place and the phrase sits off the RIGHT edge.

       Runs OUTSIDE the import on purpose: if the CDN is unreachable the band
       never animates, and the punchline still has to be on screen. */
    function centreHit() {
      if (!hit || !rows[1]) return;
      var centred = -(hit.offsetLeft + hit.offsetWidth / 2 - window.innerWidth / 2);
      centred = Math.min(centred, -20);          // keep the left edge off-canvas
      RANGES[1] = [centred - 65, Math.min(centred + 65, -20)];
      rows[1].style.transform = 'translateX(' + centred + 'px)';
      if (motionRef) {                            // re-aim an existing binding
        if (row1Stop) row1Stop();
        row1Stop = bindRow(rows[1], 1);
      }
    }

    centreHit();                                  // best guess for first paint
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(centreHit);       // again once the real face is in
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(centreHit, 150);
    }, { passive: true });

    // The catch is attached to the IMPORT only, not to the chain. Chaining it
    // after .then() would also swallow any genuine bug in the binding below,
    // silently leaving the band static with nothing in the console. An
    // unreachable CDN resolves to null and is handled; a real error still throws.
    import('https://cdn.jsdelivr.net/npm/motion@13/+esm')
      .catch(function () { return null; })
      .then(function (motion) {
        if (!motion) return;   // CDN blocked or offline - static offsets stand
        motionRef = motion;
        Array.prototype.forEach.call(rows, function (row, i) {
          var stop = bindRow(row, i);
          if (i === 1) row1Stop = stop;
        });
      });
  }

  /* ---- 6. Hero tagline scramble --------------------------------------------
     Replaces the old hero-tagline.png layer. Rotates through six phrases,
     transitioning between them by scrambling characters into place rather
     than fading or sliding - each character locks onto its final letter at
     its own randomised moment within the transition, which is what makes it
     read as "characters resolving," not a uniform typewriter effect.

     PHRASES[0] is already sitting in the HTML as plain static text, so if
     this never runs (no-JS, or prefers-reduced-motion below) the tagline is
     still correct and fully readable - nothing here needs its own fallback
     branch for those cases. */
  var tagline = document.querySelector('.hero__tagline');

  if (tagline && !reduced) {
    // Order is fixed and cycles forever - never shuffled.
    var PHRASES = [
      'CREATIVE THAT HELPS\nYOU LOOK LIKE Yourself',
      'BECOME A CATEGORY\nOF One',
      'ENTER AS URKEL,\nLEAVE AS URQELLE',
      'MAKE PEOPLE\nGIVE A DAMN',
      'TREND-CHASERS ARE\nWAY BEHIND',
      'ANTI-SLOP. ANTI-DEFAULT.\nPRO-PEOPLE.'
    ];
    var SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+-=<>/?~';
    var index = 0;

    // Each of these lives in exactly one phrase, set in mixed case there
    // specifically so it survives .hero__tagline's text-transform:uppercase
    // (overridden back to none on the span below) - every other word in every
    // phrase is plain uppercase.
    var SPECIAL_WORDS = ['Yourself', 'One'];
    function specialRangeIn(text) {
      for (var w = 0; w < SPECIAL_WORDS.length; w++) {
        var i = text.indexOf(SPECIAL_WORDS[w]);
        if (i !== -1) return { start: i, end: i + SPECIAL_WORDS[w].length };
      }
      return null;
    }

    // Renders via real DOM nodes rather than textContent/innerHTML: the
    // scramble charset includes "<" and ">", which would corrupt markup (or
    // need manual escaping) if this were built as an HTML string instead.
    // `range`, when set, wraps that slice of `chars` in the Jacquard span -
    // computed from the transition's TARGET phrase, so the word's "slot"
    // carries its own font even while the characters in it are still
    // scrambling, not just once they've resolved.
    function renderChars(chars, range) {
      var frag = document.createDocumentFragment();
      var i = 0;
      while (i < chars.length) {
        if (range && i === range.start) {
          var span = document.createElement('span');
          span.className = 'hero__tagline-jacquard';
          span.textContent = chars.slice(range.start, range.end).join('');
          frag.appendChild(span);
          i = range.end;
        } else {
          var stop = (range && i < range.start) ? range.start : chars.length;
          frag.appendChild(document.createTextNode(chars.slice(i, stop).join('')));
          i = stop;
        }
      }
      tagline.innerHTML = '';
      tagline.appendChild(frag);
    }

    function scrambleTo(from, to, duration) {
      return new Promise(function (done) {
        var len = Math.max(from.length, to.length);
        // Each character gets its own random resolve point inside the
        // transition window - this is the entire "resolve at different
        // moments" effect; there is no per-character stagger schedule beyond
        // this random draw.
        var resolveAt = [];
        for (var i = 0; i < len; i++) resolveAt.push(duration * (0.2 + 0.8 * Math.random()));
        var start = performance.now();
        var range = specialRangeIn(to);

        (function tick() {
          var elapsed = performance.now() - start;
          var chars = [];
          var allResolved = true;
          for (var i = 0; i < len; i++) {
            var c = i < to.length ? to[i] : '';
            // Whitespace and line breaks are never scrambled - this is what
            // guarantees the scramble can't alter the phrase's line breaks.
            if (c === '\n' || c === ' ' || c === '') { chars.push(c); continue; }
            if (elapsed >= resolveAt[i]) {
              chars.push(c);
            } else {
              allResolved = false;
              chars.push(SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0]);
            }
          }
          renderChars(chars, range);
          if (elapsed < duration && !allResolved) {
            setTimeout(tick, 45 + Math.random() * 15);
          } else {
            renderChars(to.split(''), range); // guarantees an exact, clean resolve
            done();
          }
        })();
      });
    }

    (function loop() {
      setTimeout(function () {
        var next = (index + 1) % PHRASES.length;
        scrambleTo(PHRASES[index], PHRASES[next], 500 + Math.random() * 400).then(function () {
          index = next;
          loop();
        });
      }, 2500 + Math.random() * 1500);
    })();
  }

  /* ---- 7. Portfolio gallery -------------------------------------------------
     A horizontal rail of cards; clicking one expands it into a full-screen
     detail view via a hand-rolled FLIP (First-Last-Invert-Play) transition -
     the card's own image/title/category block grows into the full-bleed
     hero of the detail view, rather than a modal fading in over an
     unrelated page.

     No layoutId (that's a Framer Motion / React-only mechanism built on
     React's reconciliation - there's no vanilla-JS or Motion-DOM equivalent),
     and no Motion CDN dependency: the brief calls this transition the
     defining behaviour, not something that should degrade to a fade if a
     CDN request fails, so it runs entirely on the native Web Animations API,
     which is already the substrate everything else on this page's motion
     runs on. */
  var galleryRail = document.getElementById('gallery-rail');

  if (galleryRail) {
    /* Intrinsic pixel dimensions of every image the detail body renders.

       WHY THIS EXISTS. An <img> with no width/height attributes, styled
       `width:100%; height:auto`, occupies ZERO HEIGHT until its file decodes.
       The detail body renders up to 14 of them, so on open they all collapsed
       on top of each other and then shoved each other down one by one as they
       loaded - measured at 2188px of shift (567px -> 2755px), running right
       through the 600ms open animation. That is what read as a "glitchy" or
       stacking transition; the animation itself was never at fault.

       Setting width/height here lets the browser reserve the correct box from
       the ratio before a single byte arrives. It also makes loading="lazy"
       harmless rather than a liability: a late image now drops into a box
       that is already the right size.

       A single CSS aspect-ratio cannot do this - these genuinely differ
       (1800x1012, 1800x1350, 1400x787, 778x1100...), so one blanket ratio
       would only trade a big shift for a smaller wrong one.

       Enumerated from DISK, not by grepping this file for paths. Strip and
       deck images are built at runtime with .map() -
       ('/assets/img/work/x/frame-' + n + '.jpg') - so they appear in no
       string literal and a grep-based map silently missed all 32 of them.

       REGENERATE when artwork is added or re-exported. Paths missing from the
       map fall back to the old behaviour, never to a wrong box:

         find dist/assets/img -type f \( -name '*.jpg' -o -name '*.jpeg' \
              -o -name '*.png' -o -name '*.webp' \) | sort | while read F; do
           W=$(sips -g pixelWidth  "$F" | tail -1 | awk '{print $2}')
           H=$(sips -g pixelHeight "$F" | tail -1 | awk '{print $2}')
           echo "      '${F#dist}': [$W, $H],"
         done
    */
    var IMG_DIMS = {
      '/assets/img/hero-boring-must-die.png':            [2175, 1372],
      '/assets/img/hero-creative-co.png':                [2175, 1372],
      '/assets/img/hero-hum.png':                        [2175, 1372],
      '/assets/img/hero-raccoon.png':                    [2175, 1372],
      '/assets/img/hero-tagline.png':                    [2175, 1372],
      '/assets/img/hum-bg-texture.jpg':                  [1920, 1080],
      '/assets/img/hum-link-preview.png':                [1200, 630],
      '/assets/img/hum-messy-header.png':                [1877, 1372],
      '/assets/img/letstalk.png':                        [1500, 1000],
      '/assets/img/nowbooking.png':                      [1064, 1077],
      '/assets/img/storyghost.jpg':                      [778, 1100],
      '/assets/img/studio/frame-01.jpg':                 [800, 1066],
      '/assets/img/studio/frame-02.jpg':                 [800, 1066],
      '/assets/img/studio/frame-03.jpg':                 [800, 1066],
      '/assets/img/studio/frame-04.jpg':                 [800, 1066],
      '/assets/img/studio/frame-05.jpg':                 [800, 1066],
      '/assets/img/studio/frame-06.jpg':                 [800, 1066],
      '/assets/img/studio/frame-07.jpg':                 [800, 1066],
      '/assets/img/studio/frame-08.jpg':                 [800, 1066],
      '/assets/img/studio/frame-09.jpg':                 [800, 1066],
      '/assets/img/studio/frame-10.jpg':                 [800, 1066],
      '/assets/img/studio/frame-11.jpg':                 [800, 1066],
      '/assets/img/work/decatur-city/board-runclub.jpg': [1800, 1012],
      '/assets/img/work/decatur-city/board-serve.jpg':   [1800, 1350],
      '/assets/img/work/decatur-city/cover.jpg':         [1400, 787],
      '/assets/img/work/decatur-city/pf-apparel.jpg':    [1800, 1012],
      '/assets/img/work/decatur-city/pf-badges.jpg':     [1800, 1012],
      '/assets/img/work/decatur-city/pf-eventday.jpg':   [1800, 1012],
      '/assets/img/work/decatur-city/pf-logo.jpg':       [1800, 1012],
      '/assets/img/work/decatur-city/pf-variations.jpg': [1800, 1012],
      '/assets/img/work/emmanuel/cover.jpg':             [1400, 787],
      '/assets/img/work/emmanuel/poster-cello.jpg':      [640, 360],
      '/assets/img/work/emmanuel/poster-dancer.jpg':     [640, 360],
      '/assets/img/work/emmanuel/poster-decks.jpg':      [640, 360],
      '/assets/img/work/emmanuel/poster-finale.jpg':     [640, 360],
      '/assets/img/work/emmanuel/poster-open.jpg':       [640, 360],
      '/assets/img/work/estaca/bottle-red.jpg':          [900, 900],
      '/assets/img/work/estaca/bottle-salvaje.jpg':      [900, 900],
      '/assets/img/work/estaca/bottle-trago.jpg':        [900, 900],
      '/assets/img/work/estaca/cover.jpg':               [1400, 787],
      '/assets/img/work/estaca/lifestyle.jpg':           [1920, 1080],
      '/assets/img/work/estaca/pitch-cantina.jpg':       [1600, 900],
      '/assets/img/work/estaca/pitch-dia.jpg':           [1600, 900],
      '/assets/img/work/estaca/poster-bottles.jpg':      [640, 360],
      '/assets/img/work/estaca/poster-film.jpg':         [640, 360],
      '/assets/img/work/estaca/process-mesh.jpg':        [900, 506],
      '/assets/img/work/estaca/process-render.jpg':      [900, 720],
      '/assets/img/work/fridge-cig/board-1.jpg':         [1800, 1013],
      '/assets/img/work/fridge-cig/board-2.jpg':         [1800, 1013],
      '/assets/img/work/fridge-cig/board-3.jpg':         [1800, 1013],
      '/assets/img/work/fridge-cig/board-4.jpg':         [1800, 1013],
      '/assets/img/work/fridge-cig/cover.jpg':           [1200, 1200],
      '/assets/img/work/fridge-cig/frame-1.jpg':         [900, 900],
      '/assets/img/work/fridge-cig/frame-10.jpg':        [900, 900],
      '/assets/img/work/fridge-cig/frame-2.jpg':         [900, 900],
      '/assets/img/work/fridge-cig/frame-3.jpg':         [900, 900],
      '/assets/img/work/fridge-cig/frame-4.jpg':         [900, 900],
      '/assets/img/work/fridge-cig/frame-5.jpg':         [900, 900],
      '/assets/img/work/fridge-cig/frame-6.jpg':         [900, 900],
      '/assets/img/work/fridge-cig/frame-7.jpg':         [900, 900],
      '/assets/img/work/fridge-cig/frame-8.jpg':         [900, 900],
      '/assets/img/work/fridge-cig/frame-9.jpg':         [900, 900],
      '/assets/img/work/hall-of-fame/cover.jpg':         [1200, 900],
      '/assets/img/work/hall-of-fame/deck-01.jpg':       [801, 1037],
      '/assets/img/work/hall-of-fame/deck-02.jpg':       [801, 1037],
      '/assets/img/work/hall-of-fame/deck-03.jpg':       [801, 1037],
      '/assets/img/work/hall-of-fame/deck-04.jpg':       [801, 1037],
      '/assets/img/work/hall-of-fame/deck-05.jpg':       [801, 1037],
      '/assets/img/work/hall-of-fame/deck-06.jpg':       [801, 1037],
      '/assets/img/work/hall-of-fame/deck-07.jpg':       [801, 1037],
      '/assets/img/work/hall-of-fame/deck-08.jpg':       [801, 1037],
      '/assets/img/work/hall-of-fame/deck-09.jpg':       [801, 1037],
      '/assets/img/work/hall-of-fame/deck-10.jpg':       [801, 1037],
      '/assets/img/work/hall-of-fame/deck-11.jpg':       [801, 1037],
      '/assets/img/work/secret-show/cover.jpg':          [1200, 670],
      '/assets/img/work/secret-show/signage.jpg':        [1600, 1066],
      '/assets/img/work/secret-show/social.jpg':         [1600, 900],
      '/assets/img/work/secret-show/web.jpg':            [1600, 1066],
      '/assets/img/work/secret-show/wordmark.jpg':       [1600, 900]
    };

    /* Applies the reserved box. No-op when the path is unknown, so a stale map
       degrades to the old behaviour instead of inventing wrong proportions - a
       wrong box would look worse than no box at all. */
    function sizeImg(img, src) {
      var d = IMG_DIMS[src];
      if (!d) return;
      img.width = d[0];
      img.height = d[1];
    }

    // Placeholder data - real projects replace this array later. Every
    // downstream piece (cards, dialog) renders purely from this shape.
    var PROJECTS = [
      {
        id: 'fridge-cig',
        title: 'Fridge Cig',
        category: 'Identity & packaging',
        coverImage: '/assets/img/work/fridge-cig/cover.jpg',
        /* The subject sits right of centre; a centred crop cuts the glass
           out of the 3:4 card. See the [data-focus] rules in site.css. */
        focus: 'right',
        description: 'A cold Diet Coke and five minutes alone. We gave the ritual a brand: crest, serif, and all the ceremony a vice deserves. Identity, packaging, menu, and a truck.',
        galleryImages: [
          { src: '/assets/img/work/fridge-cig/board-1.jpg',
            alt: 'Fridge Cig identity system: primary wordmark, circular badge lockup and gold crest, shown beside the brand\u2019s pin-up illustration.' },
          { src: '/assets/img/work/fridge-cig/board-2.jpg',
            alt: 'Fridge Cig packaging: cans photographed in crushed ice, with the cigarette-pack carton and hand illustration.' },
          { src: '/assets/img/work/fridge-cig/board-3.jpg',
            alt: 'Fridge Cig menu board listing the Classic, Cherry, Dirty and Night Cig, beside the \u201Cyou earned it\u201D campaign typography.' },
          { src: '/assets/img/work/fridge-cig/board-4.jpg',
            alt: 'The Fridge Cig delivery truck, a blue and cream Piaggio Ape, with the headline \u201CIt\u2019s five o\u2019clock in my nervous system.\u201D' },
          { strip: {
            label: 'Launch carousel: ten frames, one continuous image',
            images: [1,2,3,4,5,6,7,8,9,10].map(function (n) {
              return '/assets/img/work/fridge-cig/frame-' + n + '.jpg';
            })
          } }
        ]
      },
      {
        id: 'decatur-city',
        title: 'Decatur City Church',
        category: 'Brand expansion',
        coverImage: '/assets/img/work/decatur-city/cover.jpg',
        description: 'Brands keep expanding as the organizations behind them grow. Decatur City Church has added programs and events for years, and we have partnered with them through each expansion. We designed a run club identity, a serve mailer, summer motion graphics, and a full sub-brand for their Porchfest street festival. Every piece extends the same visual system, so the church stays recognizable as it grows.',
        galleryImages: [
          { heading: 'The church brand' },
          { src: '/assets/img/work/decatur-city/board-runclub.jpg',
            alt: 'Decatur City Run Club lockup: condensed yellow type on black, cut through with speed lines and a sprinting figure.' },
          { src: '/assets/img/work/decatur-city/board-serve.jpg',
            alt: 'Serve at Decatur City Church rack card mailer, front and back, showing ministry logos and a tear-off sign-up form.' },
          { heading: 'Summer at DCC motion' },
          { video: 'QhXLwxceORY', title: 'Summer at DCC motion graphics loop' },
          { video: '_BeJUkYsGME', title: 'DCC Summer Loop' },
          { heading: 'Porchfest sub-brand' },
          { src: '/assets/img/work/decatur-city/pf-logo.jpg',
            alt: 'Porchfest primary logo: hand-drawn serif wordmark with the Decatur City Church circle mark set into the letter O, on aged paper.' },
          { src: '/assets/img/work/decatur-city/pf-variations.jpg',
            alt: 'Porchfest logo variations reversed on black.' },
          { src: '/assets/img/work/decatur-city/pf-badges.jpg',
            alt: 'Porchfest overprint logo stack and vintage badge lockups.' },
          { src: '/assets/img/work/decatur-city/pf-apparel.jpg',
            alt: 'Porchfest apparel and signage mockups: t-shirts, A-frame boards and mugs.' },
          { src: '/assets/img/work/decatur-city/pf-eventday.jpg',
            alt: 'Porchfest event day photography.' }
        ]
      },
      {
        id: 'emmanuel',
        title: 'O Come, O Come Emmanuel',
        category: 'Music film',
        coverImage: '/assets/img/work/emmanuel/cover.jpg',
        description: 'The tune is centuries old. The arrangement is not. We re-scored it, recorded it, cast it, shot it and cut it.',
        galleryImages: [
          { video: 'pl3AEd7d-m0', title: 'O Come, O Come Emmanuel: the film' },
          { heading: 'Inside the film' },
          /* Every clip sits inside a single continuous take - the film itself
             averages a cut per second, so timestamps were picked off a shot
             boundary scan rather than by eye. crop is applied in CSS, so
             reframing later costs nothing and needs no re-encode. */
          { clip: '/assets/img/work/emmanuel/clip-open.mp4',
            poster: '/assets/img/work/emmanuel/poster-open.jpg',
            crop: 'wide', caption: 'Opening frame: locked-off cyc, one cellist' },
          { row: [
            { clip: '/assets/img/work/emmanuel/clip-cello.mp4',
              poster: '/assets/img/work/emmanuel/poster-cello.jpg',
              crop: 'tall', caption: 'Bow' },
            { clip: '/assets/img/work/emmanuel/clip-decks.mp4',
              poster: '/assets/img/work/emmanuel/poster-decks.jpg',
              crop: 'square', caption: 'Decks' }
          ] },
          { clip: '/assets/img/work/emmanuel/clip-dancer.mp4',
            poster: '/assets/img/work/emmanuel/poster-dancer.jpg',
            crop: 'wide', caption: 'Three panels, three performances, one take each' },
          { clip: '/assets/img/work/emmanuel/clip-finale.mp4',
            poster: '/assets/img/work/emmanuel/poster-finale.jpg',
            crop: 'wide', caption: 'The neon drops out and the room goes white' },
          { credits: {
            items: ['Creative concept + strategy', 'Scriptwriting',
                    'Musical arrangement + re-scoring', 'Recording + music production',
                    'Casting', 'Video production', 'Creative direction',
                    'Performance direction'],
            note: 'Decatur, GA / Atlanta, GA'
          } }
        ]
      },
      {
        id: 'hall-of-fame',
        title: 'Decatur Music Hall of Fame',
        category: 'Identity & pitch',
        coverImage: '/assets/img/work/hall-of-fame/cover.jpg',
        description: 'A town that turned out Indigo Girls and John Mayer by accident, with nothing built to keep the next one. We made the mark, the voice, the merch, and the eleven pages that make the case for a building.',
        galleryImages: [
          { strip: {
            label: 'The pitch deck: eleven pages',
            variant: 'deck',
            images: [1,2,3,4,5,6,7,8,9,10,11].map(function (n) {
              return '/assets/img/work/hall-of-fame/deck-' + (n < 10 ? '0' : '') + n + '.jpg';
            })
          } },
          /* The deck itself is the anchor. It already ships with the portfolio
             page, so this links that exact file rather than duplicating 7.4MB
             into a second location - verified identical by SHA-1. */
          { doc: '/portfolio/assets/docs/decatur-hall-of-fame.pdf',
            label: 'Read the full deck',
            meta: 'PDF \u00b7 11 pages \u00b7 7.3MB' },
          { credits: {
            items: ['Design concept', 'Visual identity + logo', 'Brand language',
                    'Typography + colour', 'Copywriting', 'Pitch deck design',
                    'Merch design'],
            note: 'Decatur, GA'
          } }
        ]
      },
      {
        id: 'estaca',
        title: 'ESTACA Bacanora',
        category: 'Brand & bottle design',
        coverImage: '/assets/img/work/estaca/cover.jpg',
        /* bottlehero is 16:9 and gets cropped on a different axis in each
           context: the 3:4 card keeps only 42.8% of the width, the 2.29:1 hero
           crops 22.5% of the height. 68% holds the bottle and glass in the
           card; 30% lifts the hero band so the bottle's top is not sliced off.
           See the [data-focus="right-high"] rule in site.css. */
        focus: 'right-high',
        description: 'We didn\'t know what "bacanora" was either until this client approached us to brand a line of spirits. Apparently, it\'s a lil\' less smoky than mezcal and more flavorful than tequila\u2026 and it\'s delicious and now in national distribution.\n\nSince it was illegal in Mexico until 1992, we crafted a brand persona for people who would rather leave the club than wait behind a rope. We owned the strategy, positioning, identity, packaging, and the bottle itself, modeled in 3d before anyone blew glass. Built on Sonora\'s heat, dust, and outlaw spirit.',
        galleryImages: [
          { heading: 'The world' },
          /* Both 16:9, so they sit level rather than ragged. */
          { row: [
            { src: '/assets/img/work/estaca/lifestyle.jpg',
              alt: 'Lifestyle photography: a man in a rumpled linen suit drinking bacanora at a Sonoran bar, the red ESTACA bottle beside him and a product spec panel across the frame.' },
            { src: '/assets/img/work/estaca/pitch-cantina.jpg',
              alt: 'The ESTACA 1627 mark over a dark Sonoran cantina interior, lit by a wrought-iron chandelier.' }
          ] },
          /* The whole 31.5s film rather than an excerpt, looping like the
             short clips do. Re-encoded from a 61MB / 15.6Mbps master down to
             960x540 - still the heaviest single asset on the site at 4.2MB,
             which is affordable only because it is never fetched until it
             nears the viewport inside an opened project. */
          { clip: '/assets/img/work/estaca/film.mp4',
            poster: '/assets/img/work/estaca/poster-film.jpg',
            crop: 'wide', caption: 'The film' },
          { heading: 'The bottle' },
          /* Paired small rather than one large screenshot: the point is the
             progression from blocked-out form to finished product, which a
             single frame cannot show, and neither needs to be read pixel by
             pixel to make it. */
          { row: [
            { src: '/assets/img/work/estaca/process-mesh.jpg',
              alt: 'The bottle blocked out in 3D: an untextured grey mesh of the tapered obelisk form in the modelling viewport.' },
            { src: '/assets/img/work/estaca/process-render.jpg',
              alt: 'The same bottle finished: orthographic front, side and back views, a wireframe, and a textured render of the red obelisk with the agave mark.' }
          ] },
          /* Three expressions, one row - they are a family and read as one. */
          { row: [
            { src: '/assets/img/work/estaca/bottle-red.jpg',
              alt: 'The flagship expression in red: a tapered obelisk bottle with the white agave mark, beside a filled shot glass on a cork coaster.' },
            { src: '/assets/img/work/estaca/bottle-trago.jpg',
              alt: 'The El Trago expression in cobalt blue, photographed on grey marble beside a filled shot glass.' },
            { src: '/assets/img/work/estaca/bottle-salvaje.jpg',
              alt: 'The Salvaje expression in white with the red agave mark, photographed on dark tile beside a filled shot glass.' }
          ] },
          { clip: '/assets/img/work/estaca/clip-bottles.mp4',
            poster: '/assets/img/work/estaca/poster-bottles.jpg',
            crop: 'wide', caption: 'Both expressions, out past the fence line' },
          /* Was 'The campaign', which described the lifestyle shot that has
             since moved up into the opening row. What sits here now is the
             pitch cover, press logos and all. */
          { heading: 'The pitch' },
          { src: '/assets/img/work/estaca/pitch-dia.jpg',
            alt: 'ESTACA 1627 pitch cover: a woman in Día de Muertos face paint and a red-and-gold floral headdress beside the ESTACA Bacanora wordmark, over logos for Food & Wine, bon appétit and MarketWatch.' },
          { credits: {
            items: ['Brand discovery', 'Brand strategy + positioning',
                    'Visual identity + logo', 'Packaging design',
                    'Bottle design + 3D modelling', 'Creative direction',
                    'Photography art direction'],
            note: 'Decatur, GA'
          } }
        ]
      },
      {
        id: 'secret-show',
        title: 'The Secret Show',
        category: 'Event identity',
        coverImage: '/assets/img/work/secret-show/cover.jpg',
        description: 'A live show you had to hear about from someone else. We named it, drew the mark, and built a system that gives away almost nothing. Posters, screens, signage, social, none of it explaining itself.',
        galleryImages: [
          { heading: 'The mark' },
          { src: '/assets/img/work/secret-show/wordmark.jpg',
            alt: 'The Secret Show wordmark: condensed hand-drawn caps stacked over two lines on black textured plaster, with a gold keyhole standing in for the O of SHOW.' },
          { heading: 'Applied' },
          /* Both 3:2, so they sit level beside each other rather than ragged. */
          { row: [
            { src: '/assets/img/work/secret-show/web.jpg',
              alt: 'Website and screen mockups carrying the Secret Show identity.' },
            { src: '/assets/img/work/secret-show/signage.jpg',
              alt: 'Event signage painted as a mural across construction hoarding.' }
          ] },
          { src: '/assets/img/work/secret-show/social.jpg',
            alt: 'Social promo posters in the Secret Show system.' },
          { credits: {
            items: ['Naming', 'Visual identity + logo', 'Creative direction',
                    'Palette + type system', 'Poster + social design',
                    'Event signage', 'Screen + slide content'],
            note: 'Decatur, GA'
          } }
        ]
      }
    ];

    var detail        = document.querySelector('.gallery__detail');
    var detailScroll  = detail.querySelector('.gallery__detail-scroll');
    var detailHero    = detail.querySelector('.gallery__detail-hero');
    var detailImg     = detail.querySelector('.gallery__detail-img');
    var detailTitle   = detail.querySelector('.gallery__detail-title');
    var detailCat     = detail.querySelector('.gallery__detail-category');
    var detailDesc    = detail.querySelector('.gallery__detail-description');
    var detailGallery = detail.querySelector('.gallery__detail-gallery');
    var detailBody    = detail.querySelector('.gallery__detail-body');
    var clipObserver  = null;   // torn down with the clips in finish()
    var closeBtn      = detail.querySelector('.gallery__close');

    var openCard = null;    // the <button> that opened the currently-open dialog
    var closing  = false;   // guards against double-triggering close mid-animation

    function renderCard(project) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery__card';
      btn.setAttribute('aria-label', 'View project: ' + project.title);

      var img = document.createElement('img');
      img.className = 'gallery__card-img';
      img.src = project.coverImage;
      img.alt = '';               // decorative - the button's aria-label carries the name
      img.loading = 'lazy';
      if (project.focus) img.setAttribute('data-focus', project.focus);

      var overlay = document.createElement('div');
      overlay.className = 'gallery__card-overlay';
      var title = document.createElement('h3');
      title.className = 'gallery__card-title';
      title.textContent = project.title;
      var cat = document.createElement('p');
      cat.className = 'gallery__card-category';
      cat.textContent = project.category;
      overlay.appendChild(title);
      overlay.appendChild(cat);

      btn.appendChild(img);
      btn.appendChild(overlay);
      // The rail renders three copies of every project (see below), so the
      // opened project has to be hidden by ID across all of them - hiding only
      // the clicked node would leave a visible duplicate of the card that is
      // supposedly mid-flight into the dialog.
      btn.dataset.project = project.id;
      btn.addEventListener('click', function () { openProject(project, btn); });
      return btn;
    }

    /* Infinite rail: render the set three times and keep the scroll position
       parked in the middle copy. When the user scrolls far enough into the
       leading or trailing copy, jump silently by exactly one set width - the
       content under the pointer is identical, so the seam is invisible and the
       rail appears to loop forever in both directions.

       Only the middle copy is real to assistive tech and the keyboard; the
       outer two are aria-hidden with tabindex -1, so a keyboard user tabs
       through five cards, not fifteen, and a screen reader hears each project
       once. They stay clickable, because a mouse user who clicks a visible
       clone must still open that project. */
    function buildSet(hidden) {
      var frag = document.createDocumentFragment();
      PROJECTS.forEach(function (project) {
        var card = renderCard(project);
        if (hidden) {
          card.setAttribute('aria-hidden', 'true');
          card.tabIndex = -1;
        }
        frag.appendChild(card);
      });
      return frag;
    }

    galleryRail.appendChild(buildSet(true));   // leading clones
    galleryRail.appendChild(buildSet(false));  // the real, focusable set
    galleryRail.appendChild(buildSet(true));   // trailing clones

    // Every rendered copy of one project, across all three sets.
    function copiesOf(id) {
      return Array.prototype.slice.call(
        galleryRail.querySelectorAll('.gallery__card[data-project="' + id + '"]')
      );
    }

    var setWidth = 0;

    function measureSet() {
      var cards = galleryRail.querySelectorAll('.gallery__card');
      if (cards.length < PROJECTS.length * 2) return;
      /* Distance from the first card to its counterpart one set later, so
         gaps and padding are already included.

         getBoundingClientRect, NOT offsetLeft: offsetLeft is rounded to whole
         pixels, and at some viewport widths the card pitch is fractional
         (measured 325.55px), so the same distance came out 1953 one way and
         1954 the other. The loop jumps by exactly this number, so a rounded
         value shifts the content slightly on every jump.

         Subtracting two rects is only exact because both cards carry the SAME
         rotation - the tilt cycle length equals PROJECTS.length, which
         guarantees index 0 and index PROJECTS.length are the same project at
         the same angle, so the rotation offset cancels. That invariant is
         documented on .gallery__card:nth-child(6n+k) in site.css; if it is
         ever broken, this measurement breaks with it. */
      setWidth = cards[PROJECTS.length].getBoundingClientRect().left
               - cards[0].getBoundingClientRect().left;
    }

    function recentre() {
      if (setWidth) galleryRail.scrollLeft = setWidth;
    }

    // Snap has to be off for the jump. Re-setting scrollLeft while a snap is
    // resolving makes the browser fight the correction and land somewhere else.
    // Snap used to have to be toggled off around this jump, or the browser
    // would fight the correction while a snap resolved. The rail no longer
    // snaps at all (it cancelled the drift animation - see site.css), so the
    // jump is now a plain assignment.
    function jumpTo(x) {
      galleryRail.scrollLeft = x;
    }

    function normalise() {
      if (!setWidth) return;
      var x = galleryRail.scrollLeft;
      if (x < setWidth * 0.5)      jumpTo(x + setWidth);
      else if (x > setWidth * 1.5) jumpTo(x - setWidth);
    }

    galleryRail.addEventListener('scroll', normalise, { passive: true });

    /* The "more" arrow. A real control rather than a decorative marker - it
       advances the rail by one card, so it both signals the horizontal axis
       and does something useful. The rail loops, so this never dead-ends. */
    var nextBtn = document.querySelector('.gallery__next');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var card = galleryRail.querySelector('.gallery__card');
        if (!card) return;
        var step = card.getBoundingClientRect().width +
                   parseFloat(getComputedStyle(galleryRail).gap || 0);
        // 'smooth' here is the one place easing is wanted - the loop's own
        // corrections stay instant so the seam is never visible.
        galleryRail.scrollBy({ left: step, behavior: 'smooth' });
      });
    }

    window.addEventListener('resize', function () {
      var before = setWidth;
      measureSet();
      // Keep the same relative offset within the set across a resize, rather
      // than snapping back to the start.
      if (before && setWidth) {
        galleryRail.scrollLeft = setWidth + (galleryRail.scrollLeft - before);
      } else {
        recentre();
      }
    });

    measureSet();
    recentre();
    // Cover images are lazy-loaded, so the rail's width can change after this
    // first measure; re-measure once everything has settled.
    window.addEventListener('load', function () { measureSet(); recentre(); });

    /* The interaction hint is now CSS, not JS: a scroll-linked drift on
       .gallery__card (see "Scroll-linked drift" in site.css). It runs on the
       compositor via a view-timeline, needs no observer, and cannot disturb the
       infinite-loop maths - transforms don't affect layout, so offsetLeft is
       untouched. The earlier one-shot JS bob was removed rather than kept
       alongside it: both wrote transform on the same elements, so they would
       have overwritten each other. */

    // ---- scroll lock: position:fixed on body, not overflow:hidden --------
    // overflow:hidden on body (or any ancestor) becomes the containing block
    // for position:sticky descendants - that's exactly what broke the sticky
    // footer reveal earlier in this project. This technique never touches
    // overflow, so the footer's own behaviour is unaffected while a dialog
    // is open.
    var lockedScrollY = 0;
    function lockScroll() {
      lockedScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = -lockedScrollY + 'px';
      document.body.style.width = '100%';
    }
    function unlockScroll() {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, lockedScrollY);
    }

    // ---- FLIP -------------------------------------------------------------
    // Animates `el` from `first` (its old rect) to whatever its CURRENT
    // (already-final) layout position/size is, via a single transform, so
    // the motion is compositor-only rather than animating top/left/width/
    // height directly. Returns the Animation so callers can wait on it.
    var FLIP_MS = 600;
    var FLIP_EASE = 'cubic-bezier(.22, .61, .36, 1)'; // this site's own --ease, not a new curve

    function flip(el, first, fromRadius, toRadius, reverse) {
      // Cancel any leftover animation BEFORE measuring. These use
      // fill:'forwards', so a finished one stays attached and keeps applying
      // its end transform - and on reopen that means `last` below would be
      // measured while the previous CLOSE animation still has the element
      // scaled down to card size, making every subsequent FLIP compute from
      // a wrong baseline. Cancelling is visually safe: open's end state is
      // `transform: none`, which is identical to the element's natural state,
      // and after close the dialog is hidden anyway.
      el.getAnimations().forEach(function (a) { a.cancel(); });

      // Measure the natural box BEFORE taking the element out of flow.
      var last = el.getBoundingClientRect();

      /* Animate the real BOX (left/top/width/height), not a transform.

         transform:scale() cannot do this correctly here, because the card and
         the expanded hero have very different aspect ratios - 300x400 (0.75)
         vs 1280x496 (2.58). A transform that maps one onto the other needs a
         NON-UNIFORM scale (scaleX 0.234, scaleY 0.806), which squashes the
         image to ~29% of its correct width for the whole animation. And
         object-fit:cover is computed from the element's real box, which a
         transform never changes - so the crop is wrong the entire time too.

         Animating the box instead means object-fit:cover recomputes every
         frame: the crop interpolates smoothly from the card's full-image view
         to the hero's wide slice, with zero distortion at any point. */
      /* The card is tilted (see .gallery__card:nth-child(5n+k) in site.css), so
         the transition has to straighten it as it grows - otherwise the tilt
         snaps to zero on frame 1. `first.rotate` is the card's own angle,
         measured by cardBox() below; the expanded hero is always upright. */
      var atCard = { left: first.left, top: first.top,
                     width: first.width, height: first.height,
                     radius: fromRadius, rotate: first.rotate || '0deg' };
      var atFull = { left: last.left,  top: last.top,
                     width: last.width,  height: last.height,
                     radius: toRadius,   rotate: '0deg' };

      var from = reverse ? atFull : atCard;
      var to   = reverse ? atCard : atFull;

      function box(b) {
        return {
          left: b.left + 'px', top: b.top + 'px',
          width: b.width + 'px', height: b.height + 'px',
          borderRadius: b.radius,
          rotate: b.rotate
        };
      }

      /* position:fixed for the duration. Two reasons: left/top then match the
         viewport-relative rects we measured, and resizing an out-of-flow
         element reflows only itself - never the page. That's what makes
         animating width/height affordable here. The inline start box is set
         immediately so there's no frame where the element paints at its
         natural size before the animation's first keyframe lands. */
      var f = box(from);
      el.style.position = 'fixed';
      el.style.margin = '0';
      el.style.left = f.left;
      el.style.top = f.top;
      el.style.width = f.width;
      el.style.height = f.height;
      el.style.borderRadius = f.borderRadius;
      el.style.rotate = f.rotate;

      return el.animate([f, box(to)], { duration: FLIP_MS, easing: FLIP_EASE, fill: 'forwards' });
    }

    /* getBoundingClientRect() on a rotated element returns its AXIS-ALIGNED
       bounding box: upright, and larger than the card itself (a 310x413 card
       at 2deg measures ~324x424). Starting the FLIP from that box would begin
       the expansion slightly too big and with the tilt already gone.

       offsetWidth/offsetHeight are layout dimensions, untouched by transform
       and rotate, so they give the card's true size. Both rotate and the drift
       translate leave the rect's CENTRE where the visible card's centre is
       (rotation is about the centre by default, and translation moves centre
       and box together), so re-deriving the box from that centre gives the
       card exactly as it appears on screen, drift included. */
    function cardBox(el) {
      var r = el.getBoundingClientRect();
      var w = el.offsetWidth, h = el.offsetHeight;
      var rot = getComputedStyle(el).rotate;
      return {
        left: r.left + r.width / 2 - w / 2,
        top:  r.top  + r.height / 2 - h / 2,
        width: w, height: h,
        rotate: (!rot || rot === 'none') ? '0deg' : rot
      };
    }

    /* Returns the hero to normal flow. MUST run after the open transition too,
       not just on close - if the hero stayed position:fixed, it would stay
       pinned to the viewport while the detail body scrolled underneath it.
       Safe to call repeatedly; clearing already-cleared styles is a no-op. */
    function clearHeroBox() {
      detailHero.getAnimations().forEach(function (a) { a.cancel(); });
      detailHero.style.position = '';
      detailHero.style.margin = '';
      detailHero.style.left = '';
      detailHero.style.top = '';
      detailHero.style.width = '';
      detailHero.style.height = '';
      detailHero.style.borderRadius = '';
      detailHero.style.rotate = '';
      detailHero.style.transformOrigin = '';
      detailHero.style.transform = '';
    }

    // ---- focus trap ---------------------------------------------------
    function focusableIn(container) {
      return Array.prototype.slice.call(
        container.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
      ).filter(function (el) {
        // getClientRects(), NOT offsetParent: offsetParent is null for
        // position:fixed elements, and the close button is fixed - so an
        // offsetParent check filters out the dialog's only focusable element,
        // leaving the trap with nothing to cycle and silently letting Tab
        // escape to the page behind the dialog.
        return !el.disabled && el.getClientRects().length > 0;
      });
    }

    function onDialogKeydown(e) {
      if (e.key === 'Escape') { e.preventDefault(); closeProject(); return; }
      if (e.key !== 'Tab') return;
      var focusable = focusableIn(detail);
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    function openProject(project, cardEl) {
      var cardRect = cardBox(cardEl);
      var cardRadius = getComputedStyle(cardEl).borderRadius;

      openCard = cardEl;
      detailImg.src = project.coverImage;
      detailImg.alt = project.title + ' cover image';
      if (project.focus) detailImg.setAttribute('data-focus', project.focus);
      else detailImg.removeAttribute('data-focus');
      detailTitle.textContent = project.title;
      detailCat.textContent = project.category;
      detailDesc.textContent = project.description;
      detailGallery.innerHTML = '';
      /* Gallery entries are polymorphic so a case study can interleave stills,
         motion and section headings in one authored order. A plain string is
         the shorthand for an image with a generic alt.
             'url'                  -> image
             { src, alt }           -> image with a real description
             { heading }            -> section divider
             { video, title }       -> embedded motion (see note below) */
      var clips = [];
      project.galleryImages.forEach(function (item) {
        var node = renderEntry(item, project, clips);
        if (node) detailGallery.appendChild(node);
      });
      if (clips.length) observeClips(clips);

      function renderEntry(item, project, clips) {
        if (typeof item === 'string') item = { src: item };

        if (item.heading) {
          var h = document.createElement('h3');
          h.className = 'gallery__detail-heading';
          h.textContent = item.heading;
          return h;
        }

        /* Two entries side by side on desktop, stacked on mobile. This is what
           creates the rhythm - a tall clip beside a square one - so it recurses
           rather than being a special case for clips only. */
        if (item.row) {
          var row = document.createElement('div');
          // Column count follows the entry count, so a set of three product
          // shots sits three-up instead of 2 + 1 orphan.
          row.className = 'gallery__detail-row'
            + (item.row.length === 3 ? ' gallery__detail-row--3' : '');
          item.row.forEach(function (sub) {
            var n = renderEntry(sub, project, clips);
            if (n) row.appendChild(n);
          });
          return row;
        }

        /* A real downloadable artefact (a deck, a spec). Opens in a new tab
           rather than navigating away from the dialog, which would lose the
           reader's place in the gallery. */
        /* A horizontal strip of frames, rendered WHERE IT IS AUTHORED rather
           than pinned to the end of the body. It was previously a fixed
           trailing section, which put a deck's pages after its own credits.

           variant 'deck' separates the pages; the default is seamless, for
           work that is one continuous image cut into frames - there any gap
           or corner radius would invent a seam the artwork does not have. */
        if (item.strip) {
          var deck = item.strip.variant === 'deck';
          var sec = document.createElement('section');
          sec.className = 'gallery__strip';
          var sl = document.createElement('h3');
          sl.className = 'gallery__strip-label';
          sl.textContent = item.strip.label;
          var sr = document.createElement('div');
          sr.className = 'gallery__strip-rail' + (deck ? ' gallery__strip-rail--deck' : '');
          sr.tabIndex = 0;                 // keyboard-scrollable
          sr.setAttribute('role', 'group');
          sr.setAttribute('aria-label', item.strip.label);
          item.strip.images.forEach(function (src, i) {
            var im = document.createElement('img');
            im.src = src;
            im.alt = project.title + (deck ? ' deck page ' : ' frame ')
                     + (i + 1) + ' of ' + item.strip.images.length;
            im.loading = 'lazy';
            sizeImg(im, src);         // reserve the box - see IMG_DIMS
            sr.appendChild(im);
          });
          sec.appendChild(sl);
          sec.appendChild(sr);
          return sec;
        }

        if (item.doc) {
          var a = document.createElement('a');
          a.className = 'gallery__doc';
          a.href = item.doc;
          a.target = '_blank';
          a.rel = 'noopener';
          var dl = document.createElement('span');
          dl.className = 'gallery__doc-label';
          dl.textContent = item.label || 'Open document';
          a.appendChild(dl);
          if (item.meta) {
            var dm = document.createElement('span');
            dm.className = 'gallery__doc-meta';
            dm.textContent = item.meta;
            a.appendChild(dm);
          }
          return a;
        }

        if (item.credits) {
          var cwrap = document.createElement('div');
          cwrap.className = 'gallery__credits';
          var ch = document.createElement('h3');
          ch.className = 'gallery__detail-heading';
          ch.textContent = 'Credits';
          var ul = document.createElement('ul');
          ul.className = 'gallery__credits-list';
          item.credits.items.forEach(function (t) {
            var li = document.createElement('li');
            li.textContent = t;
            ul.appendChild(li);
          });
          cwrap.appendChild(ch);
          cwrap.appendChild(ul);
          if (item.credits.note) {
            var note = document.createElement('p');
            note.className = 'gallery__credits-note';
            note.textContent = item.credits.note;
            cwrap.appendChild(note);
          }
          return cwrap;
        }

        /* Self-hosted silent loop. Not a GIF: the same 4s at 960x540 would be
           6-12MB as a GIF in 256 colours, versus ~300-700KB as H.264 with the
           full palette and hardware decode.

           `src` is deliberately NOT set here. preload="none" alone still lets
           some browsers speculatively fetch; withholding src until the clip
           nears the viewport guarantees nothing downloads. Same approach as
           the studio texture in section 3.

           Note these are torn down explicitly in finish() - see the comment
           there; removing the element alone does not stop playback. */
        if (item.clip) {
          var cfig = document.createElement('figure');
          cfig.className = 'gallery__detail-clip gallery__detail-clip--' + (item.crop || 'wide');
          var v = document.createElement('video');
          v.muted = true;            // property, not just the attribute -
          v.setAttribute('muted', '');  // Safari checks the property for autoplay
          v.loop = true;
          v.playsInline = true;      // without this iOS goes fullscreen on play
          v.setAttribute('playsinline', '');
          v.preload = 'none';
          v.controls = false;
          if (item.poster) v.poster = item.poster;
          v.dataset.src = item.clip;
          if (item.caption) v.setAttribute('aria-label', item.caption);
          cfig.appendChild(v);
          if (item.caption) {
            var ccap = document.createElement('figcaption');
            ccap.textContent = item.caption;
            cfig.appendChild(ccap);
          }
          clips.push(v);
          return cfig;
        }

        if (item.video) {
          /* The iframe is CREATED HERE, on open, and destroyed on close (see
             finish()). Two reasons it is not authored into the page:
             nothing contacts YouTube until a visitor actually opens a project
             that has motion in it, and removing the element is the only
             reliable way to stop playback on close without pulling in the
             YouTube player API. nocookie host, and no `related` videos. */
          var figure = document.createElement('figure');
          figure.className = 'gallery__detail-video';
          var frame = document.createElement('iframe');
          frame.src = 'https://www.youtube-nocookie.com/embed/' + item.video + '?rel=0';
          frame.title = item.title;
          frame.loading = 'lazy';
          frame.allow = 'accelerometer; encrypted-media; picture-in-picture';
          frame.setAttribute('allowfullscreen', '');
          frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          var cap = document.createElement('figcaption');
          cap.textContent = item.title;
          figure.appendChild(frame);
          figure.appendChild(cap);
          return figure;
        }

        var img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt || (project.title + ' additional project image');
        img.loading = 'lazy';
        sizeImg(img, item.src);   // reserve the box - see IMG_DIMS
        return img;
      }

      /* Fetch AND playback are both gated on approaching the viewport, and
         off-screen clips are paused - several 4s loops decoding at once on a
         long page is real battery cost for motion nobody is looking at.
         Mirrors the studio texture observer in section 3, including its
         reduced-motion behaviour: load a frame, never call play(). */
      function observeClips(clips) {
        function start(v) {
          if (!v.dataset.loaded) {
            v.dataset.loaded = '1';
            v.preload = 'auto';
            v.src = v.dataset.src;
          }
          if (reduced) return;               // motion off: poster frame only
          v.play().catch(function () {});    // autoplay refusal is not fatal
        }
        if (!('IntersectionObserver' in window)) {
          clips.forEach(start);
          return;
        }
        // root is the dialog's scroller, not the document - the page behind
        // the dialog is not what these clips scroll within.
        clipObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            e.isIntersecting ? start(e.target) : e.target.pause();
          });
        }, { root: detailScroll, rootMargin: '200px 0px' });
        clips.forEach(function (v) { clipObserver.observe(v); });
      }

      detailBody.classList.remove('is-visible');
      detail.hidden = false;
      detailScroll.scrollTop = 0; // "begins at the top of the expanded project"
      lockScroll();
      // Hide EVERY copy of this project, not just the clicked node - the rail
      // renders the set three times, so hiding one would leave a duplicate of
      // the card visible while it is supposedly expanding into the dialog.
      // visibility, not display:none - the rail's geometry must not shift, or
      // the loop maths and the close animation's target would both move.
      copiesOf(project.id).forEach(function (c) { c.style.visibility = 'hidden'; });

      if (reduced) {
        detailHero.style.borderRadius = '0px';
        detail.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: 'forwards' });
        detailBody.classList.add('is-visible');
      } else {
        // Drop the hero back into normal flow once it lands - while the FLIP
        // runs it is position:fixed, and leaving it that way would pin it to
        // the viewport while the detail body scrolled underneath it.
        flip(detailHero, cardRect, cardRadius, '0px', false).onfinish = clearHeroBox;
        setTimeout(clearHeroBox, FLIP_MS + 120);   // finish events get dropped on hidden tabs
        setTimeout(function () { detailBody.classList.add('is-visible'); }, FLIP_MS * 0.35);
      }

      closeBtn.focus();
      document.addEventListener('keydown', onDialogKeydown);
    }

    function closeProject() {
      if (!openCard || closing) return;
      closing = true;
      document.removeEventListener('keydown', onDialogKeydown);

      // Re-measure now, not the rect captured at open time - the window may
      // have been resized while the dialog was open, and the reverse FLIP
      // has to land on the card's CURRENT position, not a stale one.
      var cardRect = cardBox(openCard);
      var cardRadius = getComputedStyle(openCard).borderRadius;
      var originCard = openCard;

      var done = false;
      function finish() {
        if (done) return;   // onfinish and the safety net below must not both run
        done = true;
        detail.hidden = true;
        /* Emptied rather than merely hidden. A hidden iframe keeps playing -
           audio would carry on over the page behind the closed dialog - and
           removing the element is the only way to stop it without the YouTube
           player API. Both containers are rebuilt from scratch on every open,
           so clearing them here costs nothing. */
        if (clipObserver) { clipObserver.disconnect(); clipObserver = null; }

        /* Each clip must be explicitly stopped BEFORE the container is emptied.
           Detaching a <video> from the document does NOT reliably pause it -
           measured here, a removed element kept decoding and advanced its
           currentTime by 2s after the dialog closed. These loops are muted so
           nothing is audible, but a decoder left running per open/close is real
           battery cost that accumulates over a visit.
           Dropping src and calling load() is what actually releases it. */
        Array.prototype.forEach.call(detailGallery.querySelectorAll('video'),
          function (v) {
            v.pause();
            v.removeAttribute('src');
            v.load();
          });

        detailGallery.innerHTML = '';
        clearHeroBox();   // cancels the animation and returns the hero to flow
        copiesOf(originCard.dataset.project).forEach(function (c) { c.style.visibility = ''; });
        unlockScroll();
        originCard.focus();   // focus returns to the exact node that was clicked
        openCard = null;
        closing = false;
      }

      /* Safety net alongside onfinish, deliberately. Browsers throttle
         animation callbacks on hidden pages, so a visitor who closes a
         project and immediately switches tabs can have the finish event
         delayed or dropped - and this dialog locks page scroll and traps
         focus, so failing to clean up strands them with an unusable page.
         `done` makes whichever fires first the only one that runs. */
      if (reduced) {
        detail.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' }).onfinish = finish;
        setTimeout(finish, 300);
      } else {
        // Secondary content fades out before the collapse starts, per brief.
        detailBody.classList.remove('is-visible');
        setTimeout(function () {
          // Radius args are in the SAME order as the open call: `reverse`
          // plays those keyframes backwards, so passing them pre-swapped
          // here would run the radius the wrong way (the expanded view's 0px
          // has to grow back into the card's 18px, not shrink from it).
          flip(detailHero, cardRect, cardRadius, '0px', true).onfinish = finish;
          setTimeout(finish, FLIP_MS + 120);
        }, 180);
      }
    }

    closeBtn.addEventListener('click', closeProject);
  }

  /* ---- 8. Inquiry form ----------------------------------------------------
     Posts to Netlify Forms in the background so the visitor stays on the page.
     The form name (`inquiry`) and field names are what Netlify keys its email
     notification off - do not rename them. If fetch fails or JS is absent the
     form still submits normally and Netlify serves its own success page. */
  var form = document.getElementById('inquiry-form');
  var status = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    if (!form.checkValidity()) return; // let the browser show its own messages

    e.preventDefault();
    status.textContent = 'Sending…';

    var body = new URLSearchParams(new FormData(form)).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        sent();
      })
      .catch(function () {
        // Don't swallow it - a lost inquiry is the one failure that matters.
        status.textContent = 'That didn’t send. Email hum@humcreative.co instead.';
      });
  });

  function sent() {
    var slot = document.getElementById('form-slot');
    slot.innerHTML =
      '<div class="form__sent">Thank you.' +
      '<p>No automated response. No drip sequence. ' +
      'Just two people who will read what you wrote.</p></div>';
    slot.querySelector('.form__sent').setAttribute('tabindex', '-1');
    slot.querySelector('.form__sent').focus();
  }
})();
