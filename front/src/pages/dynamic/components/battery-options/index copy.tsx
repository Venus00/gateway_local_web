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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const Cards: {
  x: number;
  y: number;
  color: string;
  position: "center" | "left" | "right" | "reverseCenter";
  orientation: "horizontal" | "vertical";
}[] = [
  {
    x: 1,
    y: 2,
    color: "#d7d70d",
    position: "center",
    orientation: "horizontal",
  },
  {
    x: 2,
    y: 2,
    color: "#bd1f1f",
    position: "left",
    orientation: "vertical",
  },
  {
    x: 2,
    y: 2,
    color: "#8fd418",
    position: "right",
    orientation: "vertical",
  },
  {
    x: 1,
    y: 2,
    color: "#d7d70d",
    position: "reverseCenter",
    orientation: "horizontal",
  },
];
export default function BatteryOptions() {
  const { data, setAttribute } = useAddWidgetStore();

  const setCardType = (type: WidgetCardType) => {
    setAttribute("type", type);
  };

  const setIcon = (icon: string) => {
    setAttribute("icon", icon);
  };
  const setIsUrl = (isUrl: boolean) => {
    setAttribute("isUrl", isUrl);
  };

  const isUrl = data.attributes?.isUrl as boolean;
  const icon = data.attributes?.icon as string;

  const type = data.attributes?.type as WidgetCardType;

  const CardOption = useCallback(() => {
    if (type === "text") return <TextOption />;
    if (type === "telemetry") return <TelemetryOption />;
    return null;
  }, [type]);

  const [selectedType, setSelectedType] = useState<
    "left" | "center" | "reverseCenter" | "right"
  >("reverseCenter");
  return (
    <div className="flex flex-col gap-4 ">
      <div className="grid grid-cols-3 auto-rows-[4rem]  gap-4 grid-flow-dense p-2">
        {Cards.map((item, index) => {
          return (
            <div
              onClick={() => {
                setSelectedType(item.position);
                setAttribute("position", item.position);
                setAttribute("orientation", item.orientation);
              }}
              role="button"
              className={cn(
                "rounded-xl shadow-lg border bg-m gap-2 hover:duration-300 hover:scale-105 hover:-rotate-2 transition-transform active:scale-100 active:rotate-2",
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
              <Card1
                position={item.position as any}
                orientation={item.orientation}
              />
            </div>
          );
        })}
      </div>
      {/* <div className="flex items-center gap-8">
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
      {isUrl ? (
        <Input
          type="text"
          placeholder="icon url"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
        />
      ) : (
        <IconPicker onSelect={setIcon} />
      )} */}
      <RadioGroup
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
