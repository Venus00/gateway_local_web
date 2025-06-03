/* eslint-disable @typescript-eslint/no-explicit-any */
import { LucideIcon, LucideProps } from "lucide-react";
import lucide from "../icon-picker/lucide";

const lucideIcons: any = lucide;

interface IconProps extends LucideProps {
  name: string;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = lucideIcons[
    name as keyof typeof lucide
  ] as LucideIcon | null;
  if (!IconComponent) {
    return null;
  }
  return <IconComponent {...props} />;
};
