import ColorPicker from "@/components/color-picker";
import { Table } from "@/components/table";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GaugeChartWidgetData,
  GaugeWidgetData,
  LineChartWidgetData,
  RadialChartWidgetData,
  RadialWidgetData,
} from "@/utils";
import { Minus, Moon, PlusIcon, Sun, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useLocation } from "react-router";
import { useGridStore } from "../../grid-store";
import { useAddWidgetStore } from "../../widget-store";
const defaultTelemetry: RadialWidgetData = {
  telemetryName: "",
  unit: "",
  stops: [],
};

export default function CircularChartOptions() {
  const { data } = useAddWidgetStore();
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const { backgroundColor, color } = data;
  const now = new Date();
  const [textColor, setTextColor] = useState("#000");
  useEffect(() => {
    if (theme === "dark") setTextColor("#fff");
    else setTextColor("#000");
  }, [theme]);
  const { telemetries = [] } = data.attributes as RadialChartWidgetData;
  // console.log("telemetries", telemetries);

  return (
    <div className="flex flex-col  gap-4 relative z-[9999]">
      <div className={`flex flex-col items-end gap-2 p-3 `}>
        <Button
          variant="ghost"
          size="icon"
          title="Toggle theme"
          className=" items-end hover:bg-transparent w-fit !text-black dark:!text-white dark:hover:text-white hover:text-black"
          onClick={() => {
            setIsDark((prev) => !prev);
            setTheme(isDark ? "light" : "dark");
          }}
        >
          {theme !== "dark" ? (
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 " />
          ) : (
            <Moon className=" h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <div
          className={"flex flex-col w-full border p-4 rounded-lg"}
          style={{
            backgroundColor,
            color,
          }}
        >
          <h3 className="!pb-1  first-letter:uppercase font-semibold truncate">
            {data.title || "New Area Chart"}
          </h3>
          <ReactApexChart
            // series={[gaugeValue]}
            series={[10, 25]}
            options={{
              chart: {
                id: "id",
                type: "radialBar",
                offsetY: 0,
                // height: 200,
                // offsetY: -20,
                sparkline: {
                  enabled: true,
                },
              },
              legend: {
                show: true,
                position: "left",
                horizontalAlign: "center",
                fontSize: "14px",

                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 400,
                itemMargin: {
                  vertical: 2,
                },
                labels: {
                  colors: textColor,
                  useSeriesColors: false,
                },
              },
              plotOptions: {
                radialBar: {
                  hollow: {
                    margin: 15,
                    size: "50%",
                  },
                  track: {
                    background: "#e7e7e7",
                    strokeWidth: "80%",
                    margin: 5, // margin is in pixels
                    dropShadow: {
                      enabled: true,
                      top: 0,
                      left: 0,
                      color: textColor,
                      opacity: 1,
                      blur: 2,
                    },
                  },
                  dataLabels: {
                    name: {
                      show: true,
                    },
                    total: {
                      show: true,
                      label: "TOTAL",
                      fontSize: "12px",
                      color: theme !== "light" ? "#fff" : "#333",
                    },
                    value: {
                      offsetY: 5,
                      color: textColor,
                      fontSize: "14px",
                    },
                  },
                },
              },
              grid: {
                padding: {
                  top: 0,
                },
              },
              fill: {
                type: "solid",
                // colors: telemetries.map((t) => t.stopColor),
              },
              labels: telemetries.map((t) => t.telemetryName),
            }}
            type={"radialBar"}
            width={"100%"}
            height={"100%"}
          />
        </div>
      </div>
      <Tabs defaultValue="basic" className="w-full  space-y-4">
        <TabsList className="bg-transparent rounded-none   border-b w-full justify-start p-0 h-fit">
          <TabsTrigger
            value="basic"
            className="border-0 pb-2 rounded-none    shadow-none bg-transparent data-[state=active]:bg-transparent 
            data-[state=active]:border-b data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none
             data-[state=active]:text-blue-500"
          >
            Basics
          </TabsTrigger>
          <TabsTrigger
            value="data"
            className="border-0 pb-2 rounded-none    shadow-none bg-transparent data-[state=active]:bg-transparent 
            data-[state=active]:border-b data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none
             data-[state=active]:text-blue-500"
          >
            Data
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="border-0 pb-2 rounded-none    shadow-none bg-transparent data-[state=active]:bg-transparent 
            data-[state=active]:border-b data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none
             data-[state=active]:text-blue-500"
          >
            Appearance
          </TabsTrigger>
          {/* <TabsTrigger
            value="timeframe"
            className="border-0 pb-2 rounded-none    shadow-none bg-transparent data-[state=active]:bg-transparent 
            data-[state=active]:border-b data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none
             data-[state=active]:text-blue-500"
          >
            Timeframe
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="basic">
          <BasicTab />
        </TabsContent>
        <TabsContent value="data">
          <DataTab />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>
        {/* <TabsContent value="timeframe">
          <TimeframeTab />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
function BasicTab() {
  const { data, setTitle } = useAddWidgetStore();
  return (
    <div>
      <Label>title</Label>
      <Input
        autoFocus
        id="title"
        name="title"
        placeholder="title"
        value={data.title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
}
function DataTab() {
  const [telemetryData, setTelemetryData] = useState(defaultTelemetry);
  const { data, addGaugeTelemetry, deleteGaugeTelemetry } = useAddWidgetStore();
  const [stopData, setStopData] = useState<{ stop: number; color: string }[]>([
    {
      stop: 100,
      color: "#ff0000",
    },
  ]);
  const { telemetries = [] } = data.attributes as RadialChartWidgetData;
  const { dashboard } = useGridStore();
  const location = useLocation();
  const isAnalytic = location.pathname.startsWith("/analytic");
  const machineId = location.pathname.split("/")[2];
  const dashboardItem = dashboard.find(
    (machine: { machineId: number }) => machine.machineId === Number(machineId)
  );
  const machine = dashboardItem ? dashboardItem.machine : undefined;
  function handleAddStop() {
    setStopData((prev) => [
      ...prev,
      {
        stop: 100,
        color: "#ff0000",
      },
    ]);
  }
  function handleRemoveStop(index: number) {
    const newStops = stopData.filter((_, i) => i !== index);
    setStopData(newStops);
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();

    if (!telemetryData.telemetryName) {
      return;
    }

    const telemetry = {
      ...telemetryData,
      stops: stopData,
    };
    console.log(stopData, telemetry);
    addGaugeTelemetry(telemetry);
    setStopData([
      {
        stop: 100,
        color: "#ff0000",
      },
    ]);
    setTelemetryData(defaultTelemetry);
    // addGaugeStop(telemetry);
  }

  return (
    <div className="flex flex-col gap-4 relative">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]  gap-x-2 gap-y-3"
      >
        <Select
          name="telemetryData"
          required
          onValueChange={(value) => {
            setTelemetryData((prev) => ({
              ...prev,
              telemetryName: value,
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Telemetry" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {isAnalytic
                ? machine?.telemetries?.split(",").map((item: string) => {
                    return (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    );
                  })
                : machine?.connectionInputs?.map((item: any,index:number) => {
                    return (
                      <SelectItem key={index} value={item?.input?.label?.trimEnd()}>
                        {item?.input?.label?.trimEnd()}
                      </SelectItem>
                    );
                  })
                    }
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* <Input
          className="rounded"
          //   placeholder={t("label")}
          placeholder="label"
          name="label"
          value={telemetryData.telemetryName}
          onChange={(e) => {
            setTelemetryData((prev) => ({
              ...prev,
              telemetryName: e.target.value,
            }));
          }}
        /> */}
        <Input
          className="rounded"
          //   placeholder={t("unit")}
          placeholder="unit"
          name="unit"
          value={telemetryData.unit}
          onChange={(e) => {
            setTelemetryData((prev) => ({
              ...prev,
              unit: e.target.value,
            }));
          }}
        />
        <Button
          type="submit"
          variant="outline"
          className="flex items-center gap-2"
          disabled={!telemetryData.telemetryName}
        >
          <PlusIcon size={18} /> <span>Add Telemetry</span>
        </Button>
        <Label className="col-span-3">Stops</Label>
        <span className="text-xs col-span-3">
          Define value ranges and assign colors to visually represent different
          levels.
        </span>{" "}
        {stopData.map((sd, index) => {
          return (
            <div
              key={index}
              className="col-span-3 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-2"
            >
              <Input
                className="rounded w-full "
                //   placeholder={t("unit")}
                placeholder="stop"
                name="stop"
                value={sd.stop}
                onChange={(e) => {
                  const newStop = [...stopData];
                  newStop[index].stop = +e.target.value;
                  setStopData(newStop);
                }}
              />{" "}
              <ColorPicker
                className="rounded-md !w-full  flex !ring-0 h-9 outline-none border-none"
                color={sd.color}
                onChange={(color) => {
                  const newStop = [...stopData];
                  newStop[index].color = color;
                  setStopData(newStop);
                }}
              />
              <div className="flex items-center gap-2">
                {stopData.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={!sd.stop}
                    onClick={() => handleRemoveStop(index)}
                  >
                    <Minus size={18} />
                    {/* <span>Remove</span> */}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={!sd.stop}
                  onClick={handleAddStop}
                >
                  <PlusIcon size={18} />
                  {/* <span>Add Stop</span> */}
                </Button>
              </div>
            </div>
          );
        })}
      </form>
      {telemetries.length > 0 && (
        <ScrollArea className="max-h-[20rem] p-2  border rounded-lg">
          <Table className="w-full text-xs [&_th]:p-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Unit</th>
                <th>Stops</th>
              </tr>
            </thead>
            <tbody>
              {telemetries.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.telemetryName}</td>
                    <td>
                      {item.unit}
                      {/* <div className="flex items-center gap-1">
                        {item.stops.map((ss, i) => (
                          <span key={i}>{ss.stop}</span>
                        ))}
                      </div> */}
                    </td>
                    <td>
                      <div className="flex items-center  gap-1 justify-between">
                        <div className="flex items-center gap-2">
                          {item.stops.map((ss, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: ss.color }}
                              ></div>
                              <span>{ss.stop}</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() => {
                            deleteGaugeTelemetry(item);
                          }}
                          // onClick={() => {
                          //   const newStops = stops.filter(
                          //     (_, i) => i !== index
                          //   );

                          //   deleteGaugeStop({
                          //     ...telemetryData,
                          //     stops: newStops,
                          //   });
                          //   setTelemetryData((prev) => {
                          //     return { ...prev, stops: newStops };
                          //   });
                          // }}
                        >
                          <TrashIcon size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}
function AppearanceTab() {
  const { data, setBackgroundColor, setColor } = useAddWidgetStore();
  const backgroundColor = data.backgroundColor as string;
  const color = data.color as string;

  return (
    <div className="flex flex-col gap-4  ">
      <div className="grid grid-cols-[10rem,1fr] items-center gap-2">
        <Label htmlFor="backgroundColor">Background Color</Label>
        <ColorPicker
          className="rounded-md w-24 !e !ring-0 h-6 outline-none border-none"
          color={backgroundColor}
          onChange={setBackgroundColor}
        />
      </div>
      <div className="grid grid-cols-[10rem,1fr] items-center gap-2">
        <Label htmlFor="color">Text Color</Label>
        <ColorPicker
          className="rounded-md w-24 !e !ring-0 h-6 outline-none border-none"
          color={color}
          onChange={setColor}
        />
      </div>
    </div>
  );
}
function TimeframeTab() {
  const { data, setAttribute } = useAddWidgetStore();
  const timeframes = ["Hour", "Day", "Week", "Month", "Custom"];
  const timeFrame = (data.attributes?.timeframe as string) || "Week";
  function setTimeframe(timeframe: string) {
    setAttribute("timeframe", timeframe);
  }
  return (
    <div className="flex w-full justify-stretch ">
      {timeframes.map((tf) => (
        <Button
          key={tf}
          variant={"outline"}
          onClick={() => setTimeframe(tf)}
          className={`w-full shadow-none  px-2 py-1 text-center ${
            timeFrame === tf && "border-blue-500"
          }`}
        >
          {tf}
        </Button>
      ))}
    </div>
  );
}
