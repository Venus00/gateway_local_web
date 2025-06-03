import { useLanguage } from "@/context/language-context";
import AnalyticsDashboardList from "./components/AnalyticsDashboardList";
import EntitiesDashboardList from "./components/EntitiesDashboardList";
import GlobalDashboardList from "./components/GlobalDashboardList";
import BreadCrumb from "@/components/breadcrumb";

function Dashboards() {
  const { t, isArabic } = useLanguage();

  return (
    <main className="flex-1  overflow-x-hidden overflow-y-auto gap-8 p-6 ">
      <BreadCrumb pageTitle={t("breadcrumb.dashboards")} />
      <h1
        className="text-2xl font-semibold my-6 "
        dir={isArabic ? "rtl" : "ltr"}
      >
        {t("dashboard.globalDashboard")}
      </h1>
      <GlobalDashboardList />
      <h1
        className="text-2xl font-semibold my-6"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {t("dashboard.manageDashboard")}
      </h1>
      <EntitiesDashboardList />
      <h1
        className="text-2xl font-semibold my-6"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {t("dashboard.manageAnalytics")}
      </h1>
      <AnalyticsDashboardList />
    </main>
  );
}

export default Dashboards;
