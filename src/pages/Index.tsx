import { Suspense, lazy } from "react";
import Hero from "@/components/cafe/Hero";
import About from "@/components/cafe/About";
import Menu from "@/components/cafe/Menu";
import Testimonials from "@/components/cafe/Testimonials";
import Contact from "@/components/cafe/Contact";

const Gallery = lazy(() => import("@/components/cafe/Gallery"));

export default function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <About />
      <Menu />
      <Suspense fallback={<div className="h-[50vh]" />}>
        <Gallery />
      </Suspense>
      <Testimonials />
      <Contact />
    </main>
  );
}
