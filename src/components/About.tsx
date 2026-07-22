import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface WordProps {
  children: string;
  range: [number, number];
  progress: any;
}

const Word = ({ children, range, progress }: WordProps) => {
  const opacity = useTransform(progress, range, [0.1, 1]);
  const textShadow = useTransform(
    progress,
    range,
    ["0 0 10px rgba(0, 255, 255, 0)", "0 0 15px rgba(0, 255, 255, 0.4)"]
  );

  return (
    <span className="relative mr-3 sm:mr-4 md:mr-6 mb-3 inline-block font-sans text-3xl sm:text-5xl md:text-6xl font-black">
      <motion.span style={{ opacity, textShadow }} className="transition-all duration-300">
        {children}
      </motion.span>
    </span>
  );
};

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 85%"]
  });

  const paragraph = "I am a Full-Stack Engineer driven by high-performance architecture and modern web aesthetics. My mission is to bridge complex backend infrastructures with high-fidelity frontend systems, establishing digital standards that load instantly and interact beautifully. Specializing in Node.js, Express, React, and Angular, I craft seamless, scalable products that merge raw technical precision with stunning interactive details.";

  const words = paragraph.split(" ");

  return (
    <section ref={containerRef} id="about" className="py-44 relative bg-black">
      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 font-mono text-xs tracking-widest text-primary/80 uppercase"
        >
          // CONTEXTUAL ORIGIN // THE COGNITIVE BIO
        </motion.div>

        {/* Scroll Word Reveal Typography Panel */}
        <div className="flex flex-wrap leading-tight tracking-tighter text-white">
          {words.map((word, index) => {
            const start = index / words.length;
            const end = start + (1 / words.length);
            return (
              <Word key={index} range={[start, end]} progress={scrollYProgress}>
                {word}
              </Word>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;