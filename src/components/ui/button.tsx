import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/** DESIGN.md pill CTAs — brand blue kept; radius-pill + 10×15 padding */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[14px] font-medium tracking-[-0.01em] transition-[transform,background-color,border-color,box-shadow,color,opacity] duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/25 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.97] rounded-full",
  {
    variants: {
      variant: {
        default:
          "bg-brand-600 text-white border border-brand-600 shadow-[0_0_0_1px_rgba(30,91,168,0.12)] hover:bg-brand-500 hover:border-brand-500",
        destructive:
          "bg-destructive text-white border border-destructive shadow-[var(--shadow-lift)] hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-[rgba(10,37,68,0.14)] bg-white text-foreground shadow-none hover:bg-brand-50 hover:border-brand-300 hover:text-brand-800",
        secondary:
          "border border-transparent bg-brand-50 text-brand-800 hover:bg-brand-100",
        ghost:
          "border border-transparent hover:bg-brand-50 hover:text-brand-800",
        link: "border-transparent text-brand-600 underline-offset-4 hover:underline rounded-none",
      },
      size: {
        default: "h-auto py-[9px] px-5 has-[>svg]:px-5",
        sm: "h-auto gap-1.5 py-2 px-4 text-[13px] has-[>svg]:px-3.5",
        lg: "h-auto py-3 px-6 text-[15px] has-[>svg]:px-5",
        icon: "size-10 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
