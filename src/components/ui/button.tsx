import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-racing focus-visible:ring-offset-2 focus-visible:ring-offset-carbon disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-racing text-white hover:bg-racing-600 active:bg-racing-700 shadow-[0_0_30px_-8px_rgba(225,6,0,0.6)]",
        outline:
          "border border-white/15 bg-transparent text-foreground hover:border-white/30 hover:bg-white/5",
        ghost: "text-foreground hover:bg-white/5",
        secondary: "bg-carbon-700 text-foreground hover:bg-carbon-600",
        link: "text-racing underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 text-sm uppercase tracking-wider",
        sm: "h-9 px-4 text-xs uppercase tracking-wider",
        lg: "h-14 px-8 text-base uppercase tracking-wider",
        icon: "h-10 w-10",
      },
      shape: {
        default: "rounded-none",
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shape, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
