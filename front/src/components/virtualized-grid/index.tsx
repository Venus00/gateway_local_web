import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

export interface VirtualizedGridProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  cols: number;
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

export function VirtualizedGrid<T>({
  items,
  itemHeight,
  containerHeight,
  className,
  cols,
  style,
  children,
  ...props
}: VirtualizedGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const itemsToShow = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight) * cols;
    const end = Math.ceil((scrollTop + containerHeight) / itemHeight) * cols;
    return items.slice(start, end).map((item, index) => {
      return {
        position: start + index,
        item,
      };
    });
  }, [containerHeight, itemHeight, items, scrollTop, cols]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  };

  return (
    <div
      onScroll={handleScroll}
      className={twMerge("relative grid overflow-auto", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        ...style,
      }}
      {...props}
    >
      <div
        style={{
          height: Math.ceil(items.length / cols) * itemHeight,
          flexShrink: 0,
        }}
      ></div>
      {itemsToShow.map(({ position, item }) =>
        children({
          item,
          index: position,
          style: {
            height: itemHeight,
            position: "absolute",
            left: (position % cols) * (100 / cols) + "%",
            top: Math.floor(position / cols) * itemHeight,
            width: 100 / cols + "%",
          },
        })
      )}
    </div>
  );
}
