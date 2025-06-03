import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/features/api";
import {
  Activity,
  ArrowLeftRight,
  CircuitBoard,
  ClipboardType,
  Cpu,
  EthernetPort,
  UserMinus,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router";
import DeviceMessages from "./components/DeviceMessages";
import { useSelector } from "react-redux";
import { RootState } from "@/features/auth/store";
import BreadCrumb from "@/components/breadcrumb";
import { useLanguage } from "@/context/language-context";

export default function DeviceDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, isArabic } = useLanguage();
  const { tenant } = useSelector((state: RootState) => state.auth);

  if (!location?.state?.name) {
    navigate("/not-found");
  }

  const fetchDeviceById = async () => {
    try {
      const response = await apiClient.get(`/device/${location.state.id}`, {});
      const data = {
        ...response.data,
        attribute: {
          input: response.data.deviceInput.map((i: any) => i.name),
          output: response.data.deviceOutput.map((i: any) => i.name),
          newInput: response.data.deviceInput.map((i: any) => i.label),
          newOutput: response.data.deviceOutput.map((i: any) => i.label),
        },
        devicesTypeAttribute: {
          input: response.data?.type?.input?.split(","),
          output: response.data?.type?.output?.split(","),
        },
      };
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };

  const { data: device } = useQuery("deviceById", () => fetchDeviceById(), {
    initialData: location?.state,
    refetchInterval: 5000,
    // refetchIntervalInBackground: true,
  });

  const { data: deviceMessage } = useQuery(
    "deviceMessages",
    () => fetChDeviceMessages(),
    {
      initialData: [],
      refetchInterval: 10000,
    }
  );

  const fetChDeviceMessages = async () => {
    try {
      const response = await apiClient.get("device/messages", {
        params: {
          tenantId: tenant.id,
          id: location.state.id,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(device);
  const breadcrumb = [
    { url: "/device", name: t("nav.device") },
    // { url: "/dashboards", name: linkName },
  ];

  return (
    <main className="flex-1   lg:p-6 ">
      <BreadCrumb links={breadcrumb} pageTitle={device?.name} />
      <div className="p-4 space-y-4 mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="  md:col-span-2  overflow-hidden  h-fit flex   flex-col">
            <CardHeader
              dir={isArabic ? "rtl" : "ltr"}
              className="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <CardTitle className="text-sm font-medium">
                {t("table.column.deviceInput")}/{t("table.column.deviceOutput")}
              </CardTitle>
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className=" flex justify-center overflow-x-auto h-full w-full  mt-4">
              <div
                className={`hidden flex-col  items-end w-full  gap-2 ${
                  device?.attribute?.input?.length > 1
                    ? "justify-evenly"
                    : "justify-center"
                }`}
              >
                {device?.attribute?.input?.map(
                  (input: string, index: number) => (
                    <div
                      key={index}
                      className="w-12  border border-green-600 relative"
                    >
                      <span className="text-xs -translate-y-4 absolute ">
                        {input}
                      </span>
                    </div>
                  )
                )}
              </div>
              <div className=" h-fit  min-h-20 justify-center   w-full   flex  ">
                <div
                  className={`flex flex-col items-end  w-full py-2  gap-2 ${
                    device?.attribute?.input?.length > 1
                      ? "justify-evenly"
                      : "justify-center"
                  }`}
                >
                  {device?.attribute?.input?.map(
                    (input: string, index: number) => (
                      <div
                        key={index}
                        className="min-w-12 w-full  flex  border-b-2 border-green-600 relative"
                      >
                        <span className="text-xs   w-full flex-none">
                          {input}
                        </span>
                      </div>
                    )
                  )}
                </div>
                <div className="flex w-full justify-center items-center  rounded-lg border-2 border-green-600">
                  <CircuitBoard className="h-8 w-8 text-green-600 animate-pulse" />
                </div>
                <div
                  className={` flex flex-col w-full py-2 gap-2 ${
                    device?.attribute?.output?.length > 1
                      ? "justify-evenly"
                      : "justify-center"
                  }`}
                >
                  {device?.attribute?.output?.map(
                    (output: string, index: number) => (
                      <div
                        key={index}
                        className="w-full relative flex  border-b-2 border-green-600"
                      >
                        <span className="text-xs pl-1 flex-none">{output}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-4  w-full h-full">
            <Card>
              <CardHeader
                dir={isArabic ? "rtl" : "ltr"}
                className="flex flex-row items-center justify-between space-y-0 pb-2"
              >
                <CardTitle className="text-sm font-medium">
                  {t("table.column.name")}
                </CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{device?.name}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                dir={isArabic ? "rtl" : "ltr"}
                className="flex flex-row items-center justify-between space-y-0 pb-2"
              >
                <CardTitle className="text-sm font-medium">
                  {t("table.column.serial")}
                </CardTitle>
                <EthernetPort className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{device?.serial}</div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader
                dir={isArabic ? "rtl" : "ltr"}
                className="flex flex-row items-center justify-between space-y-0 pb-2"
              >
                <CardTitle className="text-sm font-medium">
                  {t("table.column.type")}
                </CardTitle>
                <ClipboardType className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{location?.state?.type}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                dir={isArabic ? "rtl" : "ltr"}
                className="flex flex-row items-center justify-between space-y-0 pb-2"
              >
                <CardTitle className="text-sm font-medium">
                  {t("table.column.status")}
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge
                  variant={device?.status ? "default" : "secondary"}
                  className={`flex w-fit items-center space-x-1 ${
                    device?.status === 1
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {device?.status ? (
                    <>
                      <Wifi className="h-3 w-3" />
                      <span>{t("table.column.connected")}</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3" />
                      <span>{t("table.column.disconnected")}</span>
                    </>
                  )}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className=" flex flex-col ">
          <DeviceMessages messages={deviceMessage || []} />
        </div>
      </div>
    </main>
  );
}
