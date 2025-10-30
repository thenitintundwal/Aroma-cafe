import { motion } from "framer-motion";
import { useState } from "react";
import { useIdleImagePrefetch } from "@/hooks/useImagePrefetch";

export default function About() {
  useIdleImagePrefetch([
    "https://images.pexels.com/photos/4551154/pexels-photo-4551154.jpeg?auto=compress&cs=tinysrgb&w=1000",
  ]);
  return (
    <section
      id="about"
      className="relative bg-background py-24 text-foreground"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,hsl(var(--accent)/0.35),transparent_60%)]" />
      <div className="container grid items-center gap-10 md:grid-cols-2">
        {(() => {
          const [imgLoaded, setImgLoaded] = useState(false);
          return (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={imgLoaded ? { opacity: 1, x: 0 } : {}}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-border will-change-transform transform-gpu"
            >
              {!imgLoaded && (
                <div
                  aria-hidden
                  className="h-full w-full animate-pulse bg-muted"
                  style={{ height: "100%", minHeight: 320 }}
                />
              )}
              <img
                src="https://images.pexels.com/photos/4551154/pexels-photo-4551154.jpeg?auto=compress&cs=tinysrgb&w=1400"
                srcSet="
                  https://images.pexels.com/photos/4551154/pexels-photo-4551154.jpeg?auto=compress&cs=tinysrgb&w=700 700w,
                  https://images.pexels.com/photos/4551154/pexels-photo-4551154.jpeg?auto=compress&cs=tinysrgb&w=1000 1000w,
                  https://images.pexels.com/photos/4551154/pexels-photo-4551154.jpeg?auto=compress&cs=tinysrgb&w=1400 1400w
                "
                sizes="(min-width:768px) 50vw, 100vw"
                alt="Warm cozy cafe interior"
                width={1400}
                height={933}
                className={`h-full w-full object-cover ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                loading="lazy"
                decoding="async"
                onLoad={() => setImgLoaded(true)}
                style={{
                  contentVisibility: "auto",
                  containIntrinsicSize: "800px 600px",
                  transition: "opacity 250ms ease-out",
                }}
              />
            </motion.div>
          );
        })()}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl">Crafted with Care</h2>
          <p className="mt-4 text-muted-foreground">
            From bean to cup, every step in our process is guided by passion and
            precision. We source sustainably, roast expertly, and brew with love
            — delivering an experience that warms the soul.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="glass-card p-5">
              <h3 className="font-semibold">Origins</h3>
              <p className="mt-1 text-muted-foreground">
                Ethiopia • Colombia • Sumatra
              </p>
            </div>
            <div className="glass-card p-5">
              <h3 className="font-semibold">Craft</h3>
              <p className="mt-1 text-muted-foreground">
                Slow pour • Hand tamp • Precise temp
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
