import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  BrokerDto,
  BrokerTableDto,
} from "../../settings/components/Broker.dto";
import { Link } from "react-router-dom";

export const columns = (
  handleEdit: (arg0: BrokerDto) => void,
  handleDelete: (id: number) => void
): ColumnDef<BrokerTableDto>[] => [
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
    cell: ({ row }) => <div className=" ">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "ip",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          host
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {row.original.hide ? "********" : row.getValue("ip")}
      </div>
    ),
  },

  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          username
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="lowercase">
          {row.original.hide ? "********" : row.getValue("username")}
        </div>
      );
    },
  },
  {
    accessorKey: "password",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          password
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {row.original.hide ? "********" : row.getValue("password")}
      </div>
    ),
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
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          status
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <Badge
          variant={row.getValue("status") ? "default" : "secondary"}
          className={` items-center space-x-1 ${
            row.getValue("status")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.getValue("status") ? (
            <>
              <Wifi className="h-3 w-3" />
              <span>Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              <span>Disconnected</span>
            </>
          )}
        </Badge>
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    header: () => {
      return <Button variant="ghost">Actions</Button>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-1">
          <Link
            state={row.original}
            to={{
              pathname: row.original.hide
                ? ""
                : `/settings/broker/edit/${row.original.id}`,
            }}
            className={` ${row.original.hide ? "cursor-not-allowed" : ""}`}
          >
            <Button
              variant={"ghost"}
              className={`p-2 !text-blue-500  dark:hover:bg-gray-50/60 ${
                row.original.hide ? "cursor-not-allowed" : ""
              }`}
              disabled={row.original.hide}
            >
              <FilePenLine className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant={"ghost"}
            className="p-2 !text-red-500  dark:hover:bg-gray-50/60"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
