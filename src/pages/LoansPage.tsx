import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ClipboardList,
  Search,
  X,
  BookCheck,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { Loan, LoanStatus, User, Book } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  getAllLoans,
  createLoan,
  returnLoan,
  deleteLoan,
  getAllUsersFromSupabase,
  getAllBooksFromSupabase,
  checkOverdueLoans,
} from '../services/mockData';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Modal } from '../components/ui/Modal';
import { LoanStatusBadge } from '../components/ui/Badge';

const loanSchema = z.object({
  user_id: z.string().min(1, 'Selecione um usuário'),
  book_id: z.string().min(1, 'Selecione um livro'),
  loan_date: z.string().min(1, 'Data do empréstimo é obrigatória'),
  expected_return_date: z.string().min(1, 'Data prevista de devolução é obrigatória'),
  observations: z.string().optional(),
});

type LoanFormData = z.infer<typeof loanSchema>;

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Todos os status' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'atrasado', label: 'Atrasado' },
  { value: 'devolvido', label: 'Devolvido' },
];

export function LoansPage() {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === 'admin';

  const [loans, setLoans] = useState<Loan[]>([]);
  const [filtered, setFiltered] = useState<Loan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [returnConfirmId, setReturnConfirmId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookSearch, setBookSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const loadData = useCallback(async () => {
    checkOverdueLoans();
    const allLoans = getAllLoans();
    setLoans(allLoans);
    setFiltered(allLoans);
    if (isAdmin) {
      const usersData = await getAllUsersFromSupabase();
      const booksData = await getAllBooksFromSupabase();
      setUsers(usersData);
      setBooks(booksData);
    }
  }, [isAdmin]);

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
          l.user_name?.toLowerCase().includes(q) ||
          l.book_title?.toLowerCase().includes(q) ||
          l.user_email?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [loans, search, statusFilter]);

  const today = new Date().toISOString().split('T')[0];
  const defaultReturn = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      user_id: '',
      book_id: '',
      loan_date: today,
      expected_return_date: defaultReturn,
      observations: '',
    },
  });

  const handleClear = () => {
    reset({
      user_id: '',
      book_id: '',
      loan_date: today,
      expected_return_date: defaultReturn,
      observations: '',
    });
    setBookSearch('');
    setUserSearch('');
  };

  const onSubmit = async (data: LoanFormData) => {
    try {
      await createLoan({
        user_id: parseInt(data.user_id, 10),
        book_id: parseInt(data.book_id, 10),
        loan_date: data.loan_date,
        expected_return_date: data.expected_return_date,
        observations: data.observations,
      });
      toast.success('Empréstimo registrado!', 'O empréstimo foi registrado com sucesso.');
      handleClear();
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao registrar empréstimo';
      toast.error('Erro', message);
    }
  };

  const handleReturn = async (id: number) => {
    setIsProcessing(true);
    try {
      await returnLoan(id);
      toast.success('Livro devolvido!', 'A devolução foi registrada com sucesso.');
      loadData();
      setReturnConfirmId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao registrar devolução';
      toast.error('Erro', message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsProcessing(true);
    try {
      await deleteLoan(id);
      toast.success('Empréstimo excluído!');
      loadData();
      setDeleteConfirmId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir';
      toast.error('Erro', message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      !bookSearch ||
      b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      !userSearch ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const statsCount = {
    total: loans.length,
    pendente: loans.filter((l) => l.status === 'pendente').length,
    atrasado: loans.filter((l) => l.status === 'atrasado').length,
    devolvido: loans.filter((l) => l.status === 'devolvido').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="w-6 h-6" style={{ color: '#5D97D1' }} />
          {isAdmin ? 'Controle de Empréstimos' : 'Meu Histórico'}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {isAdmin
            ? 'Gerencie todos os empréstimos da biblioteca'
            : 'Acompanhe seus empréstimos e devoluções'}
        </p>
      </div>

      {/* Admin: Loan Form */}
      {isAdmin && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div
            className="px-6 py-4 border-b border-gray-50"
            style={{ backgroundColor: '#F9FFFB' }}
          >
            <h2 className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: '#5D97D1' }}
              >
                +
              </span>
              Novo Empréstimo
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Select */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Usuário <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="Buscar usuário..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 hover:border-[#88C7DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#88C7DB] focus:border-[#88C7DB] transition-all"
                    />
                    <select
                      {...register('user_id')}
                      size={Math.min(4, filteredUsers.length + 1)}
                      className="w-full rounded-lg border border-gray-200 hover:border-[#88C7DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#88C7DB] transition-all bg-white"
                    >
                      <option value="">-- Selecione um usuário --</option>
                      {filteredUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role === 'admin' ? 'Admin' : 'Leitor'})
                        </option>
                      ))}
                    </select>
                    {errors.user_id && (
                      <p className="text-xs text-red-500">{errors.user_id.message}</p>
                    )}
                  </div>
                </div>

                {/* Book Select */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Livro <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="Buscar livro..."
                      value={bookSearch}
                      onChange={(e) => setBookSearch(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 hover:border-[#88C7DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#88C7DB] focus:border-[#88C7DB] transition-all"
                    />
                    <select
                      {...register('book_id')}
                      size={Math.min(4, filteredBooks.length + 1)}
                      className="w-full rounded-lg border border-gray-200 hover:border-[#88C7DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#88C7DB] transition-all bg-white"
                    >
                      <option value="">-- Selecione um livro --</option>
                      {filteredBooks.map((b) => (
                        <option
                          key={b.id}
                          value={b.id}
                          disabled={b.available_quantity === 0}
                        >
                          {b.title} ({b.available_quantity > 0 ? `${b.available_quantity} disp.` : 'Esgotado'})
                        </option>
                      ))}
                    </select>
                    {errors.book_id && (
                      <p className="text-xs text-red-500">{errors.book_id.message}</p>
                    )}
                  </div>
                </div>

                <Input
                  label="Data do Empréstimo"
                  type="date"
                  required
                  error={errors.loan_date?.message}
                  {...register('loan_date')}
                />

                <Input
                  label="Data Prevista de Devolução"
                  type="date"
                  required
                  error={errors.expected_return_date?.message}
                  {...register('expected_return_date')}
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="Observações"
                    placeholder="Condições do livro, anotações especiais..."
                    rows={3}
                    {...register('observations')}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                  Limpar
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  leftIcon={<ClipboardList className="w-4 h-4" />}
                >
                  Registrar Empréstimo
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: statsCount.total, color: '#5D97D1', bg: '#DDF8C3' },
          { label: 'Pendente', value: statsCount.pendente, color: '#5D97D1', bg: '#DDF8C3' },
          { label: 'Atrasado', value: statsCount.atrasado, color: '#ef4444', bg: '#fee2e2' },
          { label: 'Devolvido', value: statsCount.devolvido, color: '#16a34a', bg: '#dcfce7' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center"
          >
            <p className="text-2xl font-bold" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Buscar por usuário, livro..."
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
        {(search || statusFilter !== 'all') && (
          <p className="text-xs text-gray-400 mt-2">
            {filtered.length} resultado(s) encontrado(s)
          </p>
        )}
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ backgroundColor: '#F9FFFB' }}>
                {isAdmin && (
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                )}
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Livro
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Empréstimo
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Devolução Prev.
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Devolução Real
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {isAdmin && (
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 5}
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full" style={{ backgroundColor: '#DDF8C3' }}>
                        <ClipboardList className="w-8 h-8" style={{ color: '#5D97D1' }} />
                      </div>
                      <p className="text-gray-500 font-medium">
                        {search || statusFilter !== 'all'
                          ? 'Nenhum empréstimo encontrado'
                          : 'Nenhum empréstimo registrado'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((loan) => (
                  <tr key={loan.id} className="hover:bg-[#F9FFFB] transition-colors">
                    {isAdmin && (
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{loan.user_name}</p>
                          <p className="text-xs text-gray-400">{loan.user_email}</p>
                        </div>
                      </td>
                    )}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {loan.book_title}
                        </p>
                        <p className="text-xs text-gray-500">{loan.book_author}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 hidden sm:table-cell">
                      {formatDate(loan.loan_date)}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">
                      <span
                        className={loan.status === 'atrasado' ? 'text-red-500 font-medium' : ''}
                      >
                        {formatDate(loan.expected_return_date)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 hidden lg:table-cell">
                      {formatDate(loan.actual_return_date)}
                    </td>
                    <td className="px-5 py-4">
                      <LoanStatusBadge status={loan.status as LoanStatus} />
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {loan.status !== 'devolvido' && (
                            <button
                              onClick={() => setReturnConfirmId(loan.id)}
                              className="p-1.5 rounded-lg transition-all"
                              style={{ color: '#5D97D1' }}
                              title="Registrar Devolução"
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#DDF8C3';
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                              }}
                            >
                              <BookCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirmId(loan.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div
            className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400"
            style={{ backgroundColor: '#F9FFFB' }}
          >
            Mostrando {filtered.length} de {loans.length} empréstimo(s)
          </div>
        )}
      </div>

      {/* Return Confirm Modal */}
      <Modal
        isOpen={returnConfirmId !== null}
        onClose={() => setReturnConfirmId(null)}
        title="Confirmar Devolução"
        size="sm"
      >
        <div className="space-y-5">
          <div
            className="flex items-start gap-3 p-4 rounded-xl border"
            style={{ backgroundColor: '#DDF8C3', borderColor: '#C5ECAC' }}
          >
            <BookCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#2d7a2d' }} />
            <div>
              <p className="text-sm font-medium text-gray-700">Registrar devolução</p>
              <p className="text-sm text-gray-600 mt-1">
                Confirma que o livro foi devolvido em boas condições?
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setReturnConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              fullWidth
              isLoading={isProcessing}
              onClick={() => returnConfirmId && handleReturn(returnConfirmId)}
            >
              Confirmar Devolução
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">
              Tem certeza que deseja excluir este empréstimo? Esta ação não pode ser desfeita.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setDeleteConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              fullWidth
              isLoading={isProcessing}
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
