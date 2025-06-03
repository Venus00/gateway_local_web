import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { BrokerTableDto } from "@/pages/settings/settings/components/Broker.dto";
import moment from "moment";

export const columns = (): ColumnDef<{
  device: string;
  message: string;
  topic: string;
  created_at: Date;
}>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Device Name
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase ">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "topic",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Topic
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ">{row.getValue("topic")}</div>
    ),
  },
  {
    accessorKey: "message",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Message
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("message")?.toString()}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          created_at
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {moment(row.getValue("created_at")).format("YYYY/MM/DD hh:mm:ss")}
      </div>
    ),
  },
];
