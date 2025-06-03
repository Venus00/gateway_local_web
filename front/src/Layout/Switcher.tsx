import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog } from "@/components/ui/dialog";

import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { switchTenant } from "@/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/features/auth/store";
import { apiClient } from "@/features/api";
import { useSideBar } from "./SideBarProvider/SideBarProvider";
import { useLanguage } from "@/context/language-context";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TenantProps extends PopoverTriggerProps {
  tenants: any[];
  selected: any;
}

export default function TenantSwitcher({
  className,
  tenants,
  selected,
}: TenantProps) {
  const { tenant, id, email, role } = useSelector(
    (state: RootState) => state.auth
  );
  const { t, isArabic } = useLanguage();
  const { isSidebarVisible } = useSideBar();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  async function handleSelectTenant(tenantItem: any) {
    setIsLoading(true);
    const newToken = {
      id,
      email,
      tenantId: tenantItem.id,
      role,
      permissions: [],
    };
    const res = await apiClient.post("/auth/updateToken", newToken);
    console.log("res", res);
    const accessToken = res.data?.accessToken;
    dispatch(switchTenant({ tenantItem, accessToken }));
    setOpen(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }
  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {isLoading ? (
            <Button variant={"outline"} className="flex items-center gap-2">
              <div className="w-4 h-4 border border-t-primary border-gray-300 rounded-full animate-spin"></div>
              {isSidebarVisible && <span>Switching tenant...</span>}
            </Button>
          ) : (
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select a team"
              className={cn(
                "w-full overflow-hidden   items-center flex gap-2",
                className,
                {
                  "border-0 shadow-none": !isSidebarVisible,
                }
              )}
            >
              <Avatar className=" h-5 w-5">
                <AvatarImage
                  src={`https://avatar.vercel.sh/personal.png`}
                  //==alt={tenants}
                  className="grayscale"
                />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              {isSidebarVisible && (
                <>
                  <span className="text-ellipsis truncate w-[80px] md:w-fit md:text-balance ">
                    {selected.name}
                  </span>

                  <ChevronsUpDown className="ml-auto opacity-50 w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          side={isSidebarVisible ? "bottom" : "right"}
          sideOffset={isSidebarVisible ? 5 : 15}
          align={"start"}
          className=" p-0  w-max "
        >
          <Command className="">
            <CommandInput placeholder={t("switcher.search")} />
            <CommandList>
              <CommandEmpty className="p-2 break-all whitespace-normal text-sm">
                {t("switcher.notfound")}
              </CommandEmpty>
              <CommandGroup
                heading={
                  <div dir={isArabic ? "rtl" : "ltr"} className="w-full">
                    {t("switcher.stitle")}
                  </div>
                }
                className=""
                // dir={isArabic ? "rtl" : "ltr"}
              >
                {tenants?.map((tenantItem) => (
                  <CommandItem
                    key={tenantItem.id}
                    onSelect={() => handleSelectTenant(tenantItem)}
                    className="text-sm cursor-pointer"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/personal.png`}
                        //alt={tenant.name[0]}
                        className="grayscale"
                      />
                      <AvatarFallback>{tenantItem.name}</AvatarFallback>
                    </Avatar>
                    <span className="text-ellipsis truncate w-[100px]  md:w-fit ">
                      {tenantItem.name}
                    </span>
                    <Check
                      className={cn(
                        "ml-auto w-4 h-4 text-muted-foreground",
                        tenant?.name === tenantItem.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList></CommandList>
          </Command>
          <PopoverArrow className="" />
        </PopoverContent>
      </Popover>
    </Dialog>
  );
}
