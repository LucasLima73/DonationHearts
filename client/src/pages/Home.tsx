import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>MIMO - Plataforma para Criadores de Campanhas</title>
        <meta 
          name="description" 
          content="MIMO é a plataforma definitiva para criadores de conteúdo gerenciarem suas campanhas de arrecadação. Crie, monitore e otimize suas campanhas profissionalmente."
        />
        <meta property="og:title" content="MIMO - Plataforma para Criadores de Campanhas" />
        <meta 
          property="og:description" 
          content="A plataforma definitiva para criadores gerenciarem campanhas de arrecadação."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mimo.app" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <HowItWorks />
          <Testimonials />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </>
  );
}
