export default function Footer() {
  return (
    <footer className="bg-card/70 backdrop-blur">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} Aroma Café. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#about" className="hover:text-foreground">About</a>
          <a href="#menu" className="hover:text-foreground">Menu</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
