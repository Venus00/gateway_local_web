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
  return sortedStops[sortedStops.length - 1]?.color ?? "#000000";
}
export default function CircularChartWidget(props: Widget) {
  const telemetries = (props.attributes?.telemetries ||
    []) as GaugeWidgetData[];
  const socket = useSocket();
  const location = useLocation();
  const { theme } = useTheme();
  const machineId = location.pathname.split("/")[2];
  // const [telemetrieData, setTelemetrieData] = useState<any[]>([40, 80]);
  const [telemetrieData, setTelemetrieData] = useState<any[]>(
    telemetries.map((telemetrie) => ({
      ...telemetrie,
      stopColor: "#ff0000",
      data: 10,
    }))
  );
  useEffect(() => {
    if (!socket) return;
    socket.on(`machineData/${machineId}`, (data) => {
      const payload = JSON.parse(data);
      setTelemetrieData((prev) => {
        const newTelemetriesData = prev.map(
          (telemetrie: any, index: number) => {
            if (telemetrie.telemetryName === payload.name) {
              return {
                ...telemetrie,
                data: Number(payload?.value),
                stopColor: getStopColor(
                  Number(payload?.value),
                  telemetrie.stops
                ),
              };
            }
            return telemetrie;
          }
        );
        return newTelemetriesData;
      });
    });
    return () => {
      socket.off(`machineData/${machineId}`);
    };
  }, []);

  const id = "chart-" + props.id;
  return (
    <div className=" w-full h-full   overflow-hidden ">
      <ReactApexChart
        // series={[gaugeValue]}
        series={telemetrieData.map((t) => t.data)}
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
            show: true,
            position: "left",
            horizontalAlign: "center",
            fontSize: "14px",

            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 400,
            itemMargin: {
              vertical: 2,
            },
            labels: {
              colors: theme !== "light" ? "#fff" : "#000",
              useSeriesColors: false,
            },
          },
          plotOptions: {
            radialBar: {
              hollow: {
                margin: 15,
                size: "50%",
              },
              track: {
                background: "#e7e7e7",
                strokeWidth: "80%",
                margin: 5, // margin is in pixels
                dropShadow: {
                  enabled: true,
                  top: 0,
                  left: 0,
                  color: theme !== "light" ? "#fff" : "#000",
                  opacity: 1,
                  blur: 2,
                },
              },
              dataLabels: {
                name: {
                  show: true,
                },
                total: {
                  show: true,
                  label: "TOTAL",
                  fontSize: "12px",
                  color: theme !== "light" ? "#fff" : "#333",
                },
                value: {
                  offsetY: 5,
                  color: theme !== "light" ? "#fff" : "#000",
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
            colors: telemetrieData.map((t) => t.stopColor),
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
