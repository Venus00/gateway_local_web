import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import {
  CircleEllipsis,
  Clipboard,
  FilePenLine,
  LayoutDashboard,
  Trash2,
} from "lucide-react";
import { Link as LinkRef } from "react-router-dom";
import { TokenDto } from "../token.dto";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export const columns = (
  handleDelete: (arg0: number) => void
): ColumnDef<TokenDto>[] => [
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
    accessorKey: "token",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Token
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2 ">
        <span className="lowercase truncate  max-w-48">
          {row.getValue("token")}
        </span>
        <Dialog>
          <DialogTrigger title="View Token">
            <CircleEllipsis className="w-4 h-4" />
          </DialogTrigger>
          <DialogContent className="overflow-hidden   ">
            <DialogTitle>Token</DialogTitle>
            <span className="break-all">{row.getValue("token")}</span>
          </DialogContent>
        </Dialog>
        <Button
          variant={"ghost"}
          className="p-1"
          title="Copy to clipboard"
          onClick={() => {
            navigator.clipboard.writeText(row.getValue("token"));
          }}
        >
          <Clipboard className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("description")}</div>
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
          Created At
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ">
        {format(row.getValue("created_at"), "MM/dd/yyyy hh:mm")}
      </div>
    ),
  },
  {
    accessorKey: "expiryDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expiry Date
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ">{row.getValue("expiryDate")}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    header: () => {
      return <Button variant="ghost">Actions</Button>;
    },
    cell: ({ row }) => {
      const item = {
        id: row.original.id,
        name: row.original.name,
        description: row.original.description,
        expiryDate: row.original.expiryDate,
        token: row.original.token,
        tenantId: row.original.tenantId,
      };
      return (
        <div className="flex gap-1">
          {/* <LinkRef
            to={{
              pathname: `/machine/${item.serial}`,
            }}
          >
            <Button className="p-2 hover:bg-blue-500 rounded-full">
              <Route className="h-4 w-4" />
            </Button>
          </LinkRef> */}
          <LinkRef
            state={item}
            to={{
              pathname: `/token/edit/${item.id}`,
            }}
          >
            <Button
              variant={"ghost"}
              className="p-2 !text-blue-500  dark:hover:bg-gray-50/60"
            >
              <FilePenLine className="h-4 w-4" />
            </Button>
          </LinkRef>
          <Button
            variant={"ghost"}
            className="p-2 !text-red-500  dark:hover:bg-gray-50/60"
            onClick={() => handleDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
