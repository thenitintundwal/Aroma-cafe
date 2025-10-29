import { motion } from "framer-motion";
import { useState } from "react";

const items = [
  {
    name: "Espresso",
    price: "$3.50",
    img: "https://images.pexels.com/photos/2325307/pexels-photo-2325307.jpeg",
    desc: "Rich and bold, a pure shot of finely extracted espresso.",
  },
  {
    name: "Cappuccino",
    price: "$4.50",
    img: "https://images.pexels.com/photos/57690/pexels-photo-57690.jpeg",
    desc: "Silky foam with a balanced blend of espresso and milk.",
  },
  {
    name: "Latte",
    price: "$4.75",
    img: "https://images.pexels.com/photos/350478/pexels-photo-350478.jpeg",
    desc: "Creamy and smooth with delicate latte art on top.",
  },
  {
    name: "Mocha",
    price: "$5.00",
    img: "https://images.pexels.com/photos/4541324/pexels-photo-4541324.jpeg",
    desc: "Chocolate-kissed latte with a comforting finish.",
  },
];

export default function Menu() {
  return (
    <section id="menu" className="relative bg-card py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl">Signature Menu</h2>
          <p className="mt-3 text-muted-foreground">Hover for details • Click to expand</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <MenuCard key={item.name} {...item} />)
          )}
        </div>
      </div>
    </section>
  );
}

function MenuCard({ name, price, img, desc }: { name: string; price: string; img: string; desc: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.button
      layout
      onClick={() => setExpanded((v) => !v)}
      className="group relative overflow-hidden rounded-2xl border border-border bg-background text-left shadow transition-colors hover:border-primary/40 focus:outline-none"
      whileHover={{ y: -4 }}
    >
      <div className="aspect-square overflow-hidden">
        <motion.img
          src={img}
          alt={name}
          className="size-full object-cover"
          loading="lazy"
          whileHover={{ scale: 1.06 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{name}</h3>
          <span className="font-semibold text-primary">{price}</span>
        </div>
        <motion.p
          initial={false}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 overflow-hidden text-sm text-muted-foreground"
        >
          {desc}
        </motion.p>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.button>
  );
}
