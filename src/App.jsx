import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// ── constants ─────────────────────────────────────────────────────────────────
const CHESS_USER = "not_kxk";
const AMONG_USER = "ethicalcab#0562";
const FACTS = [
  "16 years young. India-bred. Internet-raised. 🇮🇳",
  "Professional stalker (the internet kind, relax) 👀",
  "Chess pieces fear me. Every move calculated. ♟️",
  "Sus by nature. Crewmate by choice. 📮",
  "Lo-fi music running 24/7 in my headphones 🎵",
  "Discord is basically my second home 💬",
];
const HOBBIES = [
  { label: "Chess", icon: "♟️", glow: "#00a86b", desc: "Strategist on the board. Every move is a trap." },
  { label: "Music", icon: "🎵", glow: "#a855f7", desc: "Lo-fi, beats, whatever hits. Always on shuffle." },
  { label: "Gaming", icon: "🎮", glow: "#ef4444", desc: "Among Us loyalist. Report me if you dare." },
  { label: "Stalking", icon: "👀", glow: "#06b6d4", desc: "I know your last online. It's a gift, really." },
  { label: "Discord", icon: "💬", glow: "#5865F2", desc: "Always in a server. Never truly offline." },
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
  const cursorRef = useRef(null);
  const trailRef = useRef([]);
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
      // trail
      for (let i = 0; i < trail.current.length; i++) {
        trail.current[i].age++;
        const t = i / trail.current.length;
        const alpha = t * (1 - trail.current[i].age / 60);
        if (alpha <= 0) continue;
        const r = t * (hovering ? 8 : 5);
        const grad = ctx.createRadialGradient(trail.current[i].x, trail.current[i].y, 0, trail.current[i].x, trail.current[i].y, r * 2);
        grad.addColorStop(0, `rgba(155, 89, 182, ${alpha})`);
        grad.addColorStop(1, `rgba(139, 92, 246, 0)`);
        ctx.beginPath();
        ctx.arc(trail.current[i].x, trail.current[i].y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      trail.current = trail.current.filter(p => p.age < 60);
      // dot
      const { x, y } = pos.current;
      const dotR = hovering ? 10 : 5;
      const dotGrad = ctx.createRadialGradient(x, y, 0, x, y, dotR * 3);
      dotGrad.addColorStop(0, "rgba(200,130,255,1)");
      dotGrad.addColorStop(0.4, "rgba(155,89,182,0.8)");
      dotGrad.addColorStop(1, "rgba(139,92,246,0)");
      ctx.beginPath();
      ctx.arc(x, y, dotR * 3, 0, Math.PI * 2);
      ctx.fillStyle = dotGrad;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, dotR * 0.4, 0, Math.PI * 2);
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
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div className="text-center">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="h-px w-48 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-6"
        />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-['Space_Mono'] text-purple-400 tracking-[0.4em] text-xs uppercase"
        >
          entering the void
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.7, duration: 1.0, ease: "linear" }}
          onAnimationComplete={onDone}
          className="h-px bg-gradient-to-r from-purple-600 via-cyan-400 to-purple-600 mt-6 mx-auto"
          style={{ maxWidth: 192 }}
        />
      </motion.div>
    </motion.div>
  );
}

// ── Floating Particles ────────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    dur: Math.random() * 10 + 8,
    delay: Math.random() * 5,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-purple-400"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: 0.4 }}
          animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
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
          background: "rgba(15,15,15,0.55)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(155,89,182,0.2)",
          boxShadow: "0 4px 32px rgba(155,89,182,0.08)",
        }}
      >
        {nav.map(item => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-gray-400 hover:text-purple-400 transition-colors duration-300 tracking-wider text-xs"
          >
            {item}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
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
      {/* Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb1 absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, #6b21a8cc 0%, #4c1d95aa 40%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="orb2 absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, #0e7490cc 0%, #0c4a6eaa 40%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="orb3 absolute -bottom-20 left-1/4 w-[450px] h-[450px] rounded-full"
          style={{ background: "radial-gradient(circle, #7c3aedaa 0%, #4c1d9588 40%, transparent 70%)", filter: "blur(55px)" }} />
      </div>

      {/* Profile ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative mb-8 z-10"
      >
        <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl"
          style={{
            background: "rgba(30,10,50,0.6)",
            border: "2px solid rgba(155,89,182,0.6)",
            boxShadow: "0 0 30px rgba(155,89,182,0.5), 0 0 60px rgba(155,89,182,0.2), inset 0 0 20px rgba(155,89,182,0.1)",
          }}>
          👾
        </div>
        <div className="absolute inset-0 rounded-full" style={{
          background: "conic-gradient(from 0deg, #9b59b6, #06b6d4, #9b59b6)",
          padding: 2, borderRadius: "50%", mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))",
        }} />
      </motion.div>

      {/* Name */}
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, perspective: 800, transformStyle: "preserve-3d" }}
        className="z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="shimmer-text font-['Bebas_Neue'] text-center leading-none select-none"
          style={{ fontSize: "clamp(5rem, 18vw, 16rem)", letterSpacing: "-0.02em" }}
        >
          LIGHTY
        </motion.h1>
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

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-gray-600 font-['Space_Mono'] text-xs tracking-widest">SCROLL</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}
          className="w-px h-8 bg-gradient-to-b from-purple-500 to-transparent" />
      </motion.div>
    </section>
  );
}

// ── Glassmorphism Card helper ─────────────────────────────────────────────────
function GlassCard({ children, glowColor = "#9b59b6", className = "", ...props }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMouse}
      className={`relative overflow-hidden rounded-2xl p-6 ${className}`}
      style={{
        background: "rgba(15, 5, 25, 0.55)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
      {...props}
    >
      {/* Shine follow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(180px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.04), transparent)`,
        }}
      />
      {/* Hover glow border */}
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
          className="text-purple-400 font-['Space_Mono'] text-xs tracking-[0.3em] uppercase mb-4"
        >
          01 — About
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
          className="group"
        >
          <GlassCard glowColor="#9b59b6">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(155,89,182,0.08), transparent 60%)" }}
            />
            <h2 className="font-['Bebas_Neue'] text-4xl text-white mb-4 tracking-wide">
              Hey, I'm{" "}
              <span className="shimmer-text">Lighty</span>
            </h2>
            <p className="text-gray-300 leading-relaxed font-['Syne'] text-base space-y-2">
              16-year-old from <span className="text-cyan-400 font-semibold">India</span> who lives on the internet and low-key thrives.
              You'll catch me plotting on a chessboard, vibing to lo-fi at 2am, or going sus on Among Us when nobody's watching.
            </p>
            <p className="text-gray-400 leading-relaxed font-['Syne'] text-sm mt-4">
              Discord is my HQ. Music is my therapy. Stalking profiles is definitely just a hobby.
              I don't sleep much but I do move in silence — mostly because I'm always in someone's game lobby.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {["India 🇮🇳", "16 yrs", "He/Him", "Night Owl 🌙", "Chess Nerd"].map(tag => (
                <span key={tag} className="text-xs font-['Space_Mono'] px-3 py-1 rounded-full"
                  style={{ background: "rgba(155,89,182,0.15)", border: "1px solid rgba(155,89,182,0.3)", color: "#c084fc" }}>
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
          className="text-purple-400 font-['Space_Mono'] text-xs tracking-[0.3em] uppercase mb-4"
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
              initial={{ opacity: 0, y: 60, rotate: i % 2 === 0 ? -4 : 4 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="group"
            >
              <GlassCard glowColor={h.glow}>
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
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.03 }}
      onClick={addRipple}
      className="relative overflow-hidden flex items-center gap-4 rounded-2xl px-6 py-4 transition-all duration-300 group"
      style={{
        background: "rgba(15,5,25,0.55)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
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
      {/* hover glow border */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `0 0 0 1px ${glowColor}66, 0 0 24px ${glowColor}33` }} />
      {/* ripples */}
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
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-purple-400 font-['Space_Mono'] text-xs tracking-[0.3em] uppercase mb-4">
          03 — Connect
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }} className="font-['Bebas_Neue'] text-5xl text-white mb-10 tracking-wide">
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
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-purple-400 font-['Space_Mono'] text-xs tracking-[0.3em] uppercase mb-4">
          04 — Gaming
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }} className="font-['Bebas_Neue'] text-5xl text-white mb-10 tracking-wide">
          Find me gaming
        </motion.h2>
        <div className="flex flex-col gap-5">
          {/* Chess */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
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
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}>
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
  const audioRef = useRef(null);

  useEffect(() => {
    // Generate a simple tone loop using Web Audio API (no external audio file needed)
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
        background: "rgba(20,5,35,0.7)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${on ? "rgba(155,89,182,0.6)" : "rgba(255,255,255,0.1)"}`,
        boxShadow: on ? "0 0 16px rgba(155,89,182,0.4)" : "none",
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
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.9 }, colors: ["#9b59b6", "#06b6d4", "#a855f7", "#f0abfc", "#ffffff"] });
      confetti({ particleCount: 100, angle: 60, spread: 80, origin: { x: 0 }, colors: ["#9b59b6", "#ef4444"] });
      confetti({ particleCount: 100, angle: 120, spread: 80, origin: { x: 1 }, colors: ["#06b6d4", "#a855f7"] });
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
            className="cursor-pointer hover:text-purple-400 transition-colors select-none"
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
            style={{ background: "rgba(5,0,15,0.92)", backdropFilter: "blur(10px)" }}
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
                className="font-['Space_Mono'] text-purple-400 text-sm mt-4 tracking-widest"
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
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
