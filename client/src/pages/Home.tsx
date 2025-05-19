import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import InspiringStories from "@/components/InspiringStories";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>DoeAqui - Realize sonhos. Conecte corações.</title>
        <meta 
          name="description" 
          content="DoeAqui é uma plataforma onde pessoas ajudam pessoas, um desejo de cada vez. Conecte-se a histórias inspiradoras e faça a diferença hoje."
        />
        <meta property="og:title" content="DoeAqui - Realize sonhos. Conecte corações." />
        <meta 
          property="og:description" 
          content="Uma plataforma onde pessoas ajudam pessoas, um desejo de cada vez."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://doeaqui.com.br" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <InspiringStories />
          <HowItWorks />
          <Testimonials />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </>
  );
}
