import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 250, mass: 0.4 };
  const trailConfig = { damping: 50, stiffness: 180, mass: 0.8 };

  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [magneticElement, setMagneticElement] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (magneticElement) {
        return;
      }
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverable = 
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".hover-trigger") ||
        target.classList.contains("hover-trigger");

      if (hoverable) {
        setIsHovering(true);
        const triggerEl = target.closest(".hover-trigger") || target.closest("button") || target.closest("a") || target;
        
        if (triggerEl.classList.contains("hover-trigger") || triggerEl.tagName.toLowerCase() === "button" || triggerEl.tagName.toLowerCase() === "a") {
          const rect = triggerEl.getBoundingClientRect();
          setMagneticElement(rect);
          mouseX.set(rect.left + rect.width / 2);
          mouseY.set(rect.top + rect.height / 2);
        }
      } else {
        setIsHovering(false);
        setMagneticElement(null);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (magneticElement) {
        const rect = magneticElement;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.15;
        const deltaY = (e.clientY - centerY) * 0.15;
        mouseX.set(centerX + deltaX);
        mouseY.set(centerY + deltaY);
      } else {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [magneticElement]);

  return (
    <>
      {/* Outer lagging ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[100] hidden md:block border"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 80 : 40,
          height: isHovering ? 80 : 40,
          background: isHovering 
            ? "radial-gradient(circle, rgba(0,255,255,0.1) 0%, rgba(143,0,255,0.15) 100%)" 
            : "transparent",
          boxShadow: isHovering ? "0 0 20px rgba(0, 255, 255, 0.3)" : "none",
          border: isHovering ? "2px solid rgba(0, 255, 255, 0.8)" : "1.5px solid rgba(255, 255, 255, 0.4)",
        }}
        animate={{
          scale: isHovering ? [1, 1.05, 1] : 1,
        }}
        transition={{
          scale: isHovering ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : { duration: 0.2 }
        }}
      />

      {/* Inner precise dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-white pointer-events-none z-[100] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
};

export default CustomCursor;
