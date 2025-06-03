/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@/components/theme-provider";
import { useSocket } from "@/features/socket/SockerProvider";
import { GaugeWidgetData, Widget } from "@/utils";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import GaugeChart from "react-gauge-chart";
import { cn } from "@/lib/utils";

export default function GaugeChartWidget(props: Widget) {
  const socket = useSocket();
  // const gaugeData = props.attributes as GaugeWidgetData;
  const { telemetryName, maxValue, minValue, unit, nrOfLevels, colors } =
    props.attributes as GaugeWidgetData;
  const location = useLocation();
  const { theme } = useTheme();
  const [textColor, setTextColor] = useState("#000");
  useEffect(() => {
    if (theme === "dark") setTextColor("#fff");
    else setTextColor("#000");
  }, [theme]);
  const machineId = location.pathname.split("/")[2];
  const [telemetrieData, setTelemetrieData] = useState<any>(0);
  const [realValue, setRealValue] = useState<any>(0);
  useEffect(() => {
    if (
      !socket ||
      !machineId ||
      !telemetryName ||
      minValue == null ||
      maxValue == null
    )
      return;
    setTimeout(() => {
      socket.on(`machineData/${machineId}`, (data) => {
        const payload = JSON.parse(data);
        let value;
        const payloadValue = Number(payload?.value);
        if (telemetryName === payload.name && maxValue && minValue) {
          const min = minValue;
          const max = maxValue;
          const totalRange = max - min;
          const distanceFromMin = payloadValue - min;
          value = distanceFromMin / totalRange;
          setTelemetrieData(value);
          setRealValue(payloadValue);
        }
      });
    }, 1000);

    return () => {
      socket.off(`machineData/${machineId}`);
    };
  }, [socket, machineId, telemetryName, minValue, maxValue]);

  const id = "chart-" + props.id;
  return (
    <div className=" w-full h-full  items-center flex flex-col gap-2 overflow-hidden">
      <div className="flex gap-3  px-4 text-sm w-full justify-start">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors ? colors[0] : "#00ff00" }}
          ></div>
          <span>
            Min: {minValue} {unit}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors ? colors[2] : "#ff0000" }}
          ></div>
          <span>
            Max: {maxValue}
            {unit}
          </span>
        </div>
      </div>
      <GaugeChart
        id={id}
        percent={telemetrieData}
        nrOfLevels={nrOfLevels ?? 3}
        formatTextValue={(val) => {
          const unitValue = unit ? unit : "";
          return realValue.toFixed(2) + " " + unitValue;
        }}
        fontSize="28px"
        textColor={textColor}
        // className={cn("debug", {})}
        colors={colors ?? ["#00FF00", "#FFFF00", "#FF0000"]}
      />
    </div>
  );
}
