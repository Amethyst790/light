import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// ── constants ─────────────────────────────────────────────────────────────────
const CHESS_USER = "not_kxk";
const AMONG_USER = "ethicalcab#0562";
const PROFILE_IMG = "https://i.imgur.com/C5zsT7L.jpeg"; // Replace with actual URL

const FACTS = [
  "16 years young. India-bred. Internet-raised. 🇮🇳",
  "Professional stalker (the internet kind, relax) 👀",
  "Chess pieces fear me. Every move calculated. ♟️",
  "Sus by nature. Crewmate by choice. 📮",
  "Lo-fi music running 24/7 in my headphones 🎵",
  "Discord is basically my second home 💬",
];

const HOBBIES = [
  { label: "Chess",    icon: "♟️", glow: "#C9A84C", desc: "Strategist on the board. Every move is a trap." },
  { label: "Music",    icon: "🎵", glow: "#4FC3C8", desc: "Lo-fi, beats, whatever hits. Always on shuffle." },
  { label: "Gaming",   icon: "🎮", glow: "#ef4444", desc: "Among Us loyalist. Report me if you dare." },
  { label: "Stalking", icon: "👀", glow: "#FFD580", desc: "I know your last online. It's a gift, really." },
  { label: "Discord",  icon: "💬", glow: "#5865F2", desc: "Always in a server. Never truly offline." },
];

// ── SVG brand logos ────────────────────────────────────────────────────────────
function IgLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
      <defs>
        <radialGradient id="ig1" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="url(#ig1)" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="white" />
    </svg>
  );
}

function DiscordLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#5865F2">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.034.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function SnapLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#FFFC00">
      <path d="M12.166.012c.881 0 3.96.249 5.42 3.408.45.975.342 2.628.258 3.876l-.013.19c-.002.045.024.088.065.107.25.118.832.056 1.126-.008.169-.037.347-.06.524-.055.477.014.899.265.996.56.12.36-.14.734-.78.986-.08.032-.21.07-.376.113-.549.142-1.374.357-1.622.848-.073.144-.077.324-.01.545.3.98 1.306 3.3 3.84 3.836a.27.27 0 0 1 .218.276c-.07.917-2.12 1.52-3.183 1.717-.108.021-.173.107-.148.215.067.3.235.812.524 1.326.064.115.036.261-.09.325-.3.152-.773.164-1.092.125-.387-.047-.742-.173-1.11-.305-.523-.185-1.064-.376-1.77-.376-.22 0-.449.018-.68.054-.8.126-1.42.595-2.07 1.086-.98.74-1.99 1.505-3.65 1.505-.05 0-.1 0-.15-.003h-.044c-1.672 0-2.671-.765-3.644-1.505-.65-.49-1.27-.96-2.07-1.086a4.685 4.685 0 0 0-.68-.054c-.714 0-1.264.194-1.796.38-.364.13-.716.254-1.085.301-.285.036-.668.03-.99-.08-.193-.065-.296-.21-.248-.366.276-.523.448-1.044.515-1.34.026-.109-.04-.197-.148-.218C2.12 15.9.07 15.297 0 14.38a.27.27 0 0 1 .218-.277c2.534-.535 3.54-2.855 3.84-3.836.067-.22.063-.4-.01-.545-.248-.49-1.073-.706-1.622-.848-.166-.042-.296-.08-.376-.113-.707-.273-.9-.65-.78-.986.097-.295.519-.546.996-.56.178-.005.356.018.524.055.294.064.876.126 1.127.008.04-.02.067-.062.064-.107l-.013-.19c-.083-1.248-.192-2.9.258-3.876C5.676.26 8.756.012 9.637.012l.27.002c.087 0 .175-.002.262-.002z" />
    </svg>
  );
}

function WhatsAppLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function ChessLogo() {
  return (
    <svg viewBox="0 0 100 100" className="w-10 h-10" fill="#81b64c">
      <path d="M50 5 C38 5 32 14 32 22 C32 30 36 36 36 40 L28 40 L28 48 L36 48 L30 58 L22 58 L22 66 L78 66 L78 58 L70 58 L64 48 L72 48 L72 40 L64 40 C64 36 68 30 68 22 C68 14 62 5 50 5 Z M50 12 C57 12 61 17 61 22 C61 28 57 33 57 40 L43 40 C43 33 39 28 39 22 C39 17 43 12 50 12 Z M34 70 L66 70 L70 80 L30 80 Z" />
    </svg>
  );
}

function AmongUsLogo() {
  return (
    <svg viewBox="0 0 100 120" className="w-9 h-9" fill="#c0392b">
      <ellipse cx="50" cy="75" rx="32" ry="38" />
      <ellipse cx="50" cy="45" rx="30" ry="32" />
      <rect x="18" y="60" width="14" height="24" rx="7" fill="#c0392b" />
      <rect x="68" y="60" width="14" height="24" rx="7" fill="#c0392b" />
      <rect x="26" y="34" width="48" height="18" rx="9" fill="#a8d8ea" opacity="0.9" />
    </svg>
  );
}

// ── Custom Cursor ─────────────────────────────────────────────────────────────
function Cursor() {
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const trail = useRef([]);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      trail.current.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (trail.current.length > 28) trail.current.shift();
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const hover = el && (el.tagName === "A" || el.tagName === "BUTTON" || el.closest("a") || el.closest("button") || el.dataset.hover);
      setHovering(!!hover);
    };
    window.addEventListener("mousemove", move);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Trail — gold core fading to teal
      for (let i = 0; i < trail.current.length; i++) {
        trail.current[i].age++;
        const t = i / trail.current.length;
        const alpha = t * (1 - trail.current[i].age / 60);
        if (alpha <= 0) continue;
        const r = t * (hovering ? 9 : 5);
        // interpolate gold → teal
        const goldR = 201, goldG = 168, goldB = 76;
        const tealR = 79, tealG = 195, tealB = 200;
        const cr = Math.round(goldR + (tealR - goldR) * (1 - t));
        const cg = Math.round(goldG + (tealG - goldG) * (1 - t));
        const cb = Math.round(goldB + (tealB - goldB) * (1 - t));
        const grad = ctx.createRadialGradient(trail.current[i].x, trail.current[i].y, 0, trail.current[i].x, trail.current[i].y, r * 2.5);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
        grad.addColorStop(1, `rgba(79,195,200,0)`);
        ctx.beginPath();
        ctx.arc(trail.current[i].x, trail.current[i].y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      trail.current = trail.current.filter(p => p.age < 60);

      // Center dot — white with gold halo
      const { x, y } = pos.current;
      const dotR = hovering ? 14 : 5;

      // Gold halo ring on hover
      if (hovering) {
        ctx.beginPath();
        ctx.arc(x, y, dotR + 4, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(201,168,76,0.7)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Gold glow
      const halo = ctx.createRadialGradient(x, y, 0, x, y, dotR * 3);
      halo.addColorStop(0, "rgba(255,213,128,0.6)");
      halo.addColorStop(0.5, "rgba(201,168,76,0.3)");
      halo.addColorStop(1, "rgba(201,168,76,0)");
      ctx.beginPath();
      ctx.arc(x, y, dotR * 3, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // White core dot
      ctx.beginPath();
      ctx.arc(x, y, hovering ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [hovering]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99998 }} />;
}

// ── Intro Screen ──────────────────────────────────────────────────────────────
function Intro({ onDone }) {
  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0a0a0a]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(20px)" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div className="text-center">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="h-px w-48 mx-auto mb-6"
          style={{ background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }}
        />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-['Space_Mono'] tracking-[0.4em] text-xs uppercase"
          style={{ color: "#C9A84C" }}
        >
          entering the void
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.7, duration: 1.0, ease: "linear" }}
          onAnimationComplete={onDone}
          className="h-px mt-6 mx-auto"
          style={{
            background: "linear-gradient(to right, #C9A84C, #4FC3C8, #C9A84C)",
            maxWidth: 192,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// ── Floating Particles ────────────────────────────────────────────────────────
function Particles() {
  const PALETTE = ["#C9A84C33", "#4FC3C833", "#FFD58022"];
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    dur: Math.random() * 12 + 10,
    delay: Math.random() * 6,
    color: PALETTE[i % PALETTE.length],
  }));
  const bokeh = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 40 + 20,
    dur: Math.random() * 20 + 25,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.03 + 0.03,
    color: i % 2 === 0 ? "#C9A84C" : "#4FC3C8",
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color }}
          animate={{ y: [0, -60, 0], x: [0, 20, -10, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {bokeh.map(b => (
        <motion.div
          key={`bokeh-${b.id}`}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.size,
            height: b.size,
            background: b.color,
            opacity: b.opacity,
            filter: `blur(${b.size * 0.5}px)`,
          }}
          animate={{ x: [0, 15, -10, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY.current || y < 60);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const nav = ["About", "Interests", "Connect", "Gaming"];
  return (
    <motion.nav
      animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4"
    >
      <div
        className="flex gap-6 px-7 py-3 rounded-full text-sm font-['Space_Mono']"
        style={{
          background: "rgba(15,12,8,0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(201,168,76,0.2)",
          boxShadow: "0 4px 32px rgba(201,168,76,0.06)",
        }}
      >
        {nav.map(item => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="nav-link tracking-wider text-xs"
          >
            {item}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
const LIGHTY_LETTERS = "LIGHTY".split("");

function Hero() {
  const [factIdx, setFactIdx] = useState(0);
  const [showing, setShowing] = useState(true);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotX = useSpring(useTransform(mouseY, [-400, 400], [6, -6]), { stiffness: 80, damping: 20 });
  const rotY = useSpring(useTransform(mouseX, [-600, 600], [-8, 8]), { stiffness: 80, damping: 20 });

  useEffect(() => {
    const cycle = setInterval(() => {
      setShowing(false);
      setTimeout(() => {
        setFactIdx(i => (i + 1) % FACTS.length);
        setShowing(true);
      }, 600);
    }, 3200);
    return () => clearInterval(cycle);
  }, []);

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" onMouseMove={handleMouse}>
      <Particles />

      {/* Orbs — amber + teal */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb1 absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, #6B4C1Ecc 0%, #3D2A0Eaa 40%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="orb2 absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, #0A3D40cc 0%, #052527aa 40%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="orb3 absolute -bottom-20 left-1/4 w-[450px] h-[450px] rounded-full"
          style={{ background: "radial-gradient(circle, #4A3510aa 0%, #2A1E0888 40%, transparent 70%)", filter: "blur(70px)" }} />
      </div>

      {/* Profile ring — spring entrance */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 60, damping: 12 }}
        className="relative mb-8 z-10"
      >
        <div className="profile-ring-wrapper">
          <div className="profile-ring-glow" />
          <div className="profile-ring-track" />
          <img
            src={PROFILE_IMG}
            alt="Lighty"
            className="profile-img"
            onError={e => {
              // Fallback to emoji if image not found
              e.target.style.display = "none";
              e.target.parentNode.insertAdjacentHTML("beforeend",
                '<div style="width:112px;height:112px;border-radius:50%;background:rgba(30,18,5,0.7);display:flex;align-items:center;justify-content:center;font-size:2.8rem">👾</div>'
              );
            }}
          />
        </div>
      </motion.div>

      {/* LIGHTY — cinematic letter drop */}
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, perspective: 800, transformStyle: "preserve-3d" }}
        className="z-10"
      >
        <h1
          className="font-['Bebas_Neue'] text-center leading-none select-none flex"
          style={{ fontSize: "clamp(5rem, 18vw, 16rem)", letterSpacing: "-0.03em" }}
        >
          {LIGHTY_LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              className="shimmer-text inline-block"
              initial={{ opacity: 0, y: 80, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: 0.15 + i * 0.06,
                type: "spring",
                stiffness: 90,
                damping: 14,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>
      </motion.div>

      {/* Typewriter facts */}
      <div className="h-8 z-10 mt-2 text-center">
        <AnimatePresence mode="wait">
          {showing && (
            <motion.p
              key={factIdx}
              initial={{ opacity: 0, filter: "blur(10px)", y: 8 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(10px)", y: -8 }}
              transition={{ duration: 0.5 }}
              className="text-gray-400 font-['Space_Mono'] text-sm tracking-wider"
            >
              {FACTS[factIdx]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll hint — glowing beam */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-['Space_Mono'] text-xs tracking-widest" style={{ color: "#C9A84C88" }}>SCROLL</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}
          className="w-px h-8 rounded-full scroll-beam"
          style={{ background: "linear-gradient(to bottom, #C9A84C, #4FC3C8)" }}
        />
      </motion.div>
    </section>
  );
}

// ── Glassmorphism Card helper ─────────────────────────────────────────────────
function GlassCard({ children, glowColor = "#C9A84C", className = "", tilt = false, ...props }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tiltXY, setTiltXY] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    if (tilt) {
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      setTiltXY({ x: (y - cy) / cy * 8, y: (x - cx) / cx * -8 });
    }
  };

  const handleLeave = () => {
    if (tilt) setTiltXY({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -8, scale: 1.02 }}
      animate={tilt ? { rotateX: tiltXY.x, rotateY: tiltXY.y } : {}}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden rounded-2xl p-6 ${className}`}
      style={{
        background: "rgba(20, 16, 10, 0.6)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        transformStyle: tilt ? "preserve-3d" : undefined,
        perspective: tilt ? 800 : undefined,
      }}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(180px at ${mousePos.x}px ${mousePos.y}px, rgba(201,168,76,0.05), transparent)`,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0"
        whileHover={{ opacity: 1 }}
        style={{ boxShadow: `0 0 0 1px ${glowColor}88, 0 0 20px ${glowColor}44` }}
      />
      {children}
    </motion.div>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="font-['Space_Mono'] text-xs uppercase mb-4"
          style={{ color: "#C9A84C", letterSpacing: "0.5em" }}
        >
          01 — About
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="group"
        >
          <GlassCard glowColor="#C9A84C">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.07), transparent 60%)" }}
            />
            <h2 className="font-['Bebas_Neue'] text-4xl text-white mb-4 tracking-wide">
              Hey, I'm{" "}
              <span className="shimmer-text">Lighty</span>
            </h2>
            <p className="leading-relaxed font-['Syne'] text-base" style={{ color: "#E8E8E8" }}>
              16-year-old from{" "}
              <span style={{ color: "#4FC3C8" }} className="font-semibold">India</span>{" "}
              who lives on the internet and low-key thrives.
              You'll catch me plotting on a chessboard, vibing to lo-fi at 2am, or going sus on Among Us when nobody's watching.
            </p>
            <p className="leading-relaxed font-['Syne'] text-sm mt-4 text-gray-400">
              Discord is my HQ. Music is my therapy. Stalking profiles is definitely just a hobby.
              I don't sleep much but I do move in silence — mostly because I'm always in someone's game lobby.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {["India 🇮🇳", "16 yrs", "He/Him", "Night Owl 🌙", "Chess Nerd"].map(tag => (
                <span key={tag} className="text-xs font-['Space_Mono'] px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(201,168,76,0.1)",
                    border: "1px solid rgba(201,168,76,0.4)",
                    color: "#C9A84C",
                  }}>
                  {tag}
                </span>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

// ── Interests ────────────────────────────────────────────────────────────────
function Interests() {
  return (
    <section id="interests" className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-['Space_Mono'] text-xs uppercase mb-4"
          style={{ color: "#C9A84C", letterSpacing: "0.5em" }}
        >
          02 — Interests
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="font-['Bebas_Neue'] text-5xl text-white mb-12 tracking-wide"
        >
          What I'm into
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HOBBIES.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="group"
            >
              <GlassCard glowColor={h.glow} tilt={true}>
                <span className="text-4xl block mb-3">{h.icon}</span>
                <h3 className="font-['Syne'] font-bold text-white text-lg mb-1">{h.label}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{h.desc}</p>
                <motion.div
                  className="h-0.5 mt-4 rounded-full"
                  style={{ background: `linear-gradient(to right, ${h.glow}, transparent)` }}
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: i * 0.1 + 0.4, duration: 0.6 }}
                />
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Social Button ─────────────────────────────────────────────────────────────
function SocialBtn({ href, logo, label, glowColor, subtext }) {
  const [ripples, setRipples] = useState([]);
  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(r => r.filter(ri => ri.id !== id)), 700);
  };
  return (
    <motion.a
      href={href} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.03 }}
      onClick={addRipple}
      className="relative overflow-hidden flex items-center gap-4 rounded-2xl px-6 py-4 transition-all duration-300 group"
      style={{
        background: "rgba(20,16,10,0.55)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <motion.div
        whileHover={{ rotate: [0, -15, 10, 0] }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {logo}
      </motion.div>
      <div className="flex-1">
        <p className="font-['Syne'] font-bold text-white">{label}</p>
        {subtext && <p className="font-['Space_Mono'] text-xs text-gray-500">{subtext}</p>}
      </div>
      <motion.div
        className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100"
        style={{ background: glowColor, boxShadow: `0 0 8px ${glowColor}` }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `0 0 0 1px ${glowColor}66, 0 0 24px ${glowColor}33` }} />
      {ripples.map(r => (
        <motion.div key={r.id} className="pointer-events-none absolute rounded-full"
          style={{ left: r.x - 5, top: r.y - 5, width: 10, height: 10, background: `${glowColor}66` }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 20, opacity: 0 }}
          transition={{ duration: 0.7 }}
        />
      ))}
    </motion.a>
  );
}

// ── Connect ───────────────────────────────────────────────────────────────────
function Connect() {
  return (
    <section id="connect" className="relative py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-['Space_Mono'] text-xs uppercase mb-4"
          style={{ color: "#C9A84C", letterSpacing: "0.5em" }}
        >
          03 — Connect
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }} className="font-['Bebas_Neue'] text-5xl text-white mb-10 tracking-wide"
        >
          Find me online
        </motion.h2>
        <div className="flex flex-col gap-4">
          <SocialBtn href="https://instagram.com/_roythedemon" logo={<IgLogo />} label="Instagram" glowColor="#f02fa0" subtext="@_roythedemon" />
          <SocialBtn href="https://discord.com/users/roythedemon" logo={<DiscordLogo />} label="Discord" glowColor="#5865F2" subtext="roythedemon" />
          <SocialBtn href="https://snapchat.com/add/_roythedemon" logo={<SnapLogo />} label="Snapchat" glowColor="#FFFC00" subtext="@_roythedemon" />
          <SocialBtn href="https://wa.me/" logo={<WhatsAppLogo />} label="WhatsApp" glowColor="#25D366" subtext="Drop a message" />
        </div>
      </div>
    </section>
  );
}

// ── Gaming ────────────────────────────────────────────────────────────────────
function Gaming() {
  const [rating, setRating] = useState(null);

  useEffect(() => {
    fetch(`https://api.chess.com/pub/player/${CHESS_USER}/stats`)
      .then(r => r.json())
      .then(d => {
        const r = d?.chess_rapid?.last?.rating || d?.chess_blitz?.last?.rating || d?.chess_bullet?.last?.rating;
        setRating(r || "Unrated");
      })
      .catch(() => setRating("Unrated"));
  }, []);

  return (
    <section id="gaming" className="relative py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-['Space_Mono'] text-xs uppercase mb-4"
          style={{ color: "#C9A84C", letterSpacing: "0.5em" }}
        >
          04 — Gaming
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }} className="font-['Bebas_Neue'] text-5xl text-white mb-10 tracking-wide"
        >
          Find me gaming
        </motion.h2>
        <div className="flex flex-col gap-5">
          {/* Chess */}
          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <a href={`https://chess.com/member/${CHESS_USER}`} target="_blank" rel="noopener noreferrer" className="block group">
              <GlassCard glowColor="#81b64c">
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-xl" style={{ background: "rgba(129,182,76,0.12)", border: "1px solid rgba(129,182,76,0.2)" }}>
                    <ChessLogo />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-['Syne'] font-bold text-white text-lg">Chess.com</h3>
                      {rating !== null && (
                        <span className="font-['Space_Mono'] text-xs px-3 py-1 rounded-full font-bold"
                          style={{ background: "rgba(129,182,76,0.2)", border: "1px solid rgba(129,182,76,0.4)", color: "#81b64c", boxShadow: "0 0 10px rgba(129,182,76,0.3)" }}>
                          Rating: {rating}
                        </span>
                      )}
                    </div>
                    <p className="font-['Space_Mono'] text-gray-400 text-sm">@{CHESS_USER}</p>
                  </div>
                  <span className="text-gray-600 group-hover:text-green-400 transition-colors text-xl">→</span>
                </div>
              </GlassCard>
            </a>
          </motion.div>

          {/* Among Us */}
          <motion.div
            initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="group relative">
              <GlassCard glowColor="#c0392b">
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-xl" style={{ background: "rgba(192,57,43,0.12)", border: "1px solid rgba(192,57,43,0.2)" }}>
                    <AmongUsLogo />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-['Syne'] font-bold text-white text-lg mb-1">Among Us</h3>
                    <p className="font-['Space_Mono'] text-gray-400 text-sm">{AMONG_USER}</p>
                  </div>
                </div>
              </GlassCard>
              {/* Sus tooltip */}
              <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                <div className="font-['Space_Mono'] text-xs px-3 py-1.5 rounded-full whitespace-nowrap"
                  style={{ background: "rgba(192,57,43,0.85)", border: "1px solid rgba(192,57,43,0.6)", color: "white", boxShadow: "0 0 16px rgba(192,57,43,0.4)" }}>
                  sus 👀
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Speaker ───────────────────────────────────────────────────────────────────
function Speaker() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [261.6, 293.7, 329.6, 349.2, 392.0];
    let active = false;
    let timeout;

    const playNote = (i = 0) => {
      if (!active) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = notes[i % notes.length];
      osc.type = "sine";
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.3);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      osc.start(); osc.stop(ctx.currentTime + 1.6);
      timeout = setTimeout(() => playNote(i + 1), 1800);
    };

    if (on) {
      active = true;
      if (ctx.state === "suspended") ctx.resume();
      playNote();
    } else {
      active = false;
      clearTimeout(timeout);
    }
    return () => { active = false; clearTimeout(timeout); };
  }, [on]);

  return (
    <button
      onClick={() => setOn(v => !v)}
      data-hover="true"
      className={`fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${on ? "speaker-active" : ""}`}
      style={{
        background: "rgba(20,14,5,0.7)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${on ? "rgba(201,168,76,0.6)" : "rgba(255,255,255,0.1)"}`,
        boxShadow: on ? "0 0 16px rgba(201,168,76,0.4)" : "none",
      }}
      title={on ? "Mute ambient" : "Play ambient"}
    >
      {on ? "🔊" : "🔇"}
    </button>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const [clicks, setClicks] = useState(0);
  const [egg, setEgg] = useState(false);

  const handleHeartClick = () => {
    const n = clicks + 1;
    setClicks(n);
    if (n >= 5) {
      setClicks(0);
      setEgg(true);
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.9 }, colors: ["#C9A84C", "#4FC3C8", "#FFD580", "#ffffff", "#A07830"] });
      confetti({ particleCount: 100, angle: 60, spread: 80, origin: { x: 0 }, colors: ["#C9A84C", "#ef4444"] });
      confetti({ particleCount: 100, angle: 120, spread: 80, origin: { x: 1 }, colors: ["#4FC3C8", "#FFD580"] });
      setTimeout(() => setEgg(false), 3500);
    }
  };

  return (
    <>
      <footer className="relative py-12 text-center border-t border-white border-opacity-5">
        <p className="font-['Space_Mono'] text-gray-600 text-xs tracking-widest">
          LIGHTY &nbsp;·&nbsp;{" "}
          <span
            onClick={handleHeartClick}
            data-hover="true"
            className="cursor-pointer transition-colors select-none"
            style={{ color: "inherit" }}
            onMouseEnter={e => e.target.style.color = "#C9A84C"}
            onMouseLeave={e => e.target.style.color = ""}
          >
            made with ❤️
          </span>
        </p>
        <p className="font-['Space_Mono'] text-gray-700 text-xs mt-2 tracking-widest">
          {clicks > 0 && clicks < 5 && `${5 - clicks} more...`}
        </p>
      </footer>

      {/* Easter egg overlay */}
      <AnimatePresence>
        {egg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99990] flex items-center justify-center"
            style={{ background: "rgba(5,3,0,0.92)", backdropFilter: "blur(10px)" }}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-center"
            >
              <div className="glitch-wrap font-['Bebas_Neue'] text-6xl md:text-8xl text-white" data-text="you found the secret 👀">
                you found the secret 👀
              </div>
              <motion.p
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="font-['Space_Mono'] text-sm mt-4 tracking-widest"
                style={{ color: "#C9A84C" }}
              >
                only the curious make it this far
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [intro, setIntro] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Cursor />
      <AnimatePresence>{intro && <Intro onDone={() => setTimeout(() => setIntro(false), 300)} />}</AnimatePresence>
      {!intro && (
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
        >
          <Navbar />
          <Hero />
          <About />
          <Interests />
          <Connect />
          <Gaming />
          <Speaker />
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
