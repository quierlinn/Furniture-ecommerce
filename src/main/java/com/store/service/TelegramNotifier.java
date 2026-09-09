package com.store.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.util.List;

@Service
public class TelegramNotifier {

    private static final Logger log = LoggerFactory.getLogger(TelegramNotifier.class);

    private final TelegramLongPollingBot bot;
    private final String adminChatId;
    private final String webBaseUrl;

    public TelegramNotifier(@Lazy TelegramLongPollingBot bot,   // ← @Lazy тут
                            @Value("${telegram.admin.chatId:}") String adminChatId,
                            @Value("${telegram.web.baseUrl:http://localhost:5173}") String webBaseUrl) {
        this.bot = bot;
        this.adminChatId = adminChatId;
        this.webBaseUrl = webBaseUrl;
    }

    public void sendToUser(long chatId, String text) {
        send(chatId, text, null);
    }

    public void notifyAdmin(String preview, long ticketId) {
        if (adminChatId == null || adminChatId.isBlank()) return;

        InlineKeyboardButton btn = InlineKeyboardButton.builder()
                .text("Открыть тикет →")
                .url(webBaseUrl + "/admin/support/" + ticketId)
                .build();
        InlineKeyboardMarkup kb = InlineKeyboardMarkup.builder()
                .keyboardRow(List.of(btn))
                .build();

        try {
            send(Long.parseLong(adminChatId), preview, kb);
        } catch (NumberFormatException e) {
            log.warn("Invalid admin chat id: {}", adminChatId);
        }
    }

    private void send(long chatId, String text, InlineKeyboardMarkup kb) {
        SendMessage msg = SendMessage.builder()
                .chatId(String.valueOf(chatId))
                .text(text)
                .parseMode("HTML")
                .replyMarkup(kb)
                .build();
        try {
            bot.execute(msg);
        } catch (TelegramApiException e) {
            log.error("Failed to send TG message to {}: {}", chatId, e.getMessage());
        }
    }
}
