/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@/components/theme-provider";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { useSocket } from "@/features/socket/SockerProvider";
import { cn } from "@/lib/utils";
import { MapTelemetry, Widget } from "@/utils";
import { addHours, endOfDay } from "date-fns";
import { useEffect, useId, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useGridStore } from "../../grid-store";
import WidgetMap from "./Map";

export default function MapWidget(props: Widget) {
  const socket = useSocket();
  const { theme } = useTheme();

  const location = useLocation();
  const machineId = location.pathname.split("/")[2];
  const chartId = useId();
  const isAnalytic = location.pathname.startsWith("/analytic");
  const isDashboard = location.pathname.startsWith("/dashboard");
  const { tenant } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const telemetries = (props?.attributes?.telemetries || []) as MapTelemetry[];
  const [telemetrieData, setTelemetrieData] = useState<any[]>(
    telemetries?.map((telemetrie) => ({
      label: telemetrie.label,
      latitude: telemetrie.latitude,
      longitude: telemetrie.longitude,
      [telemetrie.latitude]: 0,
      [telemetrie.longitude]: 0,
    }))
  );
  const { dashboard } = useGridStore();

  const editMode = dashboard.find(
    (machine: { machineId: number }) =>
      machine.machineId === Number(!isDashboard ? machineId : tenant.id)
  )?.editMode;
  useEffect(() => {
    const now = new Date();
    fetchHistorical({
      from: addHours(now, -1),
      to: endOfDay(now),
    });
  }, []);
  const fetchHistorical = async (dates: DateRange | undefined) => {
    setIsLoading(true);
    try {
      if (isAnalytic) {
        const result = await apiClient.get("analyticHistorical", {
          params: {
            machineId,
            telemetries,
            from: dates?.from,
            to: dates?.to,
          },
        });
        setTelemetrieData((prev) => {
          const newTelemetriesData = prev.map(
            (telemetrie: any, index: number) => {
              if (result.data[index] && result.data[index].chartData) {
                return {
                  ...telemetrie,
                  data: result.data[index].chartData.filter(
                    (chartData: { x: string | number | Date; y: any }) => {
                      if (chartData) {
                        if (chartData.x && chartData.y)
                          return {
                            x: new Date(chartData?.x),
                            y: Number(chartData?.y),
                          };
                      }
                    }
                  ),
                };
              }
            }
          );
          return newTelemetriesData;
        });
        setIsLoading(false);
        return;
      } else if (isDashboard) {
        try {
          const result = await apiClient.get("dashboard/historical", {
            params: {
              tenantId: tenant.id,
              from: dates?.from,
              to: dates?.to,
            },
          });

          setTelemetrieData((prev) => {
            const newTelemetriesData = prev.map(
              (telemetrie: any, index: number) => {
                if (result.data[index] && result.data[index].chartData) {
                  return {
                    ...telemetrie,
                    data: result.data[index].chartData.filter(
                      (chartData: { x: string | number | Date; y: any }) => {
                        if (chartData) {
                          if (chartData.x && chartData.y)
                            return {
                              x: new Date(chartData?.x),
                              y: Number(chartData?.y),
                            };
                        }
                      }
                    ),
                  };
                }
              }
            );
            return newTelemetriesData;
          });
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          return;
        }
        return;
      }

      const result = await apiClient.get("mapHistorical", {
        params: {
          machineId,
          telemetries,
          from: dates?.from,
          to: dates?.to,
        },
      });
      setTelemetrieData((prev) => {
        const newTelemetriesData = prev.map(
          (telemetrie: any, index: number) => {
            if (result.data[index]) {
              return {
                ...telemetrie,
                [telemetrie.latitude]: result.data[index].latitude,
                [telemetrie.longitude]: result.data[index].longitude,
              };
            }
          }
        );
        return newTelemetriesData;
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handlerRef = useRef<any>(null);
  useEffect(() => {
    const onData = (data: string) => {
      const payload = JSON.parse(data);

      // console.log(payload);
      setTelemetrieData((prev) => {
        const newTelemetriesData = prev.map((telemetrie: any, i: number) => {
          // if (telemetrie.hasKey(payload.name))
          if (payload.name in telemetrie) {
            return {
              ...telemetrie,
              [payload.name]: Number(payload.value) || 0,
            };
          }
          return telemetrie;
        });
        return newTelemetriesData;
      });
    };

    if (!socket) return;
    // if (!isAnalytic)
    console.log("start socket", chartId);
    socket.on(`machineData/${machineId}`, onData);

    return () => {
      socket.off(`machineData/${machineId}`, onData);
    };
  }, []);

  if (!telemetrieData?.length)
    return (
      <main className="grid place-content-center ">
        <h3 className="text-3xl text-foreground/50">No data available.</h3>
        <div>{JSON.stringify({ telemetries })}</div>
      </main>
    );

  return (
    <main className="flex flex-col">
      {
        <div
          className={cn("flex-1  ", {
            "blur-md": isLoading,
            "pointer-events-none": editMode,
          })}
        >
          <WidgetMap locations={telemetrieData} />
        </div>
      }
      <div
        className={cn(
          " absolute  justify-center  items-center flex-col gap-2 w-full h-full ",
          {
            flex: isLoading,
            hidden: !isLoading,
          }
        )}
      >
        <h1 className="text-lg italic">Loading...</h1>
        <div className="relative  flex h-[5px] w-[100px] items-center justify-center overflow-hidden rounded-[2.5px] translate-3d">
          <div className="absolute left-0 top-0 h-full w-full bg-black opacity-10"></div>
          <div className="h-full w-full animate-wobble rounded-[2.5px] bg-black"></div>
        </div>
      </div>
    </main>
  );
}
