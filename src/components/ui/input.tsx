import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-mono text-white/70">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3
            bg-white/5 border border-white/10
            rounded-lg font-mono text-white
            placeholder:text-white/30
            focus:outline-none focus:border-white/30 focus:bg-white/10
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500/50" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm font-mono text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-mono text-white/70">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3
            bg-white/5 border border-white/10
            rounded-lg font-mono text-white
            placeholder:text-white/30
            focus:outline-none focus:border-white/30 focus:bg-white/10
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            ${error ? "border-red-500/50" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm font-mono text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
