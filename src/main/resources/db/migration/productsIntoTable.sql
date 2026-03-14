-- ============================================
-- ДОБАВЛЕНИЕ ТЕСТОВЫХ ТОВАРОВ
-- ============================================

-- 🔹 Кухни (категория 1)
INSERT INTO products (name, description, price, image_url, category_id, created_at, updated_at) VALUES
                                                                                                    ('Кухня Лофт-01', 'Современная кухня в стиле лофт с фасадами из МДФ. В комплекте: верхние и нижние шкафы, столешница.', 65451.00, 'https://placehold.co/600x400/3b82f6/ffffff?text=Кухня+Лофт', 1, NOW(), NOW()),
                                                                                                    ('Кухня Классик-02', 'Классическая кухня с филенчатыми фасадами. Элегантный дизайн для традиционного интерьера.', 89990.00, 'https://placehold.co/600x400/10b981/ffffff?text=Кухня+Классик', 1, NOW(), NOW()),
                                                                                                    ('Кухня Модерн-03', 'Минималистичная кухня с глянцевыми фасадами. Встроенная техника и умное хранение.', 125000.00, 'https://placehold.co/600x400/f59e0b/ffffff?text=Кухня+Модерн', 1, NOW(), NOW());

-- 🔹 Прихожие (категория 2)
INSERT INTO products (name, description, price, image_url, category_id, created_at, updated_at) VALUES
                                                                                                    ('Шкаф-купе Классик', 'Вместительный шкаф-купе с зеркальными дверями. 3 секции, штанга для одежды, полки.', 32990.00, 'https://placehold.co/600x400/ef4444/ffffff?text=Шкаф-купе', 2, NOW(), NOW()),
                                                                                                    ('Прихожая Лофт', 'Компактная прихожая в стиле лофт: вешалка, обувница, зеркало. Металл + дерево.', 18500.00, 'https://placehold.co/600x400/8b5cf6/ffffff?text=Прихожая+Лофт', 2, NOW(), NOW());

-- 🔹 Гостиные (категория 3)
INSERT INTO products (name, description, price, image_url, category_id, created_at, updated_at) VALUES
                                                                                                    ('Диван Уют', 'Мягкий трёхместный диван с механизмом раскладки "книжка". Ткань: велюр, цвет: серый.', 45000.00, 'https://placehold.co/600x400/06b6d4/ffffff?text=Диван+Уют', 3, NOW(), NOW()),
                                                                                                    ('Стенка Модерн', 'Современная стенка для гостиной: ТВ-зона, полки, закрытые шкафы. Цвет: венге/белый.', 52000.00, 'https://placehold.co/600x400/ec4899/ffffff?text=Стенка+Модерн', 3, NOW(), NOW());

-- 🔹 Спальни (категория 4)
INSERT INTO products (name, description, price, image_url, category_id, created_at, updated_at) VALUES
                                                                                                    ('Кровать Сканди', 'Деревянная кровать в скандинавском стиле. Массив сосны, размер 160х200 см.', 28500.00, 'https://placehold.co/600x400/14b8a6/ffffff?text=Кровать+Сканди', 4, NOW(), NOW()),
                                                                                                    ('Комод Классик', 'Трёхящичный комод с классическими ручками. МДФ, цвет: белый.', 15990.00, 'https://placehold.co/600x400/f97316/ffffff?text=Комод+Классик', 4, NOW(), NOW());

-- 🔹 Столы и стулья (категория 5)
INSERT INTO products (name, description, price, image_url, category_id, created_at, updated_at) VALUES
                                                                                                    ('Обеденный стол Лофт', 'Стол из массива дуба на металлическом каркасе. Размер: 140х80 см.', 34500.00, 'https://placehold.co/600x400/6366f1/ffffff?text=Стол+Лофт', 5, NOW(), NOW()),
                                                                                                    ('Стул Барный', 'Барный стул с регулируемой высотой. Экокожа, хром, цвет: чёрный.', 8990.00, 'https://placehold.co/600x400/a855f7/ffffff?text=Стул+Барный', 5, NOW(), NOW());

-- 🔹 Шкафы (категория 6)
INSERT INTO products (name, description, price, image_url, category_id, created_at, updated_at) VALUES
    ('Шкаф платяной', 'Двухдверный платяной шкаф с антресолью. МДФ, цвет: дуб сонома.', 24990.00, 'https://placehold.co/600x400/22c55e/ffffff?text=Шкаф+Платяной', 6, NOW(), NOW());

-- 🔹 Диваны и кресла (категория 7)
INSERT INTO products (name, description, price, image_url, category_id, created_at, updated_at) VALUES
    ('Кресло-качалка', 'Классическое кресло-качалка из гнутого бука. Плетёное сиденье.', 19900.00, 'https://placehold.co/600x400/eab308/ffffff?text=Кресло-качалка', 7, NOW(), NOW());

-- 🔹 Детская мебель (категория 8)
INSERT INTO products (name, description, price, image_url, category_id, created_at, updated_at) VALUES
    ('Кровать-чердак', 'Детская кровать-чердак со столом внизу. Массив сосны, цвет: натуральный.', 42000.00, 'https://placehold.co/600x400/f43f5e/ffffff?text=Кровать-чердак', 8, NOW(), NOW());
