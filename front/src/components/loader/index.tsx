import { cn } from "@/lib/utils";
import "./index.css";
interface Props
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {}

function Loader({ className, ...props }: Props) {
  return (
    <div className={cn("loader ", className)} {...props}>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );
}

export default Loader;
