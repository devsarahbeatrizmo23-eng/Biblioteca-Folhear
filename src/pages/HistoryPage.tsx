import { useState, useEffect, useCallback } from 'react';
import { History, Search, X, Filter, BookOpen, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Loan, LoanStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getLoansByUser, checkOverdueLoans } from '../services/mockData';
import { Input } from '../components/ui/Input';
import { LoanStatusBadge } from '../components/ui/Badge';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos os status' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'atrasado', label: 'Atrasado' },
  { value: 'devolvido', label: 'Devolvido' },
];

export function HistoryPage() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filtered, setFiltered] = useState<Loan[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadData = useCallback(() => {
    if (!user) return;
    checkOverdueLoans();
    const data = getLoansByUser(user.id);
    setLoans(data);
    setFiltered(data);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    let result = [...loans];
    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.book_title?.toLowerCase().includes(q) ||
          l.book_author?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [loans, search, statusFilter]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const stats = {
    total: loans.length,
    active: loans.filter((l) => l.status !== 'devolvido').length,
    overdue: loans.filter((l) => l.status === 'atrasado').length,
    returned: loans.filter((l) => l.status === 'devolvido').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <History className="w-6 h-6" style={{ color: '#5D97D1' }} />
          Meu Histórico de Empréstimos
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Acompanhe todos os seus empréstimos e devoluções
        </p>
      </div>

      {/* Overdue Alert */}
      {stats.overdue > 0 && (
        <div className="p-4 rounded-xl flex items-start gap-3 border border-red-200 bg-red-50">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              Atenção! Você tem {stats.overdue} empréstimo(s) em atraso.
            </p>
            <p className="text-xs text-red-500 mt-0.5">
              Por favor, entre em contato com a biblioteca para regularizar sua situação.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2" style={{ backgroundColor: '#DDF8C3' }}>
            <BookOpen className="w-5 h-5" style={{ color: '#5D97D1' }} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2" style={{ backgroundColor: '#DDF8C3' }}>
            <Clock className="w-5 h-5" style={{ color: '#5D97D1' }} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
          <p className="text-xs text-gray-500">Ativos</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2" style={{ backgroundColor: '#fee2e2' }}>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-500">{stats.overdue}</p>
          <p className="text-xs text-gray-500">Atrasados</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2" style={{ backgroundColor: '#dcfce7' }}>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.returned}</p>
          <p className="text-xs text-gray-500">Devolvidos</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Buscar por título ou autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              rightIcon={
                search ? (
                  <button onClick={() => setSearch('')}>
                    <X className="w-4 h-4" />
                  </button>
                ) : undefined
              }
            />
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 hover:border-[#88C7DB] bg-white px-3 py-2.5 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#88C7DB] transition-all"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Filter className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loans Table / Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#DDF8C3' }}>
            <History className="w-8 h-8" style={{ color: '#5D97D1' }} />
          </div>
          <p className="text-gray-500 font-medium">
            {search || statusFilter !== 'all'
              ? 'Nenhum empréstimo encontrado com esses filtros'
              : 'Você ainda não possui empréstimos registrados'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {!search && statusFilter === 'all' && 'Consulte o acervo e solicite um livro ao administrador'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((loan) => (
            <div
              key={loan.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-[#A8E1DF] transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    className="p-3 rounded-xl flex-shrink-0"
                    style={{
                      backgroundColor:
                        loan.status === 'atrasado'
                          ? '#fee2e2'
                          : loan.status === 'devolvido'
                          ? '#dcfce7'
                          : '#DDF8C3',
                    }}
                  >
                    <BookOpen
                      className="w-5 h-5"
                      style={{
                        color:
                          loan.status === 'atrasado'
                            ? '#ef4444'
                            : loan.status === 'devolvido'
                            ? '#16a34a'
                            : '#5D97D1',
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {loan.book_title}
                    </p>
                    <p className="text-xs text-gray-500">{loan.book_author}</p>
                    {loan.observations && (
                      <p className="text-xs text-gray-400 mt-1 italic">"{loan.observations}"</p>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <LoanStatusBadge status={loan.status as LoanStatus} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Data do empréstimo</p>
                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(loan.loan_date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Devolução prevista</p>
                  <p
                    className={`text-sm font-medium ${
                      loan.status === 'atrasado' ? 'text-red-500' : 'text-gray-700'
                    }`}
                  >
                    {formatDate(loan.expected_return_date)}
                  </p>
                </div>
                {loan.actual_return_date && (
                  <div>
                    <p className="text-xs text-gray-400">Devolvido em</p>
                    <p className="text-sm font-medium text-green-600">
                      {formatDate(loan.actual_return_date)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center">
          Mostrando {filtered.length} de {loans.length} empréstimo(s)
        </p>
      )}
    </div>
  );
}
