package com.store.bot;

import com.store.entity.SupportMessage;
import com.store.entity.SupportTicket;
import com.store.repository.SupportMessageRepository;
import com.store.repository.SupportTicketRepository;
import com.store.service.TelegramNotifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SupportTelegramBot extends TelegramLongPollingBot {

    private static final Logger log = LoggerFactory.getLogger(SupportTelegramBot.class);

    private final String botUsername;  // ← добавлено
    private final SupportTicketRepository ticketRepo;
    private final SupportMessageRepository messageRepo;
    private final TelegramNotifier notifier;

    public SupportTelegramBot(
            @Value("${telegram.bot.token}") String token,
            @Value("${telegram.bot.username}") String botUsername,  // ← добавлено
            SupportTicketRepository ticketRepo,
            SupportMessageRepository messageRepo,
            TelegramNotifier notifier) {
        super(token);
        this.botUsername = botUsername;  // ← добавлено
        this.ticketRepo = ticketRepo;
        this.messageRepo = messageRepo;
        this.notifier = notifier;
        log.info(">>> SupportTelegramBot bean created, token length = {}, username = {}",
                token == null ? 0 : token.length(), botUsername);
    }

    @Override
    public String getBotUsername() {
        return botUsername;  // ← изменено: возвращаем реальное значение
    }

    @Override
    public void onUpdateReceived(Update update) {
        log.info(">>> TG update received: {}", update);

        if (!update.hasMessage() || !update.getMessage().hasText()) return;

        var msg = update.getMessage();
        Long chatId = msg.getChatId();
        String text = msg.getText().trim();
        String username = msg.getFrom().getUserName();
        String name = msg.getFrom().getFirstName();

        try {
            if (text.equalsIgnoreCase("/start") || text.equalsIgnoreCase("/new")) {
                handleStart(chatId, username, name);
            } else if (text.equalsIgnoreCase("/status")) {
                handleStatus(chatId);
            } else if (text.equalsIgnoreCase("/help")) {
                send(chatId,
                        "👋 Я бот поддержки Riff.\n\n" +
                                "/start — начать новый диалог\n" +
                                "/status — статус текущего обращения\n" +
                                "Любое другое сообщение — отправить в поддержку");
            } else {
                handleUserMessage(chatId, username, name, text);
            }
        } catch (Exception e) {
            log.error("Bot update handling failed", e);
        }
    }

    private void handleStart(Long chatId, String username, String name) {
        // Закрываем предыдущие активные тикеты этого пользователя
        ticketRepo.findByTelegramChatIdAndStatusIn(chatId, List.of(SupportTicket.ACTIVE))
                .ifPresent(t -> {
                    t.setStatus(SupportTicket.Status.CLOSED);
                    t.setUpdatedAt(LocalDateTime.now());
                    ticketRepo.save(t);
                });

        SupportTicket ticket = new SupportTicket();
        ticket.setTelegramChatId(chatId);
        ticket.setTelegramUsername(username);
        ticket.setTelegramName(name);
        ticket.setSubject("Новое обращение");
        ticket.setStatus(SupportTicket.Status.OPEN);
        ticket = ticketRepo.save(ticket);

        send(chatId,
                "Здравствуйте" + (name != null ? ", " + name : "") + "! 👋\n\n" +
                        "Я — бот тех.поддержки Riff. Опишите вашу проблему одним или несколькими сообщениями — " +
                        "администратор ответит вам здесь.\n\n" +
                        "Чтобы начать новый диалог позже — /new");

        notifier.notifyAdmin(
                "📩 <b>Новое обращение</b>\n" +
                        "От: " + formatAuthor(username, name) + "\n" +
                        "Тикет #" + ticket.getId(),
                ticket.getId());
    }

    private void handleStatus(Long chatId) {
        var active = ticketRepo.findByTelegramChatIdAndStatusIn(chatId, List.of(SupportTicket.ACTIVE));
        if (active.isEmpty()) {
            send(chatId, "У вас нет активных обращений. Напишите любое сообщение, чтобы создать новое.");
        } else {
            var t = active.get();
            send(chatId,
                    "Тикет #" + t.getId() + "\n" +
                            "Статус: " + statusLabel(t.getStatus()) + "\n" +
                            "Создан: " + t.getCreatedAt().toLocalDate());
        }
    }

    private void handleUserMessage(Long chatId, String username, String name, String text) {
        SupportTicket ticket = ticketRepo
                .findByTelegramChatIdAndStatusIn(chatId, List.of(SupportTicket.ACTIVE))
                .orElseGet(() -> {
                    SupportTicket t = new SupportTicket();
                    t.setTelegramChatId(chatId);
                    t.setTelegramUsername(username);
                    t.setTelegramName(name);
                    t.setSubject(text.length() > 100 ? text.substring(0, 100) : text);
                    t.setStatus(SupportTicket.Status.OPEN);
                    return ticketRepo.save(t);
                });

        SupportMessage m = new SupportMessage();
        m.setTicket(ticket);
        m.setSender(SupportMessage.Sender.USER);
        m.setText(text);
        messageRepo.save(m);

        ticket.setUpdatedAt(LocalDateTime.now());
        if (ticket.getStatus() == SupportTicket.Status.RESOLVED) {
            ticket.setStatus(SupportTicket.Status.OPEN);
        }
        ticketRepo.save(ticket);

        send(chatId, "✅ Сообщение получено. Администратор ответит в ближайшее время.");

        notifier.notifyAdmin(
                "💬 Тикет #" + ticket.getId() + " — " + formatAuthor(username, name) + "\n\n" +
                        escape(text),
                ticket.getId());
    }

    private void send(long chatId, String text) {
        SendMessage m = SendMessage.builder()
                .chatId(String.valueOf(chatId))
                .text(text)
                .parseMode("HTML")
                .build();
        try {
            execute(m);
        } catch (TelegramApiException e) {
            log.error("Failed to send to {}: {}", chatId, e.getMessage());
        }
    }

    private static String statusLabel(SupportTicket.Status s) {
        return switch (s) {
            case OPEN -> "⏳ Ожидает ответа";
            case IN_PROGRESS -> "💬 В работе";
            case RESOLVED -> "✅ Исправлено";
            case CLOSED -> "📁 Закрыто";
        };
    }

    private static String formatAuthor(String username, String name) {
        if (username != null) return "@" + username + (name != null ? " (" + name + ")" : "");
        return name != null ? name : "неизвестный пользователь";
    }

    private static String escape(String s) {
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
