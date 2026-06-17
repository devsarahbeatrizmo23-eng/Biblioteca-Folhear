import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, id, className = '', ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        {...props}
        className={`
          w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-800
          placeholder:text-gray-400
          border-gray-200 hover:border-[#88C7DB]
          focus:outline-none focus:ring-2 focus:ring-[#88C7DB] focus:border-[#88C7DB]
          transition-all duration-200 resize-none
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error ? 'border-red-400 focus:ring-red-300' : ''}
          ${className}
        `.trim()}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
