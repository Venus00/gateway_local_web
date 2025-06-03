import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import {
  FilePenLine,
  ShieldCheck,
  ShieldCheckIcon,
  ShieldXIcon,
  Trash2,
} from "lucide-react";
import moment from "moment";
import { User } from "./user.dto";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export const columns = (
  handleEdit: (arg0: User) => void,
  handleDelete: (arg0: number) => void,
  role: string,
  handleVerify: (arg0: number) => void
): ColumnDef<User>[] => {
  return [
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2 ">
          <Avatar className=" h-6 w-6">
            <AvatarImage
              src={row.original.image}
              //alt={tenant.name[0]}
            />
            <AvatarFallback>
              {row.original.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            email
            <CaretSortIcon className=" h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
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
        <div className="lowercase">
          {moment(row.getValue("created_at")).format("YYYY/MM/DD")}
        </div>
      ),
    },
    {
      accessorKey: "isVerified",
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
            variant={row.getValue("isVerified") ? "default" : "secondary"}
            className={` items-center space-x-1 ${
              row.getValue("isVerified")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.getValue("isVerified") ? (
              <>
                <ShieldCheckIcon className="h-3 w-3" />
                <span>Verified</span>
              </>
            ) : (
              <>
                <ShieldXIcon className="h-3 w-3" />
                <span>Unverified</span>
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
          <div className=" flex  gap-1">
            {role !== "user" ? (
              <>
                <Link
                  state={row.original}
                  to={{
                    pathname: `/settings/users/edit/${row.original.id}`,
                  }}
                >
                  <Button
                    variant={"ghost"}
                    className="p-2 !text-blue-500  dark:hover:bg-gray-50/60"
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
                {role === "gadmin" && !row.original.isVerified && (
                  <Button
                    title="verify user"
                    variant={"ghost"}
                    className="p-2 !text-green-500  dark:hover:bg-gray-50/60"
                    onClick={() => handleVerify(row.original.id)}
                  >
                    <ShieldCheck className="h-4 w-4" />
                  </Button>
                )}
              </>
            ) : (
              <></>
            )}
          </div>

          // <div className='flex gap-3'>
          //     <Button
          //         className="p-2 hover:bg-blue-500 rounded-full"
          //         onClick={() => handleEdit(row.original)}>
          //         <FilePenLine className="h-4 w-4" />

          //     </Button>
          //     <Button
          //         className="p-2 hover:bg-red-500 rounded-full"
          //         onClick={() => handleDelete(row.original.id)}>
          //         <Trash2 className="h-4 w-4" />

          //     </Button>
          // </div>
        );
      },
    },
  ];
};
