import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { Save, Share2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { BrokerDto } from "../../settings/components/Broker.dto";
import { useQueryClient } from "react-query";
import BreadCrumb from "@/components/breadcrumb";
import { useLanguage } from "@/context/language-context";
export default function EditBroker() {
  const queryClient = useQueryClient();
  const { tenant } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const hide = location.state?.hide;
  const [broker, setBroker] = useState<BrokerDto>({
    id: location.state?.id,
    tenantId: tenant.id,
    clientId: location.state?.clientId,
    host: location.state?.host,
    name: location.state?.name,
    password: location.state?.password,
    port: location.state?.port,
    ip: location.state?.ip,
    username: location.state?.username,
    topic: location.state?.topic,
    hide: location.state?.hide,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    editBroker(broker);
  };
  const editBroker = async (data: BrokerDto) => {
    try {
      await apiClient.put("broker", data);
      toast({
        title: "Success",
        description: "Broker Edited Successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["mqttBrokers"] });
      navigate("/settings/broker");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to Edit Broker",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {}, [broker]);
  const breadcrumb = [
    { url: "/settings/broker", name: t("nav.brokers") },
    // { url: "/devicetype", name: t("nav.profile") },
    // { url: "/dashboards", name: linkName },
  ];
  return (
    <main
      className={`flex-1 overflow-x-hidden container mx-auto   overflow-y-auto   p-6 `}
    >
      <BreadCrumb links={breadcrumb} pageTitle={t("breadcrumb.edit")} />
      <div className=" bg-white dark:bg-neutral-800 rounded-lg  overflow-hidden p-4">
        <h1 className="text-2xl font-semibold mb-6">Edit Broker</h1>
        {!location.state ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              No broker data found. Please select a broker to edit.
            </p>
          </div>
        ) : (
          <Card className="w-full  dark:bg-neutral-800 mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Share2Icon className="h-6 w-6" />
                Mqtt Connectivity
              </CardTitle>
              <CardDescription>
                Configure Mqtt Broker Connection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className=" flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g. --"
                        value={broker.name}
                        onChange={(e) =>
                          setBroker({ ...broker, name: e.target.value })
                        }
                        disabled={hide}
                        required
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="ip-address">Host Address</Label>
                      <Input
                        id="ip-address"
                        placeholder="e.g. 192.168.1.100"
                        value={broker.ip}
                        onChange={(e) =>
                          setBroker({ ...broker, ip: e.target.value })
                        }
                        required
                        disabled
                      />
                    </div>
                  </div>

                  <div className=" flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="ip-address">clientId</Label>
                      <Input
                        id="clientId"
                        placeholder="e.g. clientId"
                        value={hide ? "********" : broker.clientId}
                        onChange={(e) =>
                          setBroker({ ...broker, clientId: e.target.value })
                        }
                        required
                        disabled={hide}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="port">port</Label>
                      <Input
                        id="port"
                        placeholder="e.g. 1883"
                        value={hide ? "********" : broker.port}
                        onChange={(e) =>
                          setBroker({
                            ...broker,
                            port: parseInt(e.target.value),
                          })
                        }
                        required
                        disabled={hide}
                      />
                    </div>
                  </div>
                  <div className=" flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="gateway-address">username</Label>
                      <Input
                        id="username"
                        placeholder="e.g. username"
                        value={hide ? "********" : broker.username}
                        onChange={(e) =>
                          setBroker({ ...broker, username: e.target.value })
                        }
                        disabled={hide}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="ip-address">password</Label>
                      <Input
                        id=""
                        placeholder="password"
                        value={hide ? "********" : broker.password}
                        onChange={(e) =>
                          setBroker({ ...broker, password: e.target.value })
                        }
                        disabled={hide}
                      />
                    </div>
                  </div>
                  <div className=" flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="topic_event">Event Topic</Label>
                      <Input
                        id=""
                        placeholder="e.g. /nxt/devices/+/event"
                        value={broker.topic}
                        onChange={(e) =>
                          setBroker({ ...broker, topic: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="justify-center">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
