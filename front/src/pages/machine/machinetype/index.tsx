import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import AddMachineType from "./components/AddMachineType";
import MachineTypeView from "./components/MachineTypeView";
import { useLanguage } from "@/context/language-context";
import { toast } from "@/hooks/use-toast";
import BreadCrumb from "@/components/breadcrumb";

export default function MachineType() {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const fetchmachineType = async () => {
    try {
      const response = await apiClient.get("/machineType", {
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

  const { data: machines } = useQuery(
    "machinesType",
    () => fetchmachineType(),
    { initialData: [] }
  );

  const deletemachine = async (name: string) => {
    try {
      const res = await apiClient.delete(`machinetype/${name}`);
      if (res.data)
        toast({
          title: "Delete Entity type",
          description: "Entity type deleted successfully",
        });
      queryClient.invalidateQueries({ queryKey: ["machinesType"] });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex-1 flex flex-col gap-4 overflow-x-hidden overflow-y-auto  p-6">
      <BreadCrumb pageTitle={t("nav.profile")} />
      <h1 className="text-2xl font-semibold mb-6">
        {t("entity.manageEntityType")}
      </h1>
      {/* Create machine Form */}
      <AddMachineType />

      {/* machines Table */}
      <div className="bg-white rounded-lg shadow-md ">
        <MachineTypeView machines={machines} onDelete={deletemachine} />
      </div>
    </main>
  );
}
