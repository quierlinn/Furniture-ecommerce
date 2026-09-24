import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin,
    Truck,
    Wrench,
    PackageCheck,
    CreditCard,
    Banknote,
    FileText,
    ChevronDown,
    ArrowRight,
    Phone,
    Calculator,
    Check,
} from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';

const DELIVERY_ZONES = [
    {
        title: 'Дзержинск',
        desc: 'Бесплатная доставка в черте города при заказе от 50 000 ₽. Срок — 1–2 рабочих дня после готовности.',
        tag: 'Основная зона',
        highlight: true,
    },
    {
        title: 'Нижний Новгород',
        desc: 'Доставка в пределах Нижнего Новгорода и пригорода. Срок — 2–4 рабочих дня после готовности заказа.',
        tag: 'Расширенная зона',
        highlight: false,
    },
    {
        title: 'Другие регионы',
        desc: 'Доставка в другие города России — рассчитывается индивидуально. Работаем с транспортными компаниями.',
        tag: 'По договорённости',
        highlight: false,
    },
];

const PROCESS_STEPS = [
    {
        num: '01',
        icon: PackageCheck,
        title: 'Готовность',
        desc: 'Мебель проходит финальную проверку на производстве. Мы связываемся с вами и согласовываем дату доставки.',
    },
    {
        num: '02',
        icon: Truck,
        title: 'Доставка',
        desc: 'Привозим мебель на собственном транспорте. Аккуратно разгружаем и заносим в помещение.',
    },
    {
        num: '03',
        icon: Wrench,
        title: 'Монтаж',
        desc: 'Собираем и устанавливаем мебель. Убираем за собой. Сдаём работу только после вашей проверки.',
    },
];

const PAYMENT_METHODS = [
    {
        icon: CreditCard,
        title: 'Банковская карта',
        desc: 'Оплата картой любого банка при получении или онлайн. Безопасная транзакция с подтверждением.',
    },
    {
        icon: Banknote,
        title: 'Наличные',
        desc: 'Оплата наличными при получении заказа. Выдаём кассовый чек и полный пакет документов.',
    },
    {
        icon: FileText,
        title: 'Рассрочка',
        desc: 'Оформляем рассрочку на срок от 3 до 12 месяцев. Решение — за 15 минут, без первого взноса.',
    },
];

const FAQ_ITEMS = [
    {
        q: 'Как рассчитывается стоимость доставки?',
        a: 'Стоимость зависит от трёх факторов: удалённости адреса, объёма заказа и сложности монтажа. Для Дзержинска при заказе от 50 000 ₽ доставка бесплатная. Для других городов рассчитываем индивидуально — оставьте заявку, и мы посчитаем точную сумму.',
    },
    {
        q: 'Входит ли монтаж в стоимость?',
        a: 'Монтаж входит в стоимость для заказов в Дзержинске и Нижнем Новгороде. Для других регионов обсуждаем условия отдельно. Наши монтажники — штатные сотрудники, работают аккуратно и убирают за собой.',
    },
    {
        q: 'Можно ли доставить в другой город?',
        a: 'Да, мы доставляем мебель по всей России. Работаем с проверенными транспортными компаниями. Для крупных заказов организуем собственный транспорт. Точную стоимость и сроки посчитаем после обсуждения деталей.',
    },
    {
        q: 'Можно ли забрать мебель самостоятельно?',
        a: 'Да, самовывоз с нашего производства в Дзержинске бесплатный. Мы подготовим мебель к указанному времени, поможем с погрузкой и дадим рекомендации по транспортировке.',
    },
    {
        q: 'Сколько времени занимает доставка после готовности?',
        a: 'По Дзержинску — 1–2 рабочих дня, по Нижнему Новгороду — 2–4 дня. В другие города — от 3 до 14 дней в зависимости от удалённости и способа доставки.',
    },
    {
        q: 'Что делать, если мебель повредили при доставке?',
        a: 'Такое случается крайне редко, но если это произошло — мы бесплатно заменим повреждённые детали или изготовим их заново. Все вопросы решаем за свой счёт, без дополнительных согласований.',
    },
];

export const DeliveryPage = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="bg-cream">
            {/* ===== HERO ===== */}
            <section className="container-site pb-16 pt-10 md:pb-20 md:pt-16">
                <Reveal className="mx-auto max-w-3xl text-center">
                    <p className="overline-title">Доставка и оплата</p>
                    <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                        Доставим мебель <br className="hidden sm:block" />
                        от производства <br className="hidden sm:block" />
                        до вашего дома
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
                        Работаем по Дзержинску, Нижнему Новгороду и всей России.
                        Привозим, собираем и устанавливаем — вам остаётся только принять работу.
                    </p>
                </Reveal>
            </section>

            {/* ===== ЗОНЫ ДОСТАВКИ ===== */}
            <section className="container-site pb-20 md:pb-28">
                <Reveal>
                    <p className="overline-title">01 / География</p>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                        Куда доставляем
                    </h2>
                </Reveal>

                <div className="mt-12 grid gap-5 md:grid-cols-3">
                    {DELIVERY_ZONES.map((zone, i) => (
                        <Reveal key={zone.title} delay={i * 0.08}>
                            <div
                                className={`relative h-full rounded-card p-7 transition-shadow hover:shadow-lg md:p-8 ${
                                    zone.highlight
                                        ? 'bg-walnut text-milk shadow-lg'
                                        : 'bg-milk border border-ink/10'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-full ${
                                            zone.highlight ? 'bg-terra' : 'bg-sand'
                                        }`}
                                    >
                                        <MapPin
                                            className={`h-5 w-5 ${
                                                zone.highlight ? 'text-milk' : 'text-walnut'
                                            }`}
                                            strokeWidth={1.75}
                                        />
                                    </div>
                                    <span
                                        className={`text-xs font-semibold uppercase tracking-wider ${
                                            zone.highlight ? 'text-milk/70' : 'text-ink-soft'
                                        }`}
                                    >
                                        {zone.tag}
                                    </span>
                                </div>

                                <h3 className="mt-6 text-2xl font-extrabold tracking-tight md:text-3xl">
                                    {zone.title}
                                </h3>
                                <p
                                    className={`mt-4 leading-relaxed ${
                                        zone.highlight ? 'text-milk/80' : 'text-ink-soft'
                                    }`}
                                >
                                    {zone.desc}
                                </p>

                                {zone.highlight && (
                                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-terra">
                                        <Check className="h-4 w-4" strokeWidth={2.5} />
                                        Бесплатно от 50 000 ₽
                                    </div>
                                )}
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ===== ПРОЦЕСС ===== */}
            <section className="bg-sand/40 py-20 md:py-28">
                <div className="container-site">
                    <Reveal className="max-w-2xl">
                        <p className="overline-title">02 / Процесс</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                            От готовности до монтажа
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                            Три понятных этапа после того, как мебель прошла финальную проверку
                            на производстве.
                        </p>
                    </Reveal>

                    <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
                        {PROCESS_STEPS.map((step, i) => (
                            <Reveal key={step.num} delay={i * 0.1}>
                                <div className="group relative">
                                    <div className="rounded-card bg-milk p-7 transition-shadow hover:shadow-md md:p-8">
                                        <p className="text-6xl font-extrabold leading-none tracking-tighter text-terra md:text-7xl">
                                            {step.num}
                                        </p>
                                        <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-sand transition-colors group-hover:bg-terra">
                                            <step.icon
                                                className="h-5 w-5 text-walnut transition-colors group-hover:text-milk"
                                                strokeWidth={1.75}
                                            />
                                        </div>
                                        <h3 className="mt-5 text-xl font-bold tracking-tight md:text-2xl">
                                            {step.title}
                                        </h3>
                                        <p className="mt-3 leading-relaxed text-ink-soft">
                                            {step.desc}
                                        </p>
                                    </div>
                                    {i < 2 && (
                                        <ArrowRight className="absolute -right-5 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-walnut/30 md:block" strokeWidth={1.75} />
                                    )}
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== СТОИМОСТЬ ===== */}
            <section className="container-site py-20 md:py-28">
                <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
                    <Reveal>
                        <p className="overline-title">03 / Стоимость</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                            Сколько стоит доставка?
                        </h2>
                        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
                            Стоимость рассчитывается индивидуально — зависит от адреса,
                            объёма заказа и сложности монтажа. Фиксируем цену в договоре
                            до начала работ.
                        </p>
                        <ul className="mt-8 space-y-3">
                            {[
                                'Бесплатно по Дзержинску при заказе от 50 000 ₽',
                                'Фиксированная цена в договоре — без сюрпризов',
                                'Включены разгрузка и занос в помещение',
                                'Монтаж входит в стоимость для Дзержинска и Нижнего Новгорода',
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/20">
                                        <Check className="h-3.5 w-3.5 text-success" strokeWidth={2.5} />
                                    </span>
                                    <span className="font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div className="rounded-card bg-walnut p-8 text-milk md:p-12">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-terra">
                                <Calculator className="h-6 w-6 text-milk" strokeWidth={1.75} />
                            </div>
                            <h3 className="mt-6 text-2xl font-extrabold tracking-tight md:text-3xl">
                                Рассчитать стоимость доставки
                            </h3>
                            <p className="mt-4 leading-relaxed text-milk/80">
                                Оставьте заявку — в течение рабочего дня посчитаем точную
                                сумму доставки и монтажа под ваш адрес и заказ.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/contacts"
                                    className="btn-primary flex items-center justify-center gap-2 bg-terra hover:bg-terra-dark"
                                >
                                    Рассчитать заказ <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                                </Link>
                                <a
                                    href="tel:+79200085416"
                                    className="inline-flex items-center justify-center gap-2 rounded-btn border border-milk/30 px-6 py-3 text-sm font-semibold text-milk transition-colors hover:bg-milk/10"
                                >
                                    <Phone className="h-4 w-4" strokeWidth={1.75} />
                                    Позвонить
                                </a>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ===== ОПЛАТА ===== */}
            <section className="bg-milk py-20 md:py-28">
                <div className="container-site">
                    <Reveal className="max-w-2xl">
                        <p className="overline-title">04 / Оплата</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                            Как можно оплатить заказ
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                            Три удобных способа. Выбирайте тот, который подходит именно вам.
                        </p>
                    </Reveal>

                    <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
                        {PAYMENT_METHODS.map((method, i) => (
                            <Reveal key={method.title} delay={i * 0.08}>
                                <div className="h-full rounded-card border border-ink/10 bg-cream p-7 transition-all hover:border-terra/40 hover:shadow-md md:p-8">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terra/10">
                                        <method.icon className="h-5 w-5 text-terra" strokeWidth={1.75} />
                                    </div>
                                    <h3 className="mt-6 text-xl font-bold tracking-tight md:text-2xl">
                                        {method.title}
                                    </h3>
                                    <p className="mt-3 leading-relaxed text-ink-soft">
                                        {method.desc}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section className="container-site py-20 md:py-28">
                <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
                    <Reveal>
                        <p className="overline-title">05 / Вопросы</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                            Частые вопросы
                        </h2>
                        <p className="mt-4 leading-relaxed text-ink-soft">
                            Собрали ответы на самые популярные вопросы о доставке и оплате.
                            Не нашли свой — оставьте заявку, и мы свяжемся с вами.
                        </p>
                        <Link
                            to="/contacts"
                            className="btn-secondary mt-8 inline-flex items-center gap-2"
                        >
                            Задать вопрос <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                        </Link>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div className="divide-y divide-ink/10 rounded-card bg-milk">
                            {FAQ_ITEMS.map((item, i) => {
                                const isOpen = openFaq === i;
                                return (
                                    <div key={i}>
                                        <button
                                            onClick={() => setOpenFaq(isOpen ? null : i)}
                                            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-sand/40 md:px-8"
                                        >
                                            <span className="text-base font-semibold tracking-tight md:text-lg">
                                                {item.q}
                                            </span>
                                            <ChevronDown
                                                className={`h-5 w-5 shrink-0 text-ink-soft transition-transform ${
                                                    isOpen ? 'rotate-180 text-terra' : ''
                                                }`}
                                                strokeWidth={1.75}
                                            />
                                        </button>
                                        <div
                                            className={`overflow-hidden transition-all ${
                                                isOpen ? 'max-h-96' : 'max-h-0'
                                            }`}
                                        >
                                            <p className="px-6 pb-6 leading-relaxed text-ink-soft md:px-8">
                                                {item.a}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ===== ФИНАЛЬНЫЙ CTA ===== */}
            <section className="container-site pb-20 md:pb-28">
                <div className="relative overflow-hidden rounded-card bg-terra px-8 py-16 text-milk md:px-16 md:py-20">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-extrabold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                            Готовы обсудить ваш заказ?
                        </h2>
                        <p className="mt-5 text-lg leading-relaxed text-milk/85">
                            Расскажите, какую мебель хотите — посчитаем стоимость, подберём
                            материалы и спланируем доставку. Первый шаг — самый простой.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/contacts"
                                className="btn-primary flex items-center justify-center gap-2 bg-milk text-terra hover:bg-cream"
                            >
                                Рассчитать мой заказ <ArrowRight className="h-4 w-4" strokeWidth={2} />
                            </Link>
                            <a
                                href="tel:+79200085416"
                                className="btn-secondary flex items-center justify-center gap-2 border-milk/40 text-milk hover:bg-milk/10"
                            >
                                <Phone className="h-4 w-4" strokeWidth={1.75} />
                                +7 (920) 008-54-16
                            </a>
                        </div>
                    </div>

                    {/* декоративные круги в углу */}
                    <svg
                        viewBox="0 0 400 400"
                        className="pointer-events-none absolute -right-16 -top-16 h-[120%] w-[60%] text-milk/10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <circle key={i} cx="300" cy="100" r={40 + i * 40} />
                        ))}
                    </svg>
                </div>
            </section>
        </div>
    );
};
