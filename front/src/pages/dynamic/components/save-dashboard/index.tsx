import { DashboardSwitch } from "@/components/ui/dashboardSwitcher";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { cn } from "@/lib/utils";
import { Check, CodeXml } from "lucide-react";
import { useSelector } from "react-redux";
import { useGridStore } from "../../grid-store";

interface PropsType {
  id: number;
}
export function SaveDashboard({ id }: PropsType) {
  const {
    dashboard,
    setUpdatedMachine,
    setEditMachine,
    toggleMachineEditMode,
  } = useGridStore();
  const pathname = window.location.pathname;
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAnalytic = location.pathname.startsWith("/analytic");
  const { tenant } = useSelector((state: RootState) => state.auth);

  const dashboardItem = dashboard.find(
    (dashboardItem) => dashboardItem.machineId === id
  );
  const isUpdated = dashboardItem ? dashboardItem.isUpdated : false;
  // useInsertionEffect(() => {
  //   toggleMachineEditMode(id);
  // }, [pathname]);
  const save = async () => {
    await submitDashboard();
  };

  const submitDashboard = async () => {
    try {
      if (!isDashboard) {
        if (isAnalytic)
          await apiClient.post(
            `analytic/layout/${id}`,
            {
              layout: dashboardItem?.layout,
              widget: dashboardItem?.widgets,
            },
            {
              params: { type: dashboardItem?.type },
            }
          );
        else
          await apiClient.post(
            `machine/layout/${id}`,
            {
              layout: dashboardItem?.layout,
              widget: dashboardItem?.widgets,
            },
            {
              params: { type: dashboardItem?.type },
            }
          );
      } else {
        await apiClient.put(`tenant/dashboard`, {
          tenantId: tenant.id,
          layout: JSON.stringify(dashboardItem?.layout),
          widget: JSON.stringify(dashboardItem?.widgets),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const editMode = dashboard.find(
    (machine) => machine.machineId === Number(id)
  )?.editMode;
  // console.log("edit mode", editMode);

  return (
    <DashboardSwitch
      // className={`${editMode && isUpdated ? "!bg-yellow-100" : ""}`}
      checked={editMode}
      onCheckedChange={(checked) => {
        if (!checked) {
          console.log("saving dashboard");

          save();
        }
        toggleMachineEditMode(Number(id));
      }}
      className={cn(
        "h-6 w-14 [&>*]:data-[state=checked]:!translate-x-7 [&>*]:data-[state=unchecked]:!translate-x-1 ",
        {
          "!bg-yellow-400": editMode && isUpdated,
          "!bg-blue-500": editMode && !isUpdated,
        }
      )}
    >
      {editMode && isUpdated ? (
        <Check className="w-5 h-5 bg-white dark:bg-neutral-500  rounded-full p-1 text-muted-foreground dark:text-white" />
      ) : (
        <CodeXml className="w-5 h-5 bg-white dark:bg-neutral-500  rounded-full p-1 text-muted-foreground dark:text-white" />
      )}
    </DashboardSwitch>
  );
}
// <Button
//   disabled={!isUpdated}
//   className={cn(
//     "flex items-center gap-2 h-fit py-1 px-2 rounded-lg text-xs bg-blue-200 text-blue-600 hover:bg-blue-300"
//   )}
//   onClick={save}
// >
//   <Save size={12} />
//   <span>Save</span>
// </Button>
// <TooltipProvider>
//   <Tooltip delayDuration={100}>
//     <TooltipTrigger asChild>
//       <Button
//         disabled={!isUpdated}
//         className={cn(
//           "flex items-center gap-2 h-8 bg-blue-200 text-blue-600 hover:bg-blue-300"
//         )}
//         onClick={save}
//       >
//         <Save size={16} />
//         <span>Save</span>
//       </Button>
//     </TooltipTrigger>
//     <TooltipContent side={"bottom-end" as unknown as "bottom"}>
//       Save
//     </TooltipContent>
//   </Tooltip>
// </TooltipProvider>
