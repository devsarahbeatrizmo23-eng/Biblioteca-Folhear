import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  BookOpen,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Book } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from '../services/mockData';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { AvailabilityBadge } from '../components/ui/Badge';

const bookSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200),
  author: z.string().min(1, 'Autor é obrigatório').max(100),
  publisher: z.string().min(1, 'Editora é obrigatória').max(100),
  isbn: z.string().min(1, 'ISBN é obrigatório').max(20),
  category: z.string().min(1, 'Categoria é obrigatória').max(50),
  publication_year: z.string().min(1, 'Ano é obrigatório'),
  total_quantity: z.string().min(1, 'Quantidade é obrigatória'),
  available_quantity: z.string(),
});

type BookFormData = z.infer<typeof bookSchema>;

const CATEGORIES = [
  'Romance',
  'Fantasia',
  'Ficção Científica',
  'Ficção',
  'Mistério',
  'Suspense',
  'Terror',
  'Drama',
  'Poesia',
  'Biografia',
  'Autobiografia',
  'História',
  'Ciências',
  'Tecnologia',
  'Arte',
  'Infantil',
  'Juvenil',
  'Realismo Mágico',
  'Outros',
];

export function BooksPage() {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === 'admin';

  const [books, setBooks] = useState<Book[]>([]);
  const [filtered, setFiltered] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadBooks = useCallback(() => {
    const data = getAllBooks();
    setBooks(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(books);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      )
    );
  }, [search, books]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  });

  const openCreateModal = () => {
    setEditingBook(null);
    reset({
      title: '',
      author: '',
      publisher: '',
      isbn: '',
      category: '',
      publication_year: String(new Date().getFullYear()),
      total_quantity: '1',
      available_quantity: '1',
    });
    setModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setValue('title', book.title);
    setValue('author', book.author);
    setValue('publisher', book.publisher);
    setValue('isbn', book.isbn);
    setValue('category', book.category);
    setValue('publication_year', String(book.publication_year));
    setValue('total_quantity', String(book.total_quantity));
    setValue('available_quantity', String(book.available_quantity));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBook(null);
    reset();
  };

  const onSubmit = async (data: BookFormData) => {
    try {
      const bookData = {
        title: data.title,
        author: data.author,
        publisher: data.publisher,
        isbn: data.isbn,
        category: data.category,
        publication_year: parseInt(data.publication_year, 10),
        total_quantity: parseInt(data.total_quantity, 10),
        available_quantity: parseInt(data.available_quantity || '0', 10),
      };
      if (editingBook) {
        updateBook(editingBook.id, bookData);
        toast.success('Livro atualizado!', `"${data.title}" foi atualizado com sucesso.`);
      } else {
        createBook(bookData);
        toast.success('Livro cadastrado!', `"${data.title}" foi adicionado ao acervo.`);
      }
      loadBooks();
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar livro';
      toast.error('Erro', message);
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      deleteBook(id);
      toast.success('Livro removido!', 'O livro foi excluído do acervo.');
      loadBooks();
      setDeleteConfirmId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir';
      toast.error('Erro', message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6" style={{ color: '#5D97D1' }} />
            {isAdmin ? 'Gerenciar Livros' : 'Acervo da Biblioteca'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isAdmin
              ? `${books.length} título(s) cadastrado(s) no acervo`
              : `Explore nosso acervo com ${books.length} título(s) disponíveis`}
          </p>
        </div>
        {isAdmin && (
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
            Novo Livro
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Input
          placeholder="Buscar por título, autor, ISBN ou categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          rightIcon={
            search ? (
              <button onClick={() => setSearch('')} className="hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            ) : undefined
          }
        />
        {search && (
          <p className="text-xs text-gray-400 mt-2">
            {filtered.length} resultado(s) encontrado(s)
          </p>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ backgroundColor: '#F9FFFB' }}>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Título / Autor
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Categoria
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Disponibilidade
                </th>
                {isAdmin && (
                  <>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      ISBN
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Ano
                    </th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 3} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full" style={{ backgroundColor: '#DDF8C3' }}>
                        <BookOpen className="w-8 h-8" style={{ color: '#5D97D1' }} />
                      </div>
                      <p className="text-gray-500 font-medium">
                        {search ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}
                      </p>
                      {search && (
                        <p className="text-sm text-gray-400">
                          Tente outros termos de busca
                        </p>
                      )}
                      {isAdmin && !search && (
                        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal} size="sm">
                          Cadastrar primeiro livro
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((book) => (
                  <tr key={book.id} className="hover:bg-[#F9FFFB] transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {book.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                        {isAdmin && (
                          <p className="text-xs text-gray-400 mt-0.5">{book.publisher}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span
                        className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#A8E1DF', color: '#1a4a6e' }}
                      >
                        {book.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <AvailabilityBadge available={book.available_quantity > 0} />
                        {isAdmin && (
                          <span className="text-xs text-gray-400">
                            {book.available_quantity}/{book.total_quantity}
                          </span>
                        )}
                      </div>
                    </td>
                    {isAdmin && (
                      <>
                        <td className="px-5 py-4 text-sm text-gray-500 hidden lg:table-cell font-mono text-xs">
                          {book.isbn}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 hidden md:table-cell">
                          {book.publication_year}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(book)}
                              className="p-1.5 rounded-lg hover:bg-[#DDF8C3] transition-all"
                              title="Editar"
                              style={{ color: '#88C7DB' }}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(book.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400" style={{ backgroundColor: '#F9FFFB' }}>
            Mostrando {filtered.length} de {books.length} livro(s)
          </div>
        )}
      </div>

      {/* Book Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingBook ? 'Editar Livro' : 'Novo Livro'}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Título"
                placeholder="Ex: O Senhor dos Anéis"
                required
                error={errors.title?.message}
                {...register('title')}
              />
            </div>
            <Input
              label="Autor"
              placeholder="Ex: J.R.R. Tolkien"
              required
              error={errors.author?.message}
              {...register('author')}
            />
            <Input
              label="Editora"
              placeholder="Ex: HarperCollins"
              required
              error={errors.publisher?.message}
              {...register('publisher')}
            />
            <Input
              label="ISBN"
              placeholder="Ex: 978-8533613379"
              required
              error={errors.isbn?.message}
              {...register('isbn')}
            />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Categoria <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category')}
                className="w-full appearance-none rounded-lg border border-gray-200 hover:border-[#88C7DB] bg-white px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#88C7DB] focus:border-[#88C7DB] transition-all"
              >
                <option value="">Selecione uma categoria</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
              )}
            </div>
            <Input
              label="Ano de Publicação"
              type="number"
              placeholder="Ex: 2023"
              required
              error={errors.publication_year?.message}
              {...register('publication_year')}
            />
            <Input
              label="Quantidade Total"
              type="number"
              placeholder="Ex: 5"
              required
              error={errors.total_quantity?.message}
              {...register('total_quantity')}
            />
            <Input
              label="Quantidade Disponível"
              type="number"
              placeholder="Ex: 3"
              required
              error={errors.available_quantity?.message}
              {...register('available_quantity')}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" fullWidth onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" fullWidth isLoading={isSubmitting}>
              {editingBook ? 'Salvar Alterações' : 'Cadastrar Livro'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">Ação irreversível</p>
              <p className="text-sm text-red-600 mt-1">
                Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setDeleteConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              fullWidth
              isLoading={isDeleting}
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
