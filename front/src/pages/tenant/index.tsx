import { useQuery, useQueryClient } from "react-query";
import { apiClient } from "@/features/api";
import TenantView from "./components/TenantView";
import { RootState } from "@/features/auth/store";
import { useDispatch, useSelector } from "react-redux";
import { switchTenant } from "@/features/auth/authSlice";
import { TenantForm } from "./components/TenantForm";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import BreadCrumb from "@/components/breadcrumb";
import { useLanguage } from "@/context/language-context";

export default function Tenant() {
  const dispatch = useDispatch();
  const { role, tenant, id, email } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const fetchTenant = async () => {
    try {
      const response = await apiClient.get("tenant");
      return response.data;
    } catch (error) {
      console.log(error);
      return [tenant];
    }
  };
  useEffect(() => {
    if (role !== "gadmin") {
      return navigate(`/tenant/${tenant.id}`, {
        state: tenant.id,
      });
    }
  }, [tenant, role, navigate]);
  const { data: tenants } = useQuery("tenant", () => fetchTenant(), {
    initialData: [],
    enabled: role === "gadmin",
    // refetchInterval: 2000,
  });

  const deleteTenant = async (id: number) => {
    try {
      await apiClient.delete(`tenant/${id}`);
      toast({
        title: "Tenant Delete  Status",
        description: "Tenant has been succefully deleted",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    } catch (error) {
      console.log(error);
    }
  };

  async function handleSwitchTenant(tenantItem: any) {
    // setIsLoading(true);
    const newToken = {
      id,
      email,
      tenantId: tenantItem.id,
      role,
      permissions: [],
    };
    const res = await apiClient.post("/auth/updateToken", newToken);
    console.log("res", res);
    const accessToken = res.data?.accessToken;
    dispatch(switchTenant({ tenantItem, accessToken }));
  }
  if (role !== "gadmin") {
    return <div>Redirecting to tenant Informations page...</div>;
  }
  return (
    <main className=" flex-1 overflow-x-hidden overflow-y-auto p-6 ">
      <BreadCrumb pageTitle={t("nav.tenant")} />
      <h1 className="text-2xl font-semibold mb-6">Manage Tenants</h1>
      {role === "gadmin" ? <TenantForm /> : <></>}
      <div className="mt-8 bg-white rounded-lg shadow-md  flex-1 ">
        <TenantView
          tenants={tenants}
          onDelete={deleteTenant}
          handleSwitchTenant={handleSwitchTenant}
        />
      </div>
    </main>
  );
}
