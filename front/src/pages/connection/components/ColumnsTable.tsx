import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { ConnectionDto } from "../utils/connection.dto";

const InputConnection: React.FC<{ connections: ConnectionDto }> = ({
  connections,
}) => (
  <ul className="space-y-1">
    {connections.deviceInput.map(
      (conn: { input: { deviceId: number; label: any } }, index: number) => (
        <li key={index} className="text-sm">
          {conn.input.deviceId}:{" "}
          {`${conn.input.label} → ${
            connections.machineInput.split(",")[index]
          }`}
        </li>
      )
    )}
  </ul>
);
const OutputConnection: React.FC<{ connections: ConnectionDto }> = ({
  connections,
}) => (
  <ul className="space-y-1">
    {connections.deviceOutput.map(
      (conn: { output: { deviceId: number; label: any } }, index: number) => (
        <li key={index} className="text-sm">
          {conn.output.deviceId}:{" "}
          {`${conn.output.label} → ${
            connections.machineOutput.split(",")[index]
          }`}
        </li>
      )
    )}
  </ul>
);

export const columns = (
  onDelete: (id: number) => void
): ColumnDef<ConnectionDto>[] => [
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
    accessorKey: "machine",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Entity
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{(row.getValue("machine") as any)?.name}</div>
    ),
  },
  {
    accessorKey: "Inputs",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Inputs
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        <InputConnection connections={row.original} />
      </div>
    ),
  },
  {
    accessorKey: "Outputs",
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
      <div className="lowercase">
        <OutputConnection connections={row.original} />
      </div>
    ),
  },
  {
    enableHiding: false,
    accessorKey: "machineId",
    header: () => {
      return <Button variant="ghost">Actions</Button>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-3">
          <Button
            className="p-2 hover:bg-blue-500 rounded-full"
            onClick={() => onDelete(row.getValue("machineId"))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
