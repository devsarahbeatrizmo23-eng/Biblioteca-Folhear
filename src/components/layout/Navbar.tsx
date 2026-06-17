import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  BookMarked,
  ClipboardList,
  History,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const isAdmin = user?.role === 'admin';

  const adminLinks = [
    { to: '/dashboard', label: 'Painel de Controle', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/livros', label: 'Livros', icon: <BookMarked className="w-4 h-4" /> },
    { to: '/emprestimos', label: 'Empréstimos', icon: <ClipboardList className="w-4 h-4" /> },
  ];

  const leitorLinks = [
    { to: '/dashboard', label: 'Início', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/livros', label: 'Acervo', icon: <BookMarked className="w-4 h-4" /> },
    { to: '/historico', label: 'Meu Histórico', icon: <History className="w-4 h-4" /> },
  ];

  const navLinks = isAdmin ? adminLinks : leitorLinks;

  const isActive = (path: string) => location.pathname === path;

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#5D97D1] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 text-white font-bold text-lg hover:opacity-90 transition-opacity"
          >
            <img src="/folhear-logo2.svg" alt="Folhear" className="w-28 h-28" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive(link.to)
                      ? 'bg-white/25 text-white'
                      : 'text-white/80 hover:bg-white/15 hover:text-white'
                  }
                `}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* User Menu (Desktop) */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/15 hover:text-white transition-all text-sm font-medium"
              >
                <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="max-w-[120px] truncate">{user?.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-50">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    <span
                      className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: '#DDF8C3', color: '#2d5a27' }}
                    >
                      {isAdmin ? 'Administrador' : 'Leitor'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair da conta
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setUserMenuOpen(false);
              }}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-all"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#4a82bb] border-t border-white/20 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {/* User info */}
            <div className="flex items-center gap-3 py-3 border-b border-white/20 mb-2">
              <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-white/70">{isAdmin ? 'Administrador' : 'Leitor'}</p>
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive(link.to)
                      ? 'bg-white/25 text-white'
                      : 'text-white/80 hover:bg-white/15 hover:text-white'
                  }
                `}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-200 hover:bg-red-500/20 transition-all mt-2"
            >
              <LogOut className="w-4 h-4" />
              Sair da conta
            </button>
          </div>
        </div>
      )}

      {/* Close user menu on outside click */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </nav>
  );
}
