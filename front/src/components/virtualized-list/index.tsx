import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

export interface VirtualizedListProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  children: ({
    item,
    index,
    style,
  }: {
    item: T;
    index: number;
    style: React.CSSProperties;
  }) => React.ReactNode;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  className,
  children,
  ...props
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const itemsToShow = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.ceil((scrollTop + containerHeight) / itemHeight);
    return items.slice(start, end).map((item, index) => {
      return {
        position: start + index,
        item,
      };
    });
  }, [containerHeight, itemHeight, items, scrollTop]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  };

  return (
    <div
      onScroll={handleScroll}
      className={twMerge(" relative flex flex-col overflow-auto", className)}
      {...props}
    >
      <div
        style={{
          height: items.length * itemHeight,
          flexShrink: 0,
        }}
      ></div>
      {itemsToShow.map(({ position, item }) =>
        children({
          item,
          index: position,
          style: {
            height: itemHeight,
            width: "100%",
            position: "absolute",
            top: position * itemHeight,
          },
        }),
      )}
    </div>
  );
}
