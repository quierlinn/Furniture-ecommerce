export const APP_CONFIG = {
  NAME: 'Furniture Store',
  DESCRIPTION: 'Premium furniture for your home',
  COMPANY: 'Furniture Store LLC',
  ADDRESS: 'Moscow, Tverskaya st., 1',
  PHONE: '+7 (495) 123-45-67',
  EMAIL: 'info@furniturestore.ru',
  WORK_TIME: 'Daily 9:00-21:00',
} as const;

export const PAGINATION = {
  DEFAULT_SIZE: 12,
  SIZES: [12, 24, 36, 48],
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^(\+7|8)[\s-]?\(?[\d]{3}\)?[\s-]?[\d]{3}[\s-]?[\d]{2}[\s-]?[\d]{2}$/,
} as const;

export const MESSAGES = {
  SUCCESS: {
    ADDED_TO_CART: 'Товар добавлен в корзину',
    ORDER_CREATED: 'Заказ успешно создан',
    LOGIN_SUCCESS: 'Успешный вход в аккаунт',
    REGISTRATION_SUCCESS: 'Регистрация прошла успешно',
  },
  ERROR: {
    NETWORK_ERROR: 'Ошибка сети. Попробуйте позже.',
    INVALID_CREDENTIALS: 'Неверный email или пароль',
    PRODUCT_NOT_FOUND: 'Товар не найден',
    CART_EMPTY: 'Корзина пуста',
    FILL_REQUIRED_FIELDS: 'Заполните все обязательные поля',
  },
} as const;
