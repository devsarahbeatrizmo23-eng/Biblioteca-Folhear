import { User, Book, Loan, UserRole } from '../types';

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

export function createBook(data: Omit<Book, 'id' | 'created_at'>): Book {
  const books = load<Book>(STORAGE_KEYS.BOOKS);
  if (data.isbn && books.find((b) => b.isbn === data.isbn)) {
    throw new Error('ISBN já cadastrado');
  }
  const id = nextId('books');
  const newBook: Book = { id, ...data, created_at: new Date().toISOString() };
  books.push(newBook);
  save(STORAGE_KEYS.BOOKS, books);
  return newBook;
}

export function updateBook(id: number, data: Partial<Omit<Book, 'id' | 'created_at'>>): Book {
  const books = load<Book>(STORAGE_KEYS.BOOKS);
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error('Livro não encontrado');
  books[idx] = { ...books[idx], ...data };
  save(STORAGE_KEYS.BOOKS, books);
  return books[idx];
}

export function deleteBook(id: number): void {
  const books = load<Book>(STORAGE_KEYS.BOOKS).filter((b) => b.id !== id);
  save(STORAGE_KEYS.BOOKS, books);
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

export function createLoan(data: {
  user_id: number;
  book_id: number;
  loan_date: string;
  expected_return_date: string;
  observations?: string;
}): Loan {
  const loans = load<Loan>(STORAGE_KEYS.LOANS);
  const books = load<Book>(STORAGE_KEYS.BOOKS);
  const users = load<StoredUser>(STORAGE_KEYS.USERS);

  const book = books.find((b) => b.id === data.book_id);
  const user = users.find((u) => u.id === data.user_id);

  if (!book) throw new Error('Livro não encontrado');
  if (!user) throw new Error('Usuário não encontrado');
  if (book.available_quantity <= 0) throw new Error('Livro indisponível para empréstimo');

  const id = nextId('loans');
  const newLoan: Loan = {
    id,
    ...data,
    actual_return_date: null,
    status: 'pendente',
    observations: data.observations || '',
    created_at: new Date().toISOString(),
    user_name: user.name,
    user_email: user.email,
    book_title: book.title,
    book_author: book.author,
  };

  // Update book availability
  const bookIdx = books.findIndex((b) => b.id === data.book_id);
  books[bookIdx].available_quantity -= 1;
  save(STORAGE_KEYS.BOOKS, books);

  loans.push(newLoan);
  save(STORAGE_KEYS.LOANS, loans);
  return newLoan;
}

export function returnLoan(id: number): Loan {
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

export function deleteLoan(id: number): void {
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
    }
  }
  save(STORAGE_KEYS.LOANS, loans.filter((l) => l.id !== id));
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
