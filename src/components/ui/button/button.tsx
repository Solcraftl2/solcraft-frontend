import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import cn from '@/utils/cn';

const colors = {
  primary: 'bg-brand hover:bg-brand-dark text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  info: 'bg-blue-500 hover:bg-blue-600 text-white',
  gray: 'bg-gray-500 hover:bg-gray-600 text-white',
  white: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300',
};

const sizes = {
  mini: 'px-2 py-1 text-xs',
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-4 py-2 text-sm',
  large: 'px-6 py-3 text-base',
};

const shapes = {
  rounded: 'rounded-md',
  pill: 'rounded-full',
  circle: 'rounded-full w-10 h-10 p-0',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: keyof typeof colors;
  size?: keyof typeof sizes;
  shape?: keyof typeof shapes;
  variant?: 'solid' | 'outline' | 'ghost';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      color = 'primary',
      size = 'medium',
      shape = 'rounded',
      variant = 'solid',
      isLoading = false,
      fullWidth = false,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    let [dripShow, setDripShow] = useState<boolean>(false);
    let [dripX, setDripX] = useState<number>(0);
    let [dripY, setDripY] = useState<number>(0);
    const colorClassNames = colors[color];
    const sizeClassNames = sizes[size];
    const shapeClassNames = shapes[shape];
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    useImperativeHandle(ref, () => buttonRef.current!);
    
    function dripCompletedHandle() {
      setDripShow(false);
      setDripX(0);
      setDripY(0);
    }

    function clickHandler(event: React.MouseEvent<HTMLButtonElement>) {
      const targetRect = event.currentTarget.getBoundingClientRect();
      const dripX = event.clientX - targetRect.left;
      const dripY = event.clientY - targetRect.top;
      setDripX(dripX);
      setDripY(dripY);
      setDripShow(true);
      onClick && onClick(event);
    }

    const baseClasses = cn(
      'relative inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden',
      colorClassNames,
      sizeClassNames,
      shapeClassNames,
      {
        'w-full': fullWidth,
        'cursor-not-allowed opacity-50': disabled || isLoading,
      },
      className
    );

    return (
      <button
        ref={buttonRef}
        className={baseClasses}
        disabled={disabled || isLoading}
        onClick={clickHandler}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
        {dripShow && (
          <span
            className="absolute animate-ping rounded-full bg-white bg-opacity-30"
            style={{
              left: dripX,
              top: dripY,
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)',
            }}
            onAnimationEnd={dripCompletedHandle}
          />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
