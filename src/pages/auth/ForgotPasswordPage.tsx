import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const forgotSchema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotFormData) => {
    await forgotPassword(data.email);
    setSent(true);
  };

  if (sent) {
    return (
      <AuthLayout title="E-mail enviado" subtitle="Verifique sua caixa de entrada">
        <div className="text-center py-4 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2" style={{ backgroundColor: '#C5ECAC' }}>
            <CheckCircle className="w-8 h-8" style={{ color: '#2d7a2d' }} />
          </div>
          <div className="p-4 rounded-xl text-sm" style={{ backgroundColor: '#DDF8C3' }}>
            <p className="text-gray-700 leading-relaxed">
              Se o e-mail estiver cadastrado em nosso sistema, você receberá um link de redefinição em breve.
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Não esqueça de verificar sua pasta de spam.
          </p>
          <Link to="/login">
            <Button variant="primary" fullWidth leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Voltar ao Login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Esqueceu sua senha?"
      subtitle="Informe seu e-mail para receber o link de redefinição"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="p-4 rounded-xl text-sm border" style={{ backgroundColor: '#F9FFFB', borderColor: '#A8E1DF' }}>
          <p className="text-gray-600">
            Por razões de segurança, sempre exibiremos a mensagem de confirmação, independente do e-mail existir ou não no sistema.
          </p>
        </div>

        <Input
          label="E-mail cadastrado"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          required
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
          Enviar Link de Redefinição
        </Button>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline transition-all"
            style={{ color: '#5D97D1' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
