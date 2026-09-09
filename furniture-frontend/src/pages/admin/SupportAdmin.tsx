import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, Inbox, MessageCircle, Send, XCircle } from 'lucide-react';
import { api } from '../../api/client';
import type { SupportMessage, SupportStats, SupportStatus, SupportTicket } from '../../types';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/cn';

const STATUS: Record<SupportStatus, { label: string; dot: string; icon: React.ReactNode }> = {
    OPEN:        { label: 'Ожидает',    dot: 'bg-terra',   icon: <Inbox className="h-4 w-4" strokeWidth={1.75} /> },
    IN_PROGRESS: { label: 'В работе',   dot: 'bg-walnut',  icon: <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> },
    RESOLVED:    { label: 'Исправлено', dot: 'bg-success', icon: <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} /> },
    CLOSED:      { label: 'Закрыт',     dot: 'bg-ink/40',  icon: <XCircle className="h-4 w-4" strokeWidth={1.75} /> },
};

export const SupportAdmin = () => {
    const queryClient = useQueryClient();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const { data: tickets = [], isLoading } = useQuery<SupportTicket[]>({
        queryKey: ['support'],
        queryFn: () => api.getSupportTickets(),
        refetchInterval: 15000, // опрос каждые 15 сек
    });

    const { data: stats } = useQuery<SupportStats>({
        queryKey: ['support', 'stats'],
        queryFn: () => api.getSupportStats(),
        refetchInterval: 15000,
    });

    const selected = tickets.find((t) => t.id === selectedId) ?? null;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selected?.messages.length]);

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['support'] });
    };

    const replyMutation = useMutation({
        mutationFn: ({ id, text }: { id: number; text: string }) => api.supportReply(id, text),
        onSuccess: (updated) => {
            invalidate();
            setReplyText('');
            setFormError(null);
            setSelectedId(updated.id);
        },
        onError: (e: any) => setFormError(e.response?.data?.message || 'Не удалось отправить'),
    });

    const resolveMutation = useMutation({
        mutationFn: (id: number) => api.supportResolve(id),
        onSuccess: () => invalidate(),
    });

    const closeMutation = useMutation({
        mutationFn: (id: number) => api.supportClose(id),
        onSuccess: () => invalidate(),
    });

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected || !replyText.trim()) {
            setFormError('Введите сообщение');
            return;
        }
        setFormError(null);
        replyMutation.mutate({ id: selected.id, text: replyText.trim() });
    };

    const pending = replyMutation.isPending || resolveMutation.isPending || closeMutation.isPending;

    return (
        <div className="space-y-6">
            <div>
                <p className="overline-title">
                    <Link to="/admin" className="hover:text-walnut">Админ-панель</Link> / Поддержка
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Тех. поддержка в Telegram</h1>
                <p className="mt-2 text-sm text-ink-soft">
                    Пользователи пишут в бота — вы отвечаете отсюда. Бот сам отправит ответ им в Telegram.
                </p>
            </div>

            {stats && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {([
                        ['open', 'Ожидают', 'bg-terra'],
                        ['inProgress', 'В работе', 'bg-walnut'],
                        ['resolved', 'Исправлены', 'bg-success'],
                        ['total', 'Всего', 'bg-ink'],
                    ] as const).map(([k, label, dot]) => (
                        <div key={k} className="card flex items-center justify-between px-5 py-4">
                            <span className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                                <span className={cn('h-2 w-2 rounded-full', dot)} /> {label}
                            </span>
                            <span className="text-xl font-extrabold">{stats[k as keyof SupportStats]}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-[340px_1fr] md:gap-6">
                {/* ===== Список тикетов ===== */}
                <div className="card max-h-[70vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="px-4 py-10 text-center text-sm text-ink-soft">Загрузка...</div>
                    ) : tickets.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-ink-soft">Обращений пока нет</div>
                    ) : (
                        <div className="divide-y divide-ink/5">
                            {tickets.map((t) => {
                                const s = STATUS[t.status];
                                const active = t.id === selectedId;
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedId(t.id)}
                                        className={cn(
                                            'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                                            active ? 'bg-sand/40' : 'hover:bg-ink/5'
                                        )}
                                    >
                                        <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', s.dot)} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-baseline justify-between gap-2">
                                                <p className="truncate text-sm font-bold">
                                                    {t.telegramName ?? t.telegramUsername ?? `Чат ${t.telegramChatId ?? ''}`}
                                                </p>
                                                <p className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                                                    #{t.id}
                                                </p>
                                            </div>
                                            <p className="mt-0.5 truncate text-xs text-ink-soft">
                                                {t.lastMessage ?? 'Нет сообщений'}
                                            </p>
                                            <div className="mt-1.5 flex items-center gap-2 text-[11px] text-ink-soft">
                                                <span>{s.label}</span>
                                                {t.unreadByAdmin > 0 && t.status !== 'CLOSED' && (
                                                    <span className="rounded-full bg-terra px-1.5 py-0.5 text-[10px] font-bold text-milk">
                                                        +{t.unreadByAdmin}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ===== Чат ===== */}
                <div className="card flex max-h-[70vh] flex-col">
                    {!selected ? (
                        <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-ink-soft">
                            Выберите тикет слева, чтобы начать диалог
                        </div>
                    ) : (
                        <>
                            {/* Шапка чата */}
                            <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-3">
                                <div className="min-w-0">
                                    <p className="truncate font-extrabold">
                                        {selected.telegramName ?? selected.telegramUsername ?? `Чат #${selected.id}`}
                                        {selected.telegramUsername && (
                                            <a
                                                href={`https://t.me/${selected.telegramUsername}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="ml-2 text-xs font-semibold text-terra hover:underline"
                                            >
                                                @{selected.telegramUsername}
                                            </a>
                                        )}
                                    </p>
                                    <p className="text-xs text-ink-soft">
                                        Тикет #{selected.id} · {STATUS[selected.status].label}
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    {selected.status !== 'RESOLVED' && selected.status !== 'CLOSED' && (
                                        <Button
                                            size="sm"
                                            onClick={() => resolveMutation.mutate(selected.id)}
                                            disabled={pending}
                                        >
                                            <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} /> Исправлено
                                        </Button>
                                    )}
                                    {selected.status !== 'CLOSED' && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => closeMutation.mutate(selected.id)}
                                            disabled={pending}
                                        >
                                            Закрыть
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Сообщения */}
                            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                                {selected.messages.length === 0 && (
                                    <p className="py-10 text-center text-sm text-ink-soft">
                                        Пользователь создал тикет, но ещё не написал сообщение.
                                    </p>
                                )}
                                {selected.messages.map((m) => (
                                    <MessageBubble key={m.id} m={m} />
                                ))}
                            </div>

                            {/* Форма ответа */}
                            {selected.status === 'CLOSED' ? (
                                <div className="border-t border-ink/10 px-5 py-3 text-sm text-ink-soft">
                                    Тикет закрыт. Откройте новый через Telegram-бота.
                                </div>
                            ) : (
                                <form onSubmit={handleReply} className="flex items-end gap-2 border-t border-ink/10 p-3">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        rows={2}
                                        placeholder="Напишите ответ пользователю..."
                                        className="input-field resize-none"
                                        disabled={replyMutation.isPending}
                                    />
                                    <Button type="submit" disabled={pending || !replyText.trim()}>
                                        <Send className="h-4 w-4" strokeWidth={1.75} />
                                        {replyMutation.isPending ? 'Отправка...' : 'Отправить'}
                                    </Button>
                                </form>
                            )}

                            {formError && (
                                <div className="border-t border-terra/20 bg-terra/10 px-4 py-2 text-xs font-semibold text-terra-dark">
                                    <AlertCircle className="mr-1.5 inline h-3.5 w-3.5" strokeWidth={1.75} />
                                    {formError}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const MessageBubble = ({ m }: { m: SupportMessage }) => {
    const mine = m.sender === 'ADMIN';
    const system = m.sender === 'SYSTEM';
    return (
        <div className={cn('flex', mine && 'justify-end')}>
            <div
                className={cn(
                    'max-w-[80%] rounded-card px-4 py-2.5 text-sm',
                    mine ? 'bg-walnut text-milk' : 'bg-sand/60 text-ink',
                    system && 'mx-auto bg-ink/5 text-center text-xs italic text-ink-soft'
                )}
            >
                <p className="whitespace-pre-wrap">{m.text}</p>
                <p className={cn('mt-1 text-[10px]', mine ? 'text-milk/60' : 'text-ink-soft')}>
                    {new Date(m.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    {!system && (
                        <span className="ml-2 uppercase tracking-wider">
                            {m.sender === 'USER' ? 'клиент' : 'вы'}
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
};
