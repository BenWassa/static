import { useState, useEffect, useRef } from "react";

// ============================================================
// STATIC — SPRINT 0: DESIGN SYSTEM
// Complete token library, typography, components, motion
// ============================================================

// ── DESIGN TOKENS ──────────────────────────────────────────
const tokens = {
  color: {
    // Base
    bg:         "#0D0B0A",   // near-black, slightly warm
    bgElevated: "#141210",   // cards, elevated surfaces
    bgHigh:     "#1C1917",   // highest elevation

    // Text
    textPrimary:   "#F0EDE8", // warm off-white
    textSecondary: "#9E9890", // muted, warm grey
    textMuted:     "#5C5852", // very muted

    // Signal channels
    red:       "#E8244D",   // sympathetic / hot channel
    redDim:    "#4A0B1A",   // red at low opacity
    redGlow:   "#E8244D33", // red glow

    blue:      "#1E6FE8",   // parasympathetic / cold channel
    blueDim:   "#061933",   // blue at low opacity
    blueGlow:  "#1E6FE833", // blue glow

    // Utility
    border:    "#2A2724",
    borderDim: "#1A1816",
    white:     "#FFFFFF",
  },

  type: {
    // Display — condensed, industrial tension
    display: "'Barlow Condensed', 'Arial Narrow', sans-serif",
    // Body — warm, readable serif
    body:    "'Source Serif 4', Georgia, serif",
    // Mono — mechanical, scientific labels
    mono:    "'IBM Plex Mono', 'Courier New', monospace",
  },

  size: {
    // Type scale
    xs:   "0.75rem",   // 12px
    sm:   "0.875rem",  // 14px
    base: "1rem",      // 16px
    md:   "1.125rem",  // 18px
    lg:   "1.25rem",   // 20px
    xl:   "1.5rem",    // 24px
    "2xl": "2rem",     // 32px
    "3xl": "3rem",     // 48px
    "4xl": "4.5rem",   // 72px
    "5xl": "7rem",     // 112px
    "6xl": "10rem",    // 160px
  },

  space: {
    1:  "0.25rem",
    2:  "0.5rem",
    3:  "0.75rem",
    4:  "1rem",
    6:  "1.5rem",
    8:  "2rem",
    12: "3rem",
    16: "4rem",
    24: "6rem",
    32: "8rem",
    48: "12rem",
  },

  motion: {
    fast:   "150ms",
    base:   "300ms",
    slow:   "600ms",
    slower: "1200ms",
    ease:   "cubic-bezier(0.16, 1, 0.3, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  },
};

// ── GLOBAL STYLES (injected once) ──────────────────────────
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --bg:           ${tokens.color.bg};
        --bg-elevated:  ${tokens.color.bgElevated};
        --bg-high:      ${tokens.color.bgHigh};
        --text:         ${tokens.color.textPrimary};
        --text-muted:   ${tokens.color.textSecondary};
        --text-dim:     ${tokens.color.textMuted};
        --red:          ${tokens.color.red};
        --red-dim:      ${tokens.color.redDim};
        --red-glow:     ${tokens.color.redGlow};
        --blue:         ${tokens.color.blue};
        --blue-dim:     ${tokens.color.blueDim};
        --blue-glow:    ${tokens.color.blueGlow};
        --border:       ${tokens.color.border};
        --font-display: ${tokens.type.display};
        --font-body:    ${tokens.type.body};
        --font-mono:    ${tokens.type.mono};
        --ease:         ${tokens.motion.ease};
      }

      html { scroll-behavior: smooth; }

      body {
        background: var(--bg);
        color: var(--text);
        font-family: var(--font-body);
        font-size: 18px;
        line-height: 1.7;
        -webkit-font-smoothing: antialiased;
      }

      ::selection {
        background: var(--red);
        color: var(--bg);
      }

      /* Grain overlay */
      body::before {
        content: '';
        position: fixed;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.028;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: overlay;
      }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: var(--bg); }
      ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--text-dim); }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Section divider */
      .section-divider {
        border: none;
        border-top: 1px solid var(--border);
        margin: 0;
      }

      /* Chromatic aberration utility */
      @keyframes aberrate {
        0%   { text-shadow: -3px 0 var(--red), 3px 0 var(--blue); }
        20%  { text-shadow: -6px 0 var(--red), 6px 0 var(--blue); }
        40%  { text-shadow: -2px 0 var(--red), 2px 0 var(--blue); }
        60%  { text-shadow: -8px 0 var(--red), 8px 0 var(--blue); }
        80%  { text-shadow: -3px 0 var(--red), 3px 0 var(--blue); }
        100% { text-shadow: -3px 0 var(--red), 3px 0 var(--blue); }
      }

      @keyframes pulse-red {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }

      @keyframes pulse-blue {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      @keyframes scanline {
        0%   { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

// ── COMPONENTS ─────────────────────────────────────────────

// Signal Label — monospace tag used for section/channel markers
const SignalLabel = ({ children, channel = "neutral", style = {} }) => {
  const colors = {
    red:     { color: tokens.color.red,           border: tokens.color.redDim,  bg: tokens.color.redDim },
    blue:    { color: tokens.color.blue,           border: tokens.color.blueDim, bg: tokens.color.blueDim },
    neutral: { color: tokens.color.textSecondary,  border: tokens.color.border,  bg: "transparent" },
  };
  const c = colors[channel];
  return (
    <span style={{
      fontFamily: tokens.type.mono,
      fontSize: tokens.size.xs,
      fontWeight: 500,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: c.color,
      border: `1px solid ${c.border}`,
      background: c.bg,
      padding: "3px 10px",
      borderRadius: "2px",
      display: "inline-block",
      ...style,
    }}>
      {children}
    </span>
  );
};

// Display Heading — Barlow Condensed, large
const DisplayText = ({ children, size = "4xl", weight = 700, aberration = false, style = {} }) => (
  <h1 style={{
    fontFamily: tokens.type.display,
    fontSize: tokens.size[size],
    fontWeight: weight,
    letterSpacing: "-0.01em",
    lineHeight: 0.95,
    color: tokens.color.textPrimary,
    animation: aberration ? "aberrate 4s ease-in-out infinite" : "none",
    ...style,
  }}>
    {children}
  </h1>
);

// Body text
const BodyText = ({ children, size = "base", muted = false, style = {} }) => (
  <p style={{
    fontFamily: tokens.type.body,
    fontSize: tokens.size[size],
    lineHeight: 1.75,
    color: muted ? tokens.color.textSecondary : tokens.color.textPrimary,
    ...style,
  }}>
    {children}
  </p>
);

// Mono text — for labels, data, annotations
const MonoText = ({ children, size = "sm", muted = false, style = {} }) => (
  <span style={{
    fontFamily: tokens.type.mono,
    fontSize: tokens.size[size],
    fontWeight: 400,
    color: muted ? tokens.color.textMuted : tokens.color.textSecondary,
    ...style,
  }}>
    {children}
  </span>
);

// Card — elevated surface
const Card = ({ children, style = {}, hover = true }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: tokens.color.bgElevated,
        border: `1px solid ${hovered ? tokens.color.border : tokens.color.borderDim}`,
        borderRadius: "4px",
        padding: tokens.space[8],
        transition: `border-color ${tokens.motion.base} ${tokens.motion.ease}, transform ${tokens.motion.base} ${tokens.motion.ease}`,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Signal Channel Card — for the Signal Board
const ChannelCard = ({ label, title, description, channel = "neutral" }) => {
  const [hovered, setHovered] = useState(false);
  const accentColor = channel === "red" ? tokens.color.red : channel === "blue" ? tokens.color.blue : tokens.color.textSecondary;
  const glowColor   = channel === "red" ? tokens.color.redGlow : channel === "blue" ? tokens.color.blueGlow : "transparent";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tokens.color.bgElevated,
        border: `1px solid ${hovered ? accentColor + "66" : tokens.color.borderDim}`,
        borderRadius: "4px",
        padding: `${tokens.space[8]} ${tokens.space[8]}`,
        cursor: "pointer",
        transition: `all ${tokens.motion.base} ${tokens.motion.ease}`,
        boxShadow: hovered ? `0 0 24px ${glowColor}` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left border accent */}
      <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0,
        width: "3px",
        background: accentColor,
        opacity: hovered ? 1 : 0.3,
        transition: `opacity ${tokens.motion.base} ${tokens.motion.ease}`,
      }} />

      <div style={{ paddingLeft: tokens.space[4] }}>
        <SignalLabel channel={channel} style={{ marginBottom: tokens.space[4] }}>
          {label}
        </SignalLabel>
        <h3 style={{
          fontFamily: tokens.type.display,
          fontSize: tokens.size["2xl"],
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: tokens.color.textPrimary,
          marginTop: tokens.space[3],
          marginBottom: tokens.space[3],
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily: tokens.type.body,
          fontSize: tokens.size.sm,
          color: tokens.color.textSecondary,
          lineHeight: 1.6,
        }}>
          {description}
        </p>
      </div>

      {/* Arrow indicator */}
      <div style={{
        position: "absolute",
        right: tokens.space[6],
        bottom: tokens.space[6],
        fontFamily: tokens.type.mono,
        fontSize: tokens.size.sm,
        color: accentColor,
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateX(0)" : "translateX(-8px)",
        transition: `all ${tokens.motion.base} ${tokens.motion.ease}`,
      }}>
        →
      </div>
    </div>
  );
};

// Button
const Button = ({ children, variant = "primary", onClick, style = {} }) => {
  const [hovered, setHovered] = useState(false);
  const variants = {
    primary: {
      bg:       hovered ? tokens.color.textPrimary : "transparent",
      color:    hovered ? tokens.color.bg : tokens.color.textPrimary,
      border:   tokens.color.textPrimary,
    },
    red: {
      bg:       hovered ? tokens.color.red : "transparent",
      color:    hovered ? tokens.color.bg : tokens.color.red,
      border:   tokens.color.red,
    },
    blue: {
      bg:       hovered ? tokens.color.blue : "transparent",
      color:    hovered ? tokens.color.bg : tokens.color.blue,
      border:   tokens.color.blue,
    },
    ghost: {
      bg:       hovered ? tokens.color.bgHigh : "transparent",
      color:    hovered ? tokens.color.textPrimary : tokens.color.textSecondary,
      border:   tokens.color.border,
    },
  };
  const v = variants[variant];
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: tokens.type.mono,
        fontSize: tokens.size.sm,
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: `${tokens.space[3]} ${tokens.space[8]}`,
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: "2px",
        cursor: "pointer",
        transition: `all ${tokens.motion.fast} ${tokens.motion.ease}`,
        outline: "none",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

// Door — the entry question option
const Door = ({ children, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${hovered ? tokens.color.border : tokens.color.borderDim}`,
        padding: `${tokens.space[6]} 0`,
        cursor: "pointer",
        transition: `all ${tokens.motion.base} ${tokens.motion.ease}`,
        color: hovered ? tokens.color.textPrimary : tokens.color.textSecondary,
      }}
    >
      <span style={{
        fontFamily: tokens.type.body,
        fontSize: tokens.size.lg,
        lineHeight: 1.5,
        display: "flex",
        alignItems: "center",
        gap: tokens.space[4],
      }}>
        <span style={{
          fontFamily: tokens.type.mono,
          fontSize: tokens.size.xs,
          color: hovered ? tokens.color.red : tokens.color.textMuted,
          transition: `color ${tokens.motion.fast} ${tokens.motion.ease}`,
          letterSpacing: "0.1em",
          flexShrink: 0,
        }}>
          {hovered ? "→" : "—"}
        </span>
        {children}
      </span>
    </button>
  );
};

// Behavior Card — front/back flip
const BehaviorCard = ({ behavior, mechanism }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(!flipped)}
      style={{
        perspective: "1000px",
        cursor: "pointer",
        height: "180px",
      }}
    >
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d",
        transition: `transform ${tokens.motion.slow} ${tokens.motion.ease}`,
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* Front */}
        <div style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          background: tokens.color.bgElevated,
          border: `1px solid ${tokens.color.borderDim}`,
          borderRadius: "4px",
          padding: tokens.space[6],
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <SignalLabel channel="neutral">behavior</SignalLabel>
          <div>
            <p style={{
              fontFamily: tokens.type.body,
              fontSize: tokens.size.base,
              color: tokens.color.textPrimary,
              lineHeight: 1.5,
            }}>
              {behavior}
            </p>
            <MonoText muted style={{ marginTop: tokens.space[3], display: "block" }}>
              tap to reveal mechanism →
            </MonoText>
          </div>
        </div>
        {/* Back */}
        <div style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: tokens.color.bgHigh,
          border: `1px solid ${tokens.color.blue}33`,
          borderLeft: `3px solid ${tokens.color.blue}`,
          borderRadius: "4px",
          padding: tokens.space[6],
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <SignalLabel channel="blue">mechanism</SignalLabel>
          <p style={{
            fontFamily: tokens.type.body,
            fontSize: tokens.size.sm,
            color: tokens.color.textPrimary,
            lineHeight: 1.65,
          }}>
            {mechanism}
          </p>
        </div>
      </div>
    </div>
  );
};

// Divider with label
const LabeledDivider = ({ label }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: tokens.space[4],
    margin: `${tokens.space[16]} 0`,
  }}>
    <div style={{ flex: 1, height: "1px", background: tokens.color.borderDim }} />
    <MonoText muted size="xs" style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}>
      {label}
    </MonoText>
    <div style={{ flex: 1, height: "1px", background: tokens.color.borderDim }} />
  </div>
);

// Capacity Cup — simplified version for design system
const CapacityCup = () => {
  const [level, setLevel] = useState(30);
  const isOverflow = level >= 95;
  const fillColor = level < 50
    ? tokens.color.blue
    : level < 80
    ? `color-mix(in srgb, ${tokens.color.blue} ${100 - (level - 50) * 2}%, ${tokens.color.red})`
    : tokens.color.red;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: tokens.space[6] }}>
      {/* Cup SVG */}
      <div style={{ position: "relative", width: 120, height: 160 }}>
        <svg width="120" height="160" viewBox="0 0 120 160">
          {/* Cup outline */}
          <path
            d="M 20 10 L 10 150 L 110 150 L 100 10 Z"
            fill="none"
            stroke={tokens.color.border}
            strokeWidth="2"
          />
          {/* Fill */}
          <clipPath id="cupClip">
            <path d="M 21 11 L 11 149 L 109 149 L 99 11 Z" />
          </clipPath>
          <rect
            x="11"
            y={149 - (138 * level / 100)}
            width="98"
            height={138 * level / 100}
            fill={level < 80 ? tokens.color.blue : tokens.color.red}
            opacity="0.7"
            clipPath="url(#cupClip)"
            style={{ transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
          {/* Overflow indicator */}
          {isOverflow && (
            <g>
              <ellipse cx="60" cy="10" rx="40" ry="8" fill={tokens.color.red} opacity="0.8" />
              <ellipse cx="60" cy="10" rx="40" ry="8" fill="none" stroke={tokens.color.red} strokeWidth="1" />
            </g>
          )}
        </svg>
        {/* Level percentage */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{
            fontFamily: tokens.type.mono,
            fontSize: tokens.size.sm,
            color: tokens.color.textPrimary,
            fontWeight: 500,
          }}>
            {level}%
          </span>
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={100}
        value={level}
        onChange={e => setLevel(Number(e.target.value))}
        style={{
          width: "200px",
          accentColor: level >= 80 ? tokens.color.red : tokens.color.blue,
        }}
      />

      {/* State label */}
      <SignalLabel channel={level >= 80 ? "red" : "blue"}>
        {level < 30 ? "regulated" : level < 60 ? "loading" : level < 80 ? "high load" : level < 95 ? "near threshold" : "overflow"}
      </SignalLabel>
    </div>
  );
};

// ── SECTION WRAPPER ────────────────────────────────────────
const Section = ({ children, label, style = {} }) => (
  <section style={{
    maxWidth: "1200px",
    margin: "0 auto",
    padding: `${tokens.space[24]} ${tokens.space[12]}`,
    ...style,
  }}>
    {label && (
      <div style={{ marginBottom: tokens.space[12] }}>
        <MonoText muted size="xs" style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>
          {label}
        </MonoText>
      </div>
    )}
    {children}
  </section>
);

// ── MAIN DESIGN SYSTEM SHOWCASE ────────────────────────────
export default function StaticDesignSystem() {
  const [activeNav, setActiveNav] = useState("tokens");

  const navItems = [
    { id: "tokens",     label: "Tokens" },
    { id: "type",       label: "Typography" },
    { id: "components", label: "Components" },
    { id: "motion",     label: "Motion" },
    { id: "patterns",   label: "Patterns" },
  ];

  return (
    <div style={{ background: tokens.color.bg, minHeight: "100vh", color: tokens.color.textPrimary }}>
      <GlobalStyles />

      {/* ── STICKY NAV ── */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: tokens.color.bg + "F0",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${tokens.color.borderDim}`,
        padding: `${tokens.space[4]} ${tokens.space[12]}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: tokens.space[8],
      }}>
        {/* Logo mark */}
        <div style={{
          fontFamily: tokens.type.display,
          fontSize: tokens.size.xl,
          fontWeight: 800,
          letterSpacing: "0.1em",
          color: tokens.color.textPrimary,
          textShadow: `-2px 0 ${tokens.color.red}, 2px 0 ${tokens.color.blue}`,
        }}>
          STATIC
        </div>

        {/* Nav items */}
        <div style={{ display: "flex", gap: tokens.space[1] }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                fontFamily: tokens.type.mono,
                fontSize: tokens.size.xs,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: `${tokens.space[2]} ${tokens.space[4]}`,
                background: activeNav === item.id ? tokens.color.bgHigh : "transparent",
                color: activeNav === item.id ? tokens.color.textPrimary : tokens.color.textMuted,
                border: `1px solid ${activeNav === item.id ? tokens.color.border : "transparent"}`,
                borderRadius: "2px",
                cursor: "pointer",
                transition: `all ${tokens.motion.fast} ${tokens.motion.ease}`,
                outline: "none",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <MonoText muted size="xs">Sprint 0 · Design System</MonoText>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: `${tokens.space[48]} ${tokens.space[12]} ${tokens.space[24]}`,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: tokens.space[12],
        alignItems: "end",
      }}>
        <div>
          <SignalLabel channel="neutral" style={{ marginBottom: tokens.space[8] }}>
            design system · v0.1
          </SignalLabel>
          <DisplayText size="6xl" weight={800} style={{
            display: "block",
            lineHeight: 0.9,
            textShadow: `-4px 0 ${tokens.color.red}, 4px 0 ${tokens.color.blue}`,
            marginBottom: tokens.space[8],
          }}>
            STATIC
          </DisplayText>
          <BodyText muted>
            Sprint 0. Every token, component, and pattern that builds the guide.
            The foundation everything else depends on.
          </BodyText>
        </div>
        <div style={{
          borderLeft: `1px solid ${tokens.color.borderDim}`,
          paddingLeft: tokens.space[12],
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.space[4] }}>
            {[
              ["Background",  tokens.color.bg,          "—"],
              ["Text",        tokens.color.textPrimary,  "—"],
              ["Red channel", tokens.color.red,          "sympathetic"],
              ["Blue channel",tokens.color.blue,         "parasympathetic"],
            ].map(([name, hex, note]) => (
              <div key={name} style={{
                display: "flex",
                alignItems: "center",
                gap: tokens.space[4],
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "2px",
                  background: hex,
                  border: `1px solid ${tokens.color.border}`,
                  flexShrink: 0,
                }} />
                <div>
                  <MonoText>{name}</MonoText>
                  <MonoText muted size="xs" style={{ display: "block" }}>{hex} · {note}</MonoText>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ── TOKENS ── */}
      <Section label="01 · Design Tokens">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: tokens.space[12] }}>

          {/* Color palette */}
          <div>
            <MonoText size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Color
            </MonoText>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.space[2] }}>
              {[
                ["bg",          tokens.color.bg,           "Surface / Base"],
                ["bgElevated",  tokens.color.bgElevated,   "Cards"],
                ["bgHigh",      tokens.color.bgHigh,       "Highest elevation"],
                ["text",        tokens.color.textPrimary,  "Primary text"],
                ["textMuted",   tokens.color.textSecondary,"Secondary text"],
                ["textDim",     tokens.color.textMuted,    "Muted text"],
                ["red",         tokens.color.red,          "Hot channel"],
                ["blue",        tokens.color.blue,         "Cold channel"],
                ["border",      tokens.color.border,       "Borders"],
              ].map(([name, hex, note]) => (
                <div key={name} style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr",
                  gap: tokens.space[3],
                  alignItems: "center",
                }}>
                  <div style={{
                    width: 28, height: 28,
                    background: hex,
                    borderRadius: "2px",
                    border: `1px solid ${tokens.color.border}`,
                  }} />
                  <div>
                    <MonoText size="xs">{name}</MonoText>
                    <MonoText muted size="xs" style={{ display: "block", opacity: 0.6 }}>{note}</MonoText>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div>
            <MonoText size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Spacing
            </MonoText>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.space[3] }}>
              {Object.entries(tokens.space).map(([key, val]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: tokens.space[4] }}>
                  <div style={{
                    height: "12px",
                    width: val,
                    background: tokens.color.blue,
                    opacity: 0.6,
                    flexShrink: 0,
                    maxWidth: "100%",
                  }} />
                  <MonoText muted size="xs">{key} · {val}</MonoText>
                </div>
              ))}
            </div>
          </div>

          {/* Motion */}
          <div>
            <MonoText size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Motion
            </MonoText>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.space[4] }}>
              {Object.entries(tokens.motion).filter(([k]) => !k.includes("ease")).map(([key, val]) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: tokens.space[1] }}>
                  <MonoText size="xs">{key}</MonoText>
                  <MonoText muted size="xs" style={{ opacity: 0.6 }}>{val}</MonoText>
                </div>
              ))}
              <div style={{ marginTop: tokens.space[4] }}>
                <MonoText size="xs">easing</MonoText>
                <MonoText muted size="xs" style={{ opacity: 0.6, display: "block", marginTop: tokens.space[1] }}>
                  cubic-bezier(0.16, 1, 0.3, 1)
                </MonoText>
                <MonoText muted size="xs" style={{ opacity: 0.6, display: "block" }}>
                  Expo out — fast start, elastic settle
                </MonoText>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <hr className="section-divider" />

      {/* ── TYPOGRAPHY ── */}
      <Section label="02 · Typography">

        {/* Display scale */}
        <div style={{ marginBottom: tokens.space[16] }}>
          <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[8], letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Display — Barlow Condensed
          </MonoText>
          {[
            ["6xl", 800, "SIGNAL"],
            ["5xl", 700, "STATIC"],
            ["4xl", 700, "The Machine"],
            ["3xl", 600, "Understanding the Mechanics"],
            ["2xl", 500, "Sensory Processing"],
          ].map(([size, weight, text]) => (
            <div key={size} style={{
              display: "flex",
              alignItems: "baseline",
              gap: tokens.space[6],
              marginBottom: tokens.space[4],
              borderBottom: `1px solid ${tokens.color.borderDim}`,
              paddingBottom: tokens.space[4],
            }}>
              <MonoText muted size="xs" style={{ width: 60, flexShrink: 0 }}>{size}</MonoText>
              <span style={{
                fontFamily: tokens.type.display,
                fontSize: tokens.size[size],
                fontWeight: weight,
                lineHeight: 1,
                color: tokens.color.textPrimary,
                letterSpacing: "-0.01em",
              }}>
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Body scale */}
        <div style={{ marginBottom: tokens.space[16] }}>
          <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[8], letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Body — Source Serif 4
          </MonoText>
          {[
            ["xl",   400, "The brain fails to habituate to repetitive sounds."],
            ["lg",   400, "Their thalamus doesn't filter background noise before it reaches the cortex."],
            ["base", 400, "Every sound arrives at equal volume. The coffee machine. The ventilation. Your colleague's keyboard. All of it, full signal, simultaneously."],
            ["sm",   400, "Italic — Source Serif 4 has a particularly elegant italic for pull quotes and annotations.", true],
          ].map(([size, weight, text, italic]) => (
            <div key={size} style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr",
              gap: tokens.space[6],
              marginBottom: tokens.space[6],
              paddingBottom: tokens.space[6],
              borderBottom: `1px solid ${tokens.color.borderDim}`,
            }}>
              <MonoText muted size="xs">{size}</MonoText>
              <p style={{
                fontFamily: tokens.type.body,
                fontSize: tokens.size[size],
                fontWeight: weight,
                fontStyle: italic ? "italic" : "normal",
                color: tokens.color.textPrimary,
                lineHeight: 1.75,
              }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Mono */}
        <div>
          <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[8], letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Mono — IBM Plex Mono
          </MonoText>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: tokens.space[8] }}>
            {[
              { label: "SENSORY · CH-01", text: "thalamocortical-gating" },
              { label: "MECHANISM", text: "GABAergic inhibitory tone" },
              { label: "STATUS", text: "threshold: 73% capacity" },
              { label: "SIGNAL", text: "→ auditory cortex overflow" },
            ].map(({ label, text }) => (
              <div key={label} style={{
                background: tokens.color.bgElevated,
                border: `1px solid ${tokens.color.borderDim}`,
                borderRadius: "2px",
                padding: tokens.space[4],
              }}>
                <span style={{
                  fontFamily: tokens.type.mono,
                  fontSize: tokens.size.xs,
                  color: tokens.color.textMuted,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: tokens.space[2],
                }}>
                  {label}
                </span>
                <span style={{
                  fontFamily: tokens.type.mono,
                  fontSize: tokens.size.sm,
                  color: tokens.color.textSecondary,
                }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <hr className="section-divider" />

      {/* ── COMPONENTS ── */}
      <Section label="03 · Components">

        {/* Signal Labels */}
        <div style={{ marginBottom: tokens.space[16] }}>
          <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Signal Labels
          </MonoText>
          <div style={{ display: "flex", gap: tokens.space[4], flexWrap: "wrap" }}>
            <SignalLabel>neutral</SignalLabel>
            <SignalLabel channel="red">meltdown</SignalLabel>
            <SignalLabel channel="blue">shutdown</SignalLabel>
            <SignalLabel channel="red">fight · flight</SignalLabel>
            <SignalLabel channel="blue">freeze · collapse</SignalLabel>
            <SignalLabel>behavior · 01</SignalLabel>
            <SignalLabel>mechanism</SignalLabel>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ marginBottom: tokens.space[16] }}>
          <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Buttons
          </MonoText>
          <div style={{ display: "flex", gap: tokens.space[4], flexWrap: "wrap" }}>
            <Button variant="primary">Enter the guide</Button>
            <Button variant="red">Meltdown protocol</Button>
            <Button variant="blue">Recovery mode</Button>
            <Button variant="ghost">Read more</Button>
          </div>
        </div>

        {/* Doors */}
        <div style={{ marginBottom: tokens.space[16] }}>
          <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Entry Doors — Opening Question
          </MonoText>
          <div style={{
            maxWidth: "680px",
            paddingTop: tokens.space[4],
          }}>
            <BodyText muted style={{ marginBottom: tokens.space[6] }}>
              What brought you here?
            </BodyText>
            <Door>I've been exhausted for years and can't explain why</Door>
            <Door>Something clicked recently and I need to understand it</Door>
            <Door>I want to understand someone in my life better</Door>
            <Door>I just received a diagnosis</Door>
          </div>
        </div>

        {/* Cards */}
        <div style={{ marginBottom: tokens.space[16] }}>
          <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Cards
          </MonoText>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: tokens.space[6] }}>
            <Card>
              <SignalLabel style={{ marginBottom: tokens.space[4] }}>sensory · ch-01</SignalLabel>
              <h3 style={{
                fontFamily: tokens.type.display,
                fontSize: tokens.size["2xl"],
                fontWeight: 700,
                marginTop: tokens.space[3],
                marginBottom: tokens.space[3],
              }}>
                Auditory Hypersensitivity
              </h3>
              <BodyText size="sm" muted>
                The brain fails to habituate to repetitive sounds, leading to chronic autonomic arousal.
              </BodyText>
            </Card>
            <Card>
              <SignalLabel channel="red" style={{ marginBottom: tokens.space[4] }}>overload · threshold</SignalLabel>
              <h3 style={{
                fontFamily: tokens.type.display,
                fontSize: tokens.size["2xl"],
                fontWeight: 700,
                marginTop: tokens.space[3],
                marginBottom: tokens.space[3],
              }}>
                Meltdown
              </h3>
              <BodyText size="sm" muted>
                Sympathetic nervous system mobilization. The window of tolerance exceeded.
              </BodyText>
            </Card>
            <Card>
              <SignalLabel channel="blue" style={{ marginBottom: tokens.space[4] }}>overload · collapse</SignalLabel>
              <h3 style={{
                fontFamily: tokens.type.display,
                fontSize: tokens.size["2xl"],
                fontWeight: 700,
                marginTop: tokens.space[3],
                marginBottom: tokens.space[3],
              }}>
                Shutdown
              </h3>
              <BodyText size="sm" muted>
                Dorsal vagal freeze response. Parasympathetic collapse. System offline.
              </BodyText>
            </Card>
          </div>
        </div>

        {/* Channel Cards (Signal Board preview) */}
        <div style={{ marginBottom: tokens.space[16] }}>
          <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Signal Board — Channel Cards
          </MonoText>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: tokens.space[4] }}>
            <ChannelCard
              label="channel · 01"
              channel="neutral"
              title="Sensory Processing"
              description="What your nervous system receives and how it's filtered — or not."
            />
            <ChannelCard
              label="channel · 02"
              channel="neutral"
              title="Social Processing"
              description="How your brain reads faces, language, and the rules no one explains."
            />
            <ChannelCard
              label="threshold · load"
              channel="red"
              title="The Capacity Model"
              description="Why small things cause big reactions. How the cup fills and what happens when it overflows."
            />
            <ChannelCard
              label="recovery · protocol"
              channel="blue"
              title="Strategies"
              description="Immediate tools, environmental design, and recovery when it goes wrong."
            />
          </div>
        </div>

        {/* Behavior Flip Cards */}
        <div style={{ marginBottom: tokens.space[16] }}>
          <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Behavior Cards — Flip to Reveal Mechanism
          </MonoText>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: tokens.space[6] }}>
            <BehaviorCard
              behavior="Can't concentrate in open-plan offices due to ambient noise"
              mechanism="Thalamocortical gating failure. The thalamus doesn't filter redundant input — every sound reaches the cortex at full volume simultaneously."
            />
            <BehaviorCard
              behavior="Forces eye contact but arrives home completely exhausted"
              mechanism="Amygdala hyperactivation to faces. Sustained eye contact triggers a persistent alarm signal. Suppressing this response depletes executive resources."
            />
            <BehaviorCard
              behavior="Remains calm during a crisis, then breaks down two days later"
              mechanism="Delayed emotional realization. Atypical insula ↔ ACC connectivity means visceral signals don't integrate into conscious emotion until a critical threshold is reached."
            />
          </div>
        </div>

        {/* Capacity Cup */}
        <div>
          <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Capacity Model — Interactive Cup
          </MonoText>
          <Card hover={false} style={{ display: "inline-block", minWidth: 320 }}>
            <div style={{ textAlign: "center", marginBottom: tokens.space[6] }}>
              <SignalLabel>capacity · model</SignalLabel>
              <p style={{
                fontFamily: tokens.type.body,
                fontSize: tokens.size.sm,
                color: tokens.color.textSecondary,
                marginTop: tokens.space[3],
              }}>
                Drag to simulate load accumulation
              </p>
            </div>
            <CapacityCup />
          </Card>
        </div>
      </Section>

      <hr className="section-divider" />

      {/* ── MOTION ── */}
      <Section label="04 · Motion & Texture">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: tokens.space[12] }}>

          {/* Aberration states */}
          <div>
            <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Chromatic Aberration States
            </MonoText>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.space[8] }}>
              {[
                { label: "Resolved — clean signal", offset: 0 },
                { label: "Low interference",         offset: 2 },
                { label: "Medium static",            offset: 5 },
                { label: "High interference",        offset: 10 },
                { label: "Peak static — pre-meltdown", offset: 18 },
              ].map(({ label, offset }) => (
                <div key={label}>
                  <span style={{
                    fontFamily: tokens.type.display,
                    fontSize: tokens.size["3xl"],
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                    color: tokens.color.textPrimary,
                    textShadow: offset > 0
                      ? `-${offset}px 0 ${tokens.color.red}, ${offset}px 0 ${tokens.color.blue}`
                      : "none",
                  }}>
                    STATIC
                  </span>
                  <MonoText muted size="xs" style={{ display: "block", marginTop: tokens.space[1] }}>
                    {label} · offset: {offset}px
                  </MonoText>
                </div>
              ))}
            </div>
          </div>

          {/* Fade-in animation showcase */}
          <div>
            <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Scroll Reveal Pattern
            </MonoText>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.space[4] }}>
              {[0, 100, 200, 300, 400, 500].map((delay, i) => (
                <div key={i} style={{
                  fontFamily: tokens.type.body,
                  fontSize: tokens.size.base,
                  color: tokens.color.textPrimary,
                  opacity: 0,
                  transform: "translateY(16px)",
                  animation: `fadeUp ${tokens.motion.slow} ${tokens.motion.ease} ${delay}ms forwards`,
                }}>
                  {[
                    "The restaurant is too loud.",
                    "The lights are too bright.",
                    "You're managing three conversations.",
                    "Your collar is bothering you.",
                    "You forgot to eat.",
                    "One small thing goes wrong.",
                  ][i]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <hr className="section-divider" />

      {/* ── PATTERNS ── */}
      <Section label="05 · Layout Patterns">

        {/* Two-column content layout */}
        <div style={{ marginBottom: tokens.space[16] }}>
          <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[8], letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Content Page Layout — Part 1 Pattern
          </MonoText>
          <div style={{
            border: `1px solid ${tokens.color.borderDim}`,
            borderRadius: "4px",
            overflow: "hidden",
          }}>
            {/* Chapter header */}
            <div style={{
              background: tokens.color.bgElevated,
              borderBottom: `1px solid ${tokens.color.borderDim}`,
              padding: `${tokens.space[8]} ${tokens.space[12]}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <SignalLabel style={{ marginBottom: tokens.space[3] }}>part 1 · chapter 01</SignalLabel>
                <h2 style={{
                  fontFamily: tokens.type.display,
                  fontSize: tokens.size["4xl"],
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  marginTop: tokens.space[3],
                }}>
                  Sensory Processing
                </h2>
              </div>
              <MonoText muted size="xs" style={{ textAlign: "right" }}>
                thalamocortical<br />gating · habituation<br />E/I balance
              </MonoText>
            </div>

            {/* Content body */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 0,
            }}>
              <div style={{
                padding: `${tokens.space[12]} ${tokens.space[12]}`,
                borderRight: `1px solid ${tokens.color.borderDim}`,
              }}>
                <BodyText size="lg" style={{ marginBottom: tokens.space[6] }}>
                  Your nervous system receives constant input from the world. Sound, light, touch, movement. In most brains, a gating system filters this — deciding what's relevant and dimming everything else.
                </BodyText>
                <BodyText muted>
                  In many autistic brains, this gate is different. Not broken — different. The filter that says "the air conditioner hum is irrelevant" doesn't operate the same way. So the hum stays loud. The fluorescent light flicker registers. The tag in your shirt remains present.
                </BodyText>
              </div>
              <div style={{
                padding: `${tokens.space[12]} ${tokens.space[8]}`,
                display: "flex",
                flexDirection: "column",
                gap: tokens.space[6],
              }}>
                <div>
                  <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[2], letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Key Systems
                  </MonoText>
                  {["Thalamus", "Auditory Cortex", "GABAergic system"].map(s => (
                    <div key={s} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: tokens.space[3],
                      marginBottom: tokens.space[2],
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: tokens.color.blue }} />
                      <MonoText size="xs">{s}</MonoText>
                    </div>
                  ))}
                </div>
                <div>
                  <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[2], letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Evidence
                  </MonoText>
                  <SignalLabel channel="blue">strong</SignalLabel>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Labeled dividers */}
        <div style={{ marginBottom: tokens.space[16] }}>
          <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Section Transitions
          </MonoText>
          <LabeledDivider label="behavior → mechanism" />
          <LabeledDivider label="part 1 → part 2" />
          <LabeledDivider label="immediate → preventive" />
        </div>

        {/* Pull quote */}
        <div>
          <MonoText muted size="xs" style={{ display: "block", marginBottom: tokens.space[6], letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Pull Quote / Key Statement
          </MonoText>
          <blockquote style={{
            borderLeft: `3px solid ${tokens.color.red}`,
            paddingLeft: tokens.space[8],
            margin: `${tokens.space[8]} 0`,
          }}>
            <p style={{
              fontFamily: tokens.type.body,
              fontSize: tokens.size["2xl"],
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.4,
              color: tokens.color.textPrimary,
            }}>
              "It's not that the volume knob is turned up. It's that the filter is turned off."
            </p>
            <MonoText muted size="xs" style={{ display: "block", marginTop: tokens.space[4] }}>
              — thalamocortical gating, simplified
            </MonoText>
          </blockquote>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${tokens.color.borderDim}`,
        padding: `${tokens.space[12]} ${tokens.space[12]}`,
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{
          fontFamily: tokens.type.display,
          fontSize: tokens.size.xl,
          fontWeight: 800,
          letterSpacing: "0.1em",
          textShadow: `-2px 0 ${tokens.color.red}, 2px 0 ${tokens.color.blue}`,
        }}>
          STATIC
        </div>
        <MonoText muted size="xs">
          Sprint 0 complete · Design system locked
        </MonoText>
        <div style={{ display: "flex", gap: tokens.space[4] }}>
          <SignalLabel channel="red">hot</SignalLabel>
          <SignalLabel channel="blue">cold</SignalLabel>
        </div>
      </footer>
    </div>
  );
}
