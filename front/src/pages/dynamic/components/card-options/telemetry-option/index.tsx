import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { useGridStore } from "@/pages/dynamic/grid-store";
import { useAddWidgetStore } from "@/pages/dynamic/widget-store";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

export default function TelemetryOption() {
  const { setAttribute, data } = useAddWidgetStore();
  const { dashboard } = useGridStore();
  const location = useLocation();
  const { id: entityId } = useParams();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAnalytic = location.pathname.startsWith("/analytic");
  const { tenant } = useSelector((state: RootState) => state.auth);

  const id = isDashboard ? tenant.id : entityId;

  const dashboardItem = dashboard.find(
    (machine: { machineId: number }) => machine.machineId === Number(id)
  );
  const machine = dashboardItem ? dashboardItem.machine : undefined;

  const { data: dashboardTelemetries } = useQuery(
    "dashboardTelemetries",
    () => fetchTelemetries(),
    { initialData: [], enabled: isDashboard }
  );

  const fetchTelemetries = async () => {
    try {
      const response = await apiClient.get("dashboard", {
        params: {
          tenantId: tenant.id,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  // const { data: analyticTelemetries } = useQuery(
  //   "analyticTelemetries",
  //   () => fetchAnalyticEvents(),
  //   { initialData: [], enabled: isAnalytic }
  // );

  // const fetchAnalyticEvents = async () => {
  //   try {
  //     const response = await apiClient.get(`analytic_events/${entityId}`);
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="flex flex-col  gap-x-4 gap-y-2">
      <Label htmlFor="telemetry">Telemetry Name</Label>
      <Select
        name="telemetry"
        required
        defaultValue={(data.attributes?.telemetryName as string) || undefined}
        onValueChange={(value) => {
          console.log("value", value.split(" "));

          setAttribute("telemetryName", value.split(" ")[0]);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Telemetry" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {isAnalytic &&
              machine?.telemetries
                ?.split(",")
                .map((item: string, key: number) => {
                  return (
                    <SelectItem key={key} value={item.trimEnd()}>
                      {item}
                    </SelectItem>
                  );
                })}
            {!isDashboard
              ? machine?.connectionInputs?.map((item: any,index:number) => {
                    return (
                      <SelectItem key={index} value={item?.input?.label?.trimEnd()}>
                        {item?.input?.label?.trimEnd()}
                      </SelectItem>
                    );
                  })
              : dashboardTelemetries.map((item: string, key: number) => {
                  return (
                    <SelectItem key={key} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label htmlFor="telemetryUnit">Telemetry Unit</Label>
      <Input
        id="telemetryUnit"
        className="rounded"
        placeholder={"unit"}
        name="unit"
        value={(data.attributes?.unit as string) || undefined}
        onChange={(e) => {
          setAttribute("unit", e.target.value);
        }}
      />
      {/* <Input
        value={(data.attributes?.telemetryName as string) || ""}
        onChange={(e) => {
          e.preventDefault();
          setAttribute("telemetryName", e.currentTarget.value);
        }}
      /> */}
    </div>
  );
}
