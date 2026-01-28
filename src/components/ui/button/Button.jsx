import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Your custom variants
        primary:
          "bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl active:scale-95 dark:bg-primary-500 dark:hover:bg-primary-600",
        blue: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl active:scale-95",
        red: "bg-red-600 text-white hover:bg-red-600/90 shadow-lg hover:shadow-xl active:scale-95",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl active:scale-95",
        yellow:
          "bg-yellow-500 text-yellow-950 hover:bg-yellow-600 shadow-lg hover:shadow-xl active:scale-95",
        dark: "bg-body-800 text-body-300 hover:bg-body-700 shadow-lg hover:shadow-xl active:scale-95 dark:bg-body-700 dark:hover:bg-body-600",
        gradient:
          "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl active:scale-95 dark:from-primary-600 dark:to-primary-700 dark:hover:from-primary-700 dark:hover:to-primary-800",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
        xl: "h-14 rounded-lg px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
