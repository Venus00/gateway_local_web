"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";
import { apiClient } from "@/features/api";
import type { RootState } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { DoorOpen, LayoutDashboard, MoreVertical, Trash } from "lucide-react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export default function GlobalDashboardList() {
  const navigate = useNavigate();
  const { tenant } = useSelector((state: RootState) => state.auth);
  const handleNavigate = () => {
    navigate(`/dashboard`);
  };
  const { t, isArabic } = useLanguage();
  const queryClient = useQueryClient();
  const deleteDashboard = async (id: number | null) => {
    try {
      const res = await apiClient.delete(`tenant/dashboard/${id}`);
      if (res.data)
        toast({
          title: "Delete Dashboard",
          description: "Dashboard deleted successfully",
        });
      queryClient.invalidateQueries({ queryKey: ["tenantViewDash"] });
    } catch (error: any) {
      toast({
        title: "Delete Dashboard",
        description: error,
      });
      console.log(error);
    }
  };
  return (
    <div className="mt-8 bg-white dark:bg-neutral-700 rounded-lg shadow-md">
      <div className="dark:bg-neutral-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:grid flex flex-col md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4 ">
          <Link
            to={{
              pathname: `/dashboard`,
            }}
            className="w-full max-w-md relative rounded-lg   dark:bg-black dark:border-neutral-800"
          >
            {" "}
            <Card className="">
              <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 dark:text-white"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="dark:bg-neutral-900"
                  >
                    <DropdownMenuItem
                      className="text-blue-600 gap-2 focus:text-blue-600 cursor-pointer dark:text-blue-400 dark:focus:text-blue-300"
                      onClick={() => handleNavigate()}
                      dir={isArabic ? "rtl" : "ltr"}
                    >
                      <DoorOpen className="mr-2 h-4 w-4" />
                      <span>{t("card.navigate")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 gap-2 focus:text-red-600 cursor-pointer dark:text-blue-400 dark:focus:text-blue-300"
                      onClick={(e) => {
                        e.stopPropagation(); // Stop event bubbling
                        e.preventDefault();
                        deleteDashboard(tenant.id);
                      }}
                      dir={isArabic ? "rtl" : "ltr"}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>{t("card.clearDashboard")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader className="flex flex-row items-start justify-between px-4 py-3 border-b min-h-[8rem] border-gray-100 bg-gray-50 dark:bg-neutral-900 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 tracking-tight dark:text-white">
                      {tenant.name}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
