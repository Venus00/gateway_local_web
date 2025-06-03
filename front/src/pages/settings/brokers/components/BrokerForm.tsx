/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { motion } from "framer-motion";
import { Server, Share2Icon } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { BrokerDto } from "./Broker.dto";
import { useQueryClient } from "react-query";
import { useLanguage } from "@/context/language-context";
const variants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
      staggerDirection: 1,
    },
  },
  closed: {
    height: 0,
    // opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};
export function BrokerForm() {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const [openForm, setOpenForm] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [broker, setBroker] = useState<BrokerDto>({
    tenantId: tenant.id,
    clientId: "",
    host: "",
    name: "",
    password: "",
    port: 1883,
    ip: "",
    username: "",
    topic: "",
  });
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await apiClient.post(`broker`, broker);
      toast({
        title: "Broker Creation  Status",
        description: "broker has been succefully added",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["mqttBrokers"] });
      setOpenForm(false);
      setBroker({
        tenantId: tenant.id,
        clientId: "",
        host: "",
        name: "",
        password: "",
        port: 1883,
        ip: "",
        username: "",
        topic: "",
      });
    } catch (error) {
      console.log(error);
      toast({
        description: "Error in Borker Creation ",
        variant: "destructive",
      });
    } finally {
      console.log("finnaly");
      //setIsLoading(false)
    }
  };
  return (
    <div>
      <div
        className={`flex flex-col transition-all duration-500 ease-in-out   overflow-hidden ${
          openForm ? "gap-4" : "gap-0"
        }`}
      >
        <Button
          onClick={() => {
            setOpenForm((prev) => !prev);
            setBroker({
              tenantId: tenant.id,
              clientId: "",
              host: "",
              name: "",
              password: "",
              port: 1883,
              ip: "",
              username: "",
              topic: "",
            });
          }}
          className="w-fit dark:bg-neutral-800 dark:hover:bg-neutral-700"
          color="red"
          variant="outline"
        >
          {openForm ? t("form.close") : t("broker.create")}
        </Button>
        <motion.div
          variants={variants}
          initial={false}
          animate={openForm ? "open" : "closed"}
          className=" bg-transparent rounded-lg  shadow-md overflow-hidden "
        >
          <Card className="w-full  dark:bg-neutral-800 mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Share2Icon className="h-6 w-6" />
                {t("broker.create.title")}
              </CardTitle>
              <CardDescription>
                {t("broker.create.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className=" flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="name">{t("table.column.name")}</Label>
                      <Input
                        id="name"
                        placeholder="e.g. --"
                        value={broker.name}
                        onChange={(e) =>
                          setBroker({ ...broker, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="ip-address">
                        {t("broker.create.host")}
                      </Label>
                      <Input
                        id="ip-address"
                        placeholder="e.g. 192.168.1.100"
                        value={broker.ip}
                        onChange={(e) =>
                          setBroker({ ...broker, ip: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className=" flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="ip-address">
                        {t("broker.create.clientId")}
                      </Label>
                      <Input
                        id="clientId"
                        placeholder="e.g. clientId"
                        value={broker.clientId}
                        onChange={(e) =>
                          setBroker({ ...broker, clientId: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="port">port</Label>
                      <Input
                        id="port"
                        placeholder="e.g. 1883"
                        value={broker.port}
                        onChange={(e) =>
                          setBroker({
                            ...broker,
                            port: parseInt(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className=" flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="gateway-address">
                        {t("broker.create.username")}
                      </Label>
                      <Input
                        id="username"
                        placeholder="e.g. username"
                        value={broker.username}
                        onChange={(e) =>
                          setBroker({ ...broker, username: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="ip-address">password</Label>
                      <Input
                        id=""
                        placeholder="password"
                        value={broker.password}
                        onChange={(e) =>
                          setBroker({ ...broker, password: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className=" flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="topic_event">
                        {t("broker.create.topic")}
                      </Label>
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
                  <Server className="mr-2 h-4 w-4" />
                  {t("broker.create")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
