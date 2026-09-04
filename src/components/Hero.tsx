import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [25, -25]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-25, 25]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const headingWords = ["SUBIN A", "FULL-STACK ENGINEER", "THE NEW DIGITAL STANDARD"];

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black py-20 px-6"
    >
      <div className="relative z-10 container mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 w-full">
        {/* Left: Extreme Typographic Scale Heading */}
        <div className="flex-1 text-left flex flex-col justify-center">
          <div className="overflow-hidden font-sans">
            {headingWords.map((line, idx) => (
              <div key={idx} className="overflow-hidden mb-2">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
                  className={`font-black tracking-tighter ${idx === 0
                    ? "text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-extrabold"
                    : idx === 1
                      ? "text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-gradient font-extrabold"
                      : "text-xs sm:text-sm md:text-base font-mono tracking-widest text-muted-foreground uppercase mt-4"
                    }`}
                >
                  {idx === 2 ? `// ${line}` : line}
                </motion.h1>
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10"
          >
            <Button
              onClick={() => {
                document.getElementById("live-projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative px-8 py-6 rounded-full bg-transparent border-2 border-primary hover:border-secondary text-foreground text-xs font-mono tracking-widest uppercase overflow-hidden hover-trigger transition-all duration-500 shadow-glow/10 hover:shadow-glow/30"
            >
              <span className="relative z-10 flex items-center gap-3">
                See My Projects <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </motion.div>
        </div>

        {/* Right: Looping Abstract Interactive 3D chrome sphere */}
        <div className="flex-1 flex items-center justify-center relative w-full h-[350px] sm:h-[450px]">
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-64 h-64 sm:w-80 sm:h-80 relative flex items-center justify-center cursor-grab active:cursor-grabbing hover-trigger"
          >
            {/* Outer morphing ring */}
            <motion.div
              animate={{ rotate: 360, borderRadius: ["40% 60% 70% 30%", "70% 30% 50% 50%", "40% 60% 70% 30%"] }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute inset-0 border border-primary/40 shadow-glow/15 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
            />

            {/* Middle complex glassmorphic torus */}
            <motion.div
              animate={{ rotate: -360, borderRadius: ["50% 50% 30% 70%", "30% 70% 70% 30%", "50% 50% 30% 70%"] }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute w-[80%] h-[80%] border-2 border-secondary/30 bg-black/40 backdrop-blur-md shadow-elegant"
            />

            {/* Inner chrome/fractal core */}
            <motion.div
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute w-[50%] h-[50%] rounded-full bg-gradient-to-br from-white via-primary/30 to-secondary border border-white/20 shadow-glow flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-accent to-black animate-pulse" />
              <div className="w-full h-full bg-gradient-to-tr from-cyan-400/20 via-blue-500/20 to-violet-600/20 backdrop-blur-sm" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Downward Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
        onClick={() => {
          document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-8 flex flex-col items-center gap-2 cursor-pointer text-muted-foreground hover:text-white transition-colors duration-300 font-mono text-xs tracking-widest hover-trigger"
      >
        <span>SCROLL DOWN</span>
        <ArrowDown size={14} className="animate-bounce" />
      </motion.div>
    </section>
  );
};

export default Hero;
