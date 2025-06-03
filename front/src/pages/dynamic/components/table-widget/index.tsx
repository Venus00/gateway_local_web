/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ViewDateTimeSwitcher } from "@/components/date-time-picker";
import ParamsPagination, {
  PaginationProps,
} from "@/components/params-pagination";
// import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { useSocket } from "@/features/socket/SockerProvider";
import { cn } from "@/lib/utils";
import { ChartTelemetry, Widget } from "@/utils";
import {
  addHours,
  endOfDay,
  format,
  startOfDay,
  subDays,
  subMonths,
} from "date-fns";
import { ArrowDown10, ArrowUp10 } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useGridStore } from "../../grid-store";

export default function TableWidget(props: Widget) {
  const socket = useSocket();
  // const { theme } = useTheme();
  const [isLive, setIsLive] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [paginationParams, setPaginationParams] = useState<PaginationProps>({
    page: 1,
    perPage: 10,
  });
  const [total, setTotal] = useState();
  const [loadingData, setLoadingData] = useState(false);
  const location = useLocation();
  const machineId = location.pathname.split("/")[2];
  const isAnalytic = location.pathname.startsWith("/analytic");
  const isDashboard = location.pathname.startsWith("/dashboard");
  const { tenant } = useSelector((state: RootState) => state.auth);
  const telemetries = (props?.attributes?.telemetries ||
    []) as ChartTelemetry[];
  const { dashboard } = useGridStore();
  const [tableData, setTableData] = useState<any[]>([]);
  const timeframe = props?.attributes?.timeframe as string;
  const editMode = dashboard.find(
    (machine: { machineId: number }) =>
      machine.machineId === Number(!isDashboard ? machineId : tenant.id)
  )?.editMode;
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
  }, [paginationParams, order]);

  useEffect(() => {
    const onData = (data: string) => {
      const payload = JSON.parse(data);
      if (!payload?.dt || !payload?.name || payload.value === undefined) return;

      const timestamp = new Date(payload.dt);
      const ts = Math.floor(timestamp.getTime() / 1000) * 1000; // Normalize to nearest second
      const normalizedDate = new Date(ts);

      setTableData((prev) => {
        const dataMap = new Map<number, any>();

        prev.forEach((item) => {
          const key = Math.floor(item.x.getTime() / 1000) * 1000;
          dataMap.set(key, {
            x: new Date(key),
            y: [...item.y],
          });
        });

        const existing = dataMap.get(ts) || {
          x: normalizedDate,
          y: telemetries.map((t) => ({ ...t, value: null })),
        };

        const updatedY = existing.y.map((t: any) => ({
          ...t,
          value: t.name === payload.name ? payload.value : t.value,
        }));

        dataMap.set(ts, { x: normalizedDate, y: updatedY });

        return Array.from(dataMap.values())
          .sort((a, b) => -a.x.getTime() + b.x.getTime())
          .slice(
            (paginationParams.page - 1) * paginationParams.perPage,
            paginationParams.page * paginationParams.perPage
          );
      });
    };
    if (isLive) {
      setTableData([]);
      if (!socket) return;
      // if (!isAnalytic)
      socket.on(`machineData/${machineId}`, onData);
    } else {
      // `machineData/${machineId}`;
      if (socket) socket.off(`machineData/${machineId}`, onData);
    }
    return () => {
      socket.off(`machineData/${machineId}`, onData);
    };
  }, [isLive]);
  // useEffect(() => {
  //   const now = new Date();
  //   fetchHistorical({
  //     from: addHours(now, -1),
  //     to: endOfDay(now),
  //   });
  // }, []);
  if (!telemetries?.length)
    return (
      <main className="grid place-content-center ">
        <h3 className="text-3xl text-foreground/50">No data available.</h3>
        <div>{JSON.stringify({ telemetries })}</div>
      </main>
    );

  const fetchHistorical = async (dates: DateRange | undefined) => {
    setLoadingData(true);
    if (!dates?.from || !dates?.to) {
      console.warn("Date range is incomplete");
      setLoadingData(false);
      return;
    }
    let query;
    // let params;
    const params: Record<string, any> = {
      from: dates.from.toISOString(),
      to: dates.to.toISOString(),
      page: paginationParams.page,
      perPage: paginationParams.perPage,
      order,
    };

    if (isAnalytic) {
      query = "analyticHistorical";
      params.machineId = machineId;
      params.telemetries = telemetries;
    } else if (isDashboard) {
      query = "dashboard/historical";
      params.tenantId = tenant?.id;
    } else {
      query = "historical";
      params.machineId = machineId;
      params.telemetries = telemetries;
    }
    try {
      const result = await apiClient.get(query, {
        params,
      });
      const tele = telemetries.map((telemetry, index) => {
        setTotal(result.data[index]?.total);
        const chartData = result.data[index]?.chartData || [];
        return {
          ...telemetry,
          data: chartData
            .filter((point: any) => point?.x && point?.y != null)
            .map((point: any) => ({
              x: new Date(point.x),
              y: Number(point.y),
            })),
        };
      });

      // // Extract all unique timestamps
      const uniqueTimestamps = [
        ...new Set(
          tele.flatMap((t) =>
            t.data ? t.data.map((d: any) => d.x.getTime()) : []
          )
        ),
      ].map((ts) => new Date(ts));
      // // Assemble new telemetry data grouped by timestamp
      const newTelemetriesData = uniqueTimestamps.map((timestamp) => {
        const y = tele.map(({ data, ...telemetry }) => {
          const dataMap = new Map(data.map((d: any) => [d.x.getTime(), d.y]));
          return {
            ...telemetry,
            value: dataMap.get(timestamp.getTime()) ?? null,
          };
        });

        return {
          x: timestamp,
          y,
        };
      });

      setTableData(newTelemetriesData);
      setLoadingData(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingData(false);
    }
  };

  const submitForm = async () => {
    fetchHistorical(dateRange);
  };

  return (
    <main className="flex flex-col ">
      <div className="flex justify-between">
        <div className="">
          <ViewDateTimeSwitcher
            color={telemetries[0].color || "hsl(var(--primary))"}
            editMode={editMode || false}
            isLiveView={isLive}
            setIsLiveView={setIsLive}
            submitForm={submitForm}
            dateRange={dateRange}
            setDateRange={setDateRange}
            timeframe={timeframe}
          />
        </div>
      </div>
      {tableData?.every((t) => t.data?.length === 0) ? (
        <main className="grid place-content-center ">
          <h3 className="text-3xl text-foreground/50">
            No data available for the last {timeframe}.
          </h3>
          {/* <div>{JSON.stringify({ telemetries })}</div> */}
        </main>
      ) : (
        <>
          <ScrollArea
            className={cn("max-h-full p-2   border rounded-lg", {
              "blur-sm": loadingData,
            })}
          >
            <Table>
              <TableCaption>A list of telemetries.</TableCaption>
              <TableHeader>
                <TableRow className="dark:border-b-gray-300">
                  <TableHead className=" flex items-center gap-2">
                    <span>Timestamp</span>
                    <Button
                      variant={"link"}
                      className="p-0"
                      onClick={() =>
                        setOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                      }
                      style={{ color: telemetries[0].color }}
                    >
                      {order === "desc" ? (
                        <ArrowDown10 className={`w-5 h-5 `} />
                      ) : (
                        <ArrowUp10 className={`w-5 h-5 `} />
                      )}
                    </Button>
                  </TableHead>
                  {telemetries.map((col) => {
                    return (
                      <TableHead key={col.name} className="text-left">
                        {col.label || col.name}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, index) => {
                  return (
                    <TableRow key={index} className="dark:border-b-gray-300">
                      <TableCell className="text-left">
                        {format(new Date(row.x), "dd/MM/yyyy HH:mm:ss")}
                        {/* {new Date(row.x).toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })} */}
                      </TableCell>
                      {row.y.map((col: any) => {
                        return (
                          <TableCell
                            key={col.name}
                            className="text-left"
                            style={{ color: col.color }}
                          >
                            {col.value ? col.value + " " + col.unit : "-"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
          <div className="mt-auto flex justify-end px-4  pt-1 ">
            <ParamsPagination
              color={telemetries[0].color || "hsl(var(--primary))"}
              total={total || 0}
              paginationParams={paginationParams}
              setPaginationParams={setPaginationParams}
            />
          </div>
        </>
      )}

      <div
        className={cn(
          " absolute  justify-center  items-center flex-col gap-2 w-full h-full ",
          {
            flex: loadingData,
            hidden: !loadingData,
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
