import { ColorResult, SketchPicker } from "react-color";

import { cn } from "@/lib/utils";
import { presetColors } from "./data";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

interface Props {
  className?: string;
  color?: string;
  onChange?: (color: string) => void;
}

export default function ColorPicker({ className, color, onChange }: Props) {
  const handleChange = (color: ColorResult) => {
    onChange?.(color.hex);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={cn("outline outline-2  outline-gray-500", className)}
          style={{
            backgroundColor: color,
          }}
        ></div>
      </PopoverTrigger>
      <PopoverContent className="w-auto  p-0 z-[9999]" align="start">
        <SketchPicker
          className="dark:!bg-neutral-800 dark:!text-black"
          presetColors={presetColors}
          color={color}
          onChange={handleChange}
        />
      </PopoverContent>
      <PopoverClose className="hidden"></PopoverClose>
    </Popover>
  );
}
