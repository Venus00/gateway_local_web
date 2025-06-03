import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  CircleEllipsis,
  Clock,
  Coins,
  FilePenLine,
  Hash,
  LayoutGrid,
  LayoutList,
  MoreVertical,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { TokenDto } from "../token.dto";
import MachineTable from "./TokenTable";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PropsTaype {
  tokens: TokenDto[];
  onDelete: (id: number) => void;
}

function TokenView({ tokens, onDelete }: PropsTaype) {
  const [view, setView] = useState<"table" | "card">("card");

  return (
    <>
      <div className="dark:bg-neutral-800 py-8 px-4 sm:px-6 lg:px-8">
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
            <MachineTable tokens={tokens} onDelete={onDelete} />
          </div>
        )}
        {/* Card view */}
        {view === "card" && (
          <div className="md:grid flex flex-col md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
            {tokens?.map((item) => {
              return (
                <Card key={item.id} className="w-full max-w-md relative rounded-lg">
                                                  <div className="absolute top-2 right-2 z-10">

                                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="More options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Coins className="mr-2 h-4 w-4" />
                                View Token
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="overflow-hidden">
                              <DialogTitle>Token</DialogTitle>
                              <span className="break-all">{item.token}</span>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenuItem asChild>
                            <Link
                              state={item}
                              to={{
                                pathname: `/token/edit/${item.id}`,
                              }}
                            >
                              <FilePenLine className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(item.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
               </div>
               <CardHeader className="flex flex-row items-start justify-between pt-3 pb-2 pl-4 pr-10">
    <div className="flex flex-col space-y-0">
      <div className="flex items-baseline gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-tight">{item.name}</span>
          
        </div>
      </div>
    </div>
  </CardHeader>
  <CardContent className="px-4 py-3">
  <div className="flex flex-col space-y-3">
    {/* Ligne ID */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium text-gray-600">{item.id}</span>
      </div>
      {/* <span className="text-sm font-mono font-medium text-gray-800">
        {item.id}
      </span> */}
    </div>

    {/* Ligne Created At */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-emerald-500" />
        <span className="text-sm font-medium text-gray-600">        {format(item.created_at, "MM/dd/yyyy hh:mm")}
        </span>
      </div>
      {/* <span className="text-sm text-gray-700">
        {format(item.created_at, "MM/dd/yyyy hh:mm")}
      </span> */}
    </div>

    {/* Ligne Expiry Date */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium text-gray-600">        {item.expiryDate}
        </span>
      </div>
      {/* <span className="text-sm text-gray-700">
        {item.expiryDate}
      </span> */}
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

export default TokenView;