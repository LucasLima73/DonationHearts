import { Link } from "wouter";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  quickLinks: [
    { name: "Início", href: "/" },
    { name: "Explorar", href: "#explore" },
    { name: "Como Funciona", href: "#how-it-works" },
    { name: "Blog", href: "#blog" },
    { name: "Perguntas Frequentes", href: "#faq" },
  ],
  information: [
    { name: "Sobre Nós", href: "#about" },
    { name: "Termos de Uso", href: "#terms" },
    { name: "Política de Privacidade", href: "#privacy" },
    { name: "Contato", href: "#contact" },
    { name: "Imprensa", href: "#press" },
  ],
  socialMedia: [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Youtube", href: "#", icon: Youtube },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#2D3748] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <Logo dark />
            </div>
            <p className="text-gray-400 mb-4">
              Conectando corações generosos a sonhos possíveis desde 2023.
            </p>
            <div className="flex space-x-4">
              {footerLinks.socialMedia.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  className="text-white hover:text-secondary transition duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white transition duration-200">
                      {link.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Informações</h3>
            <ul className="space-y-2">
              {footerLinks.information.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white transition duration-200">
                      {link.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Receba histórias inspiradoras e novidades diretamente no seu e-mail.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} DoeAqui. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
