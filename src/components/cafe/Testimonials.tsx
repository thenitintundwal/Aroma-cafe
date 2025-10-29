import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Elena Rossi",
    text: "The cappuccino is divine and the vibe is immaculate. My daily ritual!",
    stars: 5,
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    name: "Marcus Chen",
    text: "Warm, elegant, and the best beans in town. Highly recommend the mocha.",
    stars: 5,
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Sofia Alvarez",
    text: "Cozy spot for remote work. Love the playlist and the latte art.",
    stars: 4,
    avatar: "https://i.pravatar.cc/100?img=30",
  },
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const id = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
    <section id="testimonials" className="bg-card py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl">Kind Words</h2>
          <p className="mt-3 text-muted-foreground">What our guests are saying</p>
        </div>
        <div className="mt-10">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t, i) => (
                <div key={i} className="min-w-0 shrink-0 grow-0 basis-full px-4 md:basis-2/3 md:px-8">
                  <motion.div
                    initial={{ opacity: 0.6, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="glass-card mx-auto max-w-2xl p-8 text-center"
                  >
                    <div className="mx-auto mb-4 size-14 overflow-hidden rounded-full ring-2 ring-primary/30">
                      <img src={t.avatar} alt={t.name} className="size-full object-cover" />
                    </div>
                    <p className="text-lg text-foreground/90">“{t.text}”</p>
                    <div className="mt-4 flex items-center justify-center gap-1 text-primary">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <span key={j}>★</span>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{t.name}</div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-1.5 w-6 rounded-full transition-colors ${index === i ? "bg-primary" : "bg-muted"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
