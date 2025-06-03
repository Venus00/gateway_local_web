import { Button } from "@/components/ui/button";
import React, { memo, useMemo } from "react";
import lucide from "./lucide";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icon } from "../icon";
import { twMerge } from "tailwind-merge";
import { VirtualizedGrid } from "../virtualized-grid";
import { useDebounce } from "@/hooks/debounce";
import { Input } from "../ui/input";

const icons = Object.keys(lucide).filter(
  (key) => !key.startsWith("Lucide") && !key.endsWith("Icon")
);

const IconsList = ({
  selectedIcon,
  search,
  onSelect,
}: {
  selectedIcon?: string | null;
  search: string;
  onSelect: (icon: string) => void;
}) => {
  const filteredIcons = useMemo(() => {
    return icons
      .filter((icon) => icon.toLowerCase().includes(search.toLowerCase()))
      .splice(0, 1500);
  }, [search]);

  return (
    <VirtualizedGrid
      containerHeight={204}
      items={filteredIcons}
      itemHeight={54}
      cols={7}
      style={{ height: 204 }}
    >
      {({ item, index, style }) => {
        return (
          <div style={style}>
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      onSelect(item);
                    }}
                    data-selected={selectedIcon === item}
                    className="data-[selected=true]:border-primary"
                  >
                    <Icon name={item} size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{item}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      }}
    </VirtualizedGrid>
  );
};

const MemorizedList = memo(IconsList);

interface IconPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  onSelect?: (icon: string) => void;
  icon: string | null;
}

export const IconPicker = ({
  icon = null,
  onSelect,
  className,
  ...props
}: IconPickerProps) => {
  const [search, setSearch] = React.useState("");
  const [selectedIcon, setSelectedIcon] = React.useState<string | null>(icon);
  const debouncedSearch = useDebounce(search, 500);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className={twMerge("flex flex-col gap-4", className)} {...props}>
      <div className="flex items-center gap-3">
        {selectedIcon && (
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="border-primary"
          >
            <Icon name={selectedIcon} size={20} />
          </Button>
        )}
        <Input
          value={search}
          onChange={handleChange}
          placeholder={"iconSearch"}
        />
      </div>
      <MemorizedList
        selectedIcon={selectedIcon}
        search={debouncedSearch}
        onSelect={(icon) => {
          setSelectedIcon(icon);
          onSelect?.(icon);
        }}
      />
    </div>
  );
};
