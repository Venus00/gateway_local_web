import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DoorOpen,
  Eye,
  FilePenLine,
  LayoutGrid,
  LayoutList,
  MoreVertical,
  User,
} from "lucide-react";
import { useState } from "react";

import { Link } from "react-router-dom";
import TenantTable from "./TenantTable";
interface PropsType {
  tenants: any[];
  onDelete: (id: number) => void;
  handleSwitchTenant: (tenant: any) => void;
}

function TenantView({ tenants, onDelete, handleSwitchTenant }: PropsType) {
  const [view, setView] = useState<"table" | "card">("table");

  return (
    <>
      <div className="  h-full overflow-y-hidden  dark:bg-neutral-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tenants Management</h1>
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
          <div className="overflow-x-auto">
            <TenantTable
              tenants={tenants}
              onDelete={onDelete}
              handleSwitchTenant={handleSwitchTenant}
            />
          </div>
        )}
        {/* Card view */}
        {view === "card" && (
          <div className="md:grid flex flex-col   md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
            {tenants?.map((item) => (
              <Link
                to={`/tenant/${item.id}`}
                state={item}
                className="w-full max-w-sm relative"
              >
                {" "}
                <Card key={item.id} className="w-full max-w-sm relative">
                  <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link
                          to={`/tenant/${item.id}`}
                          state={item}
                          className="w-full"
                        >
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link
                          to={`/tenant/edit/${item.id}`}
                          state={item}
                          className="w-full"
                        >
                          <DropdownMenuItem>
                            <FilePenLine className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleSwitchTenant(item)}
                        >
                          <DoorOpen className="mr-2 h-4 w-4" />
                          <span>Switch</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardHeader className="flex flex-col items-start space-y-0 pb-2 pt-3 px-4">
                    <div className="flex gap-2 w-full">
                      <User className="text-green-500  w-5 h-5" />
                      <CardTitle className="text-sm font-bold">
                        {item.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      {/* <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Name:</span>
                      <span className="text-sm text-muted-foreground">
                        {item.name}
                      </span>
                    </div> */}
                      {/* <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Description:</span>
                      <span className="text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    </div> */}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default TenantView;
