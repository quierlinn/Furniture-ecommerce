CREATE TABLE portfolio_works (
                                 id          BIGSERIAL PRIMARY KEY,
                                 title       VARCHAR(255) NOT NULL,
                                 description TEXT NOT NULL,
                                 category_id BIGINT REFERENCES categories (id),
                                 images      JSONB NOT NULL DEFAULT '[]',
                                 created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE portfolio_reviews (
                                   id          BIGSERIAL PRIMARY KEY,
                                   work_id     BIGINT NOT NULL REFERENCES portfolio_works (id) ON DELETE CASCADE,
                                   author_name VARCHAR(255) NOT NULL,
                                   text        TEXT NOT NULL,
                                   rating      INT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
                                   created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
