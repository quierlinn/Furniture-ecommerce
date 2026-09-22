import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    ArrowLeft,
    ArrowRight,
    Palette,
    Ruler,
    Layers,
    Package,
    Wrench,
    Phone,
    Check,
} from 'lucide-react';
import { api } from '../api/client';
import type { Product } from '../types';
import { formatPriceFrom } from '../utils/format';
import { cn } from '../lib/cn';

export const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const [activeImg, setActiveImg] = useState(0);

    const { data: product, isLoading, isError } = useQuery<Product>({
        queryKey: ['product', id],
        queryFn: () => api.getProduct(Number(id)),
        enabled: !!id,
    });

    const { data: similar = [] } = useQuery<Product[]>({
        queryKey: ['similar', product?.categoryId],
        queryFn: () => api.getProductsByCategory(product!.categoryId),
        enabled: !!product?.categoryId,
    });

    if (isLoading) return <div className="py-20 text-center text-ink-soft">Загрузка...</div>;
    if (isError || !product) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-2xl font-extrabold">Товар не найден</h1>
                <Link to="/catalog" className="btn-secondary mt-6 inline-flex">← В каталог</Link>
            </div>
        );
    }

    const images = product.images?.length ? product.images : [];
    const similarFiltered = similar.filter((p) => p.id !== product.id).slice(0, 3);

    return (
        <div className="bg-cream">
            {/* ===== HERO ===== */}
            <section className="container-site pt-10 md:pt-16">
                <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-walnut"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> В каталог
                </Link>

                <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
                    {/* Главное фото */}
                    <div>
                        {images.length > 0 ? (
                            <div className="overflow-hidden rounded-img bg-sand shadow-lg">
                                <img
                                    src={images[activeImg] ?? images[0]}
                                    alt={product.name}
                                    className="aspect-[4/3] w-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex aspect-[4/3] items-center justify-center rounded-img bg-sand text-sm text-ink-soft">
                                Изображение скоро появится
                            </div>
                        )}

                        {/* Галерея */}
                        {images.length > 1 && (
                            <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-5">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImg(i)}
                                        className={cn(
                                            'aspect-square overflow-hidden rounded-btn border-2 transition-all',
                                            i === activeImg
                                                ? 'border-walnut ring-2 ring-walnut/20'
                                                : 'border-transparent opacity-70 hover:opacity-100'
                                        )}
                                    >
                                        <img src={img} alt="" className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Инфо */}
                    <div className="flex flex-col">
                        <p className="overline-title">{product.category?.name ?? 'Проект'}</p>
                        <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-5xl lg:text-6xl">
                            {product.name}
                        </h1>

                        <div className="mt-6 rounded-card bg-sand/60 px-6 py-5">
                            <p className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                                Стартовая цена
                            </p>
                            <p className="mt-2 text-4xl font-extrabold tracking-tight text-walnut md:text-5xl">
                                {formatPriceFrom(product.price)}
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                                Точную стоимость под ваши размеры, материалы и комплектацию посчитаем
                                после замера. Цена зависит от выбранных фасадов, фурнитуры и техники.
                            </p>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/contacts"
                                className="btn-primary flex items-center justify-center gap-2"
                            >
                                Рассчитать стоимость <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                            </Link>
                            <Link to="/contacts" className="btn-secondary flex items-center justify-center gap-2">
                                <Phone className="h-4 w-4" strokeWidth={1.75} /> Задать вопрос
                            </Link>
                        </div>

                        <ul className="mt-8 space-y-3 text-sm text-ink-soft">
                            {[
                                'Бесплатный замер в пределах города',
                                'Гарантия на материалы и сборку — 2 года',
                                'Производство от 14 рабочих дней',
                            ].map((text) => (
                                <li key={text} className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20">
                                        <Check className="h-3 w-3 text-success" strokeWidth={2.5} />
                                    </span>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ===== О ПРОЕКТЕ (Markdown) ===== */}
            {product.description && (
                <section className="container-site mt-20 md:mt-28">
                    <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
                        <div>
                            <p className="overline-title">01 / О проекте</p>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                                История этой кухни
                            </h2>
                        </div>

                        <div className="prose prose-ink max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: (props) => <h1 className="text-4xl font-extrabold tracking-tight" {...props} />,
                                    h2: (props) => <h2 className="mt-12 text-3xl font-extrabold tracking-tight" {...props} />,
                                    h3: (props) => <h3 className="mt-8 text-2xl font-bold" {...props} />,
                                    p: (props) => <p className="mt-4 text-lg leading-relaxed text-ink-soft" {...props} />,
                                    ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-soft" {...props} />,
                                    ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-ink-soft" {...props} />,
                                    strong: (props) => <strong className="font-bold text-ink" {...props} />,
                                    a: (props) => (
                                        <a className="font-semibold text-terra hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                                    ),
                                    blockquote: (props) => (
                                        <blockquote className="my-8 border-l-4 border-terra pl-6 text-lg italic text-ink" {...props} />
                                    ),
                                    hr: () => <hr className="my-10 border-ink/10" />,
                                }}
                            >
                                {product.description}
                            </ReactMarkdown>
                        </div>
                    </div>
                </section>
            )}

            {/* ===== ОСОБЕННОСТИ ===== */}
            <section className="container-site mt-20 md:mt-28">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="overline-title">02 / Детали</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                            Что внутри проекта
                        </h2>
                    </div>
                    <p className="max-w-md text-ink-soft">
                        Каждая деталь продумана: от выбора фасадов до последней петли. Всё, из чего
                        состоит эта кухня.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            icon: Layers,
                            title: 'Фасады',
                            desc: 'Массив или МДФ с эмалевым покрытием. Классическая филенка или гладкий минимализм — под ваш интерьер.',
                        },
                        {
                            icon: Palette,
                            title: 'Фартук',
                            desc: 'Керамогранит, натуральный камень или закалённое стекло. Защищает стены и задаёт характер кухне.',
                        },
                        {
                            icon: Wrench,
                            title: 'Фурнитура',
                            desc: 'Blum, Hettich, GTV — механизмы с доводчиками и плавным закрыванием. Надёжность на десятилетия.',
                        },
                        {
                            icon: Package,
                            title: 'Техника',
                            desc: 'Встраиваемая или отдельностоящая. Подберём под ваши привычки готовки и бюджет.',
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="group rounded-card border border-ink/10 bg-milk p-6 transition-all hover:border-walnut/40 hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand transition-colors group-hover:bg-terra group-hover:text-milk">
                                <item.icon className="h-5 w-5" strokeWidth={1.75} />
                            </div>
                            <h3 className="mt-5 text-lg font-bold tracking-tight">{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== ХАРАКТЕРИСТИКИ ===== */}
            <section className="mt-20 bg-sand/40 py-16 md:mt-28 md:py-24">
                <div className="container-site">
                    <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
                        <div>
                            <p className="overline-title">03 / Спецификация</p>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                                Характеристики
                            </h2>
                            <p className="mt-4 text-sm text-ink-soft">
                                Базовая комплектация проекта. Любой параметр можно изменить под
                                ваши требования.
                            </p>
                        </div>

                        <dl className="divide-y divide-ink/10 rounded-card bg-milk px-6">
                            {[
                                ['Стиль', 'Современная классика'],
                                ['Фасады', 'МДФ, эмаль / массив'],
                                ['Цвет', 'По палитре RAL и NCS'],
                                ['Столешница', 'Искусственный камень, кварц, массив'],
                                ['Фурнитура', 'Blum / Hettich'],
                                ['Комплектация', 'Полная сборка с монтажом'],
                                ['Срок производства', 'от 14 рабочих дней'],
                                ['Гарантия', '2 года'],
                            ].map(([label, value]) => (
                                <div key={label} className="flex items-baseline justify-between gap-4 py-4">
                                    <dt className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                                        {label}
                                    </dt>
                                    <dd className="text-right font-medium text-ink">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            {/* ===== АДАПТИРУЕМ ПОД ВАС ===== */}
            <section className="container-site mt-20 md:mt-28">
                <div className="rounded-card bg-walnut px-8 py-12 text-milk md:px-14 md:py-16">
                    <div className="max-w-3xl">
                        <p className="overline-title text-milk/70">04 / Индивидуальность</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                            Адаптируем проект под вас
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-milk/80">
                            Ни одна кухня не повторяет другую. Мы меняем размеры, материалы и
                            компоновку, чтобы проект идеально вписался именно в ваше пространство.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                        {[
                            { icon: Ruler, label: 'Размеры' },
                            { icon: Layers, label: 'Планировка' },
                            { icon: Palette, label: 'Цвет' },
                            { icon: Package, label: 'Материалы' },
                            { icon: Wrench, label: 'Комплектация' },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-3 rounded-btn bg-milk/10 px-4 py-3"
                            >
                                <item.icon className="h-5 w-5 shrink-0 text-terra" strokeWidth={1.75} />
                                <span className="font-semibold">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to="/contacts"
                            className="btn-primary flex items-center justify-center gap-2 bg-terra hover:bg-terra-dark"
                        >
                            Обсудить свой проект <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== СТОИМОСТЬ ===== */}
            <section className="container-site mt-20 md:mt-28">
                <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <p className="overline-title">05 / Стоимость</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                            Прозрачная цена без скрытых доплат
                        </h2>
                        <p className="mt-4 leading-relaxed text-ink-soft">
                            Стоимость кухни складывается из пяти понятных частей: корпусов, фасадов,
                            столешницы, фурнитуры и техники. Мы показываем смету до рубля — вы
                            видите, за что платите.
                        </p>
                    </div>

                    <div className="rounded-card bg-milk p-8 shadow-lg md:p-10">
                        <p className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                            Цена под ключ
                        </p>
                        <p className="mt-3 text-5xl font-extrabold tracking-tight text-walnut md:text-6xl">
                            {formatPriceFrom(product.price)}
                        </p>

                        <ul className="mt-8 space-y-3">
                            {[
                                'Корпуса из ЛДСП Egger / Kronospan',
                                'Фасады в выбранном материале',
                                'Столешница в базовой комплектации',
                                'Фурнитура с доводчиками',
                                'Доставка и монтаж в пределах города',
                            ].map((text) => (
                                <li key={text} className="flex items-start gap-3 text-sm text-ink-soft">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20">
                                        <Check className="h-3 w-3 text-success" strokeWidth={2.5} />
                                    </span>
                                    {text}
                                </li>
                            ))}
                        </ul>

                        <Link
                            to="/contacts"
                            className="btn-primary mt-8 flex w-full items-center justify-center gap-2"
                        >
                            Получить точную смету <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== ПРОЦЕСС ЗАКАЗА ===== */}
            <section className="mt-20 bg-ink py-16 text-milk md:mt-28 md:py-24">
                <div className="container-site">
                    <div className="max-w-3xl">
                        <p className="overline-title text-milk/60">06 / Как мы работаем</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                            От идеи до готовой кухни
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-milk/70">
                            Четыре понятных шага. На каждом этапе вы видите, что происходит, и
                            контролируете процесс.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                num: '01',
                                title: 'Консультация',
                                desc: 'Обсуждаем ваши пожелания, показываем примеры, отвечаем на вопросы.',
                            },
                            {
                                num: '02',
                                title: 'Замер и проект',
                                desc: 'Бесплатный замер, 3D-визуализация и детальная смета в течение 3 дней.',
                            },
                            {
                                num: '03',
                                title: 'Производство',
                                desc: 'Изготавливаем кухню в собственном цехе. Срок — от 14 рабочих дней.',
                            },
                            {
                                num: '04',
                                title: 'Доставка и монтаж',
                                desc: 'Привозим и собираем за 1 день. Сдаём кухню в идеальном состоянии.',
                            },
                        ].map((step, i) => (
                            <div key={step.num} className="relative">
                                <p className="text-7xl font-extrabold leading-none tracking-tighter text-terra md:text-8xl">
                                    {step.num}
                                </p>
                                <h3 className="mt-4 text-xl font-bold tracking-tight">{step.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-milk/70">{step.desc}</p>
                                {i < 3 && (
                                    <ArrowRight className="absolute right-0 top-8 hidden h-6 w-6 text-milk/20 lg:block" strokeWidth={1.75} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== ПОХОЖИЕ ===== */}
            {similarFiltered.length > 0 && (
                <section className="container-site mt-20 md:mt-28">
                    <div>
                        <p className="overline-title">07 / Вдохновение</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                            Похожие проекты
                        </h2>
                    </div>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {similarFiltered.map((p) => (
                            <Link
                                key={p.id}
                                to={`/product/${p.id}`}
                                className="group block"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            >
                                <div className="aspect-[4/3] overflow-hidden rounded-img bg-sand">
                                    <img
                                        src={p.images?.[0] || 'https://placehold.co/400x300?text=No+Image'}
                                        alt={p.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    />
                                </div>
                                <h3 className="mt-4 text-lg font-bold tracking-tight transition-colors group-hover:text-walnut">
                                    {p.name}
                                </h3>
                                <p className="mt-1 text-sm font-semibold text-ink-soft">
                                    {p.category?.name} · {formatPriceFrom(p.price)}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ===== ФИНАЛЬНЫЙ CTA ===== */}
            <section className="mt-20 md:mt-28">
                <div className="container-site">
                    <div className="relative overflow-hidden rounded-card bg-terra px-8 py-16 text-milk md:px-16 md:py-20">
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                                Хотите такую кухню у себя дома?
                            </h2>
                            <p className="mt-5 text-lg leading-relaxed text-milk/85">
                                Оставьте заявку&nbsp;&mdash; обсудим детали, покажем похожие проекты и&nbsp;бесплатно рассчитаем стоимость под ваши размеры.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/contacts"
                                    className="btn-primary flex items-center justify-center gap-2 bg-milk text-terra hover:bg-cream"
                                >
                                    Оставить заявку <ArrowRight className="h-4 w-4" strokeWidth={2} />
                                </Link>
                                <Link
                                    to="/contacts"
                                    className="btn-secondary flex items-center justify-center gap-2 border-milk/40 text-milk hover:bg-milk/10"
                                >
                                    <Phone className="h-4 w-4" strokeWidth={1.75} /> +7 (920) 123-45-67
                                </Link>
                            </div>
                        </div>

                        {/* декоративный большой номер */}
                        <div className="pointer-events-none absolute -right-8 -top-12 text-[20rem] font-extrabold leading-none tracking-tighter text-milk/10 md:text-[28rem]">
                            R
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-20" />
        </div>
    );
};
