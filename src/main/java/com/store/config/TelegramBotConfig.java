package com.store.config;

import com.store.bot.SupportTelegramBot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

@Configuration
public class TelegramBotConfig {

    private static final Logger log = LoggerFactory.getLogger(TelegramBotConfig.class);

    @Bean
    public TelegramBotsApi telegramBotsApi(SupportTelegramBot bot) throws TelegramApiException {
        TelegramBotsApi api = new TelegramBotsApi(DefaultBotSession.class);
        try {
            // bot.clearWebhook();  ← убираем, уже удалён ранее
            api.registerBot(bot);
            log.info(">>> Telegram bot REGISTERED and polling STARTED (username={})", bot.getBotUsername());
        } catch (TelegramApiException e) {
            log.error(">>> Bot registration FAILED: {}", e.getMessage(), e);
            throw e;
        }
        return api;
    }
}
