import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from "@/features/auth/store";
import {
  FilePenLine,
  LayoutGrid,
  LayoutList,
  MoreVertical,
  ShieldCheckIcon,
  ShieldXIcon,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserTable from "./UserTable";
interface PropsTaype {
  users: any[];
  onDelete: (id: number) => void;
  onVerify: (id: number) => void;
}

function UserView({ users, onDelete, onVerify }: PropsTaype) {
  const { role } = useSelector((state: RootState) => state.auth);
  const [view, setView] = useState<"table" | "card">("table");

  return (
    <>
      <div className="  dark:bg-neutral-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Users Management</h1>
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
            <UserTable
              users={users}
              onDelete={onDelete}
              onVerify={onVerify}
              handleEdit={() => {}}
              role={role}
            />
          </div>
        )}
        {/* Card view */}
        {view === "card" && (
          <div className="md:grid flex flex-col   md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
            {users?.map((item) => (
              <Card className="w-full max-w-md relative border-b rounded-lg bg-gray-50 dark:bg-neutral-900 dark:border-neutral-800">
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 dark:text-white cursor-pointer"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="dark:bg-neutral-900"
                    >
                      <Link
                        to={`/settings/users/edit/${item.id}`}
                        state={item}
                        className="w-full "
                      >
                        <DropdownMenuItem className="cursor-pointer">
                          <FilePenLine className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CardHeader className="flex flex-row items-center  justify-between px-4 py-3  ">
                  <div className="flex items-center gap-3 ">
                    {item.image ? (
                      <Avatar className=" h-6 w-6">
                        <AvatarImage
                          src={item.image}
                          //alt={tenant.name[0]}
                        />
                        <AvatarFallback>
                          {item.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 tracking-tight dark:text-white">
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-500 font-mono tracking-tight mt-1 dark:text-gray-300">
                        {item.email}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Badge
                      variant={item.isVerified ? "default" : "secondary"}
                      className={` items-center space-x-1 ${
                        item.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isVerified ? (
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
                </CardContent>

                {/* Add CardContent if needed with dark mode styling */}
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default UserView;
