import { Icon } from "@/components/icon";
import { useTheme } from "@/components/theme-provider";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import BatteryGauge from "react-battery-gauge";

const customization = {
  batteryBody: {
    strokeWidth: 4,
    cornerRadius: 6,
    fill: "none",
    strokeColor: "hsl(var(--primary) / 0.2)",
  },
  batteryCap: {
    fill: "none",
    strokeWidth: 4,
    strokeColor: "hsl(var(--primary) / 0.2)",
    cornerRadius: 2,
    capToBodyRatio: 0.4,
  },
  batteryMeter: {
    fill: "hsl(var(--primary) / 0.1)",
    lowBatteryValue: 15,
    lowBatteryFill: "red",
    outerGap: 1,
    noOfCells: 1, // more than 1, will create cell battery
    interCellsGap: 1,
  },
  readingText: {
    display: "none",
    lightContrastColor: "#111",
    darkContrastColor: "#fff",
    lowBatteryColor: "red",
    fontFamily: "Helvetica",
    fontSize: 14,
    showPercentage: true,
  },
  chargingFlash: {
    scale: undefined,
    fill: "orange",
    animated: true,
    animationDuration: 1000,
  },
};
const darkModeCustomization = {
  batteryBody: {
    strokeWidth: 4,
    cornerRadius: 6,
    fill: "none",
    strokeColor: "#737373",
  },
  batteryCap: {
    fill: "none",
    strokeWidth: 4,
    strokeColor: "#737373",
    cornerRadius: 2,
    capToBodyRatio: 0.4,
  },
  batteryMeter: {
    // fill: "hsl(var(--primary) / 0.1)",
    lowBatteryValue: 20,
    lowBatteryFill: "red",
    outerGap: 1,
    noOfCells: 1, // more than 1, will create cell battery
    interCellsGap: 1,
  },
  readingText: {
    lightContrastColor: "#fff",
    darkContrastColor: "#fff",
    lowBatteryColor: "red",
    fontFamily: "Helvetica",
    fontSize: 14,
    showPercentage: true,
  },
  chargingFlash: {
    scale: undefined,
    fill: "orange",
    animated: true,
    animationDuration: 1000,
  },
};

function Card1({
  position,
  orientation,
  icon,
  content,
  title,
  backgroundColor,
  color,
  isUrl,
}: {
  position: "center" | "left" | "right" | "reverseCenter";
  orientation?: "horizontal" | "vertical";
  icon?: string;
  content?: string;
  title?: string;
  backgroundColor?: string;
  color?: string;
  isUrl?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <Card
      className="flex dark:bg-neutral-800  gap-3  items-center  p-4 w-full h-full"
      style={{
        flexDirection:
          position === "center"
            ? "column"
            : position === "reverseCenter"
            ? "column-reverse"
            : position === "left"
            ? "row"
            : (position === "right" && "row-reverse") || "row",
        justifyContent:
          position === "center" || position == "reverseCenter"
            ? "center"
            : "flex-start",
        backgroundColor,
        color,
      }}
    >
      {title ? (
        <h3 className="text-xl min-w-24 first-letter:uppercase font-semibold">
          {title}
        </h3>
      ) : (
        <Skeleton className="rounded-full [animation-play-state:paused] w-full h-6" />
      )}

      {content ? (
        <BatteryGauge
          value={+content}
          size={100}
          animated
          customization={theme !== "light" ? darkModeCustomization : undefined}
          orientation={orientation}
          className=""
        />
      ) : (
        <BatteryGauge
          value={100}
          size={80}
          customization={customization}
          orientation={orientation}
        />
      )}
    </Card>
  );
}

export default Card1;
