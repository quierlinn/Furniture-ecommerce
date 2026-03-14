import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// ===== Схемы валидации =====
const loginSchema = z.object({
    email: z.string().email('Некорректный email').min(1, 'Email обязателен'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

const registerSchema = z.object({
    email: z.string().email('Некорректный email').min(1, 'Email обязателен'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: z.string().min(6, 'Подтверждение пароля обязательно'),
    firstName: z.string().min(1, 'Имя обязательно'),
    lastName: z.string().min(1, 'Фамилия обязательна'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export const AuthPage = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const { login, register: registerUser, isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Редирект если уже авторизован
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    // ===== Формы =====
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const registerForm = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { email: '', password: '', confirmPassword: '', firstName: '', lastName: '' },
    });

    // ===== Обработчики =====
    const onLoginSubmit = async (data: LoginFormData) => {
        setServerError(null);
        try {
            await login(data);
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Ошибка входа. Проверьте данные.');
        }
    };

    const onRegisterSubmit = async (data: RegisterFormData) => {
        setServerError(null);
        try {
            await registerUser({
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
            });
            // После регистрации переключаем на вход
            setActiveTab('login');
            loginForm.setValue('email', data.email);
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Ошибка регистрации. Попробуйте другой email.');
        }
    };

    if (authLoading) {
        return <div className="py-20 text-center text-gray-600">Проверка авторизации...</div>;
    }

    return (
        <div className="max-w-md mx-auto py-8">
            {/* Кнопка назад */}
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6">
                <ArrowLeft className="w-4 h-4" />
                На главную
            </Link>

            <div className="card">
                {/* Вкладки */}
                <div className="flex border-b">
                    <button
                        className={`flex-1 py-4 font-medium transition-colors ${
                            activeTab === 'login'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => { setActiveTab('login'); setServerError(null); }}
                    >
                        Вход
                    </button>
                    <button
                        className={`flex-1 py-4 font-medium transition-colors ${
                            activeTab === 'register'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => { setActiveTab('register'); setServerError(null); }}
                    >
                        Регистрация
                    </button>
                </div>

                {/* Контент */}
                <div className="p-6">
                    {/* Ошибка сервера */}
                    {serverError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {serverError}
                        </div>
                    )}

                    {/* Форма входа */}
                    {activeTab === 'login' && (
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        {...loginForm.register('email')}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {loginForm.formState.errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...loginForm.register('password')}
                                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {loginForm.formState.errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loginForm.formState.isSubmitting}
                                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loginForm.formState.isSubmitting ? 'Вход...' : 'Войти'}
                            </button>
                        </form>
                    )}

                    {/* Форма регистрации */}
                    {activeTab === 'register' && (
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            {...registerForm.register('firstName')}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Иван"
                                        />
                                    </div>
                                    {registerForm.formState.errors.firstName && (
                                        <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.firstName.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            {...registerForm.register('lastName')}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Иванов"
                                        />
                                    </div>
                                    {registerForm.formState.errors.lastName && (
                                        <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        {...registerForm.register('email')}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {registerForm.formState.errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...registerForm.register('password')}
                                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {registerForm.formState.errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Подтвердите пароль</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...registerForm.register('confirmPassword')}
                                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {registerForm.formState.errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={registerForm.formState.isSubmitting}
                                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {registerForm.formState.isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Подсказка */}
            <p className="text-center text-sm text-gray-500 mt-4">
                {activeTab === 'login' ? (
                    <>
                        Нет аккаунта?{' '}
                        <button onClick={() => setActiveTab('register')} className="text-primary hover:underline">
                            Зарегистрироваться
                        </button>
                    </>
                ) : (
                    <>
                        Уже есть аккаунт?{' '}
                        <button onClick={() => setActiveTab('login')} className="text-primary hover:underline">
                            Войти
                        </button>
                    </>
                )}
            </p>
        </div>
    );
};
