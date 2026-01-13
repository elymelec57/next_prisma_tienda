import React from 'react';

const Label = ({ children, className, ...props }) => (
  <label
    className={`block mb-2 text-sm font-medium text-gray-900 dark:text-white ${className}`}
    {...props}
  >
    {children}
  </label>
);

export { Label };
