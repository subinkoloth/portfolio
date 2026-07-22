import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  {
    id: 1,
    name: "GitHub",
    handle: "@subinkoloth",
    url: "https://github.com/subinkoloth",
    icon: Github,
    color: "from-cyan-400 to-blue-500",
    glow: "shadow-[0_0_30px_rgba(0,255,255,0.25)] hover:border-cyan-400"
  },
  {
    id: 2,
    name: "LinkedIn",
    handle: "Subin A",
    url: "https://www.linkedin.com/in/subin-koloth/",
    icon: Linkedin,
    color: "from-blue-500 to-indigo-600",
    glow: "shadow-[0_0_30px_rgba(0,120,255,0.25)] hover:border-blue-400"
  },
  {
    id: 3,
    name: "Email",
    handle: "subinkoloth7@gmail.com",
    url: "mailto:subinkoloth7@gmail.com",
    icon: Mail,
    color: "from-violet-500 to-accent",
    glow: "shadow-[0_0_30px_rgba(143,0,255,0.25)] hover:border-violet-400"
  }
];

const Connect = () => {
  return (
    <section id="connect" className="py-44 relative bg-black overflow-hidden">
      {/* Absolute design grid layer in the background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-50" />

      <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">// THE NEXT DIGITAL NODE</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white mb-20 leading-none"
        >
          LET'S <span className="text-gradient">CONNECT</span>
        </motion.h2>

        {/* Dynamic connection nodes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`group relative rounded-2xl p-6 bg-white/[0.01] border border-white/10 ${link.glow} transition-all duration-500 hover:bg-black flex flex-col items-center justify-center text-center cursor-pointer hover-trigger h-48`}
              >
                {/* Glowing neon hover circle background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-500`} />

                {/* Outlined animated neon icon */}
                <div className="p-4 rounded-full border border-white/5 group-hover:border-transparent group-hover:bg-white/5 transition-all duration-500 mb-4 text-zinc-500 group-hover:text-white">
                  <Icon size={28} className="group-hover:scale-110 transition-transform duration-500" />
                </div>

                <h3 className="text-lg font-bold text-white mb-1 font-sans">{link.name}</h3>
                <p className="text-[10px] text-zinc-500 font-mono tracking-widest">{link.handle}</p>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Connect;
