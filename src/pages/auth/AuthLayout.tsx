import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const STATS = [
  { label: 'Livros no acervo', value: '500+' },
  { label: 'Usuários ativos', value: '1.2k' },
  { label: 'Empréstimos/mês', value: '300+' },
  { label: 'Satisfação', value: '99%' },
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="w-screen h-screen flex">
      {/* Left panel — visible only on large screens */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center p-12 text-white"
        style={{ background: 'linear-gradient(135deg, #5D97D1 0%, #A8E1DF 100%)' }}
      >
        <img
          src="/library-hero.jpg"
          alt="Biblioteca"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <img src="/folhear-logo2.svg" alt="Folhear" className="w-64 h-64 -mb-10" />
          <h2 className="text-4xl font-bold leading-tight mb-2 text-center">
            Gestão inteligente da sua biblioteca
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-6">
            Controle de acervo, empréstimos, usuários e muito mais em um só lugar.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — the form */}
      <div className="flex-1 relative bg-gradient-to-br from-[#DDF8C3] via-[#F9FFFB] to-[#A8E1DF] flex items-start justify-center h-screen overflow-y-auto py-8">
        {/* Decorative blobs */}
        <div
          className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ backgroundColor: '#C5ECAC' }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-25 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"
          style={{ backgroundColor: '#88C7DB' }}
        />

        <div className="relative w-full max-w-md animate-fade-in px-4 py-8">
          {/* Logo */}
          <div className="text-center mb-0.5">
            <img src="/folhear-logo.svg" alt="Folhear" className="w-40 h-40 mx-auto" />
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-7">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {children}
          </div>

          <p className="text-center text-xs text-gray-400 mt-5 px-2">
            © {new Date().getFullYear()} Folhear Biblioteca — Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
