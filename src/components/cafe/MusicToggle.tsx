import { useEffect, useRef, useState } from "react";

export default function MusicToggle() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscARef = useRef<OscillatorNode | null>(null);
  const oscBRef = useRef<OscillatorNode | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    return () => {
      oscARef.current?.stop();
      oscBRef.current?.stop();
      ctxRef.current?.close();
    };
  }, []);

  const toggle = async () => {
    if (!on) {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        gainRef.current = ctxRef.current.createGain();
        gainRef.current.gain.value = 0.03; // very subtle
        gainRef.current.connect(ctxRef.current.destination);

        // Two soft oscillators to simulate ambient hum
        oscARef.current = ctxRef.current.createOscillator();
        oscARef.current.type = "sine";
        oscARef.current.frequency.value = 180;
        oscARef.current.connect(gainRef.current);
        oscARef.current.start();

        oscBRef.current = ctxRef.current.createOscillator();
        oscBRef.current.type = "sine";
        oscBRef.current.frequency.value = 240;
        oscBRef.current.detune.value = 5;
        oscBRef.current.connect(gainRef.current);
        oscBRef.current.start();
      } else if (ctxRef.current.state === "suspended") {
        await ctxRef.current.resume();
      }
      setOn(true);
    } else {
      await ctxRef.current?.suspend();
      setOn(false);
    }
  };

  return (
    <button
      aria-label="Toggle ambient sound"
      onClick={toggle}
      className={`inline-flex size-10 items-center justify-center rounded-full border border-white/10 transition ${on ? "bg-white/20 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
    >
      {on ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 9v6l-4-4H2V9h3l4-4v4zm5 4a3 3 0 000-6m0 10a7 7 0 000-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 9v6l-4-4H2V9h3l4-4v4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 9a3 3 0 013 3m0 4a7 7 0 000-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".5" />
        </svg>
      )}
    </button>
  );
}
