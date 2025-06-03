import { Button } from "@/components/ui/button";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { cn } from "@/lib/utils";
import { Expand, Maximize } from "lucide-react";
import PulseDot from "react-pulse-dot";
import "react-pulse-dot/dist/index.css";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import AddWidget from "./components/add-widget";
import AddWidgetDialog from "./components/add-widget-dialog";
import { Grid } from "./components/grid";
import { SaveDashboard } from "./components/save-dashboard";
import { useGridStore } from "./grid-store";
import { useSideBar } from "@/Layout/SideBarProvider/SideBarProvider";
export default function Dyanmic() {
  const {
    setMachineLayout,
    setMachineWidgets,
    setMachineId,
    toggleMachineEditMode,
    dashboard,
  } = useGridStore();
  let { id: entityId } = useParams();
  const { toggleSidebar, isSidebarVisible } = useSideBar();
  const { tenant } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isEntity = location.pathname.startsWith("/entity");
  const isAnalytic = location.pathname.startsWith("/analytic");
  const id = isDashboard ? tenant.id : entityId;
  const type = isDashboard ? "dashboard" : isEntity ? "entity" : "analytic";

  const { data: tenantdata } = useQuery(
    "tenantViewDash",
    () => fetchTenantData(),
    {
      enabled: isDashboard,
      initialData: { widget: [], layout: [] },
    }
  );
  const { data: machine } = useQuery("machineItem", () => fetchMachine(), {
    enabled: isEntity,
  });
  const { data: analytic } = useQuery("analyticItem", () => fetchAnalytic(), {
    enabled: isAnalytic,
  });
  const fetchTenantData = async () => {
    console.log("dashboard selected");
    try {
      const response = await apiClient.get("tenant/dashboard", {
        params: {
          tenantId: tenant.id,
        },
      });
      const result = response.data;
      const layout = result.layout ? JSON.parse(result.layout) : [];
      const widget = result.widget ? JSON.parse(result.widget) : [];
      setMachineId(type, Number(tenant.id), result.data, layout, widget);
      setMachineLayout(Number(tenant.id), layout);
      setMachineWidgets(Number(tenant.id), widget);
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  const fetchAnalytic = async () => {
    console.log("analytic selected");
    try {
      const result = await apiClient.get(`analyticById/${Number(id)}`);
      const layout = result.data.layout ? JSON.parse(result.data.layout) : [];
      const widget = result.data.widget ? JSON.parse(result.data.widget) : [];
      setMachineId(type, Number(id), result.data, layout, widget);
      setMachineLayout(Number(id), layout);
      setMachineWidgets(Number(id), widget);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMachine = async () => {
    try {
      const result = await apiClient.get(`machineById/`, {
        params: {
          machineId: `${Number(id)}`,
          tenantId: tenant.id,
        },
      });
      const layout = result.data.layout ? JSON.parse(result.data.layout) : [];
      const widget = result.data.widget ? JSON.parse(result.data.widget) : [];
      setMachineId(type, Number(id), result.data, layout, widget);
      setMachineLayout(Number(id), layout);
      setMachineWidgets(Number(id), widget);
      return result.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  const editMode = dashboard.find(
    (machine) => machine.machineId === Number(id)
  )?.editMode;
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      if (isSidebarVisible) toggleSidebar();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      if (!isSidebarVisible) toggleSidebar();
    }
  };

  const title = isDashboard ? "" : isEntity ? machine?.name : analytic?.name;
  return (
    <main className="h-full  flex-1 flex flex-col px-6 max-w-screen-2xl mx-auto w-full ">
      <div className="group  flex flex-wrap p-2 items-center gap-1 ">
        <h1 className="font-semibold text-lg">{title}</h1>
        <div
          className={cn(
            "flex gap-1  overflow-hidden items-center ml-auto  transition-opacity"
          )}
        >
          <div
            className={`${
              editMode ? "  translate-x-0" : "   translate-x-[34%]"
            } flex items-center gap-2 transition-all duration-300 ease-in-out `}
          >
            <div className="flex justify-end px-2 items-center gap-0  ">
              <PulseDot color="#3b82f6 " className="h-8 w-8 text-sm " />
              <span className="text-sm">Real time data</span>
            </div>
            <Button
              variant={"link"}
              className="p-0 h-fit"
              onClick={toggleFullscreen}
            >
              <Expand className="w-5 h-5 " />
            </Button>
            <div
              className={`${
                editMode ? " opacity-100 " : " opacity-0 pointer-events-none"
              } flex items-center gap-2 `}
            >
              {" "}
              <AddWidget id={Number(id)} />
            </div>
          </div>
          <SaveDashboard id={Number(id)} />
        </div>
      </div>
      <div className="hidden justify-end px-2 items-center gap-0  ">
        <PulseDot color="#3b82f6 " className="h-8 w-8 text-sm " />
        <span className="text-sm">Real time data</span>
      </div>
      <Grid id={Number(id)} />
      <AddWidgetDialog id={Number(id)} />
    </main>
  );
}
