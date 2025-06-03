import { Widget } from "@/utils";
import Card1 from "../../battery-options/cards/card1";

type Data = {
  content?: string;
  icon?: string;
  position: "center" | "left" | "right" | "reverseCenter";
  orientation: "horizontal" | "vertical";
  isUrl?: boolean;
};

export default function TextOptions({
  title,
  backgroundColor,
  color,
  attributes,
}: Widget) {
  const { content, icon, position, isUrl, orientation } = attributes as Data;

  return (
    <>
      <Card1
        backgroundColor={backgroundColor}
        color={color}
        orientation={orientation}
        title={title}
        content={content || "0"}
        icon={icon}
        position={position}
        isUrl={isUrl}
      />
    </>
  );
}
