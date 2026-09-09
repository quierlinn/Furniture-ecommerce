import { Star } from 'lucide-react';
import { cn } from '../../lib/cn';

export const Stars = ({ value, className }: { value: number; className?: string }) => (
    <div className={cn('flex gap-0.5', className)}>
        {[1, 2, 3, 4, 5].map((i) => (
            <Star
                key={i}
                className={cn('h-4 w-4', i <= Math.round(value) ? 'fill-terra text-terra' : 'text-ink/20')}
                strokeWidth={1.5}
            />
        ))}
    </div>
);
