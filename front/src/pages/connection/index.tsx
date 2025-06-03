import { useLanguage } from "@/context/language-context";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import ConnectionForm from "./components/ConnectionForm";
import ConnectionView from "./components/ConnectionView";
import { fetchConnection } from "./utils/actions";
import BreadCrumb from "@/components/breadcrumb";
export default function Connection() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { data: connections } = useQuery(
    "connections",
    () => fetchConnection(tenant.id),
    { initialData: [] }
  );
  const { tenant } = useSelector((state: RootState) => state.auth);

  const delteConnection = async (id: number) => {
    try {
      const res = await apiClient.delete(`connection/${id}`);
      if (res.data)
        toast({
          title: "Delete Connection",
          description: "Connection deleted successfully",
        });
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    } catch (error: any) {
      toast({
        title: "Delete Connection",
        description: error,
      });
    }
  };
  return (
    <main className="flex-1 flex flex-col gap-4 overflow-x-hidden overflow-y-auto p-6">
      <BreadCrumb pageTitle={t("nav.connection")} />
      <h1 className="text-2xl font-semibold mb-6">
        {t("connection.manageConnection")}
      </h1>
      <ConnectionForm />
      <div className="mt-8 bg-white rounded-lg shadow-md flex-1">
        <ConnectionView connections={connections} onDelete={delteConnection} />
      </div>
    </main>
  );
}
