import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const mapWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapWrapRef.current) return;
    const node = mapWrapRef.current;
    const onIdle = (cb: () => void) => {
      if ((window as any).requestIdleCallback) {
        (window as any).requestIdleCallback(cb, { timeout: 1500 });
      } else {
        setTimeout(cb, 200);
      }
    };
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          onIdle(() => setShouldLoadMap(true));
          obs.disconnect();
        }
      },
      { root: null, threshold: 0.1, rootMargin: "100px 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="contact" className="relative bg-background py-24">
      <div className="container grid gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-border shadow"
        >
          <div
            ref={mapWrapRef}
            className="relative h-[320px] w-full md:h-[450px]"
          >
            {!shouldLoadMap && (
              <button
                type="button"
                onClick={() => setShouldLoadMap(true)}
                className="absolute inset-0 z-10 grid place-items-center bg-muted/30 backdrop-blur-sm focus:outline-none"
                aria-label="Load interactive map"
              >
                <span className="rounded-full bg-background/80 px-4 py-2 text-sm text-foreground shadow">
                  Load map
                </span>
              </button>
            )}
            {!shouldLoadMap && (
              <img
                src="https://images.unsplash.com/photo-1509043759401-136742328bb3?q=80&auto=format&fit=crop&w=1200"
                srcSet="https://images.unsplash.com/photo-1509043759401-136742328bb3?q=80&auto=format&fit=crop&w=600 600w, https://images.unsplash.com/photo-1509043759401-136742328bb3?q=80&auto=format&fit=crop&w=900 900w, https://images.unsplash.com/photo-1509043759401-136742328bb3?q=80&auto=format&fit=crop&w=1200 1200w"
                sizes="(min-width:768px) 50vw, 100vw"
                alt="Map preview"
                className="h-full w-full object-cover"
                decoding="async"
                loading="lazy"
                style={{
                  contentVisibility: "auto",
                  containIntrinsicSize: "600px 450px",
                }}
              />
            )}
            {shouldLoadMap && (
              <iframe
                title="Map to our café"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.067893664825!2d-122.42177892347613!3d37.80436337197826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f80ac2ab2f10f%3A0xf421d8a0c86995a1!2sCoffee%20Shop!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-full w-full"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            )}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            await new Promise((r) => setTimeout(r, 800));
            setLoading(false);
            alert("Thanks! We'll be in touch soon.");
          }}
          className="glass-card grid gap-4 p-6"
        >
          <h3 className="font-serif text-2xl">Say Hello</h3>
          <label className="grid gap-2">
            <span className="text-sm text-muted-foreground">Name</span>
            <input required className="input-glow" placeholder="Your name" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-muted-foreground">Email</span>
            <input
              required
              type="email"
              className="input-glow"
              placeholder="you@email.com"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-muted-foreground">Message</span>
            <textarea
              required
              rows={5}
              className="input-glow resize-none"
              placeholder="I'd like to..."
            />
          </label>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="btn-primary justify-center"
          >
            {loading ? "Sending..." : "Send Message"}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
