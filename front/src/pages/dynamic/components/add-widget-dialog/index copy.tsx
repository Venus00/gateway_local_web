import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { ElementRef, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useGridStore } from "../../grid-store";
import { useAddWidgetStore } from "../../widget-store";
import WidgetLogo from "../widget-logo";
import { Button } from "@/components/ui/button";
import { Step1 } from "../step1";
import LineChartOptions from "../line-chart-options";
import AreaChartOptions from "../area-chart-options";
import BarChartOptions from "../bar-chart-options";
import DonutChartOptions from "../donut-chart-options";
import PieChartOptions from "../pie-chart-options";
import CardOptions from "../card-options";
import { DialogTitle } from "@radix-ui/react-dialog";
import BatteryOptions from "../battery-options";
import GaugeChartOptions from "../gauge-chart-options";
import CircularChartOptions from "../circular-chart-options";
import VideoChartOptions from "../video-options";
import MapOptions from "../map-options";

interface PropsType {
  id: number;
}
const AddWidgetDialog = ({ id }: PropsType) => {
  // const { addWidget, widgetId, setWidgetId } = useGridStore();
  const { dashboard, setAddWidgetMachine, setWidgetIdMachine } = useGridStore();
  const { widgetId } =
    dashboard.find((machine) => machine.machineId === id) || {};
  const { data, step, setStep, setData, nextStep, getDisabled } =
    useAddWidgetStore();
  const closeRef = useRef<ElementRef<"button">>(null);

  const clear = () => {
    setData({
      title: "",
      type: "card",
      attributes: {},
    });
    setStep(0);
  };
  const handleClose = () => {
    closeRef.current?.click();
    setWidgetIdMachine(id, null);
    clear();
  };
  const handleSubmit = () => {
    setAddWidgetMachine(id, data);
    handleClose();
  };

  const Step2 = useCallback(() => {
    if (data.type === "lineChart") return <LineChartOptions />;
    if (data.type === "areaChart") return <AreaChartOptions />;
    if (data.type === "barChart") return <BarChartOptions />;
    if (data.type === "donutChart") return <DonutChartOptions />;
    if (data.type === "pieChart") return <PieChartOptions />;
    if (data.type === "card") return <CardOptions />;
    if (data.type === "battery") return <BatteryOptions />;
    if (data.type === "gauge") return <GaugeChartOptions />;
    if (data.type === "circular") return <CircularChartOptions />;
    if (data.type === "video") return <VideoChartOptions />;
    if (data.type === "map") return <MapOptions />;
    return null;
  }, [data.type]);

  return (
    <Dialog
      open={!!widgetId}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogTitle></DialogTitle>
      <DialogContent
        className={cn("max-w-md  max-h-[90%] overflow-y-auto ", {
          "max-w-4xl": step === 1 && ["table"].includes(data.type),
          "max-w-2xl":
            step === 1 &&
            ["lineChart", "barChart", "areaChart", "map"].includes(data.type),
          "max-w-xl":
            step === 1 &&
            [
              "pieChart",
              "donutChart",
              "radarChart",
              "qrCode",

              "circular",
            ].includes(data.type),
          // "max-w-lg": step === 1 && ["table"].includes(data.type),
        })}
      >
        <DialogHeader className="font-semibold dark:bg-white/20   flex items-center justify-center">
          <span className="first-letter:uppercase ">
            {step === 0 ? (
              `${widgetId === "new" ? "add" : "edit"} widget`
            ) : (
              <div className="w-full py-2">
                <WidgetLogo
                  type={data.type}
                  className="bg-transparent w-full flex flex-col items-center dark:bg-transparent py-0"
                />
              </div>
            )}{" "}
          </span>
        </DialogHeader>
        {
          {
            0: <Step1 id={Number(id)} />,
            1: <Step2 />,
          }[step]
        }
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button variant="outline" onClick={handleClose}>
            <span className="first-letter:uppercase">cancel</span>
          </Button>
          {step === 1 && (
            <Button
              onClick={() => {
                setStep(0);
              }}
            >
              <span className="first-letter:uppercase">previous</span>
            </Button>
          )}
          <Button
            disabled={getDisabled()}
            onClick={step === 1 ? handleSubmit : nextStep}
          >
            <span className="first-letter:uppercase">
              {step === 0 ? "next" : "save"}
            </span>
          </Button>
        </div>
        <DialogClose ref={closeRef} hidden />
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
