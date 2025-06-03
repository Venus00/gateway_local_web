import { useQuery, useQueryClient } from "react-query";
import { apiClient } from "@/features/api";
// import { DeviceForm } from "./components/DeviceForm";
import type { RootState } from "@/features/auth/store";
import { useSelector } from "react-redux";
import DeviceView from "./components/DeviceView";
import { useLanguage } from "@/context/language-context";
import { toast } from "@/hooks/use-toast";
import BreadCrumb from "@/components/breadcrumb";
import { AddDevice } from "./components/add-device";

export default function Device() {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const { t, isArabic } = useLanguage();
  const queryClient = useQueryClient();
  const fetchDevices = async () => {
    try {
      const response = await apiClient.get("/device", {
        params: {
          tenantId: tenant.id,
        },
      });
      response.data.sort((a: { id: number }, b: { id: number }) => a.id - b.id);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };

  const { data: devices } = useQuery("devices", () => fetchDevices(), {
    initialData: [],
    refetchInterval: 5000,
    // refetchIntervalInBackground: true,
  });

  const deleteDevice = async (serial: string) => {
    try {
      const res = await apiClient.delete(`device/${serial}`);
      if (res.data)
        toast({
          title: "Delete Device",
          description: "Device deleted successfully",
        });
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex-1 flex flex-col gap-4 overflow-x-hidden overflow-y-auto p-6">
      <BreadCrumb pageTitle={t("nav.device")} />
      <h1
        className="text-2xl font-semibold mb-6"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {t("device.manageDevices")}
      </h1>
      {/* <DeviceForm/> */}
      <AddDevice />
      {/* Devices Table */}
      <div className="mt-8 bg-white rounded-lg shadow-md flex-1">
        <DeviceView devices={devices} onDelete={deleteDevice} />
      </div>
    </main>
  );
}
