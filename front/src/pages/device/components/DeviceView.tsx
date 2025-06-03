import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  FilePenLine,
  Kanban,
  LayoutGrid,
  LayoutList,
  Map,
  MoreVertical,
  Network,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { DeviceDto } from "../device.dto";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import DeviceTable from "./DeviceTable";
import DevicesMap from "./Map";
import { useLanguage } from "@/context/language-context";
import { AddDevice } from "./add-device";

interface PropsTaype {
  devices: DeviceDto[];
  onDelete: (serial: string) => void;
}

function DeviceView({ devices, onDelete }: PropsTaype) {
  const [view, setView] = useState<"table" | "card" | "map">("card");
  const locations = [
    { name: "Device 1", pos: [32.9, -8] },
    { name: "Device 2", pos: [34.515, -5] },
    { name: "Device 3", pos: [32.525, -7] },
    { name: "Device 4", pos: [32.535, -9] },
    { name: "Device 5", pos: [33, -5] },
  ];
  const { t, isArabic } = useLanguage();
  return (
    <>
      <div className="  h-full overflow-y-hidden  dark:bg-neutral-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold"></h1>
          <div className="space-x-2">
            <Button
              title="Table view"
              variant="outline"
              size="icon"
              onClick={() => setView("table")}
              aria-label="View as table"
              className={
                view === "table" ? "bg-primary text-primary-foreground" : ""
              }
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              title="Card view"
              variant="outline"
              size="icon"
              onClick={() => setView("card")}
              aria-label="View as cards"
              className={
                view === "card" ? "bg-primary text-primary-foreground" : ""
              }
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              title="Map view"
              variant="outline"
              size="icon"
              onClick={() => setView("map")}
              aria-label="View as cards"
              className={
                view === "map" ? "bg-primary text-primary-foreground" : ""
              }
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Table view */}
        {view === "table" && (
          <div className="">
            <DeviceTable
              devices={devices}
              onDelete={onDelete}
              handleEdit={() => {}}
            />
          </div>
        )}
        {/* Card view */}
        {view === "card" && (
          <div className="md:grid flex flex-col md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
            {devices?.map((item) => {
              const device = {
                id: item.id,
                name: item.name,
                serial: item.serial,
                config: item.config,
                version: item.version,
                status: item.status,
                typeId: item.type.id,
                type: item.type.name,
                brokerId: item.broker?.id ?? null,
                brokerName: item.broker?.name,
                attribute: {
                  input: item.deviceInput.map((i) => i.name),
                  output: item.deviceOutput.map((i) => i.name),
                  newInput: item.deviceInput.map((i) => i.label),
                  newOutput: item.deviceOutput.map((i) => i.label),
                },
                devicesTypeAttribute: {
                  input: item?.type?.input?.split(","),
                  output: item?.type?.output?.split(","),
                },
              };

              return (
                <Link
                  key={item.serial}
                  state={device}
                  to={{
                    pathname: `/device/${item.serial}`,
                  }}
                  className="w-full max-w-md relative hover:shadow-sm rounded-xl hover:shadow-primary"
                >
                  <Card
                    key={item.serial}
                    className="w-full max-w-md relative rounded-lg"
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link
                            state={device}
                            to={{
                              pathname: `/device/${item.serial}`,
                            }}
                            className="w-full"
                          >
                            <DropdownMenuItem
                              className="gap-2"
                              dir={isArabic ? "rtl" : "ltr"}
                            >
                              <Kanban className="mr-2 h-4 w-4" />
                              <span>{t("card.info")}</span>
                            </DropdownMenuItem>
                          </Link>
                          <Link
                            state={device}
                            to={{
                              pathname: `/device/edit/${item.serial}`,
                            }}
                            className="w-full"
                          >
                            <DropdownMenuItem
                              dir={isArabic ? "rtl" : "ltr"}
                              className="gap-2"
                            >
                              <FilePenLine className="mr-2 h-4 w-4" />
                              <span>{t("card.edit")}</span>
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            dir={isArabic ? "rtl" : "ltr"}
                            className="text-red-600 focus:text-red-600 gap-2"
                            onClick={(e: any) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onDelete(item.serial);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>{t("card.delete")}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardHeader className="flex flex-row items-start justify-between pt-3 pb-2 pl-4 pr-10">
                      <div className="flex flex-col space-y-0">
                        <div className="flex items-baseline gap-4">
                          <div
                            className={`h-2.5 w-2.5 rounded-full flex-shrink-0 mt-1.5 ${
                              item.status ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold leading-tight">
                              {item.name}
                            </span>
                            <span className="text-[0.7rem] text-gray-500 font-mono tracking-tight mt-0.5">
                              {item.serial}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-4 py-2">
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <Network className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                              {t("table.column.broker")}
                            </span>
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-400">
                            {item.broker?.name}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
        {view === "map" && (
          <div className="   h-full ">
            <DevicesMap locations={locations} />
          </div>
        )}
      </div>
    </>
  );
}

export default DeviceView;
