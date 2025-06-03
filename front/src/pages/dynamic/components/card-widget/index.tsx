import { Widget, WidgetCardType } from "@/utils";
import TelemetryOption from "./telemetry-option";
import TextOption from "./text-option";

type Data = {
  type: WidgetCardType;
  content?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element?: any;
  cameraId?: string;
  icon?: string;
  telemetryName?: string;
  isUrl?: boolean;
};

export default function CardWidget(props: Widget) {
  const { type } = props.attributes as Data;

  if (type === "text") return <TextOption {...props} />;
  if (type === "telemetry") return <TelemetryOption {...props} />;
  return type;
}
