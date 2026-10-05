import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { api } from '../../api/client';

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'name' | 'chat'>('name');
    const [userName, setUserName] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Проверяем, есть ли сохранённое имя
    useEffect(() => {
        const savedName = localStorage.getItem('chat_user_name');
        if (savedName) {
            setUserName(savedName);
            setStep('chat');
        }
    }, []);

    // Прокрутка вниз при новых сообщениях
    useEffect(() => {
        // ИСПРАВЛЕНО: убран лишний пробел в 'smooth'
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [isSent]);

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim()) {
            localStorage.setItem('chat_user_name', userName.trim());
            setStep('chat');
        }
    };

    const handleMessageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isSending) return;

        setIsSending(true);
        try {
            // ИСПРАВЛЕНО: используем публичный метод api.sendSupportMessage
            await api.sendSupportMessage(userName, message.trim());

            setMessage('');
            setIsSent(true);

            // Сбрасываем статус "отправлено" через 3 секунды
            setTimeout(() => setIsSent(false), 3000);
        } catch (error) {
            console.error('Ошибка отправки:', error);
            alert('Не удалось отправить сообщение. Попробуйте позже.');
        } finally {
            setIsSending(false);
        }
    };

    const resetChat = () => {
        localStorage.removeItem('chat_user_name');
        setUserName('');
        setMessage('');
        setStep('name');
        setIsSent(false);
        setIsOpen(false);
    };

    return (
        <>
            {/* Кнопка открытия (плавающая) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-terra text-milk shadow-lg transition-transform hover:scale-105 hover:bg-terra-dark"
                    aria-label="Открыть чат поддержки"
                >
                    <MessageCircle className="h-6 w-6" strokeWidth={2} />
                </button>
            )}

            {/* Окно чата */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-milk shadow-2xl md:w-[400px]">
                    {/* Шапка */}
                    <div className="flex items-center justify-between bg-terra px-5 py-4 text-milk">
                        <div>
                            <h3 className="font-bold tracking-tight">Поддержка Riff</h3>
                            <p className="text-xs text-milk/80">Обычно отвечаем в течение часа</p>
                        </div>
                        <div className="flex gap-2">
                            {step === 'chat' && (
                                <button
                                    onClick={resetChat}
                                    className="rounded p-1 text-milk/70 hover:bg-milk/20 hover:text-milk"
                                    title="Начать заново"
                                >
                                    <User className="h-4 w-4" />
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded p-1 text-milk/70 hover:bg-milk/20 hover:text-milk"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Тело чата */}
                    <div className="flex-1 overflow-y-auto bg-cream p-5">
                        {step === 'name' ? (
                            <form onSubmit={handleNameSubmit} className="flex h-full flex-col justify-center space-y-4">
                                <div className="text-center">
                                    <p className="text-lg font-semibold text-ink">Добро пожаловать!</p>
                                    <p className="mt-1 text-sm text-ink-soft">Как мы можем к вам обращаться?</p>
                                </div>
                                <input
                                    autoFocus
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Ваше имя"
                                    className="w-full rounded-lg border border-ink/20 bg-milk px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terra"
                                />
                                <button
                                    type="submit"
                                    disabled={!userName.trim()}
                                    className="w-full rounded-lg bg-terra py-3 text-sm font-semibold text-milk transition-colors hover:bg-terra-dark disabled:opacity-50"
                                >
                                    Начать чат
                                </button>
                            </form>
                        ) : (
                            <div className="flex h-full flex-col">
                                {/* Приветственное сообщение */}
                                <div className="mb-4 flex justify-start">
                                    <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-milk px-4 py-3 text-sm text-ink shadow-sm">
                                        Здравствуйте, {userName}! 👋<br />
                                        Опишите ваш вопрос или задачу, и мы обязательно ответим.
                                    </div>
                                </div>

                                {/* Сообщение об успешной отправке */}
                                {isSent && (
                                    <div className="mb-4 flex justify-end">
                                        <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-success/20 px-4 py-3 text-sm text-success-dark shadow-sm">
                                            ✅ Сообщение отправлено! Мы скоро свяжемся с вами.
                                        </div>
                                    </div>
                                )}

                                {/* Поле ввода (всегда внизу) */}
                                <div className="mt-auto">
                                    <form onSubmit={handleMessageSubmit} className="flex gap-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Введите сообщение..."
                                            disabled={isSending}
                                            className="flex-1 rounded-lg border border-ink/20 bg-milk px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terra disabled:opacity-50"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!message.trim() || isSending}
                                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-terra text-milk transition-colors hover:bg-terra-dark disabled:opacity-50"
                                        >
                                            {isSending ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-milk border-t-transparent" />
                                            ) : (
                                                <Send className="h-5 w-5" strokeWidth={2} />
                                            )}
                                        </button>
                                    </form>
                                    <p className="mt-2 text-center text-[10px] text-ink-soft/60">
                                        Нажимая «Отправить», вы соглашаетесь на обработку персональных данных
                                    </p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}
        </>
    );
};
