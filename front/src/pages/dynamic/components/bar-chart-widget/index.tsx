/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ViewDateTimeSwitcher } from "@/components/date-time-picker";
import { useTheme } from "@/components/theme-provider";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { useSocket } from "@/features/socket/SockerProvider";
import { ChartTelemetry, TGroupBy, Widget } from "@/utils";
import { addHours, endOfDay, startOfDay, subDays, subMonths } from "date-fns";
import { useEffect, useId, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { DateRange } from "react-day-picker";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useGridStore } from "../../grid-store";

export default function BarChartWidget(props: Widget) {
  // const { t } = useTranslation();
  const socket = useSocket();
  const { theme } = useTheme();
  const [textColor, setTextColor] = useState("#000");
  useEffect(() => {
    if (theme === "dark") setTextColor("#fff");
    else setTextColor("#000");
  }, [theme]);
  const [groupBy, setGroupBy] = useState<TGroupBy>("hour");
  const activeId = useId();
  const chartId = useId();
  const [isLive, setIsLive] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const location = useLocation();
  const machineId = location.pathname.split("/")[2];

  const isAnalytic = location.pathname.startsWith("/analytic");
  const isDashboard = location.pathname.startsWith("/dashboard");
  const { tenant } = useSelector((state: RootState) => state.auth);

  const telemetries = (props?.attributes?.telemetries ||
    []) as ChartTelemetry[];
  const [telemetrieData, setTelemetrieData] = useState<any[]>(
    telemetries?.map((telemetrie) => ({
      name: telemetrie?.name,
      type: "bar",
      data: [{ x: new Date(), y: 0 }],
    }))
  );
  const { dashboard } = useGridStore();
  const timeframe = props?.attributes?.timeframe as string;
  const editMode = dashboard.find(
    (machine: { machineId: number }) =>
      machine.machineId === Number(!isDashboard ? machineId : tenant.id)
  )?.editMode;
  useEffect(() => {
    const onData = (data: string) => {
      const payload = JSON.parse(data);
      setTelemetrieData((prev) => {
        const newTelemetriesData = prev.map(
          (telemetrie: any, index: number) => {
            if (telemetrie.name === payload.name) {
              return {
                ...telemetrie,
                data: [
                  ...telemetrie.data,
                  {
                    x: payload?.dt,
                    y: Number(payload?.value),
                  },
                ],
              };
            }
            return telemetrie;
          }
        );
        return newTelemetriesData;
      });
    };
    console.log(isLive, chartId);
    if (isLive) {
      setTelemetrieData(
        telemetries?.map((telemetrie) => ({
          name: telemetrie?.name,
          type: "bar",
          data: [],
        }))
      );
      if (!socket) return;
      // if (!isAnalytic)
      console.log("start socket", chartId);
      socket.on(`machineData/${machineId}`, onData);
    } else {
      console.log("remote quit");
      if (socket) socket.off(`machineData/${machineId}`, onData);
    }
    return () => {
      socket.off(`machineData/${machineId}`, onData);
    };
  }, [isLive]);
  useEffect(() => {
    const now = new Date();
    let from: Date = new Date();
    let to: Date = endOfDay(now);

    switch (timeframe) {
      case "1H":
        from = addHours(now, -1);
        break;
      case "1D":
        from = startOfDay(now);
        break;
      case "1W":
        from = subDays(now, 7);
        break;
      case "1M":
        from = subMonths(now, 1);
        break;
      default:
        from = addHours(now, -1);
    }

    fetchHistorical({
      from,
      to,
    });
  }, []);
  if (!telemetrieData?.length)
    return (
      <main className="grid place-content-center ">
        <h3 className="text-3xl text-foreground/50">No data available.</h3>
        <div>{JSON.stringify({ telemetries })}</div>
      </main>
    );

  const fetchHistorical = async (dates: DateRange | undefined) => {
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
        } catch (error) {
          console.log(error);
          return;
        }
        return;
      }

      const result = await apiClient.get("historical", {
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
    } catch (error) {
      console.log(error);
    }
  };

  const submitForm = async () => {
    fetchHistorical(dateRange);
  };
  // if (isLoading)
  //   return (
  //     <main className=" grid place-content-center">
  //       <Loader />
  //     </main>
  //   );
  // if (error)
  //   return (
  //     <main className="grid place-content-center">
  //       <h3>{error.message || "An error occurred while fetching the data."}</h3>
  //     </main>
  //   );

  if (!telemetrieData?.length)
    return (
      <main className="grid place-content-center ">
        <h3 className="text-3xl text-foreground/50">No data available.</h3>
        <div>{JSON.stringify({ telemetries })}</div>
      </main>
    );
  return (
    <main className="flex flex-col">
      <div className="flex justify-between flex-wrap gap-4 items-center pr-6">
        <div className="">
          <ViewDateTimeSwitcher
            editMode={editMode || false}
            isLiveView={isLive}
            setIsLiveView={setIsLive}
            submitForm={submitForm}
            dateRange={dateRange}
            setDateRange={setDateRange}
            color={telemetries[0].color || "hsl(var(--primary))"}
            timeframe={timeframe}
          />
        </div>
      </div>
      <div className="flex-1">
        {telemetrieData?.every((t) => t.data?.length === 0) ? (
          <main className="grid place-content-center ">
            <h3 className="text-3xl text-foreground/50">
              No data available for the last {timeframe}.
            </h3>
            {/* <div>{JSON.stringify({ telemetries })}</div> */}
          </main>
        ) : (
          <ReactApexChart
            options={{
              // theme: { mode: theme === "dark" ? "dark" : "light" },
              tooltip: {
                cssClass: "text-black",
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
                  colors: theme !== "light" ? "#fff" : "#000",
                  useSeriesColors: false,
                },
              },
              colors: telemetries.map((item) => item.color),
              chart: {
                id: chartId,
                type: "bar",
                background: "transparent",
                toolbar: {
                  show: false,
                },
                // animations: {
                //   enabled: false,
                // },
                zoom: {
                  enabled: false,
                },
                selection: {
                  enabled: false,
                },
                dropShadow: {
                  enabled: false,
                },
              },
              stroke: {
                width: 2.5,
                curve: "smooth",
              },
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                type: "datetime",
                labels: {
                  show: true,
                  style: {
                    colors: textColor,
                    fontSize: "12px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 400,
                    cssClass: "apexcharts-xaxis-label",
                  },
                },
              },
              yaxis: {
                min: 0,
                tickAmount: 4,
                labels: {
                  show: true,
                  formatter: function (value) {
                    return value?.toFixed(2);
                  },
                  style: {
                    colors: textColor,
                    fontSize: "12px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 400,
                    cssClass: "apexcharts-xaxis-label",
                  },
                },
              },
            }}
            series={telemetrieData || []}
            type={"bar"}
            width={"100%"}
            height={"100%"}
          />
        )}
      </div>
    </main>
  );
}
