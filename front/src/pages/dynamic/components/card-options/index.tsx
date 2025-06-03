/* eslint-disable @typescript-eslint/no-explicit-any */
import { WidgetCardType, widgetCardTypes } from "@/utils";
import { useCallback, useState } from "react";
import TextOption from "./text-option";
import TelemetryOption from "./telemetry-option";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAddWidgetStore } from "../../widget-store";
import { IconPicker } from "@/components/icon-picker";
import Card1 from "./cards/card1";
import { cn, hexToRgb } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import ColorPicker from "@/components/color-picker";
import { Icon } from "@/components/icon";
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
export default function CardOptions() {
  const { data } = useAddWidgetStore();
  const [isDark, setIsDark] = useState(false);
  const isUrl = data.attributes?.isUrl as boolean;
  const icon = data.attributes?.icon as string;
  const position = data.attributes?.position as string;
  const color = data.color as string;
  const iconColor = data.attributes?.iconColor as string;
  const title = (data.title as string) || "New Card widget";
  const backgroundColor = data.backgroundColor as string;
  const { theme, setTheme } = useTheme();
  const type = data.attributes?.type as WidgetCardType;
  const content =
    type === "text"
      ? (data.attributes?.content as string) || "Content"
      : "0.00";
  const unit = data.attributes?.unit as string;
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
            content={content}
            icon={icon || undefined}
            isUrl={isUrl}
            unit={unit}
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
        {widgetCardTypes.map((item) => {
          return (
            <div key={item} className="flex items-center space-x-2">
              <RadioGroupItem value={item} id={item} />
              <Label htmlFor={item}>{item}</Label>
            </div>
          );
        })}
      </RadioGroup>
      <CardOption />
    </div>
  );
}

function AppearanceTab() {
  const { data, setAttribute, setBackgroundColor, setColor } =
    useAddWidgetStore();
  const backgroundColor = data.backgroundColor as string;
  const color = data.color as string;
  const isUrl = data.attributes?.isUrl as boolean;
  const icon = data.attributes?.icon as string;
  const [selectedType, setSelectedType] = useState<
    "left" | "center" | "reverseCenter" | "right"
  >("left");
  const setIcon = (icon: string) => {
    setAttribute("icon", icon);
  };
  const setIsUrl = (isUrl: boolean) => {
    setAttribute("isUrl", isUrl);
  };
  return (
    <div className="flex flex-col gap-4  ">
      <div className="grid grid-cols-3 auto-rows-[4rem]  gap-4 grid-flow-dense p-2">
        {Cards.map((item, index) => {
          return (
            <div
              onClick={() => {
                setSelectedType(item.position);
                setAttribute("position", item.position);
              }}
              role="button"
              className={cn(
                "rounded-lg shadow-lg  border bg-m gap-2 hover:duration-300 hover:scale-105 hover:-rotate-2 transition-transform active:scale-100 active:rotate-2",
                {
                  "border-primary": item.position === selectedType,
                }
              )}
              key={index}
              style={{
                gridColumn: `span ${item.x}`,
                gridRow: `span ${item.y}`,
              }}
            >
              <Card1 position={item.position as any} />
            </div>
          );
        })}
      </div>
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
      <div className="flex items-center gap-8">
        <Label htmlFor="icon">Icon</Label>
        <RadioGroup
          value={isUrl ? "url" : "lucid"}
          onValueChange={(value) => {
            setIsUrl(value === "url");
            if (value === "url") setIcon("");
          }}
          className="flex items-center"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lucid" id="lucid" />
            <Label htmlFor="lucid">lucid</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="url" id="url" />
            <Label htmlFor="url">url</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="w-[60%] p-2 border rounded-md">
        {isUrl ? (
          <Input
            type="text"
            placeholder="icon url"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
        ) : (
          <IconPicker onSelect={setIcon} icon={icon} />
        )}
      </div>
      <div className="flex items-center gap-6 w-full ">
        <div className="grid grid-cols-[10rem,1fr] items-center gap-2">
          <Label htmlFor="iconColor">Icon Color</Label>
          <ColorPicker
            className="rounded-md w-24 !e !ring-0 h-6 outline-none border-none"
            color={data.attributes?.iconColor as string}
            onChange={(color) => {
              setAttribute("iconColor", color);
            }}
          />
        </div>
        {!isUrl && (data.attributes?.icon as string) && (
          <div
            className={`border  rounded-full p-2 w-16 h-16 flex items-center justify-center`}
            style={{
              color: data.attributes?.iconColor as string,
              background: `linear-gradient(
                    to bottom,
                    rgba(${hexToRgb(data.attributes?.iconColor as string).r}, ${hexToRgb(data.attributes?.iconColor as string).g
                }, ${hexToRgb(data.attributes?.iconColor as string).b
                }, 0.2),    /* Fully transparent */
                    rgba(${hexToRgb(data.attributes?.iconColor as string).r}, ${hexToRgb(data.attributes?.iconColor as string).g
                }, ${hexToRgb(data.attributes?.iconColor as string).b
                }, 0.6)      /* Full color (#3B82F6) */
                  )`,
            }}
          >
            <Icon name={icon} strokeWidth={1.5} className="shrink-0 size-10 " />
          </div>
        )}
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
        className={`border cursor-pointer rounded-lg p-4 ${timeframe === "lastValue" && "border-blue-500"
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
        className={`border cursor-pointer rounded-lg p-4 ${timeframe === "customTimeframe" && "border-blue-500"
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
