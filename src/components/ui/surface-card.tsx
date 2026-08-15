import type { HTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/utils';

type SurfaceCardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
  media?: boolean;
  ref?: Ref<HTMLDivElement>;
};

/**
 * Shared marketing surface — same look as existing white cards
 * (rounded-2xl, hairline border, lift shadow). Use hover for lift-on-hover tiles.
 */
export const SurfaceCard = ({
  hover = false,
  media = false,
  className,
  children,
  ref,
  ...props
}: SurfaceCardProps) => {
  return (
    <div
      ref={ref}
      className={cn(
        media
          ? 'relative overflow-hidden rounded-2xl border border-[rgba(10,37,68,0.08)] shadow-[0_12px_40px_rgba(10,37,68,0.1)]'
          : 'rounded-2xl border border-[rgba(10,37,68,0.08)] bg-white shadow-[var(--shadow-lift)]',
        hover &&
          'group transition-all duration-300 hover:border-brand-200 hover:shadow-[0_12px_36px_rgba(10,37,68,0.08)] hover:-translate-y-1',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
