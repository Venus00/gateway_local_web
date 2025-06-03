import {  Widget } from "@/utils";
import { useSocket } from "@/features/socket/SockerProvider";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/features/auth/store";
import Card1 from "../../button-options/cards/card1";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/features/api";

type Data = {
  icon?: string;
  iconColor?: string;
  telemetryName?: string;
  position: "center" | "left" | "right" | "reverseCenter";
  isUrl?: boolean;
  unit?: string;
};



export default function ButtonWidget({
  title,
  attributes,
  backgroundColor,
  color,
  h,
  w,
}: Widget) {
  const { position,telemetryName} =
    attributes as Data;

  const analyticId = location.pathname.split("/")[2];
  const { tenant } = useSelector((state: RootState) => state.auth);
  const socket = useSocket();
  const isAnalytic = location.pathname.startsWith("/analytic");

  const [isTriggerd, setIstriggerd] = useState(false);


  const onTrigger = () => {
    console.log("send command");

    try {
      const result = apiClient.post('analytic/output/event',{
        tenant:tenant.id,
        analyticId:analyticId,
        name:telemetryName
      })
      toast({
        title: "Success",
        description: `Action from ${title} Fired Succefully`,
        variant: "default",
      })
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error Firing Event",
        variant: "destructive",
      })
    }

  }
  return (
    <>  
    <Card1
    
      position={position}
      backgroundColor={backgroundColor}
      color={color}
      title={title}
      telemetryName={telemetryName || ''}
      trigger={onTrigger}
      h={h}
      w={w}
      />
    </>
  );
}
