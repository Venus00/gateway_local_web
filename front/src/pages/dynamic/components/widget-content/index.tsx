import { Copy, InfoIcon, PenIcon, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {  Widget } from "@/utils";
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
import BatteryWidget from "../battery-widget";
import GaugeChartWidget from "../gauge-chart-widget";
import CircularChartWidget from "../circular-chart-widget";
import VideoWidget from "../video-widget";
import MapWidget from "../map-widget";
import TableWidget from "../table-widget";
import ButtonWidget from '../button-widget'

type Props = {
  item: Widget;
  id: number;
};

function WithHeader(Comp: JSX.Element, title: string) {
  return (
    <>
      <span className="!pb-1 first-letter:uppercase text-sm font-semibold truncate">
        {title}
      </span>
      <div className="flex-1 h-1 z-[0]  !px-0 !pt-1">{Comp}</div>
    </>
  );
}

export default function WidgetContent({ item, id }: Props) {
  const {
    dashboard,
    setMachineLayout,
    setMachineWidgets,
    setWidgetIdMachine,
    duplicateWidget,
  } = useGridStore();
  const dashboardItem = dashboard.find(
    (dashboardItem) => dashboardItem.machineId === id
  );
  const { editMode, layout, widgets } = dashboardItem || {
    editMode: false,
    layout: [],
    widget: [],
  };
  const { setData } = useAddWidgetStore();

  const deleteItem = (itemId: string) => {
    setMachineLayout(
      id,
      layout.filter((l) => l.i !== itemId)
    );
    setMachineWidgets(
      id,
      (widgets || []).filter((w) => w.id !== itemId)
    );
    // setLayouts(layouts.filter((l) => l.i !== id));
    // setWidgets(widgets.filter((w) => w.id !== id));
  };

  const Comp = useCallback(() => {
    if (item.type === "table") {
      return WithHeader(<TableWidget {...item} />, `${item.title}`);
    }

    if (item.type === "button") {
      return <ButtonWidget {...item} />;
    }
    if (item.type === "lineChart") {
      const unit = item.attributes?.unit as string;
      return WithHeader(
        <LineChartWidget {...item} />,
        `${item.title} ${unit ? unit : ""}`
      );
    }
    if (item.type === "areaChart") {
      const unit = item.attributes?.unit as string;
      return WithHeader(
        <AreaChartWidget {...item} />,
        `${item.title} ${unit ? unit : ""}`
      );
    }
    if (item.type === "barChart") {
      const unit = item.attributes?.unit as string;
      return WithHeader(
        <BarChartWidget {...item} />,
        `${item.title} ${unit ? unit : ""}`
      );
    }
    // return WithHeader(<BarChartWidget {...item} />, item.title);
    if (item.type === "donutChart")
      return WithHeader(<DonutChartWidget {...item} />, item.title);
    if (item.type === "gauge") {
      const unit = item.attributes?.unit as string;
      return WithHeader(
        <GaugeChartWidget {...item} />,
        `${item.title} ${unit ? unit : ""}`
      );
    }
    if (item.type === "circular")
      return WithHeader(<CircularChartWidget {...item} />, item.title);
    if (item.type === "video")
      return WithHeader(<VideoWidget {...item} />, item.title);
    if (item.type === "pieChart")
      return WithHeader(<PieChartWidget {...item} />, item.title);
    if (item.type === "card") return <CardWidget {...item} />;
    if (item.type === "battery") return <BatteryWidget {...item} />;
    if (item.type === "map")
      return WithHeader(<MapWidget {...item} />, item.title);
  }, [item]);
  return (
    <>
      <div
        className={cn(
          "absolute cursor-pointer  top-0 !py-1 !px-1 bg-primary gap-1  right-0  rounded-tl-none rounded-br-none rounded-tr-lg  flex items-center",
          {
            hidden: !editMode,
          }
        )}
      >
        <Button
          size="icon"
          variant={"link"}
          className={cn("  h-fit text-card-foreground !px-1  w-fit")}
          onClick={(e) => {
            e.stopPropagation();
            deleteItem(item.id);
          }}
        >
          <Trash size={12} />
        </Button>
        <Button
          size="icon"
          variant={"link"}
          className={cn(" h-fit text-card-foreground  px-1 w-fit  ")}
          onClick={(e) => {
            e.stopPropagation();
            console.log("edit item", item.id);
            setWidgetIdMachine(id, item.id);
            setData(item);
          }}
        >
          <PenIcon size={12} />
        </Button>
        <Button
          size="icon"
          variant={"link"}
          className={cn(" h-fit text-card-foreground  px-1 w-fit  ")}
          onClick={(e) => {
            e.stopPropagation();
            duplicateWidget(id, item);
            // setData(item);
          }}
        >
          <Copy size={12} />
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
      </div>
      <Comp />
    </>
  );
}
{
  /* <SpeedDial>
        <SpeedDialTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "absolute top-2 !p-0 !size-6 z-10 right-2 hover:bg-background/10 text-foreground/50",
              {
                hidden: !editMode,
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
              e.stopPropagation();
              setWidgetIdMachine(id, item.id);
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
      </SpeedDial> */
}
