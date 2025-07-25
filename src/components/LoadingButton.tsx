"use client";

import { ButtonHTMLAttributes } from "react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function LoadingButton({ isLoading = false, children, disabled, ...rest }: LoadingButtonProps) {
  return (
    <button
      disabled={isLoading || disabled}
      className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition ${
        isLoading || disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
      }`}
      {...rest}
    >
      {isLoading && (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}