import { useQuery, useQueryClient } from "react-query";
import { apiClient } from "@/features/api";
import { useSelector } from "react-redux";
import { RootState } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BrokerList from "./components/BrokerList";
import { Button } from "@/components/ui/button";
import { BrokerForm } from "./components/BrokerForm";
import BreadCrumb from "@/components/breadcrumb";
import { useLanguage } from "@/context/language-context";

function Broker() {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const fetchBrokers = async () => {
    try {
      const result = await apiClient.get("broker", {
        params: {
          tenantId: tenant.id,
        },
      });
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      if (tenant?.licence?.subscriptionPlanId) {
        const result = await apiClient.get("tenant/subcsriptionPlansById", {
          params: {
            id: tenant?.licence?.subscriptionPlanId,
          },
        });
        return result.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { data: subscription } = useQuery(
    "subscription",
    fetchSubscriptionPlans,
    {
      initialData: [],
    }
  );

  const { data: brokers } = useQuery("mqttBrokers", fetchBrokers, {
    initialData: [],
  });
  const handleEdit = () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await apiClient.delete(`broker`, {
        params: {
          id,
        },
      });
      toast({
        title: "Broker Delete  Status",
        description: "broker has been succefully deleted",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["mqttBrokers"] });
    } catch (error) {
      console.log(error);
      toast({
        title: "Broker Delete  Status",
        description: "Error in Delete Broker",
        variant: "destructive",
      });
    }
  };
  const breadcrumb = [
    { url: "/settings/broker", name: t("nav.settings") },
    // { url: "/devicetype", name: t("nav.profile") },
    // { url: "/dashboards", name: linkName },
  ];
  return (
    <main className="flex flex-col overflow-x-hidden overflow-y-auto gap-6  p-6">
      <BreadCrumb links={breadcrumb} pageTitle={t("nav.brokers")} />
      {/* {subscription?.specs?.broker?.value > brokers.length && (
        <Link
          to={{
            pathname: `/settings`,
          }}
        >
          <Button variant={"outline"}>{t("broker.create")}</Button>
        </Link>
      )} */}
      <BrokerForm />
      <Card className="flex-1">
        <CardHeader>
          <h1 className="text-2xl font-semibold mb-6">{t("broker.title")}</h1>
        </CardHeader>
        <CardContent>
          <BrokerList
            brokers={brokers}
            handleEdit={handleEdit}
            onDelete={onDelete}
          />
        </CardContent>
      </Card>
    </main>
  );
}

export default Broker;
