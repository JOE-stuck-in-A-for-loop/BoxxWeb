const PHRASES = [
  { text: 'Information Cocoon', type: 'cocoon' },
  { text: 'Misinformation', type: 'misinfo' },
  { text: 'Malicious Personal Attacks', type: 'attacks' },
  { text: 'Discrimination and Bullying', type: 'discrimination' },
  { text: 'Mindless Chatter', type: 'chatter' },
  { text: 'False Hype', type: 'hype' },
  { text: 'Malicious Manipulation', type: 'manipulation' },
];

const TIMING = {
  appear: 600,
  hold: 1800,
  destroy: 1000,
  fadeOut: 500,
  pause: 400,
};

let destructionTimeout = null;

function isMobile() {
  return window.innerWidth < 600;
}

/* ──────────── DESTRUCTION EFFECTS ──────────── */
function destroyCocoon(el, letters, onDone) {
  el.style.transition = 'transform 0.4s cubic-bezier(0.25,0.1,0.25,1)';
  el.style.transform = 'scale(0.3)';
  const intensity = isMobile() ? 0.5 : 1;
  const baseDelay = 350;
  letters.forEach((ch, i) => {
    const d = i * 25;
    destructionTimeout = setTimeout(() => {
      ch.style.transition = `transform 0.3s ease, opacity 0.3s ease`;
      ch.style.transform = `translate(${(Math.random() - 0.5) * 80 * intensity}px, ${(Math.random() - 0.5) * 80 * intensity}px) rotate(${(Math.random() - 0.5) * 180}deg)`;
      ch.style.opacity = '0';
    }, baseDelay + d);
  });
  destructionTimeout = setTimeout(onDone, baseDelay + letters.length * 25 + 200);
}

function destroyMisinfo(el, letters, onDone) {
  const intensity = isMobile() ? 0.6 : 1;
  // RGB split frames
  const splits = [
    '3px 0 rgba(255,0,0,0.7), -3px 0 rgba(0,255,255,0.7)',
    '-3px 0 rgba(255,0,0,0.7), 3px 0 rgba(0,255,255,0.7)',
    '4px 0 rgba(255,0,255,0.5), -4px 0 rgba(0,255,255,0.5)',
    '2px 0 #ff0040, -2px 0 #00ff80',
  ];
  splits.forEach((s, i) => {
    destructionTimeout = setTimeout(() => { el.style.textShadow = s; }, i * 80);
  });
  // Scanline flicker
  destructionTimeout = setTimeout(() => { el.style.opacity = '0.2'; }, 200);
  destructionTimeout = setTimeout(() => { el.style.opacity = '0.7'; }, 230);
  destructionTimeout = setTimeout(() => { el.style.opacity = '0.1'; }, 310);
  destructionTimeout = setTimeout(() => { el.style.opacity = '0.6'; }, 350);

  // Pixelate + dissolve
  destructionTimeout = setTimeout(() => {
    el.style.transition = 'opacity 0.5s ease, filter 0.5s ease';
    el.style.filter = `blur(${3 * intensity}px) brightness(1.4)`;
    el.style.opacity = '0';
  }, 450);

  destructionTimeout = setTimeout(onDone, 950);
}

function destroyAttacks(el, letters, onDone) {
  const intensity = isMobile() ? 0.4 : 1;
  // Each letter spiked outward
  letters.forEach((ch, i) => {
    const angle = (i / letters.length) * Math.PI * 2;
    const dist = (50 + Math.random() * 40) * intensity;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const delay = i * 15;
    destructionTimeout = setTimeout(() => {
      ch.style.transition = `transform 0.5s cubic-bezier(0.25,0.1,0.25,1), opacity 0.5s ease`;
      ch.style.transform = `translate(${dx}px, ${dy}px) rotate(${(Math.random() - 0.5) * 120}deg) scale(${0.5 + Math.random()})`;
      ch.style.opacity = '0';
    }, delay);
  });
  destructionTimeout = setTimeout(onDone, 700 + letters.length * 15);
}

function destroyDiscrimination(el, letters, onDone) {
  const mid = Math.floor(letters.length / 2);
  // Squeeze
  el.style.transition = 'transform 0.3s ease';
  el.style.transform = 'scaleX(0.6)';
  destructionTimeout = setTimeout(() => {
    // Split: right half + middle sink, left half rises slightly
    letters.forEach((ch, i) => {
      const delay = i * 30;
      destructionTimeout = setTimeout(() => {
        ch.style.transition = `transform 0.5s ease, opacity 0.5s ease`;
        if (i >= mid) {
          ch.style.transform = `translateY(${15 + Math.random() * 25}px) rotate(${(Math.random() - 0.5) * 25}deg)`;
        } else {
          ch.style.transform = `translateY(${-(3 + Math.random() * 8)}px)`;
        }
        ch.style.opacity = '0.2';
      }, delay);
    });
  }, 300);
  destructionTimeout = setTimeout(() => {
    el.style.transition = 'opacity 0.4s ease';
    el.style.opacity = '0';
  }, 650);
  destructionTimeout = setTimeout(onDone, 1000);
}

function destroyChatter(el, letters, onDone) {
  const intensity = isMobile() ? 0.5 : 1;
  letters.forEach((ch, i) => {
    const delay = i * 40;
    destructionTimeout = setTimeout(() => {
      ch.style.transition = `transform ${0.7 + Math.random() * 0.4}s ease-out, opacity ${0.7 + Math.random() * 0.4}s ease-out, filter 0.7s ease-out`;
      ch.style.transform = `translate(${(Math.random() - 0.5) * 100 * intensity}px, ${(-30 - Math.random() * 60) * intensity}px) scale(${1.3 + Math.random() * 0.6})`;
      ch.style.filter = `blur(${(3 + Math.random() * 5) * intensity}px)`;
      ch.style.opacity = '0';
    }, delay);
  });
  destructionTimeout = setTimeout(onDone, 900 + letters.length * 40);
}

function destroyHype(el, letters, onDone) {
  // Inflate
  el.style.transition = 'transform 0.35s ease-out';
  el.style.transform = 'scale(1.5)';
  destructionTimeout = setTimeout(() => {
    el.style.filter = 'brightness(2.2)';
    destructionTimeout = setTimeout(() => {
      // Burst
      el.style.transition = 'transform 0.2s ease-in, opacity 0.3s ease, filter 0.2s ease';
      el.style.transform = 'scale(0.05)';
      el.style.filter = 'brightness(3)';
      el.style.opacity = '0';
    }, 150);
  }, 350);
  destructionTimeout = setTimeout(onDone, 800);
}

function destroyManipulation(el, letters, onDone) {
  const intensity = isMobile() ? 0.5 : 1;
  letters.forEach((ch, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    const pull = (30 + Math.random() * 50) * intensity;
    const delay = i * 35;
    destructionTimeout = setTimeout(() => {
      ch.style.transition = `transform 0.4s cubic-bezier(0.25,0.1,0.25,1), opacity 0.4s ease`;
      ch.style.transform = `translateX(${dir * pull}px)`;
      ch.style.opacity = '0';
    }, delay);
  });
  destructionTimeout = setTimeout(onDone, 700 + letters.length * 35);
}

const DESTROY_MAP = {
  cocoon: destroyCocoon,
  misinfo: destroyMisinfo,
  attacks: destroyAttacks,
  discrimination: destroyDiscrimination,
  chatter: destroyChatter,
  hype: destroyHype,
  manipulation: destroyManipulation,
};

/* ──────────── CYCLE CONTROLLER ──────────── */
function startPhraseCycle(container, reducedMotion) {
  if (!container || reducedMotion) return;
  let cancelled = false;
  let phraseIdx = 0;
  const timeouts = [];

  const ct = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timeouts.push(id);
    return id;
  };

  function cleanupTimeouts() {
    timeouts.forEach(clearTimeout);
    timeouts.length = 0;
    if (destructionTimeout) { clearTimeout(destructionTimeout); destructionTimeout = null; }
  }

  function cycle() {
    if (cancelled) return;
    const phrase = PHRASES[phraseIdx % PHRASES.length];
    phraseIdx++;

    const el = document.createElement('div');
    el.className = `tp tp--${phrase.type}`;
    el.style.cssText = `
      position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
      opacity:0; filter:blur(8px);
      font-family:'Inter','Helvetica Neue','SF Pro Display',system-ui,sans-serif;
      font-weight:600; letter-spacing:0.06em;
      color:#1F3A5F;
      font-size:clamp(1.3rem, 4.5vw, 3.2rem);
      white-space:nowrap; text-align:center;
      line-height:1.3;
      transition: opacity 0.6s ease, filter 0.6s ease, transform 0.6s ease;
      will-change: transform, opacity, filter;
    `;
    // For long phrases, allow wrapping on small screens
    if (window.innerWidth < 480 && phrase.text.length > 20) {
      el.style.whiteSpace = 'normal';
      el.style.maxWidth = '90vw';
      el.style.fontSize = 'clamp(1rem, 4vw, 1.8rem)';
    }

    const letters = phrase.text.split('').map(ch => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? ' ' : ch;
      span.style.display = 'inline-block';
      span.style.whiteSpace = 'pre';
      el.appendChild(span);
      return span;
    });

    container.appendChild(el);
    void el.offsetHeight; // force reflow

    // Appear
    el.style.opacity = '0.7';
    el.style.filter = 'blur(0)';
    el.style.transform = 'translate(-50%,-50%) translateY(0)';

    // Hold → Destroy
    ct(() => {
      if (cancelled) return;
      el.style.transition = 'none';
      el.style.transform = 'translate(-50%,-50%)';

      const destroyFn = DESTROY_MAP[phrase.type];
      if (destroyFn) {
        destroyFn(el, letters, () => {
          if (cancelled) return;
          el.style.transition = 'opacity 0.45s ease';
          el.style.opacity = '0';
          ct(() => {
            if (cancelled) return;
            if (el.parentNode) el.remove();
            ct(cycle, TIMING.pause);
          }, TIMING.fadeOut);
        });
      } else {
        el.style.transition = 'opacity 0.45s ease';
        el.style.opacity = '0';
        ct(() => {
          if (cancelled) return;
          if (el.parentNode) el.remove();
          ct(cycle, TIMING.pause);
        }, TIMING.fadeOut);
      }
    }, TIMING.appear + TIMING.hold);
  }

  cycle();

  return () => {
    cancelled = true;
    cleanupTimeouts();
    if (destructionTimeout) { clearTimeout(destructionTimeout); destructionTimeout = null; }
    container.innerHTML = '';
  };
}

/* ──────────── CSS (injected once) ──────────── */
const STYLE_ID = 'boxx-text-anim-style';
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @media (prefers-reduced-motion: reduce) {
      .text-animation-layer { display: none !important; }
    }
    @media (max-width: 480px) {
      .tp { white-space: normal !important; max-width: 90vw; }
    }
  `;
  document.head.appendChild(s);
}

export { startPhraseCycle, injectStyles };