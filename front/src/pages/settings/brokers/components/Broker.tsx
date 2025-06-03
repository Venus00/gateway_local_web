import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/features/api";
import { MessageSquare, Plug, Unplug, Wifi, WifiOff } from "lucide-react";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import { BrokerChart } from "./BrokerChart";
import BrokerMessages from "./BrokerLogs";

// Simulated MQTT data
type MQTTData = {
  timestamp: number;
  connectedClients: number;
  disconnectedClients: number;
  messageRate: number;
  lastMessage: string;
  status: boolean;
};

export default function BrokerSpecification() {
  let { id } = useParams();

  const { data: broker } = useQuery("broker", () => fetchBroker(), {
    refetchInterval: 10000,
  });

  const fetchBroker = async () => {
    try {
      const response = await apiClient.get("broker/spec", {
        params: {
          name: id,
        },
      });
      const connected = response.data?.device.filter(
        (device: any) => device.status
      ).length;
      const disconnected = response.data.device.filter(
        (device: any) => !device.status
      ).length;
      const brokerData: MQTTData = {
        connectedClients: connected,
        disconnectedClients: disconnected,
        lastMessage: "",
        messageRate: 5,
        timestamp: 0,
        status: response.data.status,
      };
      return brokerData;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Clients
            </CardTitle>
            <Plug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{broker?.connectedClients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Disconnected Clients
            </CardTitle>
            <Unplug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {broker?.disconnectedClients}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Message Rate (msg/s)
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{broker?.messageRate}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Broker Status</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div>
              <Badge
                variant={broker?.status ? "default" : "secondary"}
                className={` items-center space-x-1 ${
                  broker?.status
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {broker?.status ? (
                  <>
                    <Wifi className="h-3 w-3" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" />
                    <span>Disconnected</span>
                  </>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-2 ">
        <BrokerChart className="w-[250px]" />

        <BrokerMessages name={id || ""} />
      </div>
    </div>
  );
}
