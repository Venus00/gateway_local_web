import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import AddMachine from "./components/AddMachine";
import MachineView from "./components/MachineView";
import { useLanguage } from "@/context/language-context";
import { toast } from "@/hooks/use-toast";
import BreadCrumb from "@/components/breadcrumb";

export default function Machine() {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const fetchMachines = async () => {
    try {
      const response = await apiClient.get("/machine", {
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

  const { data: machines } = useQuery("machines", () => fetchMachines(), {
    initialData: [],
    // refetchInterval: 2000,
  });

  const deleteMachine = async (id: number) => {
    try {
      const res = await apiClient.delete(`machine/${id}`);
      if (res.data)
        toast({
          title: "Delete Entity",
          description: "Entity deleted successfully",
        });
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className="flex-1  flex flex-col gap-4 overflow-x-hidden overflow-y-auto  p-6">
      <BreadCrumb pageTitle={t("nav.entity")} />
      <h1 className="text-2xl font-semibold mb-6">
        {t("entity.manageEntity")}
      </h1>
      {/* Create machine Form */}
      <AddMachine />

      {/* machines Table */}
      <div className="mt-8 bg-white rounded-lg shadow-md  flex-1 ">
        <MachineView machines={machines} onDelete={deleteMachine} />
      </div>
    </main>
  );
}
