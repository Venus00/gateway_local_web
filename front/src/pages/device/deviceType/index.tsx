import { useQuery, useQueryClient } from "react-query";
import { apiClient } from "@/features/api";
import DeviceTypeForm from "./components/DeviceTypeForm";
import { useSelector } from "react-redux";
import { RootState } from "@/features/auth/store";
import DeviceTypeView from "./components/DeviceView";
import { toast } from "@/hooks/use-toast";
import BreadCrumb from "@/components/breadcrumb";
import { useLanguage } from "@/context/language-context";
export default function DeviceType() {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const fetchDeviceType = async () => {
    try {
      const response = await apiClient.get("/devicetype", {
        params: {
          tenantId: tenant.id,
        },
      });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };

  const { data: devices } = useQuery("devicetype", () => fetchDeviceType(), {
    initialData: [],
    // refetchInterval: 2000,
  });

  const deleteDevice = async (name: string) => {
    try {
      const res = await apiClient.delete(`devicetype/${name}`);
      if (res.data)
        toast({
          title: "Delete Device type",
          description: "Device type deleted successfully",
        });
      queryClient.invalidateQueries({ queryKey: ["devicetype"] });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto  p-6">
      <BreadCrumb pageTitle={t("nav.profile")} />
      <h1 className="text-2xl font-semibold mb-6">Manage Devices Type</h1>
      {/* Create Device Form */}
      <DeviceTypeForm />
      {/* Devices Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
        <DeviceTypeView devices={devices} onDelete={deleteDevice} />
      </div>
    </main>
  );
}
