/* eslint-disable @typescript-eslint/no-explicit-any */
import { WidgetCardType, widgetCardTypes } from "@/utils";
import { useCallback, useState } from "react";
import TextOption from "./text-option";
import TelemetryOption from "./telemetry-option";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAddWidgetStore } from "../../widget-store";
import Card1 from "./cards/card1";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
const Cards: {
  x: number;
  y: number;
  color: string;
  position: "center" | "left" | "right" | "reverseCenter";
}[] = [
    {
      x: 1,
      y: 2,
      color: "#d7d70d",
      position: "center",
    },
    {
      x: 2,
      y: 2,
      color: "#bd1f1f",
      position: "left",
    },
    {
      x: 2,
      y: 2,
      color: "#8fd418",
      position: "right",
    },
    {
      x: 1,
      y: 2,
      color: "#d7d70d",
      position: "reverseCenter",
    },
  ];
export default function ButtonOptions() {
  const { data } = useAddWidgetStore();
  const [isDark, setIsDark] = useState(false);
  const icon = data.attributes?.icon as string;
  const position = data.attributes?.position as string;
  const color = data.color as string;
  const iconColor = data.attributes?.iconColor as string;
  const title = (data.title as string) || "New Button widget";
  const backgroundColor = data.backgroundColor as string;
  const { theme, setTheme } = useTheme();
  const type = data.attributes?.type as WidgetCardType;
  return (
    <div className="flex flex-col gap-4 ">
      <div className={`flex flex-col items-end gap-2 p-4`}>
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
        <div className={`w-full `}>
          <Card1
            position={position as any}
            backgroundColor={backgroundColor}
            color={color}
            iconColor={iconColor}
            title={title}
            icon={icon || undefined} telemetryName={""} />
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
        </TabsList>
        <TabsContent value="basic">
          <BasicTab />
        </TabsContent>
        <TabsContent value="data">
          <DataTab />
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
  const setCardType = (type: WidgetCardType) => {
    setAttribute("type", type);
  };
  const type = data.attributes?.type as WidgetCardType;

  const CardOption = useCallback(() => {
    if (type === "text") return <TextOption />;
    if (type === "telemetry") return <TelemetryOption />;
    return null;
  }, [type]);
  return (
    <div className=" flex flex-col space-y-4">
      <RadioGroup
        className="flex items-center gap-2 w-full"
        defaultValue={type}
        onValueChange={(value) => setCardType(value as WidgetCardType)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={"telemetry"} />
          <Label htmlFor={"telemetry"}>{"telemetry"}</Label>
        </div>
      </RadioGroup>
      <CardOption />
    </div>
  );
}


