import { Icon } from "@/components/icon";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, hexToRgb } from "@/lib/utils";
import { useEffect, useState } from "react";

function Card1({
  position,
  icon,
  content,
  title,
  backgroundColor,
  color,
  iconColor,
  isUrl,
  unit,
  h,
  w,
}: {
  position: "center" | "left" | "right" | "reverseCenter";
  icon?: string;
  content?: string;
  telemetryAnalytic?: string;
  title?: string;
  backgroundColor?: string;
  color?: string;
  iconColor?: string;
  isUrl?: boolean;
  unit?: string;
  h?: number;
  w?: number;
}) {
  // const iconCol = `${iconColor}33`;
  const hexColor = hexToRgb(iconColor);
  const [blip, setBlip] = useState(false);
  // const {getWidgetSize} = useGridStore();
  // console.log("h,w", h, w);
  useEffect(() => {
    setBlip(true);
    const timer = setTimeout(() => {
      setBlip(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [content]);
  return (
    <Card
      className="flex  items-center overflow-hidden rounded-lg  justify-center  dark:bg-neutral-800 gap-5 p-4  w-full h-full"
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
      {!icon ? (
        <Skeleton className="rounded-full [animation-play-state:paused] size-12 shrink-0" />
      ) : (
        <div
          className={cn(
            `border  rounded-full p-2  flex items-center justify-center`,
            {
              "w-12 h-12": h && h === 1,
              "w-14 h-14": w && h && w >= 2 && h === 2,
              "w-24 h-24": w && h && w >= 3 && h >= 3,
            }
          )}
          style={{
            color: iconColor,
            background: `linear-gradient(
            to bottom,
            rgba(${hexColor.r}, ${hexColor.g}, ${hexColor.b}, 0.2),    /* Fully transparent */
            rgba(${hexColor.r}, ${hexColor.g}, ${hexColor.b}, 0.6)      /* Full color (#3B82F6) */
          )`,
          }}
        >
          {isUrl ? (
            <img src={icon} alt="icon" className="size-14 object-contain " />
          ) : (
            <Icon
              name={icon}
              strokeWidth={1.5}
              className={cn("shrink-0  ", {
                "size-6": h && h === 1,
                "size-8": w && h && h === 2,
                "size-10": w && h && h > 2,
              })}
            />
          )}
        </div>
      )}
      <div
        className={cn("flex flex-col gap-2 flex-1 overflow-hidden ", {
          "items-center h-1 w-full":
            position === "center" || position === "reverseCenter",
          "items-start w-1": position === "left" || position === "right",
        })}
      >
        {title ? (
          <h3
            className={cn("  first-letter:uppercase  ", {
              "truncate max-w-max ...": h && h === 1,
              "text-sm": w && w === 2,
            })}
          >
            {title}
          </h3>
        ) : (
          <Skeleton className="rounded-full [animation-play-state:paused] w-full h-6" />
        )}
        {content ? (
          <div
            className={cn("flex items-end gap-1 w-full ", {
              "justify-center":
                position === "center" || position === "reverseCenter",
              "text-primary": blip,
            })}
          >
            <h1
              className={cn(
                "  first-letter:uppercase truncate max-w-full whitespace-pre-line",
                {
                  "text-sm": !h || !w,
                  "text-3xl": h === 1,
                  "text-5xl": w && h && w >= 2 && h >= 2,
                  "text-7xl": w && h && w >= 2 && h >= 2,
                  // "text-5xl": w && h && w >= 3 && h > 3,
                }
              )}
            >
              {content}
            </h1>
            {unit && (
              <span
                className={cn(" text-muted-foreground font-normal", {
                  "text-sm": h === 1,
                  "text-lg": h && h >= 2,
                  "text-2xl": h && h >= 3,
                  // "text-5xl": w && h && w >= 3 && h > 3,
                })}
              >
                {unit}
              </span>
            )}
          </div>
        ) : (
          <Skeleton className="rounded-full [animation-play-state:paused] w-full h-4" />
        )}
      </div>
    </Card>
  );
}

export default Card1;
