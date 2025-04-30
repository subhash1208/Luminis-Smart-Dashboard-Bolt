import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  clickable?: boolean;
  selected?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    className, 
    clickable = false, 
    selected = false,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden',
          'transition-all duration-200',
          clickable && 'cursor-pointer hover:shadow-md transform hover:-translate-y-1',
          selected && 'ring-2 ring-primary-500 border-primary-500',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;