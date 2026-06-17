import { Mail, Globe, Code2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#5D97D1] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/folhear-logo2.svg" alt="Folhear" className="w-28 h-28" />
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="p-2 rounded-lg bg-white/15 hover:bg-white/25 transition-all"
              title="GitHub"
            >
              <Code2 className="w-4 h-4 text-white" />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg bg-white/15 hover:bg-white/25 transition-all"
              title="Website"
            >
              <Globe className="w-4 h-4 text-white" />
            </a>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Mail className="w-4 h-4" />
            <a href="mailto:contato@folhear.com" className="hover:text-white transition-colors">
              contato@folhear.com
            </a>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <img src="/folhear-logo2.svg" alt="Folhear" className="w-28 h-28" />
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="p-2 rounded-lg bg-white/15 hover:bg-white/25 transition-all">
              <Code2 className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-white/15 hover:bg-white/25 transition-all">
              <Globe className="w-4 h-4 text-white" />
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/80">
            <Mail className="w-3.5 h-3.5" />
            <a href="mailto:contato@folhear.com" className="hover:text-white transition-colors">
              contato@folhear.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-4 pt-4 border-t border-white/20 text-center">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Folhear Biblioteca. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
