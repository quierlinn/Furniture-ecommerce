import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className, 
  maxWidth = '2xl' 
}) => {
  const maxWidthClass = `max-w-${maxWidth}`;
  
  return (
    <div className={cn(`container-wide mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxWidthClass}`, className)}>
      {children}
    </div>
  );
};

export default Container;
