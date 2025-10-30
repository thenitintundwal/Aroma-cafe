import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import MusicToggle from "./MusicToggle";

const nav = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#menu", label: "Menu" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const mouseX = useMotionValue(Infinity);
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-4 flex items-center justify-between rounded-full border border-white/10 bg-black/30 p-2 backdrop-blur-md transition-colors dark:border-white/10 dark:bg-white/10">
          <a
            href="/"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-white"
          >
            <span className="inline-block size-2 rounded-full bg-primary" />
            <span className="font-serif text-lg tracking-wide">Aroma Café</span>
          </a>
          <nav
            className="hidden items-center gap-6 md:flex"
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
          >
            {nav.map((n) => (
              <NavDockLink key={n.href} href={n.href} mouseX={mouseX}>
                {n.label}
              </NavDockLink>
            ))}
            {/* <a href="#menu" className="btn-primary">Order Now</a> */}
            <MusicToggle />
            <ThemeToggle />
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <MusicToggle />
            <ThemeToggle />
            <button
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-2 rounded-2xl border border-white/10 bg-black/60 p-4 text-white backdrop-blur-md md:hidden"
          >
            <div className="grid gap-2">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 hover:bg-white/10"
                >
                  {n.label}
                </a>
              ))}
              <a
                href="#menu"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 justify-center"
              >
                Order Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavDockLink({
  href,
  children,
  mouseX,
}: {
  href: string;
  children: React.ReactNode;
  mouseX: any;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const distance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return Infinity;
    return Math.abs(val - (rect.left + rect.width / 2));
  });
  const scaleRaw = useTransform(distance, [0, 80, 200], [1.2, 1.05, 1]);
  const scale = useSpring(scaleRaw, { mass: 0.1, stiffness: 200, damping: 18 });
  const opacity = useTransform(distance, [0, 200], [1, 0.8]);
  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ scale, opacity, willChange: "transform, opacity" }}
      className="text-sm text-white/80 transition-colors hover:text-white"
    >
      {children}
    </motion.a>
  );
}
