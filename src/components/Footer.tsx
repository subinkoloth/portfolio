const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/5 py-12">
      <div className="container mx-auto px-6 max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs font-mono text-zinc-500">
        <div>
          © {currentYear} SUBIN A. ALL RIGHTS RESERVED.
        </div>
        <div className="hover-trigger text-zinc-600 hover:text-primary transition-colors duration-300">
          CRAFTED WITH VITE + FRAMER MOTION
        </div>
      </div>
    </footer>
  );
};

export default Footer;