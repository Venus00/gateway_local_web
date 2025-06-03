import { flatten, Widget } from "@/utils";
import { useSocket } from "@/features/socket/SockerProvider";
import { useEffect, useState } from "react";
import { apiClient } from "@/features/api";
import { useSelector } from "react-redux";
import { RootState } from "@/features/auth/store";
import Card1 from "../../battery-options/cards/card1";

type Data = {
  icon?: string;
  telemetryName?: string;
  position: "center" | "left" | "right" | "reverseCenter";
  isUrl?: boolean;
};

function stringify(value: unknown) {
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

export default function CardWidget({
  title,
  attributes,
  backgroundColor,
  color,
}: Widget) {
  const { telemetryName, icon, position, isUrl } = attributes as Data;

  const socket = useSocket();

  const machineId = location.pathname.split("/")[2];
  const { tenant } = useSelector((state: RootState) => state.auth);
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAnalytic = location.pathname.startsWith("/analytic");
  const [data, setData] = useState({
    [telemetryName as string]: 0,
  });

  useEffect(() => {
    fetchTelemtrie();
  }, []);

  const fetchTelemtrie = async () => {
    try {
      if (isAnalytic) {
        const result = await apiClient.get(`analyticTelemetrie`, {
          params: {
            telemetrieName: telemetryName,
            analyticId: machineId,
          },
        });
        setData({
          [telemetryName as string]: result.data[0]?.value,
        });
        console.log(result);

        return;
      }
      if (isDashboard) {
        const result = await apiClient.get(`/dashboard/telemetrie`, {
          params: {
            telemetrieName: telemetryName,
            tenantId: tenant.id,
          },
        });
        setData({
          [telemetryName as string]: result.data,
        });
        return;
      }

      const result = await apiClient.get(`telemetrie`, {
        params: {
          machineId,
          telemetrie: telemetryName,
          tenantId: tenant.id,
        },
      });
      setData({
        [telemetryName as string]: result.data,
      });
    } catch (error) {
      console.error("Error fetching telemetry data:", error);
    }
  };
  useEffect(() => {
    if (!socket) return;
    console.log("socket  connectedd");
    socket.on(`machineData/${machineId}`, (data) => {
      const payload = JSON.parse(data);
      if (payload.name === telemetryName) {
        setData({
          [telemetryName as string]: payload.value,
        });
      }
    });
  }, []);

  return (
    <>
      <Card1
        backgroundColor={backgroundColor}
        color={color}
        title={title}
        content={
          (telemetryName && stringify(flatten(data)?.[telemetryName])) || "0"
        }
        icon={icon}
        position={position}
        isUrl={isUrl}
      />
    </>
  );
}
