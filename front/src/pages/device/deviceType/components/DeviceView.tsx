import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  ChevronDown,
  ChevronUp,
  FilePenLine,
  Hash,
  LayoutGrid,
  LayoutList,
  MoreVertical,
  Network,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { DeviceTypeDto } from "../deviceType.dto";

import DeviceTable from "./DeviceTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface PropsTaype {
  devices: DeviceTypeDto[];
  onDelete: (serial: string) => void;
}

function DeviceTypeView({ devices, onDelete }: PropsTaype) {
  const [view, setView] = useState<"table" | "card">("card");
  const [expandedInputs, setExpandedInputs] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedOutputs, setExpandedOutputs] = useState<
    Record<string, boolean>
  >({});

  const toggleInputs = useCallback((id: number) => {
    setExpandedInputs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const toggleOutputs = useCallback((id: number) => {
    setExpandedOutputs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const MAX_VISIBLE_TAGS = 3;

  return (
    <>
      <div className="  dark:bg-neutral-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold"></h1>
          <div className="space-x-2">
            <Button
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
          </div>
        </div>
        {/* Table view */}
        {view === "table" && (
          <div className="">
            <DeviceTable devices={devices} onDelete={onDelete} />
          </div>
        )}
        {/* Card view */}
        {view === "card" && (
          <div className="md:grid flex flex-col   md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
            {devices?.map((item) => {
              const inputTags = item.input
                ? item.input.split(",").map((tag: string) => tag.trim())
                : [];
              const outputTags = item.output
                ? item.output.split(",").map((tag: string) => tag.trim())
                : [];

              const hasMoreInputs = inputTags.length > MAX_VISIBLE_TAGS;
              const hasMoreOutputs = outputTags.length > MAX_VISIBLE_TAGS;

              const visibleInputTags = expandedInputs[item.id]
                ? inputTags
                : inputTags.slice(0, MAX_VISIBLE_TAGS);
              const visibleOutputTags = expandedOutputs[item.id]
                ? outputTags
                : outputTags.slice(0, MAX_VISIBLE_TAGS);
              const deviceType = {
                id: item.id,
                name: item.name,
                input: item.input,
                output: item.output,
              };
              return (
                <Card
                  key={item.id}
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
                          to={`/devicetype/edit/${item.id}`}
                          state={deviceType}
                          className="w-full"
                        >
                          <DropdownMenuItem>
                            <FilePenLine className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => onDelete(item.name)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {item.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-4 py-2">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Network className="h-4 w-4 text-green-500 dark:text-green-400" />
                          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                            mqtt
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mt-1">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-6 flex items-center pt-0.5">
                            <ArrowLeftCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-wrap gap-1.5">
                              {visibleInputTags.length > 0 ? (
                                visibleInputTags.map(
                                  (input: string, index: number) => (
                                    <span
                                      key={`${item.id}-input-${index}`}
                                      className="inline-flex items-center bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs px-2 py-1 rounded-md"
                                    >
                                      {input}
                                    </span>
                                  )
                                )
                              ) : (
                                <></>
                              )}
                            </div>

                            {hasMoreInputs && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-1 h-6 px-2 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
                                onClick={() => toggleInputs(item.id)}
                              >
                                {expandedInputs[item.id] ? (
                                  <>
                                    <span>show less</span>
                                    <ChevronUp className="ml-1 h-3 w-3" />
                                  </>
                                ) : (
                                  <>
                                    <span>show more</span>
                                    <ChevronDown className="ml-1 h-3 w-3" />
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Output Badge */}
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5 mr-1">
                            <ArrowRightCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap gap-1.5">
                              {visibleOutputTags.length > 0 ? (
                                visibleOutputTags.map(
                                  (output: string, index: number) => (
                                    <span
                                      key={`${item.id}-output-${index}`}
                                      className="inline-flex items-center bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded-md"
                                    >
                                      {output}
                                    </span>
                                  )
                                )
                              ) : (
                                <></>
                              )}
                            </div>

                            {hasMoreOutputs && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-1 h-6 px-2 text-xs text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                onClick={() => toggleOutputs(item.id)}
                              >
                                {expandedOutputs[item.id] ? (
                                  <>
                                    <span>show less</span>
                                    <ChevronUp className="ml-1 h-3 w-3" />
                                  </>
                                ) : (
                                  <>
                                    <span>show more</span>
                                    <ChevronDown className="ml-1 h-3 w-3" />
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default DeviceTypeView;
