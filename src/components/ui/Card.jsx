import React from 'react';

const Card = ({ children, className }) => (
  <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`text-center mb-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h1 className={`text-4xl font-extrabold text-gray-800 dark:text-white mb-2 font-serif ${className}`}>
    {children}
  </h1>
);

const CardDescription = ({ children, className }) => (
  <p className={`text-gray-600 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);

const CardFooter = ({ children, className }) => (
  <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mt-6 ${className}`}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
