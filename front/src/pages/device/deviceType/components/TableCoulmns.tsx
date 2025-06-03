import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { FilePenLine, Trash2 } from "lucide-react";
import { Link as LinkRef } from "react-router-dom";
import { DeviceTypeDto } from "../deviceType.dto";

export const columns = (
  handleDelete: (arg0: string) => void
): ColumnDef<DeviceTypeDto>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase ">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase ">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "Connectivity_Type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Connectivity Type
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {row.getValue("connection_Type") || "mqtt"}
      </div>
    ),
  },
  {
    accessorKey: "input",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          inputs
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="lowercase truncate text-ellipsis">
          {row.getValue("input")}
        </div>
      );
    },
  },
  {
    accessorKey: "output",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Outputs
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("output")}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    header: () => {
      return <Button variant="ghost">Actions</Button>;
    },
    cell: ({ row }) => {
      const device = {
        id: row.original.id,
        name: row.original.name,
        input: row.original.input,
        output: row.original.output,
      };
      return (
        <div className="flex gap-1">
          <LinkRef
            state={device}
            to={{
              pathname: `/deviceType/edit/${row.original.id}`,
            }}
          >
            <Button
              variant={"ghost"}
              className="p-2 !text-blue-500 dark:hover:bg-gray-50/60"
            >
              <FilePenLine className="h-4 w-4" />
            </Button>
          </LinkRef>
          <Button
            variant={"ghost"}
            className="p-2 !text-red-500 dark:hover:bg-gray-50/60"
            onClick={() => handleDelete(row.original.name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
