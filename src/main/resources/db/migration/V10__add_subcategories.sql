CREATE TABLE subcategories (
                               id          BIGSERIAL PRIMARY KEY,
                               name        VARCHAR(150) NOT NULL,
                               category_id BIGINT NOT NULL,
                               created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
                               updated_at  TIMESTAMP,
                               CONSTRAINT fk_subcategories_category
                                   FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
                               CONSTRAINT uq_subcategory_name_in_category UNIQUE (category_id, name)
);

CREATE INDEX idx_subcategories_category ON subcategories (category_id);

-- nullable FK в products
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory_id BIGINT;
ALTER TABLE products ADD CONSTRAINT fk_products_subcategory
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL;
CREATE INDEX idx_products_subcategory ON products (subcategory_id);
