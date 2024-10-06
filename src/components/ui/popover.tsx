"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

import { AnimatePresence, cubicBezier, motion } from "framer-motion";

// Custom easing function for menu expansion
const expandEasing = cubicBezier(0.34, 1.56, 0.64, 1);

// Custom easing function for menu collapse
const collapseEasing = cubicBezier(0.36, 0, 0.66, -0.56);

export const menuVariants = {
  hidden: {
    height: 0,
    transition: {
      height: { duration: 0.3, ease: collapseEasing },
    },
  },
  visible: {
    height: "auto",
    transition: {
      height: { duration: 0.5, ease: expandEasing },
      staggerChildren: 0.25,
    },
  },
};

export const childVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    transition: {
      opacity: { duration: 0.2, ease: "easeInOut" },
      x: { duration: 0.3, ease: "easeInOut" },
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      opacity: { duration: 0.3, ease: "easeInOut" },
      x: { duration: 0.3, ease: "easeOut" },
    },
  },
};

// Configuration for Framer Motion components
export const menuConfig = {
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  variants: menuVariants,
};

export const childConfig = {
  variants: childVariants,
};

//context
const PopoverContext = React.createContext<{ open: boolean }>({
  open: false,
});

const PopoverTrigger = PopoverPrimitive.Trigger;

const Popover = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>
>(({ children, open, onOpenChange, defaultOpen, ...props }) => {
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState<boolean>(
    !!defaultOpen
  );

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (isControlled) {
        onOpenChange(newOpen);
      } else {
        setUncontrolledIsOpen(newOpen);
      }
    },
    [isControlled, onOpenChange]
  );

  const isOpen = isControlled ? open : uncontrolledIsOpen;

  return (
    <PopoverContext.Provider value={{ open: isOpen }}>
      <PopoverPrimitive.Root
        {...props}
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        {children}
      </PopoverPrimitive.Root>
    </PopoverContext.Provider>
  );
});
Popover.displayName = "Popover";

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(
  (
    { className, children, align = "center", sideOffset = 4, ...props },
    ref
  ) => {
    const { open } = React.useContext(PopoverContext);

    return (
      <PopoverPrimitive.Portal forceMount>
        <AnimatePresence>
          {open && (
            <PopoverPrimitive.Content
              asChild
              ref={ref}
              align={align}
              sideOffset={sideOffset}
              className={cn(
                "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
                className
              )}
              {...props}
            >
              <motion.div {...menuConfig}>
                {React.Children.map(children, (child) => (
                  <motion.div {...childConfig}>{child}</motion.div>
                ))}
              </motion.div>
            </PopoverPrimitive.Content>
          )}
        </AnimatePresence>
      </PopoverPrimitive.Portal>
    );
  }
);
PopoverContent.displayName = "PopoverContent";

//arrow
const PopoverArrow = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    className={cn("w-6 h-2 fill-border translate-y-2", className)}
    {...props}
  />
));
PopoverArrow.displayName = "PopoverArrow";

export { Popover, PopoverTrigger, PopoverContent, PopoverArrow };
