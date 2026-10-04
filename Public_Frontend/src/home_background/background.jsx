import { useEffect, useRef } from 'react';
import { ThreeBackground } from './threeBackground.jsx';
import { startPhraseCycle, injectStyles } from './textAnimations.js';

function Background({ children }) {
  const textLayerRef = useRef(null);

  // Inject text animation styles once
  useEffect(() => {
    injectStyles();
  }, []);

  // Start the phrase cycle when the text layer mounts
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!textLayerRef.current || prefersReduced) return;
    const cancel = startPhraseCycle(textLayerRef.current, prefersReduced);
    return cancel;
  }, []);

  return (
    <>
      {/* Layer 1: Three.js gradient canvas — fixed, fullscreen, behind everything */}
      <ThreeBackground />

      {/* Layer 2: Non-interactive text animation layer */}
      <div
        ref={textLayerRef}
        className="text-animation-layer"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      />

      {/* Layer 3: Normal website content */}
      <div
        className="content-layer"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {children}
      </div>
    </>
  );
}

export default Background;
export { Background };