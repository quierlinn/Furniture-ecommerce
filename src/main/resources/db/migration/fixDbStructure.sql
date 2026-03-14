-- 1. Добавьте колонку с разрешением NULL
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10,2);

-- 2. Заполните существующие заказы значением по умолчанию (0)
UPDATE orders SET total_amount = 0 WHERE total_amount IS NULL;

-- 3. Теперь можно сделать колонку NOT NULL (опционально)
ALTER TABLE orders ALTER COLUMN total_amount SET NOT NULL;

-- 4. Добавьте колонку product_name в order_items (если нужно)
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name VARCHAR(255);
UPDATE order_items SET product_name = '' WHERE product_name IS NULL;
ALTER TABLE order_items ALTER COLUMN product_name SET NOT NULL;
