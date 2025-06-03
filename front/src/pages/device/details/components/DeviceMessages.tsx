import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DeviceMessageTable from "./DeviceMessageTable";
import { useLanguage } from "@/context/language-context";

interface PropsType {
  messages: any[];
}
function DeviceMessages({ messages }: PropsType) {
  const { t, isArabic } = useLanguage();
  return (
    <Card className="h-full ">
      <CardHeader dir={isArabic ? "rtl" : "ltr"}>
        {t("device.messages")}
      </CardHeader>
      <CardContent className=" ">
        <DeviceMessageTable messages={messages} />
      </CardContent>
    </Card>
  );
}

export default DeviceMessages;
