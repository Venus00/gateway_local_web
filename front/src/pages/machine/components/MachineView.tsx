import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutList,
  LayoutGrid,
  MoreVertical,
  LayoutDashboard,
  FilePenLine,
  Trash2,
  Tags,
  GitCommit,
  ArrowLeftCircle,
  ArrowRightCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DeviceTable from "./MachineTable";

interface PropsTaype {
  machines: any[];
  onDelete: (id: number) => void;
}

function MachineView({ machines, onDelete }: PropsTaype) {
  const [view, setView] = useState<"table" | "card">("card");
  const [expandedInputs, setExpandedInputs] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedOutputs, setExpandedOutputs] = useState<
    Record<string, boolean>
  >({});

  const toggleInputs = useCallback((id: string) => {
    setExpandedInputs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const toggleOutputs = useCallback((id: string) => {
    setExpandedOutputs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const MAX_VISIBLE_TAGS = 3;
  return (
    <>
      <div className="dark:bg-neutral-800 py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
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
            <DeviceTable machines={machines} onDelete={onDelete} />
          </div>
        )}
        {/* Card view */}
        {view === "card" && (
          <div className="md:grid flex flex-col md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
            {machines?.map((item) => {
              const inputTags =
                item?.connectionInputs.map((item: any) => item.input.label) ||
                [];
              const outputTags =
                item?.connectionOutputs.map((item: any) => item.output.label) ||
                [] ||
                [];

              const hasMoreInputs = inputTags.length > MAX_VISIBLE_TAGS;
              const hasMoreOutputs = outputTags.length > MAX_VISIBLE_TAGS;

              const visibleInputTags = expandedInputs[item.id]
                ? inputTags
                : inputTags.slice(0, MAX_VISIBLE_TAGS);
              const visibleOutputTags = expandedOutputs[item.id]
                ? outputTags
                : outputTags.slice(0, MAX_VISIBLE_TAGS);

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
                        <Link to={`/entity/${item.id}`} className="w-full">
                          <DropdownMenuItem>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Info</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link
                          state={item}
                          to={`/machine/edit/${item.id}`}
                          className="w-full"
                        >
                          <DropdownMenuItem>
                            <FilePenLine className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={(e: any) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onDelete(item.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardHeader className="flex flex-col items-start space-y-0 pb-2 pt-3 px-4">
                    <div className="flex flex-col w-full">
                      <CardTitle className="text-sm font-bold">
                        {item.name}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {item.serial}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 py-2">
                    <div className="flex flex-col space-y-2">
                      {/* <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tags className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                            {item.type.name}
                          </span>
                        </div>
                      </div> */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GitCommit className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                            {item.version}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-1">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-6 flex items-center pt-0.5">
                            <ArrowLeftCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-wrap  gap-1.5">
                              {visibleInputTags.length > 0 ? (
                                visibleInputTags.map(
                                  (input: string, index: number) =>
                                    input ? (
                                      <span
                                        key={`${item.id}-input-${index}`}
                                        className="inline-flex items-center bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs px-2 py-1 rounded-md"
                                      >
                                        {input}
                                      </span>
                                    ) : (
                                      <></>
                                    )
                                )
                              ) : (
                                <></>
                                // <span className="inline-flex items-center bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs px-2 py-1 rounded-md">
                                //   N/A
                                // </span>
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
                                  (output: string, index: number) =>
                                    output ? (
                                      <span
                                        key={`${item.id}-output-${index}`}
                                        className="inline-flex items-center bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded-md"
                                      >
                                        {output}
                                      </span>
                                    ) : (
                                      <></>
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

export default MachineView;
