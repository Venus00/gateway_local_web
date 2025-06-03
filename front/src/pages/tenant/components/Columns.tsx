import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RootState } from "@/features/auth/store";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { DoorOpen, Eye, FilePenLine, Trash2 } from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Licence, Tenant } from "../utils/tenant.dto";

export const columns = (
  handleSwitchTenant: (arg0: Tenant) => void,
  // handleEdit: (arg0: Tenant) => void,
  onDelete: (id: number) => void
): ColumnDef<Tenant>[] => {
  const { role } = useSelector((state: RootState) => state.auth);
  return [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            id
            <CaretSortIcon className=" h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase ml-4">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            name
            <CaretSortIcon className=" h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
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
            description
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
          {moment(row.getValue("created_at")).format("YYYY/MM/DD HH:MM:SS")}
        </div>
      ),
    },
    {
      accessorKey: "licence",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Subscription Plan
            <CaretSortIcon className=" h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const licence: Licence = row.getValue("licence");

        return (
          <div>
            <Badge className={`ml-6 space-x-1 bg-green-100 text-green-800`}>
              <span>{licence?.name || "-"}</span>
            </Badge>
          </div>
        );
      },
    },

    {
      accessorKey: "adminId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            AdminId
            <CaretSortIcon className=" h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>
          <Badge
            variant={row.getValue("adminId") ? "default" : "secondary"}
            className={`ml-6 space-x-1 ${
              row.getValue("adminId")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.getValue("adminId") ? (
              <>
                <span>{row.getValue("adminId")}</span>
              </>
            ) : (
              <>
                <span>No ADMIN</span>
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
            {/* <Button
                            className=" text-center p-2 hover:bg-red-500 rounded-full"
                            onClick={() => handleDelete(row.original.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button> */}

            <Link
              state={row.original}
              to={{
                pathname: `/tenant/edit/${row.original.id}`,
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
              onClick={() => handleSwitchTenant(row.original)}
              variant={"ghost"}
              className="p-2 !text-green-500  dark:hover:bg-gray-50/60"
            >
              <DoorOpen className="h-4 w-4" />
            </Button>
            {role === "gadmin" && (
              <Link
                state={row.original.id}
                to={{
                  pathname: `/tenant/${row.original.id}`,
                }}
              >
                <Button
                  variant={"ghost"}
                  className="p-2 !text-primary  dark:hover:bg-gray-50/60"
                  // onClick={() => handleEdit(row.original)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Button
              variant={"ghost"}
              className="p-2 !text-red-500  dark:hover:bg-gray-50/60"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
