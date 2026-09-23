CREATE TABLE reviews (
                         id          BIGSERIAL PRIMARY KEY,
                         author_name VARCHAR(100) NOT NULL,
                         author_city VARCHAR(100),
                         rating      INT          NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
                         content     TEXT         NOT NULL,
                         published   BOOLEAN      NOT NULL DEFAULT TRUE,
                         created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
                         updated_at  TIMESTAMP
);

CREATE INDEX idx_reviews_published ON reviews (published, created_at DESC);
