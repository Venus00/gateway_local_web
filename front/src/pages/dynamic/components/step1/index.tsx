import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import WidgetLogo from "../widget-logo";
import { useAddWidgetStore } from "../../widget-store";
import { useGridStore } from "../../grid-store";
import WidgetTypeSelector from "../widget-type-selector";
import ColorPicker from "@/components/color-picker";

interface PropsType {
  id: number;
}
export function Step1({ id }: PropsType) {
  const { data, setTitle, setApiUrl, setToken, setBackgroundColor, setColor } =
    useAddWidgetStore();
  const { dashboard } = useGridStore();

  const { widgetId } =
    dashboard.find((machine) => machine.machineId === id) || {};
  return (
    <div className="place-content-center ">
      {widgetId == "new" ? (
        <WidgetTypeSelector />
      ) : (
        <WidgetLogo
          type={data.type}
          className=" bg-transparent py-4 [&>*]:mx-auto  [&>*]:w-32 mt-2   mx-auto"
        />
      )}
    </div>
  );
}
