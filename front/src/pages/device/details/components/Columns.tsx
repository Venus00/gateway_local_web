import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import moment from "moment";
import { DeviceMessages } from "./DeviceMessageTable";

export const columns = (
  t: (key: string) => string
): ColumnDef<DeviceMessages>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          className="w-full justify-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("table.column.createdAt")}
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {moment(row.getValue("createdAt")).format("YYYY/MM/DD hh:mm:ss")}
      </div>
    ),
  },
  {
    accessorKey: "data",
    header: ({ column }) => {
      return (
        <Button
          className="w-full justify-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("table.column.message")}
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{JSON.stringify(row.getValue("data"))}</div>
    ),
  },
];
