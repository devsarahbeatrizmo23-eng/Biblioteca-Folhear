export type UserRole = 'admin' | 'leitor';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  publication_year: number;
  total_quantity: number;
  available_quantity: number;
  created_at?: string;
}

export type LoanStatus = 'pendente' | 'devolvido' | 'atrasado';

export interface Loan {
  id: number;
  user_id: number;
  book_id: number;
  loan_date: string;
  expected_return_date: string;
  actual_return_date?: string | null;
  status: LoanStatus;
  observations?: string;
  created_at?: string;
  // Joined fields
  user_name?: string;
  user_email?: string;
  book_title?: string;
  book_author?: string;
}

export interface LoanFormData {
  user_id: number;
  book_id: number;
  loan_date: string;
  expected_return_date: string;
  observations?: string;
}

export interface DashboardStats {
  totalBooks: number;
  activeLoans: number;
  totalUsers: number;
  availableBooks: number;
}

export interface UserLoanStats {
  activeLoans: number;
  pendingLoans: number;
  overdueLoans: number;
  totalLoans: number;
}
