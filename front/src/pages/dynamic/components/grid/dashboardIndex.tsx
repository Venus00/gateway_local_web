import { ElementRef, useEffect, useMemo, useRef, useState } from "react";
import GridLayouts, { ItemCallback } from "react-grid-layout";
import { cn } from "@/lib/utils";
import "react-grid-layout/css/styles.css";
import { useGridStore } from "../../grid-store";
import { Card } from "@/components/ui/card";
import { StaticGrid } from "../static-grid";
import WidgetContent from "../widget-content";
import DashboardWidgetContent from "../widget-content/DashboardIndex";

export function DashboardGrid() {


    const { editMode = false, layouts, widgets, setEditMode, setLayouts } = useGridStore();
    const parentRef = useRef<ElementRef<"div">>(null);
    const [gridWidth, setGridWidth] = useState(0);
    useEffect(() => {
        const getParentWidth = () => {
            return parentRef.current?.clientWidth || 0;
        };
        const handleResize = () => {
            const width = getParentWidth();
            setGridWidth(width);
            if (width < 1536) setEditMode(false);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const widgetsWidthLayout = useMemo(() => {
        return widgets?.map((w) => {
            const widgetLayout = layouts?.find((l) => l.i === w.id);
            return {
                ...w,
                ...widgetLayout!,
            };
        });
    }, [widgets, layouts]);

    const sortedWidgets = useMemo(() => {
        return widgetsWidthLayout?.sort((a, b) => a.y * 12 + a.x - b.y * 12 - b.x);
    }, [widgetsWidthLayout]);

    const handleLayoutsUpdate: ItemCallback = (layouts) => {
        setLayouts(layouts);
    };

    return (
        <div className="flex-1" ref={parentRef}>
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
                                    ` 2xl:col-start-${item.x + 1} 2xl:col-end-${item.x + item.w + 1
                                    } 2xl:row-start-${item.y + 1} 2xl:row-end-${item.y + item.h + 1
                                    }`
                                )}
                                style={{
                                    backgroundColor,
                                    color,
                                }}
                            >
                                <DashboardWidgetContent item={item} />
                            </Card>
                        );
                    })}
                </StaticGrid>
            ) : (
                <div className="">
                    <GridLayouts
                        layout={layouts}
                        cols={12}
                        rowHeight={80}

                        width={gridWidth}
                        onDragStop={handleLayoutsUpdate}
                        onResizeStop={handleLayoutsUpdate}
                        isDraggable={true}
                        isResizable={true}
                        resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
                    >
                        {widgets?.map((item) => {
                            const { backgroundColor, color } = item;
                            return (
                                <Card
                                    className="p-0 [&>*]:p-4 flex flex-col relative group dark:bg-muted"
                                    key={item.id}
                                    style={{ backgroundColor, color }}
                                >
                                    <DashboardWidgetContent item={item} key={item.id} />
                                </Card>
                            );
                        })}
                    </GridLayouts>
                </div>
            )}
        </div>
    );
}
