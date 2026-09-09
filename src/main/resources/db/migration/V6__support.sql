CREATE TABLE support_tickets (
                                 id                BIGSERIAL PRIMARY KEY,
                                 user_id           BIGINT REFERENCES users(id),
                                 telegram_chat_id  BIGINT NOT NULL,
                                 telegram_username VARCHAR(255),
                                 telegram_name     VARCHAR(255),
                                 status            VARCHAR(32) NOT NULL DEFAULT 'OPEN',
                                 subject           VARCHAR(500),
                                 created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
                                 updated_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE support_messages (
                                  id                  BIGSERIAL PRIMARY KEY,
                                  ticket_id           BIGINT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
                                  sender              VARCHAR(16) NOT NULL, -- USER, ADMIN, SYSTEM
                                  text                TEXT NOT NULL,
                                  telegram_message_id BIGINT,
                                  created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_chat   ON support_tickets(telegram_chat_id);
CREATE INDEX idx_support_messages_ticket ON support_messages(ticket_id);
