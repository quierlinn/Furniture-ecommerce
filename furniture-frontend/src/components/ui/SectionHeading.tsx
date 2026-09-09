import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface SectionHeadingProps {
    overline?: string;
    title: string;
    action?: ReactNode;
    className?: string;
}

export const SectionHeading = ({ overline, title, action, className }: SectionHeadingProps) => (
    <div className={cn('mb-8 flex items-end justify-between gap-6 md:mb-10', className)}>
        <div>
            {overline && <p className="overline-title mb-3">{overline}</p>}
            <h2 className="text-2xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
        </div>
        {action && <div className="hidden shrink-0 md:block">{action}</div>}
    </div>
);
