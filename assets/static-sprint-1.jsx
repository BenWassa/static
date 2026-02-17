import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// STATIC — SPRINT 1: ENTRY EXPERIENCE
// Scrollytelling landing → 4 narrative doors → convergence → Signal Board
// ============================================================

// ── DESIGN TOKENS (self-contained) ─────────────────────────
const t = {
  bg:          "#0D0B0A",
  bgElevated:  "#141210",
  bgHigh:      "#1C1917",
  text:        "#F0EDE8",
  textMuted:   "#9E9890",
  textDim:     "#5C5852",
  red:         "#E8244D",
  redDim:      "#4A0B1A",
  blue:        "#1E6FE8",
  blueDim:     "#061933",
  border:      "#2A2724",
  borderDim:   "#1A1816",
  display:     "'Barlow Condensed', 'Arial Narrow', sans-serif",
  body:        "'Source Serif 4', Georgia, serif",
  mono:        "'IBM Plex Mono', 'Courier New', monospace",
  ease:        "cubic-bezier(0.16, 1, 0.3, 1)",
};

// ── GLOBAL STYLES ───────────────────────────────────────────
const useGlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "static-sprint1-styles";
    if (document.getElementById("static-sprint1-styles")) return;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        background: ${t.bg};
        color: ${t.text};
        font-family: ${t.body};
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
      }

      /* Grain overlay */
      .static-grain::after {
        content: '';
        position: fixed;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.03;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: overlay;
      }

      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: ${t.bg}; }
      ::-webkit-scrollbar-thumb { background: ${t.border}; }

      @keyframes aberrateIn {
        0%   { text-shadow: -20px 0 ${t.red}, 20px 0 ${t.blue}; opacity: 0; }
        40%  { text-shadow: -12px 0 ${t.red}, 12px 0 ${t.blue}; opacity: 0.7; }
        70%  { text-shadow: -5px 0 ${t.red},  5px 0 ${t.blue};  opacity: 0.9; }
        85%  { text-shadow: -8px 0 ${t.red},  8px 0 ${t.blue};  opacity: 1; }
        100% { text-shadow: -3px 0 ${t.red},  3px 0 ${t.blue};  opacity: 1; }
      }

      @keyframes aberrateResolve {
        0%   { text-shadow: -3px 0 ${t.red}, 3px 0 ${t.blue}; }
        100% { text-shadow: none; }
      }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      @keyframes pulseRed {
        0%, 100% { opacity: 1; box-shadow: 0 0 0 0 ${t.red}44; }
        50%       { opacity: 0.8; box-shadow: 0 0 20px 4px ${t.red}22; }
      }

      @keyframes scanDown {
        from { transform: translateY(-100%); opacity: 0.04; }
        to   { transform: translateY(100vh); opacity: 0.04; }
      }

      @keyframes breathe {
        0%, 100% { opacity: 0.4; }
        50%       { opacity: 0.8; }
      }

      @keyframes loadBar {
        from { width: 0%; }
        to   { width: 100%; }
      }

      .door-btn {
        display: block;
        width: 100%;
        text-align: left;
        background: transparent;
        border: none;
        border-bottom: 1px solid ${t.borderDim};
        padding: 20px 0;
        cursor: pointer;
        outline: none;
        transition: border-color 300ms ${t.ease};
      }
      .door-btn:hover { border-color: ${t.border}; }
      .door-btn:hover .door-arrow { color: ${t.red}; transform: translateX(4px); }
      .door-btn:hover .door-text  { color: ${t.text}; }

      .door-arrow {
        font-family: ${t.mono};
        font-size: 12px;
        color: ${t.textDim};
        transition: all 300ms ${t.ease};
        flex-shrink: 0;
        width: 20px;
      }

      .door-text {
        font-family: ${t.body};
        font-size: 18px;
        line-height: 1.5;
        color: ${t.textMuted};
        transition: color 300ms ${t.ease};
      }

      .narrative-line {
        opacity: 0;
        transform: translateY(12px);
        transition: opacity 700ms ${t.ease}, transform 700ms ${t.ease};
      }
      .narrative-line.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .signal-board-channel {
        border: 1px solid ${t.borderDim};
        border-radius: 3px;
        padding: 28px 32px;
        cursor: pointer;
        transition: all 300ms ${t.ease};
        position: relative;
        overflow: hidden;
        background: ${t.bgElevated};
      }
      .signal-board-channel::before {
        content: '';
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 3px;
        background: ${t.textDim};
        transition: background 300ms ${t.ease}, opacity 300ms ${t.ease};
        opacity: 0.4;
      }
      .signal-board-channel:hover { border-color: ${t.border}; transform: translateY(-2px); }
      .signal-board-channel:hover::before { background: ${t.text}; opacity: 1; }
      .signal-board-channel.red::before  { background: ${t.red}; opacity: 0.6; }
      .signal-board-channel.blue::before { background: ${t.blue}; opacity: 0.6; }
      .signal-board-channel.red:hover    { border-color: ${t.red}44; box-shadow: 0 0 20px ${t.red}18; }
      .signal-board-channel.blue:hover   { border-color: ${t.blue}44; box-shadow: 0 0 20px ${t.blue}18; }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById("static-sprint1-styles");
      if (el) document.head.removeChild(el);
    };
  }, []);
};

// ── NARRATIVE CONTENT ────────────────────────────────────────
// Each narrative is an array of paragraph objects
// type: "body" | "beat" | "label" | "break"
// beat = single short line, given more visual weight

const narratives = {
  A: {
    door: "I've been exhausted for years and I can't explain why",
    color: t.red,
    channel: "red",
    label: "LOAD · ACCUMULATION",
    lines: [
      { type: "label",  text: "A Tuesday. Any Tuesday." },
      { type: "body",   text: "You wake up already behind. Not tired exactly — more like the night didn't count. The alarm goes off and instead of starting, you have to negotiate with yourself just to sit up." },
      { type: "body",   text: "The shower water sounds louder than it should. You stand there longer than necessary because at least it's predictable." },
      { type: "beat",   text: "You have not left the house yet." },
      { type: "body",   text: "The commute. Forty minutes of managing. The train carriage is too loud and too bright and someone is eating something with a smell and you can feel it all registering, all of it at once, none of it filtering out the way it seems to for everyone else." },
      { type: "body",   text: "You arrive at your desk. You look like you're fine. You are performing fine with every available resource." },
      { type: "body",   text: "By noon you've had three conversations you had to consciously script. You made eye contact when you didn't want to. You laughed at the right moments. You are fluent in a second language you learned entirely by observation and you have been speaking it for six hours." },
      { type: "beat",   text: "You are so tired." },
      { type: "body",   text: "At 4pm someone asks if you're alright and you say yes. You don't know how to explain that you've been running a process in the background all day that no one else seems to have to run. That ordinary Tuesday has cost you something most people don't spend." },
      { type: "body",   text: "You get home. You lie down. You can't explain why." },
      { type: "beat",   text: "There is a reason." },
    ],
  },
  B: {
    door: "Something clicked recently and I need to understand it",
    color: t.blue,
    channel: "blue",
    label: "RECOGNITION · REFRAME",
    lines: [
      { type: "label",  text: "The moment before everything reframes." },
      { type: "body",   text: "You were reading something. Or watching something. Or someone described an experience in a way that was so specific, so exactly right, that you stopped." },
      { type: "beat",   text: "That's me. That's exactly me." },
      { type: "body",   text: "And then the strange double sensation of relief and grief arriving at the same time. Relief because you're not broken. Grief because you're forty years old and this is the first time you've had language for it." },
      { type: "body",   text: "Your memory starts doing something automatic. It begins reprocessing old footage with new metadata. The job you lost. The relationship that ended because you said the wrong thing in the wrong tone at the wrong moment without knowing why it was wrong. The decades of trying harder and still failing at things that seem effortless for everyone around you." },
      { type: "beat",   text: "Those things start to make sense now." },
      { type: "body",   text: "But a word without a map is just a label. Understanding why is different from understanding how — how your brain actually works, what it's actually doing differently, why certain situations cost what they cost and why certain strategies help and others make everything worse." },
      { type: "body",   text: "The click was real. Now you need the architecture." },
      { type: "beat",   text: "Here it is." },
    ],
  },
  C: {
    door: "I want to understand someone in my life better",
    color: t.text,
    channel: "neutral",
    label: "OUTSIDE · INSIDE",
    lines: [
      { type: "label",  text: "From the outside." },
      { type: "body",   text: "They cancel plans. Again. They seemed fine two hours ago — you had a conversation, they laughed, they were there — and now they're saying they can't come. The excuse is vague. You're not sure whether to be worried or frustrated." },
      { type: "body",   text: "Sometimes at dinner they go quiet in a way that feels like something you did. You ask what's wrong. They say nothing. Then twenty minutes later they leave early." },
      { type: "body",   text: "They're brilliant at certain things in a way that seems almost unfair. Completely lost at others in a way that also seems unfair. You can't find the pattern." },
      { type: "beat",   text: "Now from the inside." },
      { type: "body",   text: "The dinner. The restaurant was louder than expected. The lighting was buzzing slightly — not enough for most people to notice, but enough. They'd already spent six hours at work performing a version of themselves that doesn't come naturally. Their nervous system had been managing accumulating input all day. By 8pm it was nearly full." },
      { type: "body",   text: "Nothing you did made them leave. The conversation was fine. It was everything else — the lights, the sound, the effort of existing in a body that processes everything at once with no automatic filter — that made staying impossible." },
      { type: "body",   text: "They cancelled today because last time they didn't cancel, they paid for it for three days. They're not being difficult. They're managing a capacity you can't see." },
      { type: "beat",   text: "The gap between those two perspectives is what this is about." },
    ],
  },
  D: {
    door: "I just received a diagnosis",
    color: t.blue,
    channel: "blue",
    label: "DIAGNOSIS · MAP",
    lines: [
      { type: "label",  text: "You have the word. You don't have the map." },
      { type: "body",   text: "The appointment was shorter than you expected. There was a form, some questions, possibly a longer process — and at the end of it, someone said a word that explained forty years and nothing simultaneously." },
      { type: "body",   text: "People respond to diagnosis differently. Some feel relief so strong it's almost grief. Some feel nothing yet, because the information hasn't landed. Some feel resistance — this isn't what they expected, this isn't what it looks like, this doesn't match the picture in their head." },
      { type: "beat",   text: "All of those responses are correct." },
      { type: "body",   text: "What most people don't receive with a diagnosis is the mechanics. What is actually happening in your brain. Why specific situations cost specific things. Why strategies that work for everyone else don't work for you. Why you can function brilliantly in some contexts and be completely non-functional in others that look easier from the outside." },
      { type: "body",   text: "A label tells you what you are. It doesn't tell you how you work." },
      { type: "body",   text: "That's what this is. Not therapy, not identity, not inspiration. The mechanical truth of what your brain is doing — clearly, precisely, without pretense — so you can stop guessing and start working with the actual system you have." },
      { type: "beat",   text: "Start here." },
    ],
  },
};

// ── SCROLL REVEAL HOOK ───────────────────────────────────────
const useScrollReveal = (ref, options = {}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || "0px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
};

// ── STAGGERED LINE REVEAL ────────────────────────────────────
const RevealLine = ({ children, delay = 0, type = "body" }) => {
  const ref = useRef(null);
  const visible = useScrollReveal(ref, { threshold: 0.3 });

  const styles = {
    body:  { fontFamily: t.body,    fontSize: 18, lineHeight: 1.8,  color: t.text,      fontWeight: 400 },
    beat:  { fontFamily: t.body,    fontSize: 22, lineHeight: 1.5,  color: t.text,      fontWeight: 300, fontStyle: "italic" },
    label: { fontFamily: t.mono,    fontSize: 11, lineHeight: 1.5,  color: t.textDim,   fontWeight: 400, letterSpacing: "0.15em", textTransform: "uppercase" },
  };

  return (
    <div
      ref={ref}
      className={`narrative-line ${visible ? "visible" : ""}`}
      style={{
        ...styles[type],
        transitionDelay: `${delay}ms`,
        marginBottom: type === "label" ? 32 : type === "beat" ? 32 : 20,
        maxWidth: type === "beat" ? 480 : 640,
      }}
    >
      {children}
    </div>
  );
};

// ── COMPONENTS ───────────────────────────────────────────────

// Mono label tag
const Tag = ({ children, color = t.textDim }) => (
  <span style={{
    fontFamily: t.mono,
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color,
    border: `1px solid ${color}44`,
    padding: "3px 10px",
    borderRadius: 2,
    display: "inline-block",
  }}>
    {children}
  </span>
);

// ── SCREENS ──────────────────────────────────────────────────

// Screen 1: Title
const TitleScreen = ({ onScroll }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "0 120px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Scanline effect */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${t.text}04 2px, ${t.text}04 4px)`,
        pointerEvents: "none",
      }} />

      {/* Red/blue atmospheric glow */}
      <div style={{
        position: "absolute",
        top: "20%", left: "-10%",
        width: 400, height: 400,
        borderRadius: "50%",
        background: t.red,
        opacity: 0.04,
        filter: "blur(80px)",
        pointerEvents: "none",
        animation: "breathe 6s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        bottom: "20%", right: "-10%",
        width: 400, height: 400,
        borderRadius: "50%",
        background: t.blue,
        opacity: 0.05,
        filter: "blur(80px)",
        pointerEvents: "none",
        animation: "breathe 8s ease-in-out infinite 2s",
      }} />

      {/* Top label */}
      <div style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(-10px)",
        transition: "all 800ms cubic-bezier(0.16,1,0.3,1) 200ms",
        marginBottom: 40,
      }}>
        <Tag>a guide for self-discovering adults</Tag>
      </div>

      {/* Title — ReactBits placeholder */}
      {/* NOTE: Replace this div with ReactBits BlurText / GlitchText component in production */}
      <div style={{
        animation: mounted ? "aberrateIn 2s cubic-bezier(0.16,1,0.3,1) forwards" : "none",
        marginBottom: 48,
      }}>
        <h1 style={{
          fontFamily: t.display,
          fontSize: "clamp(80px, 14vw, 200px)",
          fontWeight: 900,
          letterSpacing: "-0.02em",
          lineHeight: 0.88,
          color: t.text,
          userSelect: "none",
        }}>
          STATIC
        </h1>
      </div>
      {/* END ReactBits placeholder */}

      {/* Subtitle */}
      <div style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(16px)",
        transition: "all 900ms cubic-bezier(0.16,1,0.3,1) 1400ms",
        maxWidth: 520,
        marginBottom: 64,
      }}>
        <p style={{
          fontFamily: t.body,
          fontSize: 18,
          lineHeight: 1.75,
          color: t.textMuted,
          fontWeight: 300,
        }}>
          Understanding how your nervous system actually works.
          Not why you're broken. How you're wired.
        </p>
      </div>

      {/* Scroll cue */}
      <div style={{
        opacity: mounted ? 1 : 0,
        transition: "opacity 600ms ease 2200ms",
        display: "flex",
        alignItems: "center",
        gap: 16,
        cursor: "pointer",
      }} onClick={onScroll}>
        <div style={{
          width: 1,
          height: 48,
          background: `linear-gradient(to bottom, ${t.border}, transparent)`,
        }} />
        <span style={{
          fontFamily: t.mono,
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: t.textDim,
        }}>
          scroll to begin
        </span>
      </div>

      {/* Bottom right coordinates */}
      <div style={{
        position: "absolute",
        bottom: 40, right: 120,
        opacity: mounted ? 0.3 : 0,
        transition: "opacity 600ms ease 2400ms",
      }}>
        <span style={{
          fontFamily: t.mono,
          fontSize: 11,
          color: t.textDim,
          letterSpacing: "0.1em",
        }}>
          00:00 · entry · ch-00
        </span>
      </div>
    </div>
  );
};

// Screen 2: The Question
const QuestionScreen = ({ onSelect }) => {
  const ref = useRef(null);
  const visible = useScrollReveal(ref, { threshold: 0.2 });

  return (
    <div
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 120px",
        borderTop: `1px solid ${t.borderDim}`,
      }}
    >
      {/* Question */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "all 800ms cubic-bezier(0.16,1,0.3,1)",
        marginBottom: 64,
        maxWidth: 560,
      }}>
        <p style={{
          fontFamily: t.mono,
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: t.textDim,
          marginBottom: 20,
        }}>
          orientate
        </p>
        <h2 style={{
          fontFamily: t.display,
          fontSize: "clamp(32px, 4vw, 56px)",
          fontWeight: 700,
          letterSpacing: "-0.01em",
          lineHeight: 1.1,
          color: t.text,
        }}>
          What brought you here?
        </h2>
      </div>

      {/* Doors */}
      <div style={{
        maxWidth: 680,
        opacity: visible ? 1 : 0,
        transition: "opacity 600ms ease 400ms",
      }}>
        {Object.entries(narratives).map(([key, { door }], i) => (
          <button
            key={key}
            className="door-btn"
            onClick={() => onSelect(key)}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <span className="door-arrow">—</span>
              <span className="door-text">{door}</span>
            </div>
          </button>
        ))}

        <p style={{
          fontFamily: t.body,
          fontSize: 14,
          color: t.textDim,
          marginTop: 24,
          fontStyle: "italic",
        }}>
          Your answer shapes the story. All paths lead to the same place.
        </p>
      </div>
    </div>
  );
};

// Screen 3: Narrative
const NarrativeScreen = ({ narrativeKey, onComplete }) => {
  const narrative = narratives[narrativeKey];
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      style={{
        minHeight: "100vh",
        padding: "120px 120px",
        borderTop: `1px solid ${t.borderDim}`,
        position: "relative",
      }}
    >
      {/* Ambient color pulse based on narrative */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 1,
        background: narrative.color,
        opacity: 0.4,
      }} />

      {/* Chapter label */}
      <div style={{ marginBottom: 80 }}>
        <Tag color={narrative.color}>{narrative.label}</Tag>
      </div>

      {/* Narrative lines */}
      <div style={{ maxWidth: 720 }}>
        {narrative.lines.map((line, i) => (
          <RevealLine
            key={i}
            type={line.type}
            delay={i * 60}
          >
            {line.text}
          </RevealLine>
        ))}
      </div>

      {/* Continue prompt */}
      <div style={{
        marginTop: 80,
        paddingTop: 48,
        borderTop: `1px solid ${t.borderDim}`,
        display: "flex",
        alignItems: "center",
        gap: 32,
      }}>
        <div style={{
          width: 1,
          height: 40,
          background: narrative.color,
          opacity: 0.6,
        }} />
        <button
          onClick={onComplete}
          style={{
            fontFamily: t.mono,
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: narrative.color,
            background: "transparent",
            border: `1px solid ${narrative.color}44`,
            padding: "10px 24px",
            borderRadius: 2,
            cursor: "pointer",
            transition: `all 300ms ${t.ease}`,
          }}
          onMouseEnter={e => {
            e.target.style.background = narrative.color + "22";
            e.target.style.borderColor = narrative.color + "88";
          }}
          onMouseLeave={e => {
            e.target.style.background = "transparent";
            e.target.style.borderColor = narrative.color + "44";
          }}
        >
          continue →
        </button>
      </div>
    </div>
  );
};

// Screen 4: Convergence
const ConvergenceScreen = ({ onEnter }) => {
  const ref = useRef(null);
  const visible = useScrollReveal(ref, { threshold: 0.3 });
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (visible) setTimeout(() => setResolved(true), 2400);
  }, [visible]);

  const lines = [
    { text: "There are names for all of this.",       delay: 0 },
    { text: "The exhaustion has a mechanism.",         delay: 400 },
    { text: "The recognition was accurate.",           delay: 800 },
    { text: "The gap between inside and outside is real and measurable.", delay: 1200 },
    { text: "The label was only the beginning.",       delay: 1600 },
  ];

  return (
    <div
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 120px",
        borderTop: `1px solid ${t.borderDim}`,
        position: "relative",
        overflow: "hidden",
        background: t.bg,
      }}
    >
      {/* Background: both glows, converging */}
      <div style={{
        position: "absolute",
        top: "30%", left: "5%",
        width: 600, height: 600,
        borderRadius: "50%",
        background: t.red,
        opacity: visible ? 0.03 : 0,
        filter: "blur(120px)",
        transition: "opacity 2s ease",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        top: "30%", right: "5%",
        width: 600, height: 600,
        borderRadius: "50%",
        background: t.blue,
        opacity: visible ? 0.04 : 0,
        filter: "blur(120px)",
        transition: "opacity 2s ease 400ms",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 680 }}>
        {/* Resolving STATIC title */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{
            fontFamily: t.display,
            fontSize: "clamp(48px, 8vw, 120px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 0.9,
            color: t.text,
            textShadow: resolved
              ? "none"
              : `-4px 0 ${t.red}, 4px 0 ${t.blue}`,
            animation: resolved
              ? "aberrateResolve 1s cubic-bezier(0.16,1,0.3,1) forwards"
              : visible
              ? "aberrateIn 2s cubic-bezier(0.16,1,0.3,1) forwards"
              : "none",
            transition: "text-shadow 1s ease",
          }}>
            STATIC
          </h2>
        </div>

        {/* Convergence lines — staggered reveal */}
        <div style={{ marginBottom: 64 }}>
          {lines.map(({ text, delay }) => (
            <p
              key={text}
              style={{
                fontFamily: t.body,
                fontSize: 22,
                lineHeight: 1.6,
                color: t.text,
                fontWeight: 300,
                marginBottom: 16,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `all 700ms ${t.ease} ${delay}ms`,
              }}
            >
              {text}
            </p>
          ))}
        </div>

        {/* Bridge to Signal Board */}
        <div style={{
          opacity: resolved ? 1 : 0,
          transform: resolved ? "translateY(0)" : "translateY(20px)",
          transition: `all 800ms ${t.ease}`,
        }}>
          <p style={{
            fontFamily: t.mono,
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: t.textDim,
            marginBottom: 24,
          }}>
            understanding begins here
          </p>
          <button
            onClick={onEnter}
            style={{
              fontFamily: t.display,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: t.bg,
              background: t.text,
              border: "none",
              padding: "16px 48px",
              borderRadius: 2,
              cursor: "pointer",
              transition: `all 300ms ${t.ease}`,
            }}
            onMouseEnter={e => {
              e.target.style.background = t.text;
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = `0 8px 24px ${t.text}22`;
            }}
            onMouseLeave={e => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            Enter Static
          </button>
        </div>
      </div>
    </div>
  );
};

// Screen 5: Signal Board
const SignalBoard = () => {
  const ref = useRef(null);
  const visible = useScrollReveal(ref, { threshold: 0.15 });

  const channels = [
    {
      key: "SENSORY",
      label: "channel · 01",
      title: "Sensory Processing",
      desc: "What your nervous system receives and how it's filtered — or not.",
      className: "",
      part: "Part 1",
    },
    {
      key: "SOCIAL",
      label: "channel · 02",
      title: "Social Processing",
      desc: "How your brain reads faces, language, and the rules no one explains.",
      className: "",
      part: "Part 1",
    },
    {
      key: "EXECUTIVE",
      label: "channel · 03",
      title: "Executive Function",
      desc: "Why starting, switching, and finishing tasks works differently.",
      className: "",
      part: "Part 1",
    },
    {
      key: "EMOTIONAL",
      label: "channel · 04",
      title: "Emotional Processing",
      desc: "Alexithymia, delayed realization, flooding, meltdown, shutdown.",
      className: "",
      part: "Part 1",
    },
    {
      key: "CAPACITY",
      label: "threshold · load",
      title: "The Capacity Model",
      desc: "Why small things cause big reactions. How the cup fills. What happens at overflow.",
      className: "red",
      part: "Part 1",
    },
    {
      key: "MASKING",
      label: "masking · cost",
      title: "Masking Mechanics",
      desc: "What you're actually doing when you perform neurotypical. Why it costs what it costs.",
      className: "red",
      part: "Part 1",
    },
    {
      key: "PATTERNS",
      label: "self · knowledge",
      title: "Your Patterns",
      desc: "Sensory profile, triggers, warning signs, energy accounting.",
      className: "blue",
      part: "Part 2",
    },
    {
      key: "STRATEGIES",
      label: "operating · manual",
      title: "Strategies",
      desc: "Immediate tools, structural design, recovery protocols — by challenge type.",
      className: "blue",
      part: "Part 3",
    },
  ];

  return (
    <div
      ref={ref}
      style={{
        minHeight: "100vh",
        padding: "80px 120px",
        borderTop: `1px solid ${t.border}`,
        background: t.bgElevated,
      }}
    >
      {/* Board header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 64,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 700ms ${t.ease}`,
      }}>
        <div>
          <p style={{
            fontFamily: t.mono,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: t.textDim,
            marginBottom: 12,
          }}>
            signal board · static
          </p>
          <h2 style={{
            fontFamily: t.display,
            fontSize: "clamp(40px, 5vw, 72px)",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            color: t.text,
          }}>
            Where do you<br />need to go?
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{
            fontFamily: t.mono,
            fontSize: 11,
            color: t.textDim,
            letterSpacing: "0.08em",
          }}>
            3 parts · 8 channels<br />
            25 behaviors · 40 strategies
          </p>
        </div>
      </div>

      {/* Channel grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 12,
        opacity: visible ? 1 : 0,
        transition: `opacity 600ms ease 300ms`,
      }}>
        {channels.map(({ key, label, title, desc, className, part }, i) => (
          <div
            key={key}
            className={`signal-board-channel ${className}`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `all 600ms ${t.ease} ${200 + i * 80}ms`,
            }}
          >
            <div style={{
              fontFamily: t.mono,
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: className === "red" ? t.red : className === "blue" ? t.blue : t.textDim,
              marginBottom: 12,
              paddingLeft: 16,
            }}>
              {label}
            </div>
            <h3 style={{
              fontFamily: t.display,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: t.text,
              marginBottom: 10,
              paddingLeft: 16,
              lineHeight: 1.2,
            }}>
              {title}
            </h3>
            <p style={{
              fontFamily: t.body,
              fontSize: 13,
              lineHeight: 1.6,
              color: t.textMuted,
              paddingLeft: 16,
            }}>
              {desc}
            </p>
            <div style={{
              marginTop: 20,
              paddingLeft: 16,
              fontFamily: t.mono,
              fontSize: 10,
              color: t.textDim,
              letterSpacing: "0.08em",
            }}>
              {part}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav hint */}
      <div style={{
        marginTop: 64,
        paddingTop: 32,
        borderTop: `1px solid ${t.borderDim}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: visible ? 1 : 0,
        transition: `opacity 600ms ease 900ms`,
      }}>
        <div style={{ display: "flex", gap: 12 }}>
          {["Explore", "Behavior Cards", "Differential Explorer", "Infographics"].map(item => (
            <button key={item} style={{
              fontFamily: t.mono,
              fontSize: 11,
              letterSpacing: "0.08em",
              color: t.textDim,
              background: "transparent",
              border: `1px solid ${t.borderDim}`,
              padding: "6px 14px",
              borderRadius: 2,
              cursor: "pointer",
              transition: `all 200ms ease`,
            }}
              onMouseEnter={e => { e.target.style.color = t.textMuted; e.target.style.borderColor = t.border; }}
              onMouseLeave={e => { e.target.style.color = t.textDim; e.target.style.borderColor = t.borderDim; }}
            >
              {item}
            </button>
          ))}
        </div>
        <span style={{
          fontFamily: t.mono,
          fontSize: 11,
          color: t.textDim,
          letterSpacing: "0.08em",
        }}>
          static · read linearly or explore freely
        </span>
      </div>
    </div>
  );
};

// ── PROGRESS INDICATOR ───────────────────────────────────────
const ProgressBar = ({ step, total, label }) => (
  <div style={{
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 200,
    height: 2,
    background: t.borderDim,
  }}>
    <div style={{
      height: "100%",
      width: `${(step / total) * 100}%`,
      background: `linear-gradient(to right, ${t.red}, ${t.blue})`,
      transition: `width 600ms ${t.ease}`,
    }} />
  </div>
);

// ── MAIN COMPONENT ───────────────────────────────────────────
export default function StaticSprint1() {
  useGlobalStyles();

  const [phase, setPhase] = useState("title");
  // phases: title → question → narrative → convergence → signal-board
  const [selectedNarrative, setSelectedNarrative] = useState(null);

  const questionRef = useRef(null);

  const scrollToQuestion = () => {
    questionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectDoor = (key) => {
    setSelectedNarrative(key);
    setPhase("narrative");
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight / 2, behavior: "smooth" });
    }, 100);
  };

  const handleNarrativeComplete = () => {
    setPhase("convergence");
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight * 0.7, behavior: "smooth" });
    }, 100);
  };

  const handleEnterStatic = () => {
    setPhase("signal-board");
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const phaseToStep = {
    "title": 1,
    "question": 2,
    "narrative": 3,
    "convergence": 4,
    "signal-board": 5,
  };

  return (
    <div className="static-grain" style={{ background: t.bg }}>
      <ProgressBar step={phaseToStep[phase]} total={5} />

      {/* SCREEN 1: TITLE */}
      <TitleScreen onScroll={scrollToQuestion} />

      {/* SCREEN 2: QUESTION */}
      <div ref={questionRef}>
        <QuestionScreen onSelect={handleSelectDoor} />
      </div>

      {/* SCREEN 3: NARRATIVE (only when selected) */}
      {selectedNarrative && (
        <NarrativeScreen
          narrativeKey={selectedNarrative}
          onComplete={handleNarrativeComplete}
        />
      )}

      {/* SCREEN 4: CONVERGENCE */}
      {(phase === "convergence" || phase === "signal-board") && (
        <ConvergenceScreen onEnter={handleEnterStatic} />
      )}

      {/* SCREEN 5: SIGNAL BOARD */}
      {phase === "signal-board" && (
        <SignalBoard />
      )}
    </div>
  );
}
