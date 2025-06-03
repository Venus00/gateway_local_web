import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import AddToken from "./components/AddToken";
import TokenView from "./components/TokenView";
import { useLanguage } from "@/context/language-context";
import { toast } from "@/hooks/use-toast";
import BreadCrumb from "@/components/breadcrumb";

export default function Tokens() {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const fetchTokens = async () => {
    try {
      const response = await apiClient.get("/tokens", {
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

  const { data: tokens } = useQuery("tokens", () => fetchTokens(), {
    initialData: [],
  });

  const deleteToken = async (id: number) => {
    try {
      await apiClient.delete(`tokens/${id}`);
      toast({
        title: "Token Delete  Status",
        description: "Token has been succefully deleted",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className="flex-1 flex flex-col gap-4 overflow-x-hidden overflow-y-auto  p-6">
      <BreadCrumb pageTitle={t("nav.token")} />
      <h1 className="text-2xl font-semibold mb-6">{t("token.manageToken")}</h1>
      {/* Create machine Form */}
      <AddToken />

      {/* machines Table */}
      <div className="bg-white d rounded-lg shadow-md ">
        <TokenView tokens={tokens} onDelete={deleteToken} />
      </div>
    </main>
  );
}
