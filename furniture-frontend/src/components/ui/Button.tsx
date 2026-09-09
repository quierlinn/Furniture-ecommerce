import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

const variants = {
    primary: 'bg-walnut text-milk hover:bg-walnut-dark',
    secondary: 'border border-ink/15 bg-milk text-ink hover:border-walnut/40 hover:text-walnut',
    ghost: 'text-ink-soft hover:bg-ink/5 hover:text-ink',
};

const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-3.5 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading, children, className, disabled, ...props }, ref) => (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-colors duration-200',
                'disabled:pointer-events-none disabled:opacity-50',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
        </button>
    )
);
Button.displayName = 'Button';
