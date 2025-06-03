import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { DoorOpen } from "lucide-react";
import { DashboardDto } from "../dashboard.dto";
export const columns = (
  t: (key: string) => string,
  isArabic: boolean,
  handleNavigate: (id: number) => void
): ColumnDef<DashboardDto>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("table.column.name")}
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase ">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "serial",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("table.column.serial")}
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("serial")}</div>
    ),
  },
  {
    enableHiding: false,
    accessorKey: "actions",
    header: () => {
      return (
        <Button variant="ghost" className="w-full justify-start">
          {t("table.column.actions")}
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="p-2 !text-blue-500 "
            title="Open Dashboard"
            onClick={() => handleNavigate(row.getValue("id"))}
          >
            <DoorOpen className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
