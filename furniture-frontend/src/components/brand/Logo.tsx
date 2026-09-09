import { cn } from '../../lib/cn';

interface LogoProps {
    className?: string;
    tone?: 'walnut' | 'milk';
    size?: 'sm' | 'md' | 'lg';
    tagline?: boolean;
}

const sizes = {
    sm: { mark: 'px-1.5 py-1 text-[10px]', divider: 'h-7', word: 'text-lg', tag: 'text-[6px] tracking-[0.22em]' },
    md: { mark: 'px-2 py-1.5 text-[13px]', divider: 'h-10', word: 'text-2xl', tag: 'text-[7px] tracking-[0.22em]' },
    lg: { mark: 'px-2.5 py-2 text-[15px]', divider: 'h-12', word: 'text-4xl', tag: 'text-[7px] tracking-[0.22em]' },
};

export const Logo = ({ className, tone = 'walnut', size = 'md', tagline = false }: LogoProps) => {
    const s = sizes[size];
    const box = tone === 'walnut' ? 'bg-walnut text-milk' : 'bg-milk text-walnut';
    const word = tone === 'walnut' ? 'text-walnut' : 'text-milk';
    const dim = tone === 'walnut' ? 'text-walnut/70' : 'text-milk/60';
    const divider = tone === 'walnut' ? 'bg-walnut/50' : 'bg-milk/40';

    return (
        <span className={cn('inline-flex select-none items-center gap-2.5 md:gap-3', className)}>
      {/* Знак: стек R / if / F в плашке */}
            <span className={cn('flex flex-col items-center font-extrabold leading-[0.85] tracking-[-0.05em]', box, s.mark)}>
        <span>R</span>
        <span>if</span>
        <span>F</span>
      </span>

            {/* Разделитель */}
            <span className={cn('w-px shrink-0', divider, s.divider)} aria-hidden />

            {/* Wordmark + теглайн */}
            <span className="flex flex-col">
        <span className={cn('font-extrabold leading-none tracking-[0.1em]', word, s.word)}>
          RIFF
        </span>
                {tagline && (
                    <span className={cn('mt-1.5 font-bold uppercase', dim, s.tag)}>
            Мебельное производство
          </span>
                )}
      </span>
    </span>
    );
};
