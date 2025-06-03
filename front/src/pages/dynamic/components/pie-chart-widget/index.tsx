/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@/components/theme-provider";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { useSocket } from "@/features/socket/SockerProvider";
import { ChartTelemetry, Widget } from "@/utils";
import { useEffect, useId, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
export default function PieChartWidget(props: Widget) {
  const machineId = location.pathname.split("/")[2];
  const { tenant } = useSelector((state: RootState) => state.auth);
  const socket = useSocket();
  const { theme } = useTheme();
  const chartId = useId();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const [textColor, setTextColor] = useState("#000");
  useEffect(() => {
    if (theme === "dark") setTextColor("#fff");
    else setTextColor("#000");
  }, [theme]);
  const telemetries = (props?.attributes?.telemetries ||
    []) as ChartTelemetry[];
  const [telemetrieData, setTelemetrieData] = useState<any[]>([]);
  const isAnalytic = location.pathname.startsWith("/analytic");
  useEffect(() => {
    const fetchAllTelemetrie = async () => {
      try {
        const promises = telemetries.map((telemetrie) =>
          fetchTelemtrie(telemetrie.name)
        );
        const results = await Promise.all(promises);
        setTelemetrieData(results);
      } catch (error) {
        console.error("Error fetching telemetry data:", error);
      }
    };

    fetchAllTelemetrie();
  }, []);

  const fetchTelemtrie = async (name: string) => {
    let data = null;
    try {
      if (isAnalytic) {
        const result = await apiClient.get(`analyticTelemetrie`, {
          params: {
            telemetrieName: name,
            analyticId: machineId,
          },
        });

        return (data = [result.data[0]?.value]);
      }
      if (!isDashboard) {
        const result = await apiClient.get(`telemetrie`, {
          params: {
            machineId,
            telemetrie: name,
            tenantId: tenant.id,
          },
        });
        data = result.data;
      } else {
        const result = await apiClient.get(`/dashboard/telemetrie`, {
          params: {
            telemetrieName: name,
            tenantId: tenant.id,
          },
        });
        data = result.data;
      }
    } catch (error) {
      console.error("Error fetching telemetry data:", error);
    }
    return data;
  };
  useEffect(() => {
    if (!isDashboard) {
      if (!socket) return;
      console.log("socket  connectedd");
      if (!isAnalytic)
        socket.on(`machineData/${machineId}`, (data) => {
          const payload = JSON.parse(data);
          setTelemetrieData((prev) => {
            const newTelemetriesData = telemetries.map(
              (telemetrie: any, index: number) => {
                if (telemetrie.name === payload.name) {
                  return Number(payload?.value);
                }
                return prev[index];
              }
            );
            return newTelemetriesData;
          });
        });
    }
    return () => {
      socket.off(`machineData/${machineId}`);
    };
  }, []);

  return (
    <div className=" w-full h-full  ">
      <ReactApexChart
        series={telemetrieData}
        options={{
          chart: {
            id: chartId,
            type: "pie",
            background: "transparent",
          },
          legend: {
            show: true,
            position: "bottom",
            horizontalAlign: "center",
            fontSize: "14px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 400,
            itemMargin: {
              vertical: 10,
            },
            labels: {
              colors: textColor,
              useSeriesColors: false,
            },
          },
          colors: telemetries.map((t) => t.color || "#000"),
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return Number(val).toFixed(2) + "%";
            },
          },
          labels: telemetries.map(
            (t) => t.label || t?.name?.split(".").at(-1) || ""
          ),
        }}
        type={"pie"}
        width={"105%"}
        height={"105%"}
      />
    </div>
  );
}
