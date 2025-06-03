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
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { ChartTelemetry, LineChartWidgetData } from "@/utils";
import { addHours } from "date-fns";
import { Moon, PlusIcon, Sun, TrashIcon } from "lucide-react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useGridStore } from "../../grid-store";
import { useAddWidgetStore } from "../../widget-store";
const defaultTelemetry: ChartTelemetry = {
  name: "",
  label: "",
  color: "#d32727",
  unit: "",
};

export default function LineChartOptions() {
  const { data } = useAddWidgetStore();
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const { backgroundColor, color } = data;
  const now = new Date();

  const { telemetries = [] } = data.attributes as LineChartWidgetData;
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
            {data.title || "New Line Chart"}
          </h3>
          <ReactApexChart
            options={{
              // theme: { mode: theme === "dark" ? "dark" : "light" },
              tooltip: {
                cssClass: "text-black",
              },
              legend: {
                show: true,
                position: "bottom",
                horizontalAlign: "center",
                fontSize: "14px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 400,
                itemMargin: {
                  vertical: 10,
                },
                labels: {
                  colors: theme !== "light" ? "#fff" : "#000",
                  //useSeriesColors: false,
                },
              },
              colors: telemetries?.map((item) => item.color),
              chart: {
                id: "chartId",
                type: "line",
                //background: "transparent",
                toolbar: {
                  show: false,
                },
                animations: {
                  enabled: false,
                },
                zoom: {
                  enabled: false,
                },
                selection: {
                  enabled: false,
                },
                dropShadow: {
                  enabled: false,
                },
              },
              stroke: {
                width: 2.5,
                curve: "smooth",
              },
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                type: "datetime",
                labels: {
                  show: true,
                  style: {
                    colors: theme !== "light" ? "#fff" : "#000",
                    fontSize: "12px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 400,
                    cssClass: "apexcharts-xaxis-label",
                  },
                },
              },
              yaxis: {
                tickAmount: 4,
                // title: {
                //   text: "Series A",
                //   style: {
                //     color: "#FF1654",
                //   },
                // },
                labels: {
                  show: true,
                  formatter: function (value) {
                    return value?.toFixed(2) + " ";
                  },
                  style: {
                    colors: theme !== "light" ? "#fff" : "#000",
                    fontSize: "12px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 400,
                    cssClass: "apexcharts-xaxis-label",
                  },
                },
              },
            }}
            series={[
              {
                data: [
                  { x: addHours(now, -2), y: 5 },
                  { x: addHours(now, -1), y: 8 },
                ],
              },
            ]}
            type={"line"}
            width={"100%"}
            height={"180px"}
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
          <TabsTrigger
            value="timeframe"
            className="border-0 pb-2 rounded-none    shadow-none bg-transparent data-[state=active]:bg-transparent 
            data-[state=active]:border-b data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none
             data-[state=active]:text-blue-500"
          >
            Timeframe
          </TabsTrigger>
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
        <TabsContent value="timeframe">
          <TimeframeTab />
        </TabsContent>
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
  const { data, addTelemetry, deleteTelemetry } = useAddWidgetStore();
  const [telemetryData, setTelemetryData] = useState(defaultTelemetry);
  const { dashboard } = useGridStore();
  const location = useLocation();
  const machineId = location.pathname.split("/")[2];
  const dashboardItem = dashboard.find(
    (machine: { machineId: number }) => machine.machineId === Number(machineId)
  );
  const machine = dashboardItem ? dashboardItem.machine : undefined;
  const isAnalytic = location.pathname.startsWith("/analytic");
  const isDashboard = location.pathname.startsWith("/dashboard");

  const { telemetries = [] } = data.attributes as LineChartWidgetData;
  // console.log("telemetries", telemetries);
  const { tenant } = useSelector((state: RootState) => state.auth);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();

    if (!telemetryData.name) return;

    addTelemetry(telemetryData);
  }

  const { data: dashboardTelemetries } = useQuery(
    "dashboardTelemetries",
    () => fetchTelemetries(),
    { initialData: [], enabled: isDashboard }
  );

  const fetchTelemetries = async () => {
    try {
      const response = await apiClient.get("dashboard", {
        params: {
          tenantId: tenant.id,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  console.log(machine?.connectionInputs);

  return (
    <div className="flex flex-col  gap-4">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-x-2 gap-y-3"
      >
        <Select
          name="name"
          required
          onValueChange={(value) => {
            setTelemetryData((prev) => ({
              ...prev,
              name: value,
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Telemetry" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {isAnalytic &&
                machine?.telemetries
                  ?.split(",")
                  .map((item: string, key: number) => {
                    return (
                      <SelectItem key={key} value={item}>
                        {item}
                      </SelectItem>
                    );
                  })}
              {!isDashboard
                ? machine?.connectionInputs?.map((item: any, index: number) => {
                    return (
                      <SelectItem
                        key={index}
                        value={item?.input?.label?.trimEnd()}
                      >
                        {item?.input?.label?.trimEnd()}
                      </SelectItem>
                    );
                  })
                : dashboardTelemetries.map((item: string, key: number) => {
                    return (
                      <SelectItem key={key} value={item}>
                        {item}
                      </SelectItem>
                    );
                  })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          className="rounded"
          placeholder={"label"}
          name="label"
          value={telemetryData.label}
          onChange={(e) => {
            setTelemetryData((prev) => ({
              ...prev,
              label: e.target.value,
            }));
          }}
        />
        <Input
          className="rounded"
          placeholder={"unit"}
          name="unit"
          value={telemetryData.unit}
          onChange={(e) => {
            setTelemetryData((prev) => ({
              ...prev,
              unit: e.target.value,
            }));
          }}
        />
        <ColorPicker
          className="rounded-md w-full !e !ring-0 h-9 outline-none border-none"
          color={telemetryData.color}
          onChange={(color) => {
            setTelemetryData((prev) => ({
              ...prev,
              color,
            }));
          }}
        />
        <Button type="submit" variant="outline" disabled={!telemetryData.name}>
          <PlusIcon size={18} />
        </Button>
      </form>
      {telemetries.length > 0 && (
        <ScrollArea className="max-h-[20rem] p-2  border rounded-lg">
          <Table className="w-full text-xs [&_th]:p-3">
            <thead>
              <tr>
                <th>telemetry</th>
                <th>label</th>
                <th>color</th>
              </tr>
            </thead>
            <tbody>
              {telemetries.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.label || item.name}</td>
                    <td>
                      <div className="flex items-center gap-4 justify-between">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() => {
                            deleteTelemetry(item);
                          }}
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
  const timeframes = [
    { value: "1H", title: "Hour" },
    { value: "1D", title: "Day" },
    { value: "1W", title: "Week" },
    { value: "1M", title: "Month" },
  ];
  const timeFrame = (data.attributes?.timeframe as string) || "1H";

  function setTimeframe(timeframe: string) {
    setAttribute("timeframe", timeframe);
  }
  return (
    <div className="flex w-full justify-stretch ">
      {timeframes.map((tf) => (
        <Button
          key={tf.value}
          variant={"outline"}
          onClick={() => setTimeframe(tf.value)}
          className={`w-full shadow-none  px-2 py-1 text-center ${
            timeFrame === tf.value && "border-blue-500"
          }`}
        >
          {tf.title}
        </Button>
      ))}
    </div>
  );
}
