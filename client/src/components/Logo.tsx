import { Link } from "wouter";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface LogoProps {
  dark?: boolean;
}

export default function Logo({ dark = false }: LogoProps) {
  return (
    <Link href="/">
      <a className="flex items-center">
        <motion.div 
          className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center mr-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className="text-white h-5 w-5 fill-white" />
        </motion.div>
        <span className={`font-heading font-bold text-xl ${dark ? "text-white" : "text-primary"}`}>
          DoeAqui
        </span>
      </a>
    </Link>
  );
}
