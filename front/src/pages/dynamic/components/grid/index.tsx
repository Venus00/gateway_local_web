import { ElementRef, useEffect, useMemo, useRef, useState } from "react";
import GridLayouts, { ItemCallback } from "react-grid-layout";
import { cn } from "@/lib/utils";
import "react-grid-layout/css/styles.css";
import { useGridStore } from "../../grid-store";
import { Card } from "@/components/ui/card";
import { StaticGrid } from "../static-grid";
import WidgetContent from "../widget-content";
import { useSideBar } from "@/Layout/SideBarProvider/SideBarProvider";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
// import "react-resizable/css/styles.css";
interface PropsType {
  id: number;
}

export function Grid({ id }: PropsType) {
  const {
    isSidebarVisible,
    isFullScreen,
    toggleFullScreen,
    isLayoutTooTall,
    toggleIsLayoutTooTall,
  } = useSideBar();
  const { dashboard, setEditMachine, setMachineLayout, setUpdated } =
    useGridStore();
  const dashboardItem = dashboard.find(
    (dashboardItem) => dashboardItem.machineId === id
  );
  const { editMode = false, layout, widgets } = dashboardItem || {};
  const parentRef = useRef<ElementRef<"div">>(null);
  const [gridWidth, setGridWidth] = useState(0);
  useEffect(() => {
    const getParentWidth = () => {
      return parentRef.current?.clientWidth || 0;
    };
    const handleResize = () => {
      const width = getParentWidth();
      setGridWidth(width);
      if (width < 800) setEditMachine(id, false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const widgetsWidthLayout = useMemo(() => {
    return widgets?.map((w) => {
      const widgetLayout = layout?.find((l) => l.i === w.id);
      return {
        ...w,
        ...widgetLayout!,
      };
    });
  }, [widgets, layout]);
  const sortedWidgets = useMemo(() => {
    return widgetsWidthLayout?.sort((a, b) => a.y * 12 + a.x - b.y * 12 - b.x);
  }, [widgetsWidthLayout]);
  const ROW_HEIGHT = 100;
  useEffect(() => {
    const MAX_ROWS_ALLOWED = Math.floor(screen.height / ROW_HEIGHT);

    const value =
      sortedWidgets?.some((w) => w.y + w.h > MAX_ROWS_ALLOWED) || false;
    toggleIsLayoutTooTall(value);
  }, [sortedWidgets, screen.height]);
  const handleLayoutsUpdate: ItemCallback = (layouts) => {
    setMachineLayout(id, layouts);
    setUpdated(true);
  };
  const { widgetId } =
    dashboard.find((machine) => machine.machineId === id) || {};

  return (
    <div
      className={cn("flex-1   transition-all", {
        "absolute inset-0 top-0 left-0 z-50 bg-white dark:bg-neutral-800 w-full h-[100vh] max-h-screen overflow-hidden":
          isFullScreen,
      })}
      ref={parentRef}
    >
      {!editMode ? (
        <StaticGrid>
          {sortedWidgets?.map((item) => {
            const { backgroundColor, color } = item;

            return (
              <Card
                key={item.id}
                className={cn(
                  "p-0 [&>*]:p-4 overflow-hidden  flex flex-col relative group col-span-full dark:bg-muted ",
                  `row-span-${item.h} md:col-span-${Math.min(
                    item.w,
                    6
                  )} xl:col-span-${Math.min(item.w, 9)}`,
                  ` 2xl:col-start-${item.x + 1} 2xl:col-end-${
                    item.x + item.w + 1
                  } 2xl:row-start-${item.y + 1} 2xl:row-end-${
                    item.y + item.h + 1
                  }`
                )}
                style={{
                  backgroundColor,
                  color,
                }}
              >
                <WidgetContent item={item} key={item.id} id={id} />
              </Card>
            );
          })}
        </StaticGrid>
      ) : (
        <div className="">
          <GridLayouts
            layout={layout}
            cols={12}
            rowHeight={80}
            width={gridWidth}
            onDragStop={handleLayoutsUpdate}
            onResizeStop={handleLayoutsUpdate}
            isDraggable={true}
            isResizable={true}
            resizeHandles={["se"]}
            margin={[5, 5]}
          >
            {widgets?.map((item) => {
              const { backgroundColor, color } = item;

              return (
                <Card
                  className={cn(
                    "p-0 [&>*]:p-4 flex flex-col rounded-lg cursor-pointer  border-primary relative group dark:bg-muted",
                    {
                      "z-[9999]": !widgetId && editMode,
                    }
                  )}
                  key={item.id}
                  style={{ backgroundColor, color }}
                >
                  <WidgetContent item={item} key={item.id} id={id} />
                </Card>
              );
            })}
          </GridLayouts>
        </div>
      )}
    </div>
  );
}
