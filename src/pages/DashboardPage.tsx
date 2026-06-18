import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  BookMarked,
  Users,
  ClipboardList,
  AlertTriangle,
  BookCheck,
  ArrowRight,
  History,
  Clock,
  Hand,
} from 'lucide-react';
import { StatCard } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import {
  getDashboardStats,
  getUserLoanStats,
  checkOverdueLoans,
  getAllLoans,
  getLoansByUser,
  getAllLoansFromSupabase,
  getLoansByUserFromSupabase,
} from '../services/mockData';
import { LoanStatusBadge } from '../components/ui/Badge';
import { Loan } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const [stats, setStats] = useState<ReturnType<typeof getDashboardStats> | null>(null);
  const [userStats, setUserStats] = useState<ReturnType<typeof getUserLoanStats> | null>(null);
  const [recentLoans, setRecentLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const loadData = async () => {
      checkOverdueLoans();
      
      if (isAdmin) {
        // Admins veem todos os empréstimos
        const allLoans = await getAllLoansFromSupabase();
        setStats(getDashboardStats());
        setRecentLoans(allLoans.slice(0, 5));
      } else if (user) {
        // Leitores veem apenas seus empréstimos
        const userLoans = await getLoansByUserFromSupabase(user.uuid);
        setUserStats(getUserLoanStats(user.id));
        setRecentLoans(userLoans.slice(0, 5));
      }
    };
    
    loadData();
  }, [isAdmin, user]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5D97D1 0%, #88C7DB 100%)' }}
      >
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            Olá, {user?.name?.split(' ')[0]}!
            <Hand className="w-6 h-6 inline-block ml-2 text-white" />
          </h1>
          <p className="text-white/75 text-sm mt-1">
            {isAdmin
              ? 'Bem-vindo ao painel de administração do Folhear Biblioteca.'
              : 'Bem-vindo à sua área de leitura.'}
          </p>
        </div>
        {/* Decorative circle */}
        <div
          className="absolute right-0 top-0 w-40 h-40 rounded-full opacity-20 translate-x-10 -translate-y-10"
          style={{ backgroundColor: '#A8E1DF' }}
        />
        <div
          className="absolute right-20 bottom-0 w-24 h-24 rounded-full opacity-15 translate-y-8"
          style={{ backgroundColor: '#DDF8C3' }}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
          <BookOpen className="w-24 h-24 text-white" />
        </div>
      </div>

      {/* Admin Stats */}
      {isAdmin && stats && (
        <>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Resumo do Sistema</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Títulos no Acervo"
                value={stats.totalBooks}
                subtitle={`${stats.totalBooksCopies} exemplares • ${stats.availableBooks} disponíveis`}
                icon={<BookOpen className="w-6 h-6" />}
                topBorderColor="color-3"
                onClick={() => navigate('/livros')}
              />
              <StatCard
                title="Empréstimos Ativos"
                value={stats.activeLoans}
                subtitle={`${stats.overdueLoans} atrasado(s)`}
                icon={<ClipboardList className="w-6 h-6" />}
                topBorderColor="color-4"
                trend={
                  stats.overdueLoans > 0
                    ? { value: `${stats.overdueLoans} em atraso`, positive: false }
                    : undefined
                }
                onClick={() => navigate('/emprestimos')}
              />
              <StatCard
                title="Usuários Cadastrados"
                value={stats.totalUsers}
                subtitle="Administradores e leitores"
                icon={<Users className="w-6 h-6" />}
                topBorderColor="color-5"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <QuickActionCard
                title="Gerenciar Livros"
                description="Adicionar, editar ou remover títulos do acervo"
                icon={<BookMarked className="w-6 h-6" />}
                color="#5D97D1"
                bg="#DDF8C3"
                onClick={() => navigate('/livros')}
              />
              <QuickActionCard
                title="Gerenciar Empréstimos"
                description="Registrar empréstimos e controlar devoluções"
                icon={<ClipboardList className="w-6 h-6" />}
                color="#88C7DB"
                bg="#A8E1DF"
                onClick={() => navigate('/emprestimos')}
              />
              {stats.overdueLoans > 0 && (
                <QuickActionCard
                  title="Ver Atrasos"
                  description={`${stats.overdueLoans} empréstimo(s) em atraso precisam de atenção`}
                  icon={<AlertTriangle className="w-6 h-6" />}
                  color="#ef4444"
                  bg="#fee2e2"
                  onClick={() => navigate('/emprestimos')}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Leitor Stats */}
      {!isAdmin && userStats && (
        <>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Minha Situação</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total de Empréstimos"
                value={userStats.totalLoans}
                subtitle="Histórico completo"
                icon={<History className="w-6 h-6" />}
                topBorderColor="color-3"
                onClick={() => navigate('/historico')}
              />
              <StatCard
                title="Livros Ativos"
                value={userStats.activeLoans}
                subtitle="Em meu poder agora"
                icon={<BookOpen className="w-6 h-6" />}
                topBorderColor="color-4"
              />
              <StatCard
                title="Pendentes"
                value={userStats.pendingLoans}
                subtitle="Dentro do prazo"
                icon={<Clock className="w-6 h-6" />}
                topBorderColor="color-3"
              />
              <StatCard
                title="Devolvidos"
                value={userStats.returnedLoans}
                subtitle="Histórico concluído"
                icon={<BookCheck className="w-6 h-6" />}
                topBorderColor="color-5"
              />
            </div>
          </div>

          {userStats.overdueLoans > 0 && (
            <div className="p-4 rounded-xl flex items-center gap-3 border border-red-200 bg-red-50">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">
                  Você tem {userStats.overdueLoans} empréstimo(s) em atraso!
                </p>
                <p className="text-xs text-red-500">
                  Por favor, faça a devolução o mais rápido possível.
                </p>
              </div>
              <button
                onClick={() => navigate('/historico')}
                className="text-sm font-medium text-red-600 hover:underline flex items-center gap-1"
              >
                Ver <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Actions for leitor */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Acesso Rápido</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickActionCard
                title="Consultar Acervo"
                description="Explore os livros disponíveis para empréstimo"
                icon={<BookMarked className="w-6 h-6" />}
                color="#5D97D1"
                bg="#DDF8C3"
                onClick={() => navigate('/livros')}
              />
              <QuickActionCard
                title="Meu Histórico"
                description="Veja todos os seus empréstimos e devoluções"
                icon={<History className="w-6 h-6" />}
                color="#88C7DB"
                bg="#A8E1DF"
                onClick={() => navigate('/historico')}
              />
            </div>
          </div>
        </>
      )}

      {/* Recent Loans */}
      {recentLoans.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              {isAdmin ? 'Empréstimos Recentes' : 'Meus Empréstimos Recentes'}
            </h2>
            <button
              onClick={() => navigate(isAdmin ? '/emprestimos' : '/historico')}
              className="text-sm font-medium flex items-center gap-1 hover:underline"
              style={{ color: '#5D97D1' }}
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F9FFFB' }}>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {isAdmin ? 'Usuário' : 'Livro'}
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      {isAdmin ? 'Livro' : 'Data Prevista'}
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Data Empréstimo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-[#F9FFFB] transition-colors">
                      <td className="px-5 py-3.5 text-sm text-gray-800 font-medium">
                        {isAdmin ? loan.user_name : loan.book_title}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600 hidden sm:table-cell">
                        {isAdmin ? loan.book_title : formatDate(loan.expected_return_date)}
                      </td>
                      <td className="px-5 py-3.5">
                        <LoanStatusBadge status={loan.status} />
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 hidden md:table-cell">
                        {formatDate(loan.loan_date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  onClick: () => void;
}

function QuickActionCard({ title, description, icon, color, bg, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-[#A8E1DF] transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: bg }}>
          <div style={{ color }}>{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#5D97D1] transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
        </div>
        <ArrowRight
          className="w-4 h-4 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color }}
        />
      </div>
    </button>
  );
}
