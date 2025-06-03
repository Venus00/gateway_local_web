import { Button } from "@/components/ui/button";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { cn } from "@/lib/utils";
import {
  Expand,
  History,
  Maximize,
  Settings,
  SlidersHorizontal,
  Table,
  UserCog,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/language-context";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import BreadCrumb from "@/components/breadcrumb";

export default function Dyanmic() {
  const {
    setMachineLayout,
    setMachineWidgets,
    setMachineId,
    toggleMachineEditMode,
    dashboard,
  } = useGridStore();
  let { id: entityId } = useParams();
  const { toggleSidebar, isSidebarVisible, isFullScreen, toggleFullScreen } =
    useSideBar();
  const { tenant } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isEntity = location.pathname.startsWith("/entity");
  const isAnalytic = location.pathname.startsWith("/analytic");
  const [tab, setTab] = useState("dashboard");
  const id = isDashboard ? tenant.id : entityId;
  const type = isDashboard ? "dashboard" : isEntity ? "entity" : "analytic";
  const { t } = useLanguage();
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
    // toggleFullScreen();
    // if (!document.fullscreenElement) {
    //   document.documentElement.requestFullscreen().catch((err) => {
    //     console.error(`Error attempting to enable fullscreen: ${err.message}`);
    //   });
    //   console.log("full screen");
    //   if (isSidebarVisible) toggleSidebar();
    // } else {
    //   if (document.exitFullscreen) {
    //     console.log("exit full screen");
    //     document.exitFullscreen();
    //     // toggleFullScreen();
    //   }
    //   if (!isSidebarVisible) toggleSidebar();
    // }
  };
  const linkName = isDashboard ? "Global" : isEntity ? "Entites" : "Analytics";
  const title = isDashboard
    ? t("dashboard.globalDashboard")
    : isEntity
    ? machine?.name
    : analytic?.name;
  const breadcrumb = [
    { url: "/dashboards", name: t("breadcrumb.dashboards") },
    { url: "/dashboards", name: linkName },
  ];
  return (
    <main className="h-full  flex-1 flex flex-col px-6 max-w-screen-2xl mx-auto w-full ">
      <BreadCrumb links={breadcrumb} pageTitle={title} />
      <div className="group border-b flex mb-4 flex-wrap pb-0 p-2 items-end gap-1 ">
        <Tabs defaultValue="dashboard" className="w-fit-0 space-y-4 ">
          <TabsList className="bg-transparent rounded-none    w-full justify-start p-0 h-fit">
            <TabsTrigger
              value="dashboard"
              onClick={() => setTab("dashboard")}
              className="border-0 pb-2 rounded-none  flex items-center gap-2  shadow-none bg-transparent data-[state=active]:bg-transparent 
            data-[state=active]:border-b data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none
             data-[state=active]:text-blue-500"
            >
              <Table className="w-4 h-4" />
              <span>{t("nav.dashboard")}</span>
            </TabsTrigger>

            <TabsTrigger
              value="history"
              onClick={() => setTab("history")}
              className={cn(
                `border-0 pb-2 rounded-none  flex items-center gap-2  shadow-none bg-transparent data-[state=active]:bg-transparent 
            data-[state=active]:border-b data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none
             data-[state=active]:text-blue-500 transition-all ease-in-out duration-300`,
                {
                  "translate-y-full opacity-0": editMode,
                }
              )}
            >
              <History className="w-4 h-4" />
              <span>{t("dashboard.history")}</span>
            </TabsTrigger>
            {/* {!editMode && ( */}
            <>
              {" "}
              <TabsTrigger
                value="downlinks"
                onClick={() => setTab("downlinks")}
                className={cn(
                  `border-0 pb-2 rounded-none  flex items-center gap-2  shadow-none bg-transparent data-[state=active]:bg-transparent 
                data-[state=active]:border-b data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none
                 data-[state=active]:text-blue-500 transition-all ease-in-out duration-500`,
                  {
                    "translate-y-full opacity-0": editMode,
                  }
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{t("dashboard.downlinks")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="configuration"
                onClick={() => setTab("configuration")}
                className={cn(
                  `border-0 pb-2 rounded-none  flex items-center gap-2  shadow-none bg-transparent data-[state=active]:bg-transparent 
                data-[state=active]:border-b data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none
                 data-[state=active]:text-blue-500 transition-all ease-in-out duration-700`,
                  {
                    "translate-y-full opacity-0": editMode,
                  }
                )}
              >
                <Settings className="w-4 h-4" />
                <span>{t("dashboard.configuration")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="authorization"
                onClick={() => setTab("authorization")}
                className={cn(
                  `border-0 pb-2 rounded-none  flex items-center gap-2  shadow-none bg-transparent data-[state=active]:bg-transparent 
                data-[state=active]:border-b data-[state=active]:border-b-blue-500 data-[state=active]:shadow-none
                 data-[state=active]:text-blue-500 transition-all ease-in-out duration-1000`,
                  {
                    "translate-y-full opacity-0": editMode,
                  }
                )}
              >
                <UserCog className="w-4 h-4" />
                <span>{t("dashboard.authorization")}</span>
              </TabsTrigger>
            </>
            {/* )} */}
          </TabsList>
          <TabsContent value="basic"></TabsContent>
          <TabsContent value="data"></TabsContent>
          <TabsContent value="appearance"></TabsContent>
          <TabsContent value="timeframe"></TabsContent>
        </Tabs>{" "}
        <div
          className={cn(
            "flex gap-1  overflow-hidden items-center ml-auto pb-1  transition-all ease-in-out duration-1000",
            {
              "translate-y-full opacity-0 z-0": tab !== "dashboard",
            }
          )}
        >
          <div
            className={`${
              editMode ? "  translate-x-0" : "   translate-x-[34%]"
            } flex items-center gap-2 transition-all duration-300 ease-in-out `}
          >
            <div
              className={cn(
                "flex justify-end px-2 items-center gap-0  transition-all duration-1000 delay-75 ease-in-out",
                {
                  "translate-y-full ": editMode,
                }
              )}
            >
              <PulseDot color="#3b82f6 " className="h-8 w-8 text-sm " />
              <span className="text-sm">Real time data</span>
            </div>
            <Button
              variant={"link"}
              className="p-0 h-fit"
              onClick={toggleFullScreen}
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
      {tab === "dashboard" && (
        <>
          <Grid id={Number(id)} />
          <AddWidgetDialog id={Number(id)} />
        </>
      )}
    </main>
  );
}
