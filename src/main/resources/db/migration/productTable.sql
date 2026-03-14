-- ⚠️ ВНИМАНИЕ: Это удалит все товары!
DROP TABLE IF EXISTS products CASCADE;

-- Создаём таблицу с правильным порядком колонок
CREATE TABLE products (
                          id BIGSERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          description TEXT,
                          price DECIMAL(10,2) NOT NULL,
                          image_url VARCHAR(500),
                          category_id BIGINT REFERENCES categories(id),
                          created_at TIMESTAMP DEFAULT NOW(),
                          updated_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
