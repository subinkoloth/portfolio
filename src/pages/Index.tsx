import { useEffect } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import LiveProjects from "@/components/LiveProjects";
import About from "@/components/About";
import Connect from "@/components/Connect";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const Index = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollVelocity = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 250, mass: 0.5 };
  const trailConfig = { damping: 80, stiffness: 150, mass: 0.8 };

  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const cursorX2 = useSpring(mouseX, trailConfig);
  const cursorY2 = useSpring(mouseY, trailConfig);

  // Map scroll velocity to warp scaling and skewing
  const skewY = useTransform(scrollVelocity, [-20, 20], [-1.5, 1.5]);
  const scale = useTransform(scrollVelocity, (v) => 1 - Math.min(0.02, Math.abs(v) * 0.0005));

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Track scroll velocity for warp transitions
    lenis.on('scroll', (e) => {
      scrollVelocity.set(e.velocity);
    });

    // Mouse tracking for background gradients
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      lenis.destroy();
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen relative overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30 selection:text-white"
      >
        <CustomCursor />
        
        {/* Static Background Ambient Glow (Ultraviolet) */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[180px] animate-pulse delay-1000" />
        </div>

        {/* Evolving trailing mesh gradients */}
        <motion.div 
          className="fixed pointer-events-none z-0 w-96 h-96 rounded-full opacity-35 blur-[120px]"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
            x: useTransform(cursorX, (x) => x - 192),
            y: useTransform(cursorY, (y) => y - 192),
          }}
        />

        <motion.div 
          className="fixed pointer-events-none z-0 w-[450px] h-[450px] rounded-full opacity-25 blur-[140px]"
          style={{
            background: "radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)",
            x: useTransform(cursorX2, (x) => x - 225),
            y: useTransform(cursorY2, (y) => y - 225),
          }}
        />
        
        <div className="relative z-10">
          <Navigation />
          <motion.main style={{ skewY, scale }} className="origin-center transition-all duration-300">
            <section id="home">
              <Hero />
            </section>
            <Skills />
            <LiveProjects />
            <About />
            <Connect />
          </motion.main>
          <Footer />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
