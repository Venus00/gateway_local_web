import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConnectionsTable from "@/pages/connection/components/ConnectionTable";
import DeviceTable from "@/pages/device/components/DeviceTable";
import MachineTypeTable from "@/pages/machine/machinetype/components/MachineTypeTable";
import BrokerList from "@/pages/settings/brokers/components/BrokerList";
import UserTable from "@/pages/settings/users/components/UserTable";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router";
import { fetchConnection, fetchDevices, fetchTenant } from "../utils/actions";
import TenantInfo from "./components/TenantInfo";
import { useLanguage } from "@/context/language-context";
import BreadCrumb from "@/components/breadcrumb";
import { useSelector } from "react-redux";
import { RootState } from "@/features/auth/store";

export default function TenantDetails() {
  const location = useLocation();
  const { t } = useLanguage();
  const [selectedCard, setSelectedCard] = useState("Info");
  const { role } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useQuery("tenant_details", async () => {
    const [fetchedTenant, fetchedConnections, fetchedDevices] =
      await Promise.all([
        fetchTenant(location.state),
        fetchConnection(location.state),
        fetchDevices(location.state),
      ]);
    return {
      fetchedTenant,
      fetchedConnections,
      fetchedDevices,
    };
  });
  const fetchedTenant = data?.fetchedTenant;
  const fetchedConnections = data?.fetchedConnections;
  const fetchedDevices = data?.fetchedDevices;
  console.log(fetchConnection);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  const cards = [
    {
      title: "Users",
      value: fetchedTenant?.users?.length,
      component: (
        <UserTable
          users={fetchedTenant?.users || []}
          onDelete={() => {}}
          handleEdit={() => {}}
          onVerify={() => {}}
          role={role}
        />
      ),
    },
    {
      title: "Entities",
      value: fetchedTenant?.entities,
      component: (
        <MachineTypeTable
          machines={fetchedTenant.machines || []}
          onDelete={() => {}}
        />
      ),
    },
    {
      title: "Devices",
      value: fetchedDevices?.length,
      component: (
        <DeviceTable
          devices={fetchedDevices || []}
          onDelete={() => {}}
          handleEdit={() => {}}
        />
      ),
    },
    // {
    //   title: "Connections",
    //   value: fetchedConnections?.length,
    //   component: (
    //     <ConnectionsTable
    //       connections={fetchedConnections || []}
    //       onDelete={() => {}}
    //     />
    //   ),
    // },
    {
      title: "Brokers",
      value: fetchedTenant?.brokers?.length,
      component: (
        <BrokerList
          brokers={fetchedTenant.brokers || []}
          onDelete={() => {}}
          handleEdit={() => {}}
        />
      ),
    },
  ];
  const breadcrumb = [
    { url: "/tenant", name: t("nav.tenant") },
    // { url: "/devicetype", name: t("nav.profile") },
    // { url: "/dashboards", name: linkName },
  ];
  return (
    <div className="flex flex-col gap-4 max-w-screen-2xl mx-auto w-full  p-4">
      <BreadCrumb links={breadcrumb} pageTitle={fetchedTenant?.name} />
      <div className="flex  gap-4 w-full ">
        <div className=" flex flex-col  gap-3 min-w-56  w-full md:w-56 ">
          <Card
            onClick={() => setSelectedCard("Info")}
            className={`w-full  flex-none cursor-pointer
            ${
              selectedCard === "Info"
                ? "shadow-md text-primary shadow-primary"
                : ""
            }
            `}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tenant Info</CardTitle>
              {/* <Users className="h-4 w-4 text-muted-foreground" /> */}
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="text-xl font-bold flex flex-none truncate text-ellipsis">
                {fetchedTenant?.name}
              </div>
            </CardContent>
          </Card>
          {selectedCard === "Info" && (
            <div className="p-4 md:hidden flex w-full overflow-x-auto flex-col [&>*]:w-full bg-white dark:bg-neutral-950 rounded-xl">
              <TenantInfo fetchedTenant={fetchedTenant} />
            </div>
          )}
          {cards.map((card, index) => (
            <div key={index} className="flex flex-col gap-3">
              <Card
                onClick={() => setSelectedCard(card.title)}
                className={`w-full  flex-none cursor-pointer
            ${
              selectedCard === card.title
                ? "shadow-md shadow-primary text-primary "
                : ""
            }
            `}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
              {selectedCard === card.title && (
                <div className="p-4  md:hidden flex w-full overflow-x-auto flex-col [&>*]:w-full bg-white dark:bg-neutral-950 rounded-xl">
                  {card.component}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-0 md:p-4  md:!w-full !w-0 flex-col   [&>*]:w-full bg-white !overflow-hidden dark:bg-neutral-950 rounded-xl">
          <h1 className="text-xl  truncate font-medium">{selectedCard}</h1>
          {fetchedTenant && selectedCard === "Info" ? (
            <TenantInfo fetchedTenant={fetchedTenant} />
          ) : (
            cards.filter((card) => card.title === selectedCard)[0]?.component
          )}
        </div>
      </div>
    </div>
  );
}
