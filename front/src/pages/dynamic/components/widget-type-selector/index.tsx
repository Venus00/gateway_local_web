import { cn } from "@/lib/utils";
import { widgetTypes } from "@/utils";
import WidgetLogo from "../widget-logo";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function WidgetTypeSelector({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <ScrollArea className=" ">
      <div className={cn("grid grid-cols-2 mt-2 gap-4 h-fit ", className)}>
        {widgetTypes.map((item) => (
          <WidgetLogo key={item} type={item} />
        ))}
      </div>
    </ScrollArea>
  );
}
