import { Phone, Send, MessageCircle, MapPin } from 'lucide-react';

export const ContactsPage = () => {
    const contacts = {
        phone: '+7 (920) 008-54-16',
        email: 'info@furniturestore.ru',
        address: 'г. Москва, ул. Красная Площадь, д. 1',
        telegramChannel: 'https://t.me/furniture_store_channel',
        telegramProfile: 'https://t.me/furniture_support',
    };

    return (
        <div className="max-w-4xl mx-auto py-12">
            <h1 className="text-3xl font-bold mb-8">Контакты</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Контактная информация */}
                <div className="space-y-6">
                    <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary mt-1" />
                        <div>
                            <p className="font-medium">Телефон</p>
                            <a href={`tel:${contacts.phone}`} className="text-primary hover:underline">
                                {contacts.phone}
                            </a>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Send className="w-5 h-5 text-primary mt-1" />
                        <div>
                            <p className="font-medium">Telegram-канал</p>
                            <a href={contacts.telegramChannel} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                @furniture_store_channel
                            </a>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MessageCircle className="w-5 h-5 text-primary mt-1" />
                        <div>
                            <p className="font-medium">Поддержка</p>
                            <a href={contacts.telegramProfile} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                @furniture_support
                            </a>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-1" />
                        <div>
                            <p className="font-medium">Адрес</p>
                            <p>{contacts.address}</p>
                        </div>
                    </div>
                </div>

                {/* Форма обратной связи (заглушка) */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold mb-4">Напишите нам</h2>
                    <form className="space-y-4">
                        <input
                            type="text"
                            placeholder="Ваше имя"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <textarea
                            rows={4}
                            placeholder="Сообщение"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button type="button" className="btn-primary w-full">
                            Отправить
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
