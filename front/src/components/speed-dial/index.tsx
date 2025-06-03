import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

const SpeedDial = PopoverPrimitive.Root;

const SpeedDialTrigger = PopoverPrimitive.Trigger;

const SpeedDialClose = PopoverPrimitive.Close;

const SpeedDialContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(
  (
    { className, align = "center", side = "left", sideOffset = 4, ...props },
    ref
  ) => {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          side={side}
          className={cn(
            "rounded z-[500] text-popover-foreground/50 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 flex gap-1 justify-center items-center",
            {
              "data-[state=open]:slide-in-from-top-2": side === "bottom",
              "data-[state=open]:slide-in-from-right-2": side === "left",
              "data-[state=open]:slide-in-from-left-2": side === "right",
              "data-[state=open]:slide-in-from-bottom-2": side === "top",
            },
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  }
);
SpeedDialContent.displayName = PopoverPrimitive.Content.displayName;

export { SpeedDial, SpeedDialTrigger, SpeedDialContent, SpeedDialClose };
