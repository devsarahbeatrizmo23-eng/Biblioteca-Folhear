import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const registerSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo'),
    email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
    role: z.enum(['admin', 'leitor']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', role: 'leitor' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError('');
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      toast.success('Cadastro realizado!', 'Sua conta foi criada com sucesso. Faça o login.');
      navigate('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao cadastrar';
      setApiError(message);
    }
  };

  const handleCancel = () => {
    reset();
    setApiError('');
  };

  return (
    <AuthLayout title="Criar conta" subtitle="Preencha os dados abaixo para se registrar">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {apiError && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        <Input
          label="Nome completo"
          type="text"
          placeholder="João da Silva"
          autoComplete="name"
          required
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

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
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
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

        <Input
          label="Confirmar senha"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Repita a senha"
          autoComplete="new-password"
          required
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Select
          label="Tipo de perfil"
          required
          options={[
            { value: 'leitor', label: 'Leitor' },
            { value: 'admin', label: 'Administrador' },
          ]}
          error={errors.role?.message}
          {...register('role')}
        />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Cadastrar
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="font-semibold hover:underline"
            style={{ color: '#5D97D1' }}
          >
            Entrar
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
