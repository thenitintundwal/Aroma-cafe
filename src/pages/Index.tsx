import Hero from "@/components/cafe/Hero";
import About from "@/components/cafe/About";
import Menu from "@/components/cafe/Menu";
import Gallery from "@/components/cafe/Gallery";
import Testimonials from "@/components/cafe/Testimonials";
import Contact from "@/components/cafe/Contact";

export default function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <About />
      <Menu />
      <Gallery />
      <Testimonials />
      <Contact />
    </main>
  );
}
