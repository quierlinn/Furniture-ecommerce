import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Loader2 } from 'lucide-react';
import { api } from '../../api/client';

// Тип для сообщения (должен совпадать с MessageDto на бэке)
interface ChatMessage {
    id: number;
    sender: 'USER' | 'ADMIN' | 'SYSTEM';
    text: string;
    createdAt: string;
}

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'name' | 'chat'>('name');
    const [userName, setUserName] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Состояние для тикета и сообщений
    const [ticketId, setTicketId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. При монтировании проверяем, есть ли сохранённый тикет
    useEffect(() => {
        const savedTicketId = localStorage.getItem('support_ticket_id');
        const savedName = localStorage.getItem('chat_user_name');

        if (savedName) setUserName(savedName);

        if (savedTicketId) {
            setTicketId(Number(savedTicketId));
            loadTicketHistory(Number(savedTicketId));
        } else if (savedName) {
            setStep('chat');
        }
    }, []);

    // 2. Функция загрузки истории
    const loadTicketHistory = async (id: number) => {
        setIsLoadingHistory(true);
        try {
            const ticket = await api.getPublicTicket(id);
            setMessages(ticket.messages || []);
            setStep('chat');
        } catch (error) {
            console.error('Не удалось загрузить историю:', error);
            // Если тикет удалён или не найден, сбрасываем ID
            localStorage.removeItem('support_ticket_id');
            setTicketId(null);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // 3. Автопрокрутка вниз при новых сообщениях
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

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

        const currentMessage = message.trim();
        setMessage(''); // Очищаем поле сразу для лучшего UX
        setIsSending(true);

        // Оптимистичное добавление сообщения в UI
        const tempMsg: ChatMessage = {
            id: Date.now(),
            sender: 'USER',
            text: currentMessage,
            createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, tempMsg]);

        try {
            const response = await api.sendPublicSupportMessage({
                message: currentMessage,
                name: userName || 'Посетитель',
                ticketId: ticketId,
            });

            if (response.ticketId && !ticketId) {
                // Сохраняем ID только при создании самого первого тикета
                setTicketId(response.ticketId);
                localStorage.setItem('support_ticket_id', String(response.ticketId));
            }
        } catch (error) {
            console.error('Ошибка отправки:', error);
            alert('Не удалось отправить сообщение. Попробуйте позже.');
            // Убираем временное сообщение при ошибке
            setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
            setMessage(currentMessage); // Возвращаем текст в поле
        } finally {
            setIsSending(false);
        }
    };

    const resetChat = () => {
        localStorage.removeItem('support_ticket_id');
        localStorage.removeItem('chat_user_name');
        setUserName('');
        setMessage('');
        setMessages([]);
        setTicketId(null);
        setStep('name');
        setIsOpen(false);
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-terra text-milk shadow-lg transition-transform hover:scale-105 hover:bg-terra-dark"
                    aria-label="Открыть чат поддержки"
                >
                    <MessageCircle className="h-6 w-6" strokeWidth={2} />
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-milk shadow-2xl md:w-[400px]">
                    {/* Шапка */}
                    <div className="flex items-center justify-between bg-terra px-5 py-4 text-milk">
                        <div>
                            <h3 className="font-bold tracking-tight">Поддержка Riff</h3>
                            <p className="text-xs text-milk/80">
                                {isLoadingHistory ? 'Загрузка...' : 'Обычно отвечаем в течение часа'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {step === 'chat' && (
                                <button
                                    onClick={resetChat}
                                    className="rounded p-1 text-milk/70 hover:bg-milk/20 hover:text-milk"
                                    title="Начать новый диалог"
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
                        ) : isLoadingHistory ? (
                            <div className="flex h-full items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-terra" />
                            </div>
                        ) : (
                            <div className="flex h-full flex-col">
                                {/* Приветственное сообщение (если история пуста) */}
                                {messages.length === 0 && (
                                    <div className="mb-4 flex justify-start">
                                        <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-milk px-4 py-3 text-sm text-ink shadow-sm">
                                            Здравствуйте, {userName || 'друг'}! 👋<br />
                                            Опишите ваш вопрос, и мы обязательно ответим.
                                        </div>
                                    </div>
                                )}

                                {/* Список сообщений */}
                                <div className="flex flex-col gap-3">
                                    {messages.map((msg) => {
                                        const isUser = msg.sender === 'USER';
                                        return (
                                            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                                <div
                                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                                        isUser
                                                            ? 'rounded-tr-none bg-terra text-milk'
                                                            : 'rounded-tl-none bg-milk text-ink'
                                                    }`}
                                                >
                                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                                    <p className={`mt-1 text-[10px] ${isUser ? 'text-milk/70' : 'text-ink-soft'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        {!isUser && <span className="ml-1 font-semibold">Поддержка</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div ref={messagesEndRef} />

                                {/* Поле ввода */}
                                <div className="mt-4">
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
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Send className="h-5 w-5" strokeWidth={2} />
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
