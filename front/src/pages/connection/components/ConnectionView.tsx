import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building,
  LayoutGrid,
  LayoutList,
  MoreVertical,
  Trash,
} from "lucide-react";
import { useState } from "react";
import ConnectionsTable from "./ConnectionTable";
interface PropsType {
  connections: any[];
  onDelete: (id: number) => void;
}
export default function ConnectionView({ connections, onDelete }: PropsType) {
  const [view, setView] = useState<"table" | "card">("card");

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
          </div>
        </div>

        {/* Table view */}
        {view === "table" && (
          <div className="">
            <ConnectionsTable connections={connections} onDelete={onDelete} />
          </div>
        )}
        {/* Card view */}
        {view === "card" && (
          <div className="md:grid flex flex-col md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
            {connections?.map((item: any) => (
              <Card className="w-full max-w-md relative rounded-lg">
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600  focus:text-red-600 cursor-pointer dark:text-blue-400 dark:focus:text-blue-300"
                        onClick={(e) => {
                          e.stopPropagation(); // Stop event bubbling
                          e.preventDefault();
                          onDelete(item.machineId);
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardHeader className="flex flex-row items-start justify-between pt-3 pb-2 pl-4 pr-10">
                  <div className="flex flex-col space-y-0">
                    <div className="flex items-baseline gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold leading-tight">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </CardHeader>
                <CardContent className="px-4 py-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex  gap-2 mt-1">
                      {item?.machine?.name && (
                        <>
                          <Building className="w-4 h-4 text-blue-500" />

                          <span className="text-sm font-medium">
                            {item?.machine?.name}
                          </span>
                        </>
                      )}

                      {/* <span className="text-sm text-muted-foreground">
                {item?.machine?.name}
              </span> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
