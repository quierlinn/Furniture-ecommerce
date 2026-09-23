import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Layers,
    ShieldCheck,
    Sparkles,
    Droplet,
    Check,
    Phone,
} from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';
import {
    ABOUT_WORKSHOP,
    ABOUT_HERO,
    ABOUT_CUSTOM,
    ABOUT_PROCESS,
    ABOUT_CATEGORIES,
    ABOUT_CUSTOM_SMALL,
} from '../utils/placeholders';

const PROCESS_STEPS = [
    { num: '01', title: 'Раскрой', desc: 'Точный раскрой материалов на современном оборудовании.' },
    { num: '02', title: 'Обработка', desc: 'Кромка, фрезеровка, подготовка деталей к сборке.' },
    { num: '03', title: 'Покраска', desc: 'Собственный покрасочный цех с контролем качества.' },
    { num: '04', title: 'Сборка', desc: 'Предварительная сборка и проверка всех механизмов.' },
    { num: '05', title: 'Монтаж', desc: 'Доставка и установка мебели на вашем объекте.' },
];

const WORK_STEPS = [
    { num: '01', title: 'Заявка', text: 'Расскажите, какую мебель хотите получить.' },
    { num: '02', title: 'Обсуждение', text: 'Уточняем размеры, материалы и пожелания.' },
    { num: '03', title: 'Проект', text: 'Подбираем конструктивное и визуальное решение.' },
    { num: '04', title: 'Производство', text: 'Изготавливаем мебель на собственном производстве.' },
    { num: '05', title: 'Доставка и монтаж', text: 'Доставляем готовое изделие и устанавливаем его.' },
];

const ADVANTAGES = [
    {
        icon: Layers,
        title: 'Гибкость',
        desc: 'Можно адаптировать конструкцию под конкретное помещение — без оглядки на складские стандарты.',
    },
    {
        icon: ShieldCheck,
        title: 'Контроль',
        desc: 'Контролируем основные этапы изготовления — от выбора материала до финальной сборки.',
    },
    {
        icon: Sparkles,
        title: 'Нестандартные задачи',
        desc: 'Работаем не только с типовыми решениями — проектируем под конкретный объект.',
    },
    {
        icon: Droplet,
        title: 'Собственная покраска',
        desc: 'Отдельный покрасочный цех — точные цвета, стойкое покрытие, никаких задержек от подрядчиков.',
    },
];

export const AboutPage = () => {
    return (
        <div className="bg-cream">
            {/* ===== 1. HERO ===== */}
            <section className="container-site grid items-center gap-10 pb-20 pt-10 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
                <Reveal>
                    <p className="overline-title">О компании</p>
                    <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                        Мебель, которую мы делаем сами
                    </h1>
                    <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft md:text-lg">
                        Собственное производство в Дзержинске. Кухни, корпусная мебель,
                        лестницы и индивидуальные проекты — без посредников и переплат.
                    </p>
                    <div className="mt-9 flex flex-wrap gap-3">
                        <Link to="/contacts" className="btn-primary !px-8 !py-3.5">
                            Обсудить проект <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                        </Link>
                        <Link to="/catalog" className="btn-secondary !px-8 !py-3.5">
                            Смотреть каталог
                        </Link>
                    </div>
                </Reveal>

                <Reveal delay={0.15} className="relative">
                    <div className="absolute -right-4 -top-4 hidden h-full w-full rounded-img bg-sand md:block" aria-hidden />
                    <img
                        src={ABOUT_HERO}
                        alt="Производство мебели Riff"
                        className="relative aspect-[4/5] w-full object-cover md:aspect-[5/6]"
                    />
                </Reveal>
            </section>

            {/* ===== 2. СОБСТВЕННОЕ ПРОИЗВОДСТВО ===== */}
            <section className="container-site pb-20 md:pb-28">
                <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                    <Reveal>
                        <img
                            src={ABOUT_WORKSHOP}
                            alt="Наше производство"
                            className="aspect-[4/3] w-full rounded-img object-cover"
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <p className="overline-title">01 / Производство</p>
                        <h2 className="mt-3 text-3xl font-extrabold leading-[1.1] tracking-tight md:text-4xl lg:text-5xl">
                            Мы не просто продаём мебель — мы изготавливаем её сами
                        </h2>
                        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
                            Работаем с мебелью с 2012 года. Все основные этапы производства
                            выполняем самостоятельно — от первого реза до финальной установки
                            на объекте.
                        </p>

                        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                            {[
                                'Собственное производство',
                                'Собственная покраска',
                                'Изготовление под заказ',
                                'Монтаж на объекте',
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
                </div>
            </section>

            {/* ===== 3. НАША ИСТОРИЯ ===== */}
            <section className="bg-sand/40 py-20 md:py-28">
                <div className="container-site">
                    <Reveal className="mx-auto max-w-3xl text-center">
                        <p className="overline-title">02 / История</p>
                        <p className="mt-4 text-5xl font-extrabold tracking-tighter text-walnut md:text-7xl">
                            с 2012 года
                        </p>
                        <h2 className="mt-6 text-2xl font-extrabold tracking-tight md:text-3xl">
                            От решения работать на себя до собственного производства
                        </h2>
                    </Reveal>

                    {/* Таймлайн */}
                    <Reveal delay={0.1} className="mx-auto mt-14 max-w-2xl">
                        <div className="relative">
                            {/* горизонтальная линия */}
                            <div className="absolute left-0 right-0 top-4 h-0.5 bg-walnut/20" />
                            <div className="relative flex items-start justify-between">
                                {[
                                    { year: '2012', label: 'Основание компании' },
                                    { year: 'Сегодня', label: 'Производство полного цикла' },
                                ].map((point) => (
                                    <div key={point.year} className="flex flex-col items-center">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terra text-sm font-bold text-milk">
                                            ●
                                        </div>
                                        <p className="mt-3 text-2xl font-extrabold tracking-tight">{point.year}</p>
                                        <p className="mt-1 max-w-[140px] text-center text-sm text-ink-soft">
                                            {point.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={0.15} className="mx-auto mt-14 max-w-3xl">
                        <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
                            <p>
                                В 2012 году основатель компании решил отказаться от работы на
                                кого-то и начать собственное производство. Так появился РИФФ —
                                небольшое предприятие с большими планами.
                            </p>
                            <p>
                                С этого момента компания развивалась постепенно: расширялись
                                возможности, появлялось новое оборудование, рос ассортимент
                                изделий и команда мастеров.
                            </p>
                            <p>
                                Сегодня мы продолжаем развивать производство и расширять
                                возможности для индивидуальных проектов — от простых решений
                                до сложных конструктивных задач.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ===== 4. ПОЛНЫЙ ЦИКЛ ПРОИЗВОДСТВА ===== */}
            <section className="container-site py-20 md:py-28">
                <Reveal className="max-w-2xl">
                    <p className="overline-title">03 / Процесс</p>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                        Полный цикл производства
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                        Большинство этапов выполняем самостоятельно. От листа материала до
                        готовой мебели в вашем доме.
                    </p>
                </Reveal>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {PROCESS_STEPS.map((step, i) => (
                        <Reveal key={step.num} delay={i * 0.08}>
                            <div className="group relative overflow-hidden rounded-card bg-milk p-6 transition-shadow hover:shadow-lg">
                                <p className="text-5xl font-extrabold leading-none tracking-tighter text-terra md:text-6xl">
                                    {step.num}
                                </p>
                                <h3 className="mt-4 text-lg font-bold tracking-tight">{step.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.desc}</p>
                                <div className="mt-5 aspect-[4/3] overflow-hidden rounded-btn bg-sand">
                                    <img
                                        src={ABOUT_PROCESS[i]}
                                        alt={step.title}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                    />
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ===== 5. ЧТО МЫ ДЕЛАЕМ ===== */}
            <section className="bg-milk py-20 md:py-28">
                <div className="container-site">
                    <Reveal className="max-w-2xl">
                        <p className="overline-title">04 / Ассортимент</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                            Не ограничиваемся каталогом
                        </h2>
                    </Reveal>

                    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {ABOUT_CATEGORIES.map((cat, i) => (
                            <Reveal key={cat.name} delay={i * 0.06}>
                                <Link
                                    to="/catalog"
                                    className="group relative block aspect-[4/3] overflow-hidden rounded-img bg-sand"
                                >
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/0" />
                                    <span className="absolute bottom-5 left-5 text-xl font-extrabold tracking-tight text-milk md:text-2xl">
                                        {cat.name}
                                    </span>
                                </Link>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal delay={0.3} className="mt-14 rounded-card border border-terra/20 bg-sand/30 px-8 py-10 text-center md:px-14">
                        <p className="text-lg font-semibold text-ink md:text-xl">
                            Если нужного решения нет в каталоге —
                            <br className="hidden sm:block" />
                            <span className="text-terra"> его можно сделать под вас.</span>
                        </p>
                        <Link
                            to="/contacts"
                            className="btn-primary mt-6 inline-flex items-center gap-2"
                        >
                            Обсудить индивидуальное решение
                            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                        </Link>
                    </Reveal>
                </div>
            </section>

            {/* ===== 6. ИНДИВИДУАЛЬНЫЕ ПРОЕКТЫ ===== */}
            <section className="container-site py-20 md:py-28">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
                    <Reveal>
                        <div className="overflow-hidden rounded-img">
                            <img
                                src={ABOUT_CUSTOM}
                                alt="Индивидуальный проект"
                                className="aspect-[4/3] w-full object-cover md:aspect-[5/6]"
                            />
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <p className="overline-title">05 / Индивидуальные проекты</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                            Можем сделать сложнее
                        </h2>
                        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
                            Не каждый проект можно решить готовым набором из каталога.
                            Нестандартные размеры, сложная конструкция, особенности помещения
                            или необычная задача — проектируем решение под конкретный объект.
                        </p>

                        <div className="mt-8 grid gap-3">
                            {ABOUT_CUSTOM_SMALL.map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-center gap-4 rounded-btn bg-milk p-3"
                                >
                                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-btn bg-sand">
                                        <img src={item.img} alt="" loading="lazy" className="h-full w-full object-cover" />
                                    </div>
                                    <p className="font-semibold tracking-tight">{item.title}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ===== 7. ПОЧЕМУ СОБСТВЕННОЕ ПРОИЗВОДСТВО ===== */}
            <section className="bg-walnut py-20 text-milk md:py-28">
                <div className="container-site">
                    <Reveal className="max-w-3xl">
                        <p className="overline-title text-milk/60">06 / Преимущества</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                            Собственное производство даёт свободу в работе с каждым проектом
                        </h2>
                    </Reveal>

                    <div className="mt-12 grid gap-5 sm:grid-cols-2">
                        {ADVANTAGES.map((adv, i) => (
                            <Reveal key={adv.title} delay={i * 0.08}>
                                <div className="group rounded-card bg-milk/5 p-7 transition-colors hover:bg-milk/10 md:p-8">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terra">
                                        <adv.icon className="h-5 w-5 text-milk" strokeWidth={1.75} />
                                    </div>
                                    <h3 className="mt-5 text-xl font-bold tracking-tight">{adv.title}</h3>
                                    <p className="mt-3 leading-relaxed text-milk/75">{adv.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== 8. КАК МЫ РАБОТАЕМ ===== */}
            <section className="container-site py-20 md:py-28">
                <Reveal className="max-w-2xl">
                    <p className="overline-title">07 / Процесс работы</p>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                        От идеи до монтажа
                    </h2>
                </Reveal>

                <div className="mt-14 space-y-4">
                    {WORK_STEPS.map((step, i) => (
                        <Reveal key={step.num} delay={i * 0.06}>
                            <div className="group flex items-start gap-6 rounded-card border border-ink/10 bg-milk p-6 transition-all hover:border-terra/40 hover:shadow-md md:gap-8 md:p-8">
                                <p className="text-5xl font-extrabold leading-none tracking-tighter text-terra md:text-6xl">
                                    {step.num}
                                </p>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold tracking-tight md:text-2xl">{step.title}</h3>
                                    <p className="mt-2 leading-relaxed text-ink-soft">{step.text}</p>
                                </div>
                                <ArrowRight className="hidden h-6 w-6 shrink-0 text-ink/20 transition-colors group-hover:text-terra md:block" strokeWidth={1.75} />
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ===== 9. ПОЧЕМУ «РИФФ» ===== */}
            <section className="bg-sand/40 py-20 md:py-28">
                <div className="container-site grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
                    <Reveal className="relative flex aspect-square items-center justify-center overflow-hidden rounded-img bg-walnut text-milk">
                        <div className="pointer-events-none absolute -right-6 -top-10 text-[22rem] font-extrabold leading-none tracking-tighter text-milk/10 md:text-[28rem]">
                            R
                        </div>
                        <div className="relative z-10 flex flex-col items-center gap-3">
                            <svg viewBox="0 0 100 50" className="h-20 w-40 text-terra" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                <path d="M 10 40 Q 30 10, 50 25 T 90 15" />
                                <path d="M 10 45 Q 30 15, 50 30 T 90 20" opacity="0.5" />
                            </svg>
                            <p className="text-3xl font-extrabold tracking-tight md:text-4xl">Riff</p>
                            <p className="text-sm uppercase tracking-[0.2em] text-milk/60">est. 2012</p>
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <p className="overline-title">08 / Название</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                            Почему «Рифф»?
                        </h2>
                        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
                            <p>
                                Название РИФФ — отсылка к морскому рифу. Это то, что
                                формирует ландшафт, создаёт характер и остаётся надолго.
                            </p>
                            <p>
                                Основатель компании — профессиональный рыбак, поэтому море
                                стало частью истории названия. Мебель, которую мы делаем,
                                должна быть такой же основательной и устойчивой, как
                                настоящий морской риф.
                            </p>
                            <p className="font-semibold text-ink">
                                Отсюда наш подход: делать на совесть, без спешки и компромиссов.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ===== 10. ФИНАЛЬНЫЙ CTA ===== */}
            <section className="container-site pb-20 pt-10 md:pb-28">
                <div className="relative overflow-hidden rounded-card bg-terra px-8 py-16 text-milk md:px-16 md:py-24">
                    <div className="relative z-10 max-w-2xl">
                        <p className="overline-title text-milk/70">09 / Следующий шаг</p>
                        <h2 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                            Есть идея для мебели?
                        </h2>
                        <p className="mt-5 text-lg leading-relaxed text-milk/85">
                            Расскажите нам о своей задаче. Не обязательно иметь готовый
                            проект — достаточно фотографии, эскиза или описания того, что
                            вы хотите.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/contacts"
                                className="btn-primary flex items-center justify-center gap-2 bg-milk text-terra hover:bg-cream"
                            >
                                Обсудить проект <ArrowRight className="h-4 w-4" strokeWidth={2} />
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

                    {/* декоративные «волны» в углу */}
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
