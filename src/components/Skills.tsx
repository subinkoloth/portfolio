import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const relationships: Record<string, string[]> = {
  "React": ["Next.js", "TypeScript", "JavaScript", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
  "Next.js": ["React", "TypeScript", "JavaScript", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
  "Angular": ["TypeScript", "JavaScript", "Node.js", "REST APIs", "MongoDB"],
  "Node.js": ["Express", "MongoDB", "React", "Next.js", "REST APIs", "JavaScript", "TypeScript", "Postman", "Angular"],
  "Express": ["Node.js", "MongoDB", "React", "Next.js", "REST APIs", "Postman"],
  "MongoDB": ["Node.js", "Express", "React", "Next.js", "Angular"],
  "TypeScript": ["React", "Angular", "Next.js", "Node.js", "JavaScript", "Git"],
  "JavaScript": ["React", "Angular", "Next.js", "Node.js", "TypeScript"],
  "Git": ["VS Code", "TypeScript", "JavaScript"],
  "Postman": ["REST APIs", "FastAPI", "Express", "Node.js", "GraphQL"],
  "FastAPI": ["Python", "REST APIs", "Postman", "SQL"],
  "Python": ["FastAPI", "SQL", "REST APIs"],
  "SQL": ["Python", "FastAPI", "Node.js"],
  "Firebase": ["React", "Angular", "JavaScript", "TypeScript"],
  "GraphQL": ["React", "Node.js", "Postman", "REST APIs"],
  "REST APIs": ["Postman", "FastAPI", "Express", "Node.js", "GraphQL"]
};

const skillColors: Record<string, { shadow: string; border: string; text: string; bg: string }> = {
  // Cyan Brand Glows
  "React": { shadow: "shadow-[0_0_15px_rgba(0,255,255,0.4)]", border: "border-cyan-400/50", text: "text-cyan-400", bg: "bg-cyan-950/30" },
  "Tailwind CSS": { shadow: "shadow-[0_0_15px_rgba(0,255,255,0.4)]", border: "border-cyan-400/50", text: "text-cyan-400", bg: "bg-cyan-950/30" },
  "Next.js": { shadow: "shadow-[0_0_15px_rgba(0,255,255,0.4)]", border: "border-cyan-400/50", text: "text-cyan-400", bg: "bg-cyan-950/30" },
  "TypeScript": { shadow: "shadow-[0_0_15px_rgba(0,255,255,0.4)]", border: "border-cyan-400/50", text: "text-cyan-400", bg: "bg-cyan-950/30" },
  "VS Code": { shadow: "shadow-[0_0_15px_rgba(0,255,255,0.4)]", border: "border-cyan-400/50", text: "text-cyan-400", bg: "bg-cyan-950/30" },
  "Postman": { shadow: "shadow-[0_0_15px_rgba(0,255,255,0.4)]", border: "border-cyan-400/50", text: "text-cyan-400", bg: "bg-cyan-950/30" },

  // Blue Brand Glows
  "Angular": { shadow: "shadow-[0_0_15px_rgba(0,120,255,0.4)]", border: "border-blue-500/50", text: "text-blue-400", bg: "bg-blue-950/30" },
  "Express": { shadow: "shadow-[0_0_15px_rgba(0,120,255,0.4)]", border: "border-blue-500/50", text: "text-blue-400", bg: "bg-blue-950/30" },
  "SQL": { shadow: "shadow-[0_0_15px_rgba(0,120,255,0.4)]", border: "border-blue-500/50", text: "text-blue-400", bg: "bg-blue-950/30" },
  "HTML5": { shadow: "shadow-[0_0_15px_rgba(0,120,255,0.4)]", border: "border-blue-500/50", text: "text-blue-400", bg: "bg-blue-950/30" },
  "Firebase": { shadow: "shadow-[0_0_15px_rgba(0,120,255,0.4)]", border: "border-blue-500/50", text: "text-blue-400", bg: "bg-blue-950/30" },

  // Green Brand Glows
  "Node.js": { shadow: "shadow-[0_0_15px_rgba(50,255,50,0.4)]", border: "border-green-400/50", text: "text-green-400", bg: "bg-green-950/30" },
  "JavaScript": { shadow: "shadow-[0_0_15px_rgba(50,255,50,0.4)]", border: "border-green-400/50", text: "text-green-400", bg: "bg-green-950/30" },
  "Python": { shadow: "shadow-[0_0_15px_rgba(50,255,50,0.4)]", border: "border-green-400/50", text: "text-green-400", bg: "bg-green-950/30" },
  "FastAPI": { shadow: "shadow-[0_0_15px_rgba(50,255,50,0.4)]", border: "border-green-400/50", text: "text-green-400", bg: "bg-green-950/30" },
  "Git": { shadow: "shadow-[0_0_15px_rgba(50,255,50,0.4)]", border: "border-green-400/50", text: "text-green-400", bg: "bg-green-950/30" },
  "CSS3": { shadow: "shadow-[0_0_15px_rgba(50,255,50,0.4)]", border: "border-green-400/50", text: "text-green-400", bg: "bg-green-950/30" },

  // Violet Brand Glows
  "REST APIs": { shadow: "shadow-[0_0_15px_rgba(143,0,255,0.4)]", border: "border-violet-500/50", text: "text-violet-400", bg: "bg-violet-950/30" },
  "GraphQL": { shadow: "shadow-[0_0_15px_rgba(143,0,255,0.4)]", border: "border-violet-500/50", text: "text-violet-400", bg: "bg-violet-950/30" }
};

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skillCategories = [
    {
      title: "Frontend Development",
      skills: [
        "React", "Angular", "TypeScript", "JavaScript", "HTML5", "CSS3",
        "Tailwind CSS", "Next.js"
      ],
      span: "col-span-1 md:col-span-2"
    },
    {
      title: "Backend Core",
      skills: [
        "Node.js", "Express", "Python", "FastAPI", "REST APIs", "GraphQL"
      ],
      span: "col-span-1"
    },
    {
      title: "Database Hub",
      skills: ["MongoDB", "SQL", "Firebase"],
      span: "col-span-1"
    },
    {
      title: "Workflow & Tools",
      skills: ["Git", "VS Code", "Postman"],
      span: "col-span-1 md:col-span-2"
    }
  ];

  const getHighlightStyle = (skill: string) => {
    if (!hoveredSkill) return "border-white/10 text-muted-foreground bg-white/5";

    const isCurrent = hoveredSkill === skill;
    const isRelated = relationships[hoveredSkill]?.includes(skill);

    if (isCurrent || isRelated) {
      const colors = skillColors[skill] || { shadow: "shadow-[0_0_15px_rgba(255,255,255,0.3)]", border: "border-white/50", text: "text-white", bg: "bg-white/10" };
      return `${colors.shadow} ${colors.border} ${colors.text} ${colors.bg}`;
    }

    return "border-white/5 text-muted-foreground/30 bg-transparent opacity-30";
  };

  return (
    <section id="skills" className="py-32 relative bg-black">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            TECH <span className="text-gradient">SPECTRUM</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-mono max-w-2xl mx-auto">
            // An interactive showcase of my technical skills and developer toolkit.
          </p>
        </motion.div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`${category.span} group relative`}
            >
              {/* Glow border overlay */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 rounded-3xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative rounded-3xl p-8 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-primary/30 transition-all duration-500 shadow-elegant h-full flex flex-col justify-between">
                <h3 className="text-xl font-bold tracking-tight mb-8 font-sans text-white/90">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className={`transition-all duration-300 ease-out cursor-default text-xs tracking-wider font-mono font-bold px-4 py-2 border rounded-xl hover-trigger ${getHighlightStyle(skill)}`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;