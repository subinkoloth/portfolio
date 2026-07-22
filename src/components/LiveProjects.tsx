import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  X,
  Film,
  ChefHat,
  DollarSign,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  longDescription: string;
  features: string[];
  technologies: string[];
  image: string;
  liveUrl: string;
  githubUrl: string;
  span: string;
  color: string;
  glowColor: string;
  icon: any;
}

const LiveProjects = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const projectsList: Project[] = [
    {
      id: 1,
      title: "Movie Search Console",
      subtitle: "High-performance global movie indexing using TMDB API with regional filters & response caching.",
      longDescription: "A high-performance movie search platform that integrates with the TMDB API. It features an advanced caching layer to minimize request latency to under 12ms and supports complex filters for languages, release years, and movie genres. The user interface provides smooth animations, lazy-loaded poster frames, and infinite scrolling.",
      features: [
        "Edge-cached TMDB queries under 12ms",
        "Multi-criteria filtering (Year, Language, Genre)",
        "Dynamic search query auto-suggestions",
        "Infinite scrolling gallery with lazy-loaded frames"
      ],
      technologies: ["React", "Express", "Node.js", "TMDB API", "Framer Motion"],
      image: "/cinema_engine.png",
      liveUrl: "https://chithram-movie-search.netlify.app",
      githubUrl: "https://github.com/subinkoloth/chithram-movie-search",
      span: "col-span-1 md:col-span-2 row-span-2",
      color: "from-violet-500/20 to-purple-500/10",
      glowColor: "rgba(139,92,246,0.25)",
      icon: Film
    },
    {
      id: 2,
      title: "DineFlow POS Panel",
      subtitle: "Enterprise kitchen display orders (KDS) pipeline with active waiter POS synchronization.",
      longDescription: "DineFlow is an enterprise restaurant POS solution connecting waiter terminals, kitchen display monitors, and checkout billing devices. Built with a unified global state manager, it synchronizes table orders, courses, meal modifications, and ticket statuses instantly across terminals.",
      features: [
        "Real-time table status updates",
        "KDS cooking progress timers & ticket queuing",
        "Integrated waiter POS order modification system",
        "Unified Context state manager terminal dashboard"
      ],
      technologies: ["React", "Tailwind CSS", "Context API", "Lucide Icons"],
      image: "/dineflow_mock.png",
      liveUrl: "https://dineflow-web.netlify.app",
      githubUrl: "https://github.com/subinkoloth/Dineflow",
      span: "col-span-1 row-span-1",
      color: "from-amber-500/20 to-orange-500/10",
      glowColor: "rgba(245,158,11,0.25)",
      icon: ChefHat
    },
    {
      id: 3,
      title: "Expense Tracker",
      subtitle: "Financial tracker dashboard detailing category breakdown metrics and transaction logs.",
      longDescription: "A robust expense tracking dashboard featuring interactive budget visualizers, dynamic filter systems, and multi-category charts. Users can add or edit expenses, inspect weekly spending distributions, configure monthly warnings, and import/export financial data streams.",
      features: [
        "Real-time spending breakdown and budget limit warning",
        "Flexible category configurations and budget allocations",
        "Detailed financial log exports (CSV / Excel format)",
        "Secure local storage session memory caching"
      ],
      technologies: ["React", "Recharts", "Lucide Icons", "CSS Grid"],
      image: "/expense_tracker.png",
      liveUrl: "https://expense-tracker-angular.netlify.app",
      githubUrl: "https://github.com/subinkoloth/Expense-tracker",
      span: "col-span-1 row-span-1",
      color: "from-emerald-500/20 to-teal-500/10",
      glowColor: "rgba(16,185,129,0.25)",
      icon: DollarSign
    }
  ];

  return (
    <section id="live-projects" className="py-32 relative bg-black">
      {/* Decorative Blueprint/Grid Background styling */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[10px] text-primary tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" /> CREATIVE INDEX
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white font-sans uppercase">
            MY <span className="text-gradient font-black">PROJECTS</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-mono max-w-2xl">
            // Non-linear development nodes. Click a card's path to view specifications.
          </p>
        </motion.div>

        {/* Bento Grid Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[340px] md:auto-rows-[360px] gap-6 max-w-6xl mx-auto font-sans">
          {projectsList.map((project, index) => {
            const ProjectIcon = project.icon;
            return (
              <motion.div
                layoutId={`card-container-${project.id}`}
                key={project.id}
                onClick={() => setSelectedId(project.id)}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer border border-white/5 bg-zinc-950 p-6 md:p-8 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_0_40px_-10px_var(--glow)] hover:border-white/15 ${project.span}`}
                style={{ "--glow": project.glowColor } as any}
              >
                {/* Background Mockup Image inside Bento Grid Card */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-20 group-hover:scale-105 group-hover:opacity-35 transition-all duration-700 ease-out"
                  />
                  {/* Subtle card grid mesh shading on top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
                </div>

                {/* Top Metas Bar */}
                <div className="flex justify-between items-start z-10 w-full mb-4">
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-primary font-mono text-[8px] tracking-wider py-0.5 uppercase">
                    NODE // 0{project.id}
                  </Badge>
                  <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10 text-zinc-500 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                    <ProjectIcon size={16} />
                  </div>
                </div>

                {/* Main Mid Info Container */}
                <div className="z-10 flex-grow flex flex-col justify-end">
                  <motion.h3
                    layoutId={`title-${project.id}`}
                    className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight tracking-tight font-sans"
                  >
                    {project.title}
                  </motion.h3>

                  <motion.p
                    layoutId={`desc-${project.id}`}
                    className="text-zinc-300 font-mono text-xs leading-relaxed max-w-xl group-hover:text-white transition-colors"
                  >
                    {project.subtitle}
                  </motion.p>

                  {/* Highlight core features in card container */}
                  <div className="mt-4 space-y-1.5 hidden sm:block">
                    {project.features.slice(0, 2).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 font-mono text-[10px] text-zinc-400">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_4px_rgba(0,255,255,0.6)]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech tags footer */}
                <div className="z-10 w-full mt-6 flex justify-between items-center border-t border-white/5 pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-[9px] font-mono text-zinc-500">
                        [{tech}]
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-450 flex items-center gap-1 group-hover:text-white transition-colors">
                    EXPAND <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Portal Dialog Modal Popover */}
        <AnimatePresence>
          {selectedId && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
                className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90]"
              />
              <div className="fixed inset-0 grid place-items-center z-[100] pointer-events-none px-4">
                <motion.div
                  layoutId={`card-container-${selectedId}`}
                  className="w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto h-[90vh] md:h-auto max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
                >
                  {projectsList.filter(p => p.id === selectedId).map(project => {
                    return (
                      <div key={project.id} className="relative p-6 sm:p-8 flex flex-col md:flex-row gap-8 bg-zinc-950 h-full md:h-auto">
                        {/* Close button */}
                        <button
                          onClick={() => setSelectedId(null)}
                          className="absolute top-6 right-6 z-50 p-2.5 bg-zinc-900/90 border border-white/10 hover:border-primary hover:bg-primary/20 text-white rounded-full transition-all duration-300"
                        >
                          <X size={18} />
                        </button>

                        {/* Left Side: Thumbnail, Title, Tech, Buttons */}
                        <div className="w-full md:w-[320px] flex flex-col justify-between shrink-0">
                          <div className="space-y-4">
                            {/* Image Container */}
                            <div className="h-40 w-full rounded-2xl overflow-hidden border border-white/5 relative">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-45"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                              <Badge className="absolute top-3 left-3 bg-primary/10 border-primary/20 text-primary text-[8px] tracking-wider font-mono uppercase">
                                NODE // 0{project.id}
                              </Badge>
                            </div>

                            {/* Title & Sub */}
                            <div>
                              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none mb-2 font-sans">
                                {project.title}
                              </h3>
                              <p className="text-zinc-400 font-mono text-[11px] leading-relaxed">
                                {project.subtitle}
                              </p>
                            </div>

                            {/* Technologies */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {project.technologies.slice(0, 4).map((tech) => (
                                <Badge key={tech} variant="outline" className="bg-white/5 border-white/10 text-zinc-455 font-mono text-[9px] px-2 py-0.5">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2.5 pt-6 border-t border-white/5 mt-6">
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <button className="w-full py-3 bg-primary hover:bg-white text-black font-extrabold font-mono tracking-widest text-[10px] uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/15">
                                <ExternalLink size={12} /> Launch Application
                              </button>
                            </a>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <button className="w-full py-3 bg-transparent border border-white/20 hover:border-white text-white font-bold font-mono tracking-widest text-[10px] uppercase rounded-xl hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2">
                                <Github size={12} /> Source Repository
                              </button>
                            </a>
                          </div>
                        </div>

                        {/* Right Side: Description, Features list */}
                        <div className="flex-grow flex flex-col justify-center space-y-6 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">

                          {/* Specs summary */}
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-mono tracking-widest text-primary/80 uppercase font-extrabold">// SPECIFICATION DETAIL:</h4>
                            <p className="text-zinc-300 font-mono text-[11.5px] leading-relaxed">
                              {project.longDescription}
                            </p>
                          </div>

                          {/* Features */}
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-mono tracking-widest text-primary/80 uppercase font-extrabold">// KEY FEATURES DEPLOYED:</h4>
                            <ul className="space-y-1.5" aria-label="Key Features">
                              {project.features.map((feat, i) => (
                                <li key={i} className="flex items-center gap-2 font-mono text-[10.5px] text-zinc-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_4px_rgba(0,255,255,0.6)]" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LiveProjects;
