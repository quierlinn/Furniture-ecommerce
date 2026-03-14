-- ✅ Тестовый заказ для пользователя user@example.com (id=2)
-- Сначала найдите ID пользователя:
-- SELECT id FROM users WHERE email = 'user@example.com';

-- Если пользователь есть (id=2), создайте тестовый заказ:
INSERT INTO orders (user_id, total_amount, status, created_at, updated_at)
VALUES (
           2,  -- замените на реальный ID пользователя
           65451.00,
           'PENDING',
           NOW(),
           NOW()
       ) RETURNING id;  -- запомните ID заказа для следующего шага

-- Добавьте товар в заказ (замените 1 на реальный ID заказа и 1 на ID товара)
INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
VALUES (
           1,  -- ID заказа из предыдущего INSERT
           1,  -- ID товара (например, "Кухня Лофт-01")
           'Кухня Лофт-01',
           1,
           65451.00
       );
