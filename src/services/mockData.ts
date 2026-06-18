import { User, Book, Loan, UserRole } from '../types';
import { supabase } from './supabase';

// ──────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  USERS: 'folhear_users',
  BOOKS: 'folhear_books',
  LOANS: 'folhear_loans',
  COUNTER: 'folhear_counter',
};

function getCounter(key: string): number {
  const raw = localStorage.getItem(`${STORAGE_KEYS.COUNTER}_${key}`);
  return raw ? parseInt(raw, 10) : 0;
}

function nextId(key: string): number {
  const next = getCounter(key) + 1;
  localStorage.setItem(`${STORAGE_KEYS.COUNTER}_${key}`, String(next));
  return next;
}

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ──────────────────────────────────────────────────────────────────────
// Seed initial data
// ──────────────────────────────────────────────────────────────────────
export function seedData(): void {
  // Only seed if empty
  if (load(STORAGE_KEYS.USERS).length > 0) return;

  const now = new Date().toISOString();

  const users: (User & { password: string })[] = [
    {
      id: 1,
      name: 'Administrador',
      email: 'admin@folhear.com',
      password: 'admin123',
      role: 'admin',
      created_at: now,
    },
    {
      id: 2,
      name: 'Maria Leitora',
      email: 'leitor@folhear.com',
      password: 'leitor123',
      role: 'leitor',
      created_at: now,
    },
    {
      id: 3,
      name: 'João Santos',
      email: 'joao@folhear.com',
      password: '123456',
      role: 'leitor',
      created_at: now,
    },
  ];

  const books: Book[] = [
    {
      id: 1,
      title: 'O Senhor dos Anéis',
      author: 'J.R.R. Tolkien',
      publisher: 'HarperCollins',
      isbn: '978-8533613379',
      category: 'Fantasia',
      publication_year: 2001,
      total_quantity: 5,
      available_quantity: 3,
      created_at: now,
    },
    {
      id: 2,
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      publisher: 'Martin Claret',
      isbn: '978-8572326421',
      category: 'Romance',
      publication_year: 1899,
      total_quantity: 8,
      available_quantity: 6,
      created_at: now,
    },
    {
      id: 3,
      title: 'Harry Potter e a Pedra Filosofal',
      author: 'J.K. Rowling',
      publisher: 'Rocco',
      isbn: '978-8532511010',
      category: 'Fantasia',
      publication_year: 2000,
      total_quantity: 10,
      available_quantity: 7,
      created_at: now,
    },
    {
      id: 4,
      title: '1984',
      author: 'George Orwell',
      publisher: 'Companhia das Letras',
      isbn: '978-8535914849',
      category: 'Ficção Científica',
      publication_year: 2009,
      total_quantity: 6,
      available_quantity: 4,
      created_at: now,
    },
    {
      id: 5,
      title: 'O Pequeno Príncipe',
      author: 'Antoine de Saint-Exupéry',
      publisher: 'Agir',
      isbn: '978-8522005710',
      category: 'Infantil',
      publication_year: 2006,
      total_quantity: 12,
      available_quantity: 0,
      created_at: now,
    },
    {
      id: 6,
      title: 'Grande Sertão: Veredas',
      author: 'João Guimarães Rosa',
      publisher: 'Nova Fronteira',
      isbn: '978-8520912536',
      category: 'Romance',
      publication_year: 2019,
      total_quantity: 4,
      available_quantity: 2,
      created_at: now,
    },
    {
      id: 7,
      title: 'A Revolução dos Bichos',
      author: 'George Orwell',
      publisher: 'Penguin',
      isbn: '978-8535909555',
      category: 'Ficção',
      publication_year: 2007,
      total_quantity: 7,
      available_quantity: 5,
      created_at: now,
    },
    {
      id: 8,
      title: 'Cem Anos de Solidão',
      author: 'Gabriel García Márquez',
      publisher: 'Record',
      isbn: '978-8501012159',
      category: 'Realismo Mágico',
      publication_year: 2017,
      total_quantity: 5,
      available_quantity: 3,
      created_at: now,
    },
  ];

  const todayDate = new Date();
  const pastDate = new Date(todayDate);
  pastDate.setDate(pastDate.getDate() - 20);
  const overdueDate = new Date(todayDate);
  overdueDate.setDate(overdueDate.getDate() - 5);
  const futureDate = new Date(todayDate);
  futureDate.setDate(futureDate.getDate() + 14);

  const loans: Loan[] = [
    {
      id: 1,
      user_id: 2,
      book_id: 1,
      loan_date: pastDate.toISOString().split('T')[0],
      expected_return_date: overdueDate.toISOString().split('T')[0],
      actual_return_date: null,
      status: 'atrasado',
      observations: 'Livro em bom estado ao sair',
      created_at: pastDate.toISOString(),
      user_name: 'Maria Leitora',
      user_email: 'leitor@folhear.com',
      book_title: 'O Senhor dos Anéis',
      book_author: 'J.R.R. Tolkien',
    },
    {
      id: 2,
      user_id: 3,
      book_id: 3,
      loan_date: new Date(todayDate.getTime() - 7 * 86400000).toISOString().split('T')[0],
      expected_return_date: futureDate.toISOString().split('T')[0],
      actual_return_date: null,
      status: 'pendente',
      observations: '',
      created_at: new Date(todayDate.getTime() - 7 * 86400000).toISOString(),
      user_name: 'João Santos',
      user_email: 'joao@folhear.com',
      book_title: 'Harry Potter e a Pedra Filosofal',
      book_author: 'J.K. Rowling',
    },
    {
      id: 3,
      user_id: 2,
      book_id: 2,
      loan_date: new Date(todayDate.getTime() - 30 * 86400000).toISOString().split('T')[0],
      expected_return_date: new Date(todayDate.getTime() - 16 * 86400000).toISOString().split('T')[0],
      actual_return_date: new Date(todayDate.getTime() - 18 * 86400000).toISOString().split('T')[0],
      status: 'devolvido',
      observations: 'Devolvido sem danos',
      created_at: new Date(todayDate.getTime() - 30 * 86400000).toISOString(),
      user_name: 'Maria Leitora',
      user_email: 'leitor@folhear.com',
      book_title: 'Dom Casmurro',
      book_author: 'Machado de Assis',
    },
  ];

  localStorage.setItem(STORAGE_KEYS.COUNTER + '_users', '3');
  localStorage.setItem(STORAGE_KEYS.COUNTER + '_books', '8');
  localStorage.setItem(STORAGE_KEYS.COUNTER + '_loans', '3');

  save(STORAGE_KEYS.USERS, users);
  save(STORAGE_KEYS.BOOKS, books);
  save(STORAGE_KEYS.LOANS, loans);
}

// ──────────────────────────────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────────────────────────────
export interface StoredUser extends User {
  password: string;
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const users = load<StoredUser>(STORAGE_KEYS.USERS);
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}): User {
  const users = load<StoredUser>(STORAGE_KEYS.USERS);
  if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error('E-mail já cadastrado');
  }
  const id = nextId('users');
  const newUser: StoredUser = {
    id,
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    created_at: new Date().toISOString(),
  };
  users.push(newUser);
  save(STORAGE_KEYS.USERS, users);
  const { password: _p, ...user } = newUser;
  return user;
}

// ──────────────────────────────────────────────────────────────────────
// Users
// ──────────────────────────────────────────────────────────────────────
export function getAllUsers(): User[] {
  return load<StoredUser>(STORAGE_KEYS.USERS).map(({ password: _p, ...u }) => u);
}

export function getUserById(id: number): User | undefined {
  const users = load<StoredUser>(STORAGE_KEYS.USERS);
  const u = users.find((x) => x.id === id);
  if (!u) return undefined;
  const { password: _p, ...user } = u;
  return user;
}

// ──────────────────────────────────────────────────────────────────────
// Books
// ──────────────────────────────────────────────────────────────────────
export function getAllBooks(): Book[] {
  return load<Book>(STORAGE_KEYS.BOOKS);
}

export function getBookById(id: number): Book | undefined {
  return load<Book>(STORAGE_KEYS.BOOKS).find((b) => b.id === id);
}

export async function createBook(data: Omit<Book, 'id' | 'created_at'>): Promise<Book> {
  const books = load<Book>(STORAGE_KEYS.BOOKS);
  if (data.isbn && books.find((b) => b.isbn === data.isbn)) {
    throw new Error('ISBN já cadastrado');
  }

  // Tentar salvar primeiro no Supabase
  let supabaseBook: Book | null = null;
  try {
    console.log('Tentando inserir livro no Supabase:', data);
    
    const { data: insertedBook, error } = await supabase
      .from('livro')
      .insert([
        {
          title: data.title,
          author: data.author,
          publisher: data.publisher,
          isbn: data.isbn,
          category: data.category,
          publication_year: data.publication_year,
          total_quantity: data.total_quantity,
          available_quantity: data.available_quantity,
        },
      ])
      .select();

    console.log('Resposta do Supabase:', { insertedBook, error });

    if (error) {
      console.error('Erro ao salvar livro no Supabase:', error);
      throw new Error(`Erro Supabase: ${error.message}`);
    } 
    
    if (insertedBook && insertedBook.length > 0) {
      const book = insertedBook[0];
      supabaseBook = {
        id: book.id,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        isbn: book.isbn,
        category: book.category,
        publication_year: book.publication_year,
        total_quantity: book.total_quantity,
        available_quantity: book.available_quantity,
        created_at: book.created_at,
      };
      console.log('Livro inserido com sucesso no Supabase:', supabaseBook);
    }
  } catch (err) {
    console.error('Erro ao sincronizar livro com Supabase:', err);
    // Se houver erro, continuar com fallback
  }

  // Se conseguiu salvar no Supabase, usar esse livro
  if (supabaseBook) {
    books.push(supabaseBook);
    save(STORAGE_KEYS.BOOKS, books);
    // Atualizar contador local
    localStorage.setItem(`${STORAGE_KEYS.COUNTER}_books`, String(supabaseBook.id));
    return supabaseBook;
  }

  // Senão, usar ID local como fallback
  console.warn('Usando fallback local para criar livro');
  const id = nextId('books');
  const newBook: Book = { id, ...data, created_at: new Date().toISOString() };
  books.push(newBook);
  save(STORAGE_KEYS.BOOKS, books);
  return newBook;
}

export async function updateBook(id: number, data: Partial<Omit<Book, 'id' | 'created_at'>>): Promise<Book> {
  const books = load<Book>(STORAGE_KEYS.BOOKS);
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error('Livro não encontrado');
  books[idx] = { ...books[idx], ...data };
  save(STORAGE_KEYS.BOOKS, books);

  // Atualizar também no Supabase
  try {
    const { error } = await supabase
      .from('livro')
      .update(data)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar livro no Supabase:', error);
    }
  } catch (err) {
    console.error('Erro ao sincronizar livro com Supabase:', err);
  }

  return books[idx];
}

export async function deleteBook(id: number): Promise<void> {
  const books = load<Book>(STORAGE_KEYS.BOOKS).filter((b) => b.id !== id);
  save(STORAGE_KEYS.BOOKS, books);

  // Deletar também do Supabase
  try {
    const { error } = await supabase
      .from('livro')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar livro do Supabase:', error);
    }
  } catch (err) {
    console.error('Erro ao sincronizar deleção com Supabase:', err);
  }
}

// ──────────────────────────────────────────────────────────────────────
// Loans
// ──────────────────────────────────────────────────────────────────────
export function getAllLoans(): Loan[] {
  return load<Loan>(STORAGE_KEYS.LOANS);
}

export function getLoansByUser(userId: number): Loan[] {
  return load<Loan>(STORAGE_KEYS.LOANS).filter((l) => l.user_id === userId);
}

export async function getLoansByUserFromSupabase(userUuid: string): Promise<Loan[]> {
  try {
    console.log('🔍 Buscando empréstimos do usuário:', userUuid);
    
    const { data, error } = await supabase
      .from('emprestimo')
      .select(`
        id,
        user_id,
        book_id,
        loan_date,
        expected_return_date,
        actual_return_date,
        status,
        observations,
        created_at
      `)
      .eq('user_id', userUuid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar empréstimos:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('⚠️ Nenhum empréstimo encontrado');
      return [];
    }

    console.log(`✅ ${data.length} empréstimos encontrados`);

    // Buscar dados dos livros para enriquecer os empréstimos
    const loans: Loan[] = [];
    for (const loan of data) {
      const { data: book } = await supabase
        .from('livro')
        .select('title, author')
        .eq('id', loan.book_id)
        .single();

      loans.push({
        id: loan.id,
        user_id: loan.user_id,
        book_id: loan.book_id,
        loan_date: loan.loan_date,
        expected_return_date: loan.expected_return_date,
        actual_return_date: loan.actual_return_date,
        status: loan.status,
        observations: loan.observations,
        created_at: loan.created_at,
        user_name: '', // Será preenchido do contexto
        user_email: userUuid,
        book_title: book?.title || 'Livro não encontrado',
        book_author: book?.author || '',
      });
    }

    return loans;
  } catch (err) {
    console.error('❌ Erro ao buscar empréstimos do usuário:', err);
    return [];
  }
}

export async function getAllLoansFromSupabase(): Promise<Loan[]> {
  try {
    console.log('🔍 Buscando TODOS os empréstimos do Supabase...');
    
    const { data, error } = await supabase
      .from('emprestimo')
      .select(`
        id,
        user_id,
        book_id,
        loan_date,
        expected_return_date,
        actual_return_date,
        status,
        observations,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar todos os empréstimos:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('⚠️ Nenhum empréstimo encontrado');
      return [];
    }

    console.log(`✅ ${data.length} empréstimos encontrados`);

    // Buscar dados dos livros e usuários para enriquecer os empréstimos
    const loans: Loan[] = [];
    for (const loan of data) {
      const { data: book } = await supabase
        .from('livro')
        .select('title, author')
        .eq('id', loan.book_id)
        .single();

      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', loan.user_id)
        .single();

      loans.push({
        id: loan.id,
        user_id: loan.user_id,
        book_id: loan.book_id,
        loan_date: loan.loan_date,
        expected_return_date: loan.expected_return_date,
        actual_return_date: loan.actual_return_date,
        status: loan.status,
        observations: loan.observations,
        created_at: loan.created_at,
        user_name: profile?.name || 'Usuário desconhecido',
        user_email: '',
        book_title: book?.title || 'Livro não encontrado',
        book_author: book?.author || '',
      });
    }

    // Sincronizar com localStorage
    save(STORAGE_KEYS.LOANS, loans);
    console.log('✅ Empréstimos sincronizados com localStorage');

    return loans;
  } catch (err) {
    console.error('❌ Erro ao buscar empréstimos do Supabase:', err);
    return [];
  }
}

export async function createLoan(data: {
  user_id: string; // UUID string, não number
  book_id: number;
  loan_date: string;
  expected_return_date: string;
  observations?: string;
}): Promise<Loan> {
  const loans = load<Loan>(STORAGE_KEYS.LOANS);
  const books = load<Book>(STORAGE_KEYS.BOOKS);

  console.log('🔍 Buscando livro ID:', data.book_id);
  console.log('🔍 Buscando usuário UUID:', data.user_id);

  // Buscar livro do Supabase
  const { data: supabaseBooks, error: bookError } = await supabase
    .from('livro')
    .select('*')
    .eq('id', data.book_id)
    .single();

  if (bookError || !supabaseBooks) {
    console.error('Livro não encontrado no Supabase:', bookError);
    throw new Error('Livro não encontrado');
  }

  // Buscar usuário (profile) do Supabase
  const { data: supabaseProfile, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user_id)
    .single();

  if (userError || !supabaseProfile) {
    console.error('Usuário não encontrado no Supabase:', userError);
    throw new Error('Usuário não encontrado');
  }

  if (supabaseBooks.available_quantity <= 0) {
    throw new Error('Livro indisponível para empréstimo');
  }

  console.log('✅ Livro e usuário encontrados, criando empréstimo...');

  // Tentar salvar no Supabase
  try {
    console.log('📝 Enviando empréstimo para Supabase:', {
      user_id: data.user_id,
      book_id: data.book_id,
      loan_date: data.loan_date,
    });

    const { data: insertedLoan, error: loanError } = await supabase
      .from('emprestimo')
      .insert([
        {
          user_id: data.user_id, // UUID string direto
          book_id: data.book_id,
          loan_date: data.loan_date,
          expected_return_date: data.expected_return_date,
          actual_return_date: null,
          status: 'pendente',
          observations: data.observations || '',
        },
      ])
      .select()
      .single();

    if (loanError) {
      console.error('❌ Erro ao salvar empréstimo no Supabase:', loanError);
      throw new Error(`Erro ao criar empréstimo: ${loanError.message}`);
    }

    if (!insertedLoan) {
      throw new Error('Falha ao criar empréstimo');
    }

    console.log('✅ Empréstimo criado no Supabase:', insertedLoan.id);

    // Atualizar quantidade disponível do livro no Supabase
    const { error: updateError } = await supabase
      .from('livro')
      .update({ available_quantity: supabaseBooks.available_quantity - 1 })
      .eq('id', data.book_id);

    if (updateError) {
      console.error('⚠️ Erro ao atualizar disponibilidade:', updateError);
    } else {
      console.log('✅ Disponibilidade do livro atualizada');
    }

    // Construir objeto Loan para retornar
    const newLoan: Loan = {
      id: insertedLoan.id,
      user_id: insertedLoan.user_id,
      book_id: insertedLoan.book_id,
      loan_date: insertedLoan.loan_date,
      expected_return_date: insertedLoan.expected_return_date,
      actual_return_date: insertedLoan.actual_return_date,
      status: insertedLoan.status,
      observations: insertedLoan.observations,
      created_at: insertedLoan.created_at,
      user_name: supabaseProfile.name,
      user_email: supabaseProfile.id, // UUID como email
      book_title: supabaseBooks.title,
      book_author: supabaseBooks.author,
    };

    // Salvar no localStorage como cache
    loans.push(newLoan);
    save(STORAGE_KEYS.LOANS, loans);

    return newLoan;
  } catch (err) {
    console.error('❌ Erro ao criar empréstimo:', err);
    throw err instanceof Error ? err : new Error('Erro ao criar empréstimo');
  }
}

export async function returnLoan(id: number): Promise<Loan> {
  const loans = load<Loan>(STORAGE_KEYS.LOANS);
  const books = load<Book>(STORAGE_KEYS.BOOKS);

  const loanIdx = loans.findIndex((l) => l.id === id);
  if (loanIdx === -1) throw new Error('Empréstimo não encontrado');

  const loan = loans[loanIdx];
  if (loan.status === 'devolvido') throw new Error('Empréstimo já devolvido');

  loans[loanIdx] = {
    ...loan,
    status: 'devolvido',
    actual_return_date: new Date().toISOString().split('T')[0],
  };

  const bookIdx = books.findIndex((b) => b.id === loan.book_id);
  if (bookIdx !== -1) {
    books[bookIdx].available_quantity = Math.min(
      books[bookIdx].available_quantity + 1,
      books[bookIdx].total_quantity
    );
    save(STORAGE_KEYS.BOOKS, books);
  }

  save(STORAGE_KEYS.LOANS, loans);

  // Atualizar também no Supabase
  try {
    const returnDate = new Date().toISOString().split('T')[0];
    const { error: loanError } = await supabase
      .from('emprestimo')
      .update({
        status: 'devolvido',
        actual_return_date: returnDate,
      })
      .eq('id', id);

    if (loanError) {
      console.error('Erro ao atualizar empréstimo no Supabase:', loanError);
    }

    // Atualizar quantidade disponível do livro
    if (bookIdx !== -1) {
      const { error: bookError } = await supabase
        .from('livro')
        .update({ available_quantity: books[bookIdx].available_quantity })
        .eq('id', loan.book_id);

      if (bookError) {
        console.error('Erro ao atualizar disponibilidade no Supabase:', bookError);
      }
    }
  } catch (err) {
    console.error('Erro ao sincronizar devolução com Supabase:', err);
  }

  return loans[loanIdx];
}

export function updateLoan(id: number, data: Partial<Loan>): Loan {
  const loans = load<Loan>(STORAGE_KEYS.LOANS);
  const idx = loans.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error('Empréstimo não encontrado');
  loans[idx] = { ...loans[idx], ...data };
  save(STORAGE_KEYS.LOANS, loans);
  return loans[idx];
}

export async function deleteLoan(id: number): Promise<void> {
  const loans = load<Loan>(STORAGE_KEYS.LOANS);
  const loan = loans.find((l) => l.id === id);
  if (loan && loan.status !== 'devolvido') {
    const books = load<Book>(STORAGE_KEYS.BOOKS);
    const bookIdx = books.findIndex((b) => b.id === loan.book_id);
    if (bookIdx !== -1) {
      books[bookIdx].available_quantity = Math.min(
        books[bookIdx].available_quantity + 1,
        books[bookIdx].total_quantity
      );
      save(STORAGE_KEYS.BOOKS, books);

      // Atualizar no Supabase
      try {
        await supabase
          .from('livro')
          .update({ available_quantity: books[bookIdx].available_quantity })
          .eq('id', loan.book_id);
      } catch (err) {
        console.error('Erro ao sincronizar deleção com Supabase:', err);
      }
    }
  }
  save(STORAGE_KEYS.LOANS, loans.filter((l) => l.id !== id));

  // Deletar também do Supabase
  try {
    const { error } = await supabase
      .from('emprestimo')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar empréstimo do Supabase:', error);
    }
  } catch (err) {
    console.error('Erro ao sincronizar deleção do Supabase:', err);
  }
}

// Check and update overdue loans
export function checkOverdueLoans(): void {
  const loans = load<Loan>(STORAGE_KEYS.LOANS);
  const today = new Date().toISOString().split('T')[0];
  let changed = false;
  loans.forEach((loan, idx) => {
    if (loan.status === 'pendente' && loan.expected_return_date < today) {
      loans[idx] = { ...loan, status: 'atrasado' };
      changed = true;
    }
  });
  if (changed) save(STORAGE_KEYS.LOANS, loans);
}

// Dashboard stats
export function getDashboardStats() {
  const books = load<Book>(STORAGE_KEYS.BOOKS);
  const loans = load<Loan>(STORAGE_KEYS.LOANS);
  const users = load<StoredUser>(STORAGE_KEYS.USERS);

  return {
    totalBooks: books.length,
    totalBooksCopies: books.reduce((sum, b) => sum + b.total_quantity, 0),
    availableBooks: books.reduce((sum, b) => sum + b.available_quantity, 0),
    activeLoans: loans.filter((l) => l.status !== 'devolvido').length,
    overdueLoans: loans.filter((l) => l.status === 'atrasado').length,
    totalUsers: users.length,
    totalLoans: loans.length,
  };
}

export function getUserLoanStats(userId: number) {
  const loans = load<Loan>(STORAGE_KEYS.LOANS).filter((l) => l.user_id === userId);
  return {
    totalLoans: loans.length,
    activeLoans: loans.filter((l) => l.status !== 'devolvido').length,
    overdueLoans: loans.filter((l) => l.status === 'atrasado').length,
    pendingLoans: loans.filter((l) => l.status === 'pendente').length,
    returnedLoans: loans.filter((l) => l.status === 'devolvido').length,
  };
}

// ──────────────────────────────────────────────────────────────────────
// Supabase Functions - Fetch real data from database
// ──────────────────────────────────────────────────────────────────────

export async function getAllUsersFromSupabase(): Promise<User[]> {
  try {
    console.log('🔍 Buscando usuários do Supabase (profiles table)...');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('name', { ascending: true });

    console.log('📊 Resposta profiles:', { dataLength: data?.length, error });

    if (error) {
      console.error('❌ Erro ao buscar usuários do Supabase:', error.message, error.code);
      console.log('⚠️ Retornando dados mock como fallback');
      // Fallback para dados mock
      return getAllUsers();
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ Nenhum usuário encontrado no Supabase! Retornando mock.');
      return getAllUsers();
    }

    console.log(`✅ ${data.length} usuários encontrados no Supabase`);
    return data.map((profile: any) => ({
      id: profile.id,
      name: profile.name,
      email: profile.id, // O UUID é usado como ID
      role: profile.role,
      created_at: profile.created_at,
    }));
  } catch (err) {
    console.error('❌ Erro geral ao buscar usuários:', err);
    // Fallback para dados mock
    return getAllUsers();
  }
}

export async function getAllBooksFromSupabase(): Promise<Book[]> {
  try {
    console.log('Buscando livros do Supabase...');
    const { data, error } = await supabase
      .from('livro')
      .select('*')
      .order('title', { ascending: true });

    console.log('Resposta do Supabase:', { data, error });

    if (error) {
      console.error('Erro ao buscar livros do Supabase:', error);
      // Fallback para dados mock
      console.log('Usando fallback para dados mock');
      return getAllBooks();
    }

    if (!data || data.length === 0) {
      console.log('Nenhum livro encontrado no Supabase, retornando dados mock');
      return getAllBooks();
    }

    console.log(`Retornando ${data.length} livros do Supabase`);
    return (data || []).map((book: any) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      category: book.category,
      publication_year: book.publication_year,
      total_quantity: book.total_quantity,
      available_quantity: book.available_quantity,
      created_at: book.created_at,
    }));
  } catch (err) {
    console.error('Erro ao buscar livros:', err);
    // Fallback para dados mock
    return getAllBooks();
  }
}

