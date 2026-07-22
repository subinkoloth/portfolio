import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#live-projects" },
    { label: "Connect", href: "#connect" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/85 backdrop-blur-xl border-b border-white/10 shadow-glow/10' : 'bg-transparent'
      }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="text-xl sm:text-2xl font-black tracking-tighter hover-trigger select-none">
            <span className="text-gradient font-black">SUBIN</span> A
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 font-mono text-xs tracking-widest">
            {navItems.map((item, index) => (
              <div key={item.label} className="flex items-center gap-6">
                {index > 0 && <span className="text-white/20 select-none font-light">//</span>}
                <button
                  onClick={() => handleNavClick(item.href)}
                  className="text-foreground hover:text-primary transition-all duration-300 font-bold hover:scale-105 hover-trigger uppercase"
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground hover:text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl animate-fade-in">
            <div className="container mx-auto px-6 py-8 space-y-4">
              {navItems.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left py-4 px-6 text-foreground hover:text-primary hover:bg-white/5 transition-all duration-300 font-bold tracking-widest font-mono rounded-xl animate-slide-in uppercase border border-transparent hover:border-white/5"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;