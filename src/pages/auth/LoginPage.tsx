import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError('');
    try {
      await login(data.email, data.password);
      toast.success('Bem-vindo(a) de volta!', 'Login realizado com sucesso.');
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      setApiError(message);
    }
  };

  return (
    <AuthLayout title="Entrar na conta" subtitle="Acesse o sistema com suas credenciais">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* API Error */}
        {apiError && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          required
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Forgot Password Link */}
        <div className="flex justify-end -mt-2">
          <Link
            to="/esqueci-senha"
            className="text-sm font-medium hover:underline transition-all"
            style={{ color: '#5D97D1' }}
          >
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
          Entrar
        </Button>

        {/* Demo credentials hint */}
        <div className="p-3 rounded-lg text-xs text-gray-500 border" style={{ backgroundColor: '#F9FFFB', borderColor: '#DDF8C3' }}>
          <p className="font-semibold text-gray-600 mb-1">🔐 Credenciais de demonstração:</p>
          <p><strong>Admin:</strong> admin@folhear.com / admin123</p>
          <p><strong>Leitor:</strong> leitor@folhear.com / leitor123</p>
        </div>

        <div className="pt-2 text-center text-sm text-gray-500">
          Não tem uma conta?{' '}
          <Link
            to="/cadastro"
            className="font-semibold hover:underline transition-all"
            style={{ color: '#5D97D1' }}
          >
            Cadastre-se
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
