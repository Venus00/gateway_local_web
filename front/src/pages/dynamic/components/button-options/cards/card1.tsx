import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, hexToRgb } from "@/lib/utils";

function Card1({
  position,
  telemetryName,
  trigger,
  title,
  backgroundColor,
  color,
  iconColor,
  h,
  w,
}: {
  telemetryName:string;
  position: "center" | "left" | "right" | "reverseCenter";
  icon?: string;
  trigger?: () => void;
  telemetryAnalytic?: string;
  title?: string;
  backgroundColor?: string;
  color?: string;
  iconColor?: string;
  h?: number;
  w?: number;
}) {
  const hexColor = hexToRgb(iconColor);

  return (
    <Card
      className="flex  items-center overflow-hidden rounded-lg justify-center  dark:bg-neutral-800 gap-5 p-4  w-full h-full"
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
      <div
        className={cn("flex flex-col gap-2 flex-1 overflow-hidden ", {
          "items-center h-1 w-full":
            position === "center" || position === "reverseCenter",
          "items-start w-1": position === "left" || position === "right",
        })}
      >
        {title ? (
          <h3
            className={cn("  first-letter:uppercase  font-bold", {
              "truncate max-w-max ...": h && h === 1,
              "text-sm": w && w === 2,
            })}
          >
            {title}
            <h4 className="font-light">{telemetryName}</h4>
          </h3>
        ) : (
          <Skeleton className="rounded-full [animation-play-state:paused] w-full h-6" />
        )}
        <Button className="rounded-lg" onClick={() => trigger && trigger()}>{title}</Button>

      </div>
    </Card>
  );
}

export default Card1;
