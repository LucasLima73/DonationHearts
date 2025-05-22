import { Link } from "wouter";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface LogoProps {
  dark?: boolean;
}

export default function Logo({ dark = false }: LogoProps) {
  return (
    <Link href="/">
      <div className="flex items-center">
        <motion.div 
          className="w-10 h-10 glass-panel bg-black/50 rounded-md flex items-center justify-center mr-2 backdrop-blur-xl"
          style={{
            background: "linear-gradient(135deg, rgba(150, 60, 250, 0.5), rgba(220, 50, 120, 0.5))",
            boxShadow: "0 0 10px rgba(220, 50, 120, 0.3), 0 0 20px rgba(150, 60, 250, 0.2)"
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="text-white h-5 w-5" />
        </motion.div>
        <span className="font-heading font-bold text-xl tracking-tight text-gradient">
          MIMO
        </span>
      </div>
    </Link>
  );
}
