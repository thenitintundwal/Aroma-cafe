import { motion } from "framer-motion";

export default function FloatingOrder() {
  return (
    <motion.a
      href="#menu"
      className="fixed bottom-6 right-6 z-40 rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground shadow-glow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      Order Now
    </motion.a>
  );
}
