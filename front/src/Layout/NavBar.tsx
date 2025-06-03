import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLanguage } from "@/context/language-context";
import { logOutUser } from "@/features/auth/authSlice";
import type { RootState } from "@/features/auth/store";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { Globe, LogOut, Menu, User } from "lucide-react";
import { useEffect, useState } from "react";
import { FlagIcon, FlagIconCode } from "react-flag-kit";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "./SideBar";
import { useSideBar } from "./SideBarProvider/SideBarProvider";
import { arSA, is } from "date-fns/locale";
// Type pour les langues supportées
type SupportedLanguage = "en" | "fr" | "es" | "ar";
const now = new Date();
const CountryFlag = ({ countryCode }: { countryCode: SupportedLanguage }) => {
  const flagCodes: Record<SupportedLanguage, FlagIconCode> = {
    en: "GB" as FlagIconCode,
    fr: "FR" as FlagIconCode,
    es: "ES" as FlagIconCode,
    ar: "SA" as FlagIconCode,
  };

  return (
    <span className="mr-2">
      <FlagIcon code={flagCodes[countryCode]} size={16} />
    </span>
  );
};

function NavBar() {
  const { tenant, role, email, name, image } = useSelector(
    (state: RootState) => state.auth
  );
  const { language, setLanguage, t, isArabic } = useLanguage();

  const { toggleSidebar, isSidebarVisible } = useSideBar();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logOutUser());
  };
  const getUserInitials = (): string => {
    if (name) {
      return name.toString().charAt(0).toUpperCase();
    }
    if (email) {
      return email.toString().charAt(0).toUpperCase();
    }
    return "U";
  };

  const isMobile = useIsMobile();

  // Définissez le code de pays pour la langue actuelle avec le typage approprié
  const flagMapping: Record<SupportedLanguage, FlagIconCode> = {
    en: "GB" as FlagIconCode,
    fr: "FR" as FlagIconCode,
    es: "ES" as FlagIconCode,
    ar: "SA" as FlagIconCode,
  };

  // S'assurer que language est bien un type SupportedLanguage
  const currentLanguage = (language as SupportedLanguage) || "en";

  return (
    <header
      className="flex flex-row items-center  gap-2 py-1  h-12  px-3 bg-white dark:bg-black border-b"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => toggleSidebar()}
        // className={` ${isArabic ? "order-0" : ""}`}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isMobile && (
        <Sheet open={isSidebarVisible} onOpenChange={() => toggleSidebar()}>
          <SheetTitle className="hidden"></SheetTitle>
          <SheetDescription className="hidden"></SheetDescription>
          <SheetContent
            side="left"
            className="w-fit  p-0 overflow-y-auto overflow-x-hidden"
            aria-describedby="navigation menu for mobile devices"
          >
            <SideBar />
          </SheetContent>
        </Sheet>
      )}
      <div
        className="w-full  flex justify-center items-center"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <h1 className="font-bold md:text-base text-primary text-sm ">
          {isArabic ? (
            <>
              {format(now, "EEEE dd LLLL yyy ", { locale: arSA })} <LiveClock />
            </>
          ) : (
            <>
              {format(now, "EEEE, LLLL dd yyy ")} <LiveClock />
            </>
          )}
          {/* {format(now, "EEEE, LLLL dd yyy ")} <LiveClock />
          {format(now, "EEEE, LLLL dd yyy ",{ locale: arSA })} <LiveClock /> */}
        </h1>
      </div>
      <div
        className="flex  items-center ml-auto gap-3"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Language Selector avec drapeaux */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 flex items-center"
            >
              <span className="mr-1">
                <FlagIcon code={flagMapping[currentLanguage]} size={16} />
              </span>
              <Globe className="h-5 w-5" />
              <span className="sr-only">{t("nav.language")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("nav.language")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setLanguage("en")}
              className={language === "en" ? "bg-secondary" : ""}
            >
              <CountryFlag countryCode="en" />
              {t("nav.english")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLanguage("fr")}
              className={language === "fr" ? "bg-secondary" : ""}
            >
              <CountryFlag countryCode="fr" />
              {t("nav.french")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLanguage("es")}
              className={language === "es" ? "bg-secondary" : ""}
            >
              <CountryFlag countryCode="es" />
              {t("nav.spanish")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLanguage("ar")}
              className={language === "ar" ? "bg-secondary" : ""}
            >
              <CountryFlag countryCode="ar" />
              {t("nav.arabic")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" size="icon" className="h-8 w-8 p-0">
              <Avatar className="h-7 w-7">
                <AvatarImage src={image || undefined}></AvatarImage>
                <AvatarFallback className="bg-primary text-white text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{name || email}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive dark:text-red-500 focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("nav.signOut")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default NavBar;
function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="text-sm md:text-base">{format(time, "h:mmaaa")}</span>
  );
}
