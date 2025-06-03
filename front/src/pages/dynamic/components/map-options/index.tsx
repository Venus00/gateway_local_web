import { Table } from "@/components/table";
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
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { MapTelemetry, MapWidgetData } from "@/utils";
import { Moon, Pen, PlusIcon, Sun, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useGridStore } from "../../grid-store";
import { useAddWidgetStore } from "../../widget-store";

import ColorPicker from "@/components/color-picker";
import { useTheme } from "@/components/theme-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WidgetMap from "../map-widget/Map";
const defaultTelemetry: MapTelemetry = {
  label: "",
  longitude: "",
  latitude: "",
};

export default function MapOptions() {
  const { data } = useAddWidgetStore();
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const { backgroundColor, color } = data;

  const telemetrieData = [
    {
      label: "location 1 ",
      latitude: "lat",
      longitude: "lon",
      lat: 34.515,
      lon: -5,
    },
  ];
  return (
    <div className="flex flex-col  gap-4 relative z-[9999]">
      <div className={`flex flex-col items-end gap-2 p-3 h-[480px] `}>
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
          className={"flex-1  w-full h-[180px] border p-4 rounded-lg"}
          style={{
            backgroundColor,
            color,
          }}
        >
          <h3 className="!pb-1  first-letter:uppercase font-semibold truncate">
            {data.title || "New Map Widget"}
          </h3>
          <WidgetMap locations={telemetrieData} />
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
        <TabsContent value="timeframe">{/* <TimeframeTab /> */}</TabsContent>
      </Tabs>
    </div>
  );
}
function DataTab() {
  const { data, addMapTelemetry, deleteMapTelemetry, editMapTelemetry } =
    useAddWidgetStore();
  const [telemetryData, setTelemetryData] = useState(defaultTelemetry);
  const [isEdit, setIsEdit] = useState<string | null>(null);
  const { dashboard } = useGridStore();
  const location = useLocation();
  const machineId = location.pathname.split("/")[2];
  const dashboardItem = dashboard.find(
    (machine: { machineId: number }) => machine.machineId === Number(machineId)
  );
  const machine = dashboardItem ? dashboardItem.machine : undefined;
  const isAnalytic = location.pathname.startsWith("/analytic");
  const isDashboard = location.pathname.startsWith("/dashboard");

  const { telemetries = [] } = data.attributes as MapWidgetData;
  // console.log("telemetries", telemetries);
  const { tenant } = useSelector((state: RootState) => state.auth);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();

    if (!telemetryData.latitude || !telemetryData.longitude) return;
    if (isEdit) {
      editMapTelemetry(telemetryData, isEdit);
      setIsEdit(null);
      return;
    }
    addMapTelemetry(telemetryData);
    setTelemetryData(defaultTelemetry);
  }
  console.log(isEdit);

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

  return (
    <div className="flex flex-col gap-4 relative z-[9999]">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-x-2 gap-y-3"
      >
        <div>
          <Label htmlFor="telemetry">Label</Label>
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
        </div>
        <div className="">
          <Label htmlFor="latitude">Latitude</Label>
          <Select
            name="latitude"
            required
            value={telemetryData.latitude}
            onValueChange={(value) => {
              setTelemetryData((prev) => ({
                ...prev,
                latitude: value,
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
                    ?.filter((i: string) => i !== telemetryData.longitude)
                    ?.map((item: string, key: number) => {
                      return (
                        <SelectItem key={key} value={item}>
                          {item}
                        </SelectItem>
                      );
                    })}
                {!isDashboard
                  ? machine?.connectionInputs?.map(
                      (item: any, index: number) => {
                        return (
                          <SelectItem
                            key={index}
                            value={item?.input?.label?.trimEnd()}
                          >
                            {item?.input?.label?.trimEnd()}
                          </SelectItem>
                        );
                      }
                    )
                  : dashboardTelemetries
                      ?.filter((i: string) => i !== telemetryData.longitude)
                      ?.map((item: string, key: number) => {
                        return (
                          <SelectItem key={key} value={item}>
                            {item}
                          </SelectItem>
                        );
                      })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="">
          <Label htmlFor="longitude">Longitude</Label>
          <Select
            name="longitude"
            required
            value={telemetryData.longitude}
            onValueChange={(value) => {
              setTelemetryData((prev) => ({
                ...prev,
                longitude: value,
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
                    ?.filter((i: string) => i !== telemetryData.latitude)
                    ?.map((item: string, key: number) => {
                      return (
                        <SelectItem key={key} value={item}>
                          {item}
                        </SelectItem>
                      );
                    })}
                {!isDashboard
                  ? machine?.connectionInputs?.map(
                      (item: any, index: number) => {
                        return (
                          <SelectItem
                            key={index}
                            value={item?.input?.label?.trimEnd()}
                          >
                            {item?.input?.label?.trimEnd()}
                          </SelectItem>
                        );
                      }
                    )
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
        </div>

        <Button type="submit" variant="outline" disabled={!telemetryData.label}>
          {isEdit ? <Pen size={18} /> : <PlusIcon size={18} />}
        </Button>
      </form>
      {telemetries.length > 0 && (
        <ScrollArea className="max-h-[20rem] p-2  border rounded-lg">
          <Table className="w-full text-xs [&_th]:p-3">
            <thead>
              <tr>
                <th>Label</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>
            <tbody>
              {telemetries.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.label}</td>
                    <td>{item.latitude}</td>
                    <td>
                      <div className="flex items-center gap-4 justify-between">
                        {item.longitude}
                        <div className="flex items-center gap-2 ">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 border-0"
                            onClick={() => {
                              console.log(item);
                              setIsEdit(item.label);
                              setTelemetryData(item);
                            }}
                          >
                            <Pen size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 text-red-500 border-0 hover:text-white hover:bg-red-500 rounded-lg"
                            onClick={() => {
                              deleteMapTelemetry(item);
                            }}
                          >
                            <TrashIcon size={16} />
                          </Button>
                        </div>
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
