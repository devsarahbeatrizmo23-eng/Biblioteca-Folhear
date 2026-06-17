import { Link } from 'react-router-dom';
import { BookOpen, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FFFB] p-4">
      <div className="text-center max-w-md animate-fade-in">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
          style={{ backgroundColor: '#DDF8C3' }}
        >
          <BookOpen className="w-10 h-10" style={{ color: '#5D97D1' }} />
        </div>
        <h1 className="text-6xl font-bold mb-2" style={{ color: '#5D97D1' }}>
          404
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Página não encontrada</h2>
        <p className="text-gray-500 text-sm mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/dashboard">
          <Button leftIcon={<Home className="w-4 h-4" />}>
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
}
