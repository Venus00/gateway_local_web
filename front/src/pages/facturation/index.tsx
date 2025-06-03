import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import FactorisationByTenant from "./FactorisationByTenant";
import YourPlan from "./YourPlan";
import ManageFacture from "./ManageFacture";
import DangerZone from "./DangerZone";
import LOGO from "../../assets/images/logo.svg";
import LOGODARK from "../../assets/images/logo-dark.png";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/context/language-context";
import BreadCrumb from "@/components/breadcrumb";
export default function Facturation() {
  const AppName = "DigiSense";
  const { theme } = useTheme();
  const { t } = useLanguage();
  const image = theme === "light" ? LOGO : LOGODARK;
  const { tenant, id } = useSelector((state: RootState) => state.auth);
  const fetchTenant = async () => {
    try {
      const response = await apiClient.get(
        `/tenant/dashboard?tenantId=${tenant.id}`
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };
  const { data: tenantData } = useQuery("tenantData", () => fetchTenant(), {
    initialData: {},
  });
  return (
    <div className="flex flex-col gap-6 p-6">
      <img src={image} className="w-[200px] h-full" />
      <BreadCrumb pageTitle={t("nav.facturation")} />
      <FactorisationByTenant tenantData={tenantData} />
      <YourPlan tenantData={tenantData} />
      <ManageFacture tenantData={tenantData} />
      <DangerZone tenantData={tenantData} />
    </div>
  );
}
