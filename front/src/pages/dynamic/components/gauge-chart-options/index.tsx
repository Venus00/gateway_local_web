import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GaugeWidgetData } from "@/utils";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { useLocation } from "react-router";
import { useGridStore } from "../../grid-store";
import { useAddWidgetStore } from "../../widget-store";
import ColorPicker from "@/components/color-picker";
import { array } from "zod";
export default function GaugeChartOptions() {
  const { data } = useAddWidgetStore();
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const { backgroundColor, color } = data;
  const { nrOfLevels, colors } = data.attributes as GaugeWidgetData;
  const [textColor, setTextColor] = useState("#000");
  useEffect(() => {
    if (theme === "dark") setTextColor("#fff");
    else setTextColor("#000");
  }, [theme]);
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
          className={"flex flex-col w-full h-full  border p-4 rounded-lg"}
          style={{
            backgroundColor,
            color,
          }}
        >
          <h3 className="!pb-1  first-letter:uppercase font-semibold truncate">
            {data.title || "New Gauge Chart"}
          </h3>
          <GaugeChart
            id={"id"}
            percent={50}
            nrOfLevels={nrOfLevels ?? 3}
            formatTextValue={(val) => {
              return `50.00 %`;
            }}
            animate={false}
            fontSize="28px"
            // animDelay={0}
            textColor={textColor}
            className="w-full justify-center flex"
            colors={colors || ["#00FF00", "#FFFF00", "#FF0000"]}
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
  const { data, setAttribute } = useAddWidgetStore();
  const { theme } = useTheme();
  const { telemetryName, unit, minValue, maxValue, nrOfLevels } =
    data.attributes as GaugeWidgetData;
  const [selectedNrOfLevels, setSelectedNrOfLevels] = useState(nrOfLevels ?? 3);
  const { dashboard } = useGridStore();
  const location = useLocation();
  const machineId = location.pathname.split("/")[2];
  const dashboardItem = dashboard.find(
    (machine: { machineId: number }) => machine.machineId === Number(machineId)
  );
  const isAnalytic = location.pathname.startsWith("/analytic");
  const machine = dashboardItem ? dashboardItem.machine : undefined;
  const nrOfLevelsList = [3, 10, 20, 30];
  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex  flex-col gap-1">
        <Label htmlFor="telemetrie">Telemetrie</Label>
        <Select
          name="telemetryData"
          required
          value={telemetryName || undefined}
          onValueChange={(value) => {
            setAttribute("telemetryName", value);
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
      </div>
      <div className="flex  flex-col gap-1">
        <Label htmlFor="unit">Unit</Label>
        <Input
          className="rounded"
          //   placeholder={t("unit")}
          placeholder="unit"
          name="unit"
          value={unit}
          onChange={(e) => {
            setAttribute("unit", e.target.value);
          }}
        />
      </div>
      <div className="flex  flex-col gap-1">
        <Label htmlFor="minValue">Min Value</Label>
        <Input
          className="rounded"
          //   placeholder={t("label")}
          placeholder="Min Value"
          name="minValue"
          type="number"
          value={minValue}
          onChange={(e) => {
            setAttribute("minValue", +e.target.value);
          }}
        />
      </div>
      <div className="flex  flex-col gap-1">
        <Label htmlFor="maxValue">Max Value</Label>
        <Input
          className="rounded"
          //   placeholder={t("label")}
          placeholder="Max Value"
          type="number"
          min={minValue}
          name="maxValue"
          value={maxValue}
          onChange={(e) => {
            setAttribute("maxValue", +e.target.value);
          }}
        />
      </div>
    </div>
  );
}

function AppearanceTab() {
  const { theme } = useTheme();
  const [textColor, setTextColor] = useState("#000");
  useEffect(() => {
    if (theme === "dark") setTextColor("#fff");
    else setTextColor("#000");
  }, [theme]);
  const { data, setBackgroundColor, setColor, setAttribute } =
    useAddWidgetStore();
  const { nrOfLevels, colors } = data.attributes as GaugeWidgetData;
  const [selectedNrOfLevels, setSelectedNrOfLevels] = useState(nrOfLevels ?? 3);
  const [selectedColors, setSelectedColors] = useState(
    colors || ["#00FF00", "#FFFF00", "#FF0000"]
  );
  const backgroundColor = data.backgroundColor as string;
  const color = data.color as string;
  const nrOfLevelsList = [3, 10, 20, 30];
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
      <div className="grid grid-cols-[10rem,1fr] items-center gap-2">
        <Label htmlFor="color">Gauge Colors</Label>
        <div className="flex  gap-4">
          {selectedColors?.map((color, index) => {
            return (
              <ColorPicker
                key={index}
                className="rounded-md w-24 !e !ring-0 h-6 outline-none border-none"
                color={color}
                onChange={(color) => {
                  const newColors = [...selectedColors];
                  newColors[index] = color;
                  setAttribute("colors", newColors);
                  setSelectedColors(newColors);
                }}
              />
            );
          })}
        </div>
        {/* <ColorPicker
          className="rounded-md w-24 !e !ring-0 h-6 outline-none border-none"
          color={color}
          onChange={(color) => setAttribute("colors", [])}
        />
        <ColorPicker
          className="rounded-md w-24 !e !ring-0 h-6 outline-none border-none"
          color={color}
          // onChange={}
        />
        <ColorPicker
          className="rounded-md w-24 !e !ring-0 h-6 outline-none border-none"
          color={color}
          onChange={setColor}
        />*/}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="maxValue">Gauge Style</Label>
        <div className="grid grid-cols-3 gap-3">
          {nrOfLevelsList.map((item, index) => {
            return (
              <div
                key={index}
                className={`rounded-lg border-2 p-2 cursor-pointer  ${
                  selectedNrOfLevels === item ? "border-primary" : ""
                }`}
                onClick={() => {
                  setAttribute("nrOfLevels", +item);
                  setSelectedNrOfLevels(+item);
                }}
              >
                <GaugeChart
                  id={`${index}`}
                  percent={0}
                  nrOfLevels={item}
                  textColor={textColor}
                  colors={["#177e76"]}
                  hideText
                />
              </div>
            );
          })}{" "}
        </div>
      </div>
    </div>
  );
}
function TimeframeTab() {
  const { data, setAttribute } = useAddWidgetStore();
  const timeframe = (data.attributes?.timeframe as string) || "lastValue";
  const setTimeframe = (timeframe: string) => {
    setAttribute("timeframe", timeframe);
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      <div
        onClick={() => setTimeframe("lastValue")}
        role="button"
        className={`border cursor-pointer rounded-lg p-4 ${
          timeframe === "lastValue" && "border-blue-500"
        }`}
      >
        <h1 className="font-semibold">Valeur actuelle</h1>
        <p className="text-muted-foreground text-sm">
          Afficher la derniere valeur
        </p>
      </div>
      <div
        onClick={() => setTimeframe("customTimeframe")}
        role="button"
        className={`border cursor-pointer rounded-lg p-4 ${
          timeframe === "customTimeframe" && "border-blue-500"
        }`}
      >
        <h1 className="font-semibold">Operation de la gamme temporelle</h1>
        <p className="text-muted-foreground text-sm">
          Affichage du min, du max, de la moyenne ou de la variation sur une
          période donnée
        </p>
      </div>
    </div>
  );
}
