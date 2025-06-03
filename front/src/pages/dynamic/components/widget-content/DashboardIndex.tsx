import { InfoIcon, MoreVertical, PenIcon, Trash } from "lucide-react";
import {
    SpeedDial,
    SpeedDialContent,
    SpeedDialTrigger,
} from "@/components/speed-dial";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Widget } from "@/utils";
import { useCallback } from "react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { useGridStore } from "../../grid-store";
import { useAddWidgetStore } from "../../widget-store";
import { cn } from "@/lib/utils";
import LineChartWidget from "../line-chart-widget";
import AreaChartWidget from "../area-chart-widget";
import BarChartWidget from "../bar-chart-widget";
import DonutChartWidget from "../donut-chart-widget";
import PieChartWidget from "../pie-chart-widget";
import CardWidget from "../card-widget";

type Props = {
    item: Widget;
};

function WithHeader(Comp: JSX.Element, title: string) {
    return (
        <>
            <div className="flex-1 h-1 !pt-1">{Comp}</div>
        </>
    );
}

export default function DashboardWidgetContent({ item }: Props) {

    const { editMode, layouts, widgets, setLayouts, setWidgets, setWidgetId } = useGridStore();
    const { setData } = useAddWidgetStore();

    const deleteItem = (itemId: string) => {

        setLayouts(layouts.filter((l: { i: string; }) => l.i !== itemId));
        setWidgets((widgets || []).filter((w: { id: string; }) => w.id !== itemId));
    };

    const Comp = useCallback(() => {
        if (item.type === "lineChart")
            return WithHeader(<LineChartWidget {...item} />, item.title);
        if (item.type === "areaChart")
            return WithHeader(<AreaChartWidget {...item} />, item.title);
        if (item.type === "barChart")
            return WithHeader(<BarChartWidget {...item} />, item.title);
        if (item.type === "donutChart")
            return WithHeader(<DonutChartWidget {...item} />, item.title);
        if (item.type === "pieChart")
            return WithHeader(<PieChartWidget {...item} />, item.title);
        if (item.type === "card") return <CardWidget {...item} />;
    }, [item]);
    return (
        <>
            <SpeedDial>
                <SpeedDialTrigger asChild>
                    <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                            "absolute top-2 !p-0 !size-6 z-10 right-2 hover:bg-background/10 text-foreground/50",
                            {
                                hidden: editMode,
                            }
                        )}
                    >
                        <MoreVertical size={16} />
                    </Button>
                </SpeedDialTrigger>
                <SpeedDialContent>
                    <Button
                        size="icon"
                        className={cn(
                            "size-8 bg-card text-card-foreground hover:bg-card hover:brightness-95 active:shadow-inner border"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item.id);
                        }}
                    >
                        <Trash size={12} />
                    </Button>
                    <Button
                        size="icon"
                        className={cn(
                            "size-8 bg-card text-card-foreground hover:bg-card hover:brightness-95 active:shadow-inner border"
                        )}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setWidgetId(item.id);
                            setData(item);
                        }}
                    >
                        <PenIcon size={12} />
                    </Button>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    className={cn({
                                        hidden: !item.description,
                                    })}
                                >
                                    <InfoIcon size={16} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-sm">{item.description}</div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </SpeedDialContent>
            </SpeedDial>
            <Comp />
        </>
    );
}
