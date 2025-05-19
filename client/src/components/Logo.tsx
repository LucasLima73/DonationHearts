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
          className="w-10 h-10 gradient-bg rounded-md flex items-center justify-center mr-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="text-white h-5 w-5" />
        </motion.div>
        <span className={`font-heading font-bold text-xl tracking-tight ${dark ? "text-white" : "text-gradient"}`}>
          DoeAqui
        </span>
      </div>
    </Link>
  );
}
