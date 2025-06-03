import { WidgetType } from "@/utils";
import { cn } from "@/lib/utils";
import { useAddWidgetStore } from "../../widget-store";

import Card from "@/assets/widgets/card.svg";
import Area from "@/assets/widgets/area.svg";
import Bar from "@/assets/widgets/bar.svg";
import Donut from "@/assets/widgets/donut.svg";
import Gauge from "@/assets/widgets/gauge.svg";
import Line from "@/assets/widgets/line.svg";
import Pie from "@/assets/widgets/pie.svg";
import Table from "@/assets/widgets/table.svg";
import Video from "@/assets/widgets/video.svg";
import Battery from "@/assets/widgets/battery2.svg";
import Circular from "@/assets/widgets/circular.svg";
import Map from "@/assets/widgets/map-marker.svg";
import Button from "@/assets/widgets/button.svg";
// import ProgressGauge from "@/assets/widgets/images.svg";
import { useEffect, useRef } from "react";
const AreaImage = ({ src, colors }: { src: string; colors: string[] }) => {
  const imgRef: any = useRef();

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.querySelector("svg");
        // Modify all paths/shapes
        svgElement?.querySelectorAll("path").forEach((el, index) => {
          if (!colors[index]) return;
          el.setAttribute("fill", colors[index]);
        });
        svgElement?.setAttribute("height", "60px");
        svgElement?.setAttribute("width", "80px");
        imgRef.current?.parentNode?.replaceChild(
          imgRef.current?.ownerDocument.importNode(svgElement, true),
          imgRef.current
        );
      });
  }, [colors, src]);

  return <img ref={imgRef} src={src} className=" " alt="Area Widget" />;
};
const WidgetMap: Record<WidgetType, React.ReactNode> = {
  areaChart: <AreaImage colors={[]} src={Area} />,
  barChart: <AreaImage colors={["#92571d", "", ""]} src={Bar} />,
  card: <AreaImage colors={[]} src={Card} />,
  donutChart: <AreaImage colors={["", "", "#92571d"]} src={Donut} />,
  gauge: <AreaImage colors={["", "", "#92571d"]} src={Gauge} />,
  // progressGauge: <AreaImage colors={["#177e76", "", ""]} src={ProgressGauge} />,
  circular: <AreaImage colors={["#92571d", "#f39130", ""]} src={Circular} />,
  lineChart: <AreaImage colors={[]} src={Line} />,
  pieChart: <AreaImage colors={["", "", "#92571d", ""]} src={Pie} />,
  table: <AreaImage colors={[]} src={Table} />,
  video: <AreaImage colors={["", "#92571d"]} src={Video} />,
  battery: <AreaImage colors={["#f39130"]} src={Battery} />,
  map: <AreaImage colors={["#f39130"]} src={Map} />,
  button: <AreaImage colors={["#f39130"]} src={Button} />,
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  type: WidgetType;
  active?: boolean;
}

export default function WidgetLogo({ type, className, ...props }: Props) {
  const { setType, data } = useAddWidgetStore();
  const active = data.type === type;
  const isAnalytic = location.pathname.startsWith("/analytic");
  return (
    <div
      className={cn(
        "flex  p-2 gap-2  overflow-hidden border dark:bg-white/25 relative rounded-lg transition-colors cursor-pointer hover:bg-gray-500/5 outline outline-transparent active:shadow-inner shadow-black/10",
        {
          "bg-primary/10 dark:bg-neutral-400 hover:bg-primary-500/10": active,
          hidden: !isAnalytic && type == "button",
        },
        className
      )}
      role="button"
      onClick={() => {
        setType(type);
      }}
      {...props}
    >
      <div className="w-[15%] flex-shrink-0 flex justify-center items-center [&>*]:fill-card-foreground text-primary">
        {WidgetMap[type]}
      </div>
      <div className="flex flex-col justify-center items-start ">
        <h1 className=" text-sm capitalize w-full font- text-gray-900 dark:text-white text-start">
          {type}
        </h1>
        <p
          className={cn("text-xs text-gray-500  w-full text-start", {
            "dark:text-gray-700": active,
            "dark:text-gray-400": !active,
          })}
        >
          Displays a {type} widget.
        </p>
      </div>
    </div>
  );
}
