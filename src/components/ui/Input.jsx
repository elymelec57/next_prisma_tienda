import React from 'react';
import { forwardRef } from 'react';

const Input = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 transition duration-300 ease-in-out ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

const InputWithIcon = forwardRef(({ icon, className, ...props }, ref) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {icon}
      </div>
      <Input
        ref={ref}
        className={`pl-10 ${className}`}
        {...props}
      />
    </div>
  );
});

InputWithIcon.displayName = 'InputWithIcon';


export { Input, InputWithIcon };
