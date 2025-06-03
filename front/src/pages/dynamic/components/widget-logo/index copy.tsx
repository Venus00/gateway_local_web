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
        svgElement?.setAttribute("height", "75px");
        svgElement?.setAttribute("width", "91px");
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
  barChart: <AreaImage colors={["#177e76", "", ""]} src={Bar} />,
  card: <AreaImage colors={[]} src={Card} />,
  donutChart: <AreaImage colors={["", "", "#177e76"]} src={Donut} />,
  gauge: <AreaImage colors={["", "", "#177e76"]} src={Gauge} />,
  // progressGauge: <AreaImage colors={["#177e76", "", ""]} src={ProgressGauge} />,
  circular: <AreaImage colors={["#177e76", "#167f70", ""]} src={Circular} />,
  lineChart: <AreaImage colors={[]} src={Line} />,
  pieChart: <AreaImage colors={["", "", "#177e76", ""]} src={Pie} />,
  table: <AreaImage colors={[]} src={Table} />,
  video: <AreaImage colors={[]} src={Video} />,
  battery: <AreaImage colors={["#177e76"]} src={Battery} />,
  map: <AreaImage colors={["#177e76"]} src={Map} />,
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  type: WidgetType;
  active?: boolean;
}

export default function WidgetLogo({ type, className, ...props }: Props) {
  const { setType, data } = useAddWidgetStore();
  const active = data.type === type;
  return (
    <div
      className={cn(
        "flex flex-col p-2 gap-2 overflow-hidden  dark:bg-white/25 relative rounded-lg transition-colors cursor-pointer hover:bg-gray-500/5 outline outline-transparent active:shadow-inner shadow-black/10",
        {
          "bg-primary/10 dark:bg-neutral-400 hover:bg-primary-500/10": active,
        },
        className
      )}
      role="button"
      onClick={() => {
        setType(type);
      }}
      {...props}
    >
      <div className="w-full aspect-square  flex justify-center items-center [&>*]:fill-card-foreground text-teal-500">
        {WidgetMap[type]}
      </div>
      <div className="text-center text-sm capitalize w-fit">{type}</div>
    </div>
  );
}
