import { useQuery } from "react-query";
import BrokerMessagesTable from "./components/BrokerMessagesTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { apiClient } from "@/features/api";

interface PropsType {
  name: string;
}
function BrokerMessages({ name }: PropsType) {
  const { data: brokerMessages } = useQuery(
    "brokerMessages",
    () => fetchBroker(),
    {
      refetchInterval: 10000,
      initialData: [],
    }
  );
  console.log(brokerMessages, "brokerMessages");

  const fetchBroker = async () => {
    try {
      const response = await apiClient.get("broker/messages", {
        params: {
          name,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card className="flex-1 ">
      <CardHeader> Broker Messages </CardHeader>
      <CardContent>
        <BrokerMessagesTable messages={brokerMessages} />
      </CardContent>
    </Card>
  );
}

export default BrokerMessages;
