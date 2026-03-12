import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, error, ...props }: React.ComponentProps<"input"> & { error?: string }) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 outline-none placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60",
        error && "border-red-500 focus:border-red-500 focus:ring-red-200",
        className
      )}
      {...props}
    />
  )
}

export { Input }
