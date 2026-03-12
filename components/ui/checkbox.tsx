"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  error?: string
  onCheckedChange?: (checked: boolean) => void
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, error, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked)
      }
      if (onChange) {
        onChange(e)
      }
    }
    return (
      <div className="relative">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          className={cn(
            "peer h-5 w-5 shrink-0 rounded-md border border-gray-300 bg-white transition-all duration-200",
            "hover:border-orange-400 hover:ring-2 hover:ring-orange-200",
            "focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
            checked && "bg-orange-500 border-orange-500",
            checked && "hover:bg-orange-600 hover:border-orange-600",
            error && "border-red-500 focus:border-red-500 focus:ring-red-200",
            className
          )}
          {...props}
        />
        {checked && (
          <svg
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white"
          >
            <path
              d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
