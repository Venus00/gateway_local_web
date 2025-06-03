import { useQuery, useQueryClient } from "react-query";
import { apiClient } from "@/features/api";
import UserView from "./components/UserView";
import { useEffect } from "react";
import { RootState } from "@/features/auth/store";
import { useSelector } from "react-redux";
import { useLanguage } from "@/context/language-context";
import { toast } from "@/hooks/use-toast";
import { UserCreateForm } from "./components/UserCreateForm";
import BreadCrumb from "@/components/breadcrumb";

export default function Device() {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/users", {
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

  const { data: users } = useQuery("users", () => fetchUsers(), {
    initialData: [],
    refetchInterval: 5000,
  });

  const deleteUser = async (id: number) => {
    try {
      await apiClient.delete(`users/${id}`);
      toast({
        title: "User Delete  Status",
        description: "User has been succefully deleted",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.log(error);
    }
  };
  const verifyUser = async (id: number) => {
    try {
      await apiClient.post(`/auth/verifyUser/${id}`);
      toast({
        title: "User Verification  Status",
        description: "User has been succefully verified",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.log(error);
    }
  };
  const breadcrumb = [
    { url: "/settings/users", name: t("nav.settings") },
    // { url: "/devicetype", name: t("nav.profile") },
    // { url: "/dashboards", name: linkName },
  ];
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto  p-6">
      <BreadCrumb links={breadcrumb} pageTitle={t("nav.Users")} />
      <h1 className="text-2xl font-semibold mb-6">
        {t("settings.manageUser")}
      </h1>
      <UserCreateForm />
      {/* Devices Table */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <UserView users={users} onDelete={deleteUser} onVerify={verifyUser} />
      </div>
    </main>
  );
}
