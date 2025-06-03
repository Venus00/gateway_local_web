import { ColumnDef } from "@tanstack/react-table";
import { DeviceDto, DeviceInputDto, deviceOutputDto } from "../device.dto";
import { Button } from "@/components/ui/button";
import {
  CircleOff,
  FilePenLine,
  Kanban,
  Link,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Link as LinkRef } from "react-router-dom";

export const columns = (
  t: (key: string) => string,
  handleEdit: (arg0: DeviceDto) => void,
  handleDelete: (arg0: string) => void
): ColumnDef<DeviceDto>[] => [
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
          className="w-full justify-start"
          variant="ghost"
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
    accessorKey: "broker",
    header: ({ column }) => {
      return (
        <Button
          className="w-full justify-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("table.column.broker")}
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        <Badge
          variant={row.getValue("broker") ? "default" : "secondary"}
          className={` rounded-full items-center space-x-1 ${
            row.getValue("broker")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.getValue("broker") ? (
            <>
              <Link className="h-3 w-3" />
              <span>{(row.getValue("broker") as { name: string }).name}</span>
            </>
          ) : (
            <>
              <CircleOff className="h-3 w-3" />
              <span>No Broker Defined</span>
            </>
          )}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "deviceInput",
    header: ({ column }) => {
      return (
        <Button
          className="w-full justify-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("table.column.deviceInput")}
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {(row.getValue("deviceInput") as DeviceInputDto[]).map(
          (element) => `${element.label} `
        )}
      </div>
    ),
  },
  {
    accessorKey: "deviceOutput",
    header: ({ column }) => {
      return (
        <Button
          className="w-full justify-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("table.column.deviceOutput")}
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {(row.getValue("deviceOutput") as deviceOutputDto[]).map(
          (element) => `${element.label} `
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          className="w-full justify-start"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("table.column.status")}
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <Badge
          variant={row.getValue("status") ? "default" : "secondary"}
          className={`rounded-full items-center space-x-1 ${
            row.getValue("status")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.getValue("status") ? (
            <>
              <Wifi className="h-3 w-3" />
              <span> {t("table.column.connected")}</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              <span> {t("table.column.disconnected")}</span>
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
      return (
        <Button className="w-full justify-start" variant="ghost">
          {" "}
          {t("table.column.actions")}
        </Button>
      );
    },
    cell: ({ row }) => {
      const device = {
        name: row.original.name,
        serial: row.original.serial,
        version: row.original.version,
        typeId: row.original.type.id,
        brokerId: row.original.broker?.id ?? null,
        attribute: {
          input: row.original.deviceInput.map((item) => item.name),
          output: row.original.deviceOutput.map((item) => item.name),
          newInput: row.original.deviceInput.map((item) => item.label),
          newOutput: row.original.deviceOutput.map((item) => item.label),
        },
        devicesTypeAttribute: {
          input: row.original?.type?.input?.split(","),
          output: row.original?.type?.output?.split(","),
        },
      };
      return (
        <div className="flex gap-1">
          <LinkRef
            state={device}
            to={{
              pathname: `/device/${row.original.serial}`,
            }}
          >
            <Button
              variant={"ghost"}
              className="p-2 !text-primary  dark:hover:bg-gray-50/60"
              onClick={() => handleEdit(row.original)}
            >
              <Kanban className="h-4 w-4" />
            </Button>
          </LinkRef>
          <LinkRef
            state={device}
            to={{
              pathname: `/device/edit/${row.original.serial}`,
            }}
          >
            <Button
              variant={"ghost"}
              className="p-2 !text-blue-500 dark:hover:bg-gray-50/60"
            >
              <FilePenLine className="h-4 w-4" />
            </Button>
          </LinkRef>
          {/* <Button
          className="p-2 hover:bg-blue-500 rounded-full"
          onClick={() => {
            handleEdit(row.original);
          }}
        >
          <FilePenLine className="h-4 w-4" />
        </Button> */}
          <Button
            variant={"ghost"}
            className="p-2  !text-red-500 dark:hover:bg-gray-50/60"
            onClick={() => handleDelete(row.original.serial)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
