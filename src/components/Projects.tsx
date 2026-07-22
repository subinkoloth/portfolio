import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, X } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Expense Tracker",
    description: "A comprehensive full-stack expense tracking application built with Angular and Node.js. Features real-time expense monitoring, category management, and detailed financial analytics.",
    longDescription: "Built with a microservices architecture, this expense tracker handles real-time data sync using WebSockets. It includes advanced features like receipt scanning via OCR, predictive budget analysis using simple ML models, and comprehensive export options.",
    technologies: ["Angular", "Node.js", "MongoDB", "Express.js"],
    image: "/placeholder.svg",
    liveUrl: "https://expense-tracker-angular.netlify.app",
    githubUrl: "https://github.com/subinkoloth/Expense-tracker",
    span: "col-span-1 md:col-span-2 row-span-2",
  },
  {
    id: 2,
    title: "Climate Now",
    description: "An interactive climate awareness platform providing real-time environmental data.",
    longDescription: "Climate Now aggregates data from multiple environmental APIs (NOAA, OpenWeather) to present a unified dashboard. It features interactive 3D globes for visualizing temperature anomalies and tracks user carbon footprints with actionable reduction tips.",
    technologies: ["JavaScript", "HTML5", "CSS3", "Chart.js"],
    image: "/placeholder.svg",
    liveUrl: "https://climate-now-app.netlify.app",
    githubUrl: "https://github.com/subinkoloth/climate-now",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "Modern weather application featuring location-based forecasts.",
    longDescription: "A high-performance weather application that utilizes service workers for offline functionality. It features custom weather animations, severe weather push notifications, and detailed historical weather data charts.",
    technologies: ["React", "Express", "MongoDB", "OpenWeather"],
    image: "/placeholder.svg",
    liveUrl: "https://weather-dashboard-pro.netlify.app",
    githubUrl: "https://github.com/subinkoloth/weather-dashboard",
    span: "col-span-1 row-span-1",
  }
];

const Projects = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <section id="projects" className="py-32 relative bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 font-sans tracking-tight">
            Featured <span className="text-gradient">Work</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-mono">
            // Building digital experiences that combine aesthetics with robust engineering.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] gap-6">
          {projects.map((project, index) => (
            <motion.div
              layoutId={`card-${project.id}`}
              key={project.id}
              onClick={() => setSelectedId(project.id)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group flex flex-col justify-between relative rounded-3xl overflow-hidden cursor-pointer glass-effect border border-white/10 hover:border-primary/50 transition-colors duration-500 hover-trigger ${project.span}`}
            >
              {/* Image Container */}
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="relative w-full h-48 overflow-hidden block cursor-pointer group/image z-20"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/image:scale-110 transition-transform duration-700 group-hover/image:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 bg-black/40 transition-opacity duration-300">
                  <span className="text-white font-mono text-xs tracking-widest uppercase bg-black/80 px-3 py-1.5 rounded-full border border-white/10">
                    Visit Live Site ↗
                  </span>
                </div>
              </a>

              {/* Content Area */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-end relative z-10 bg-gradient-to-t from-black to-black/80">
                <motion.div layoutId={`title-${project.id}`}>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-sans group-hover:text-primary transition-colors duration-300">{project.title}</h3>
                </motion.div>
                <motion.p
                  layoutId={`desc-${project.id}`}
                  className="text-white/70 line-clamp-2 mb-4 font-mono text-xs md:text-sm"
                >
                  {project.description}
                </motion.p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-primary/10 text-primary border-primary/10 text-[10px]">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedId && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              />
              <div className="fixed inset-0 grid place-items-center z-50 pointer-events-none px-4">
                <motion.div
                  layoutId={`card-${selectedId}`}
                  className="w-full max-w-3xl bg-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto"
                >
                  {projects.filter(p => p.id === selectedId).map(project => (
                    <div key={project.id} className="relative">
                      <button
                        onClick={() => setSelectedId(null)}
                        className="absolute top-6 right-6 z-30 p-2 bg-black/50 hover:bg-primary text-white rounded-full transition-colors backdrop-blur-md"
                      >
                        <X size={20} />
                      </button>

                      {/* Detailed View Image */}
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-64 relative block cursor-pointer group/photo overflow-hidden"
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 bg-black/40 transition-opacity duration-300">
                          <span className="text-white font-mono text-xs tracking-widest uppercase bg-black/60 px-4 py-2 rounded-full border border-white/20">
                            Visit Live Site ↗
                          </span>
                        </div>
                      </a>

                      <div className="p-8 relative z-20">
                        <motion.h3
                          layoutId={`title-${project.id}`}
                          className="text-4xl font-bold text-white mb-4 font-sans"
                        >
                          {project.title}
                        </motion.h3>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="bg-white/10 text-white font-mono">
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        <motion.p
                          layoutId={`desc-${project.id}`}
                          className="text-muted-foreground mb-8 font-mono text-sm leading-relaxed"
                        >
                          {project.longDescription}
                        </motion.p>

                        <div className="flex gap-4">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <button className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 hover-trigger">
                              <ExternalLink size={18} /> Live Demo
                            </button>
                          </a>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2 hover-trigger">
                              <Github size={18} /> Source Code
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
