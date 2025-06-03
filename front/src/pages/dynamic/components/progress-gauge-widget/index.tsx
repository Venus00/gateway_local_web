/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@/components/theme-provider";
import { useSocket } from "@/features/socket/SockerProvider";
import { GaugeWidgetData, Widget } from "@/utils";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useLocation } from "react-router";

function getStopColor(value: number, stops: { stop: number; color: string }[]) {
  // Sort stops by their stop value in ascending order
  const sortedStops = stops.sort((a, b) => a.stop - b.stop);

  // Find the first stop where the value is less than or equal to the stop threshold
  for (let i = 0; i < sortedStops.length; i++) {
    if (value <= sortedStops[i].stop) {
      return sortedStops[i].color;
    }
  }

  // If value exceeds all defined stops, return the color of the last stop
  return sortedStops[sortedStops.length - 1]?.color ?? "#ff0000";
}
export default function ProgressGaugeWidget(props: Widget) {
  // const gaugeData = props.attributes as GaugeWidgetData;
  const telemetries = (props.attributes?.telemetries ||
    []) as GaugeWidgetData[];
  const socket = useSocket();
  const location = useLocation();
  const { theme } = useTheme();
  const machineId = location.pathname.split("/")[2];
  const [telemetrieData, setTelemetrieData] = useState<any[]>([50]);
  const [colorStop, setColorStop] = useState<string>("#ff0000");
  useEffect(() => {
    if (!socket) return;
    socket.on(`machineData/${machineId}`, (data) => {
      const payload = JSON.parse(data);
      if (telemetries[0].telemetryName === payload.name) {
        setTelemetrieData([Number(payload?.value)]);
        const colorStop = getStopColor(
          Number(payload?.value),
          telemetries[0].stops
        );
        setColorStop(colorStop);
      }
      // setTelemetrieData((prev) => {
      //   const newTelemetriesData = prev.map((item: any, index: number) => {
      //     if (telemetries[0].telemetryName === payload.name) {
      //       return [Number(payload?.value)];
      //     }
      //     return item;
      //   });
      //   return newTelemetriesData;
      // });
    });
    return () => {
      socket.off(`machineData/${machineId}`);
    };
  }, []);

  const id = "chart-" + props.id;
  return (
    <div className=" w-full h-full  overflow-hidden ">
      <ReactApexChart
        // series={[gaugeValue]}
        series={telemetrieData}
        options={{
          chart: {
            id,
            type: "radialBar",
            offsetY: 0,
            // height: 200,
            // offsetY: -20,
            sparkline: {
              enabled: true,
            },
          },
          legend: {
            show: false,
            position: "bottom",
            horizontalAlign: "center",
            fontSize: "14px",

            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 400,
            itemMargin: {
              vertical: 2,
            },
            labels: {
              colors: textColor,
              useSeriesColors: false,
            },
          },
          plotOptions: {
            radialBar: {
              startAngle: -90,
              endAngle: 90,
              track: {
                background: "#e7e7e7",
                strokeWidth: "80%",
                margin: 5, // margin is in pixels
                dropShadow: {
                  enabled: true,
                  top: 0,
                  left: 0,
                  // color: textColor,
                  opacity: 1,
                  blur: 2,
                },
              },
              dataLabels: {
                name: {
                  show: true,
                },
                value: {
                  offsetY: 5,
                  // color: textColor,
                  fontSize: "14px",
                },
              },
            },
          },
          grid: {
            padding: {
              top: 0,
            },
          },
          fill: {
            type: "solid",
            colors: [colorStop],
          },
          labels: telemetries.map((t) => t.telemetryName),
        }}
        type={"radialBar"}
        width={"100%"}
        height={"105%"}
      />
    </div>
  );
}
