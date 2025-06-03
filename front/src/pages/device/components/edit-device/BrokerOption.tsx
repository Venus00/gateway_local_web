/* eslint-disable @typescript-eslint/no-unused-vars */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/language-context";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { BrokerTableDto } from "@/pages/settings/brokers/components/Broker.dto";
import { useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useEditDeviceStore } from "./device-store";
export default function BrokerOption() {
  const { t, isArabic } = useLanguage();
  const { data, setData } = useEditDeviceStore();
  const { data: brokers } = useQuery("brokers", () => fetchBrokers(), {
    initialData: [],
  });
  // const [selectedBroker, setSelectedBroker] = useState<BrokerTableDto | null>(
  //   null
  // );
  const { tenant } = useSelector((state: RootState) => state.auth);
  const fetchBrokers = async () => {
    try {
      const response = await apiClient.get("broker", {
        params: {
          tenantId: tenant.id,
        },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  };

  return (
    <div>
      <div className="flex-1 space-y-2">
        <Label className="font-semibold" htmlFor="deviceType">
          {t("broker.title")}
        </Label>
        <Select
          name="mqttBroker"
          value={data.brokerId?.toString() || ""}
          required
          onValueChange={(e) => {
            const broker = brokers.find(
              (broker: { id: number }) => broker.id === +e
            );
            const prefix = broker?.hide === true ? tenant.name + "/" : "";
            // setSelectedBroker(broker);
            setData({
              ...data,
              brokerId: +e,
              config: { ...data.config, prefix },
            });
          }}
          dir={isArabic ? "rtl" : "ltr"}
        >
          <SelectTrigger className="dark:border-neutral-400">
            <SelectValue placeholder={t("device.selectBroker")} />
          </SelectTrigger>
          <SelectContent className="dark:bg-neutral-800 border dark:border-neutral-300">
            <SelectGroup>
              {brokers
                ? brokers.map(
                    (broker: { id: number; name: string }, key: number) => {
                      return (
                        <SelectItem
                          key={key}
                          value={broker.id.toString()}
                          className="dark:hover:bg-neutral-700"
                        >
                          {broker.name}
                        </SelectItem>
                      );
                    }
                  )
                : null}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 space-y-2">
        <Label className="font-semibold" htmlFor="ip-address">
          {t("broker.create.clientId")}
        </Label>
        <Input
          id="clientId"
          placeholder="clientId"
          value={data.serial}
          disabled
          required
        />
      </div>

      <div className="flex-1 space-y-2">
        <Label className="font-semibold" htmlFor="gateway-address">
          {t("broker.create.username")}
        </Label>
        <Input
          id="username"
          placeholder="username"
          value={data.config.username}
          onChange={(e) =>
            setData({
              ...data,
              config: { ...data.config, username: e.target.value },
            })
          }
        />
      </div>
      <div className="flex-1 space-y-2">
        <Label className="font-semibold" htmlFor="ip-address">
          password
        </Label>
        <Input
          id=""
          placeholder="password"
          value={data.config.password}
          onChange={(e) =>
            setData({
              ...data,
              config: { ...data.config, password: e.target.value },
            })
          }
        />
      </div>

      <div className="flex-1 space-y-2">
        <Label className="font-semibold" htmlFor="">
          Subscription topic
        </Label>
        <div className="flex items-center gap-2">
          {data.config.prefix && (
            <span className="text-sm text-primary">{tenant.name}/</span>
          )}
          <Input
            id=""
            placeholder={`devices/${data.serial}/#`}
            value={data.config.subTopic}
            onChange={(e) => {
              setData({
                ...data,
                config: { ...data.config, subTopic: e.target.value },
              });
            }}
            required
          />
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <Label className="font-semibold" htmlFor="topic_event">
          Publish topic
        </Label>
        <div className="flex items-center gap-2">
          {data.config.prefix && (
            <span className="text-sm text-primary">{tenant.name}/</span>
          )}
          <Input
            id=""
            placeholder={`devices/${data.serial}/#`}
            value={data.config.pubTopic}
            onChange={(e) =>
              setData({
                ...data,
                config: { ...data.config, pubTopic: e.target.value },
              })
            }
            required
          />
        </div>
      </div>
    </div>
  );
}
