import { motion } from "framer-motion";
import { useIdleImagePrefetch } from "@/hooks/useImagePrefetch";

const images = [
  "https://images.pexels.com/photos/87221/pexels-photo-87221.jpeg",
  "https://images.pexels.com/photos/1635329/pexels-photo-1635329.jpeg",
  "https://images.pexels.com/photos/29170314/pexels-photo-29170314.jpeg",
  "https://images.pexels.com/photos/4551154/pexels-photo-4551154.jpeg",
  "https://images.pexels.com/photos/1233535/pexels-photo-1233535.jpeg",
  "https://images.pexels.com/photos/350478/pexels-photo-350478.jpeg",
];

export default function Gallery() {
  // Prefetch a few top images during idle so they render instantly on view
  useIdleImagePrefetch(
    images.slice(0, 3).map((raw) => `${raw}?auto=compress&cs=tinysrgb&w=700`),
    { concurrency: 2 },
  );
  return (
    <section id="gallery" className="bg-background py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl">Atmosphere</h2>
          <p className="mt-3 text-muted-foreground">
            Moments from our café • Scroll to explore
          </p>
        </div>
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((raw, i) => {
            const src = `${raw}?auto=compress&cs=tinysrgb&w=1200`; // cap max width
            const srcSet = [400, 700, 1000, 1400]
              .map((w) => `${raw}?auto=compress&cs=tinysrgb&w=${w} ${w}w`)
              .join(", ");
            const sizes =
              "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw";
            return (
              <motion.img
                key={i}
                src={src}
                srcSet={srcSet}
                sizes={sizes}
                alt="Cafe moment"
                loading="lazy"
                decoding="async"
                className="mb-4 w-full break-inside-avoid rounded-xl border border-border object-cover shadow"
                style={{
                  contentVisibility: "auto",
                  containIntrinsicSize: "400px 300px",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
