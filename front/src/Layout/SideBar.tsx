import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { RootState } from "@/features/auth/store";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  BadgePlus,
  BookText,
  BotIcon,
  Building,
  Cable,
  ChevronDown,
  CircleDollarSign,
  Coins,
  Image,
  ImageOff,
  LayoutDashboard,
  MonitorIcon as MonitorCog,
  Router,
  RouterIcon,
  Settings,
  Share2Icon,
  Users,
  Workflow,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

import type React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LOGODARK from "../assets/images/logo-dark.png";
import LOGO from "../assets/images/logo.svg";
import LOGODARKMini from "../assets/images/logoMini.svg";
import LOGOMini from "../assets/images/logoMiniDark.svg";
import { useSideBar } from "./SideBarProvider/SideBarProvider";
import { apiClient } from "@/features/api";
import { useQuery } from "react-query";
interface NavItem {
  titleKey: string;
  subtitleKey?: string;
  href: string;
  icon: React.ReactNode;
  submenu?: NavItem[];
  collapsedHref?: string;
}
const docsUrl = `${import.meta.env.VITE_DOCS_URL}`;
const createNavItems = (): NavItem[] => [
  {
    titleKey: "nav.dashboard",
    href: "/dashboards",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    titleKey: "nav.device",
    subtitleKey: "nav.manage",
    href: "/device",
    icon: <RouterIcon className="w-5 h-5" />,
    submenu: [
      {
        titleKey: "nav.manage",
        subtitleKey: "nav.device",
        href: "/device",
        icon: <MonitorCog className="w-4 h-4" />,
      },
      {
        titleKey: "nav.profile",
        subtitleKey: "nav.manage",
        href: "/devicetype",
        icon: <BotIcon className="w-4 h-4" />,
      },
    ],
  },
  {
    titleKey: "nav.brokers",
    href: "/settings/broker",
    icon: <Share2Icon className="w-5 h-5" />,
  },
  // {
  //   titleKey: "nav.settings",
  //   subtitleKey: "nav.settings",
  //   href: "/settings/users",
  //   icon: <Settings className="w-5 h-5" />,
  //   submenu: [
  //     {
  //       titleKey: "nav.Users",
  //       subtitleKey: "nav.manage",
  //       href: "/settings/users",
  //       icon: <Users className="w-4 h-4" />,
  //     },
  //     {
  //       titleKey: "nav.brokers",
  //       subtitleKey: "nav.manage",
  //       href: "/settings/broker",
  //       icon: <Router className="w-4 h-4" />,
  //     },
  //   ],
  // },
  {
    titleKey: "nav.Users",
    href: "/settings/users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    titleKey: "nav.tokens",
    href: "/tokens",
    icon: <Coins className="w-5 h-5" />,
  },

  {
    titleKey: "nav.workflow",
    href: "/flow",
    icon: <Workflow className="w-5 h-5" />,
  },

  {
    titleKey: "nav.docs",
    subtitleKey: "nav.docs",
    href: docsUrl,
    icon: <BookText className="w-5 h-5" />,
    submenu: undefined,
  },
];

const variants = {
  open: {
    width: "16rem",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    width: "4rem",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  mobile: {
    width: 0,
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  fullscreen: {
    width: 0,
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

export default function SideBar() {
  const { t, isArabic } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarVisible } = useSideBar();
  const { theme } = useTheme();
  const imageMini = theme === "light" ? LOGOMini : LOGODARKMini;
  const image = theme === "light" ? LOGO : LOGODARK;
  const [showTenantLogo, setShowTenantLogo] = useState(true);
  const [openMenus, setOpenMenus] = useState<string>("");
  const { tenant, role } = useSelector((state: RootState) => state.auth);
  const fetchTenant = async () => {
    try {
      const response = await apiClient.get("tenant");
      return response.data;
    } catch (error) {
      console.log(error);
      return [tenant];
    }
  };

  const { data: tenants } = useQuery("tenant", () => fetchTenant(), {
    initialData: [],
    enabled: role === "gadmin",
  });
  useEffect(() => {
    const show = localStorage.getItem("show_logo")
      ? localStorage.getItem("show_logo") === "true"
      : false;
    setShowTenantLogo(show);
  }, []);
  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => (prev.includes(title) ? "" : title));
  };

  const isMenuOpen = (titleKey: string) => openMenus.includes(titleKey);

  const navItemsWithUpdatedWorkflowRoute = createNavItems();

  const isMobile = useIsMobile();

  const animationVariant = isMobile
    ? isSidebarVisible
      ? "open"
      : "mobile"
    : isSidebarVisible
      ? "open"
      : "closed";

  const handleNavigation = (
    item: NavItem,
    hasSubmenu: boolean,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (hasSubmenu && (isSidebarVisible || isMobile)) {
      toggleMenu(item.titleKey);
      return;
    }

    if (!isSidebarVisible && !isMobile && item.collapsedHref) {
      navigate(item.collapsedHref);
      return;
    }
    if (item.titleKey === "nav.docs") window.open(item.href, "_blank");
    else navigate(item.href);
  };

  const renderMenuItem = (item: NavItem) => {
    const isActive =
      location.pathname === item.href || location.pathname.includes(item.href);

    const showTooltip = !isSidebarVisible && !isMobile;
    const hasSubmenu = !!item.submenu;

    const buttonContent = (
      <button
        dir={isArabic ? "rtl" : "ltr"}
        className={cn(
          "w-full justify-start flex-col items-start   hover:text-primary  py-2 px-4 ",
          {
            "bg-secondary  text-primary ": isActive,
            "hover:bg-muted": isActive,
            "items-center px-2": !isSidebarVisible && !isMobile,
            "border-l-4 border-primary ": isActive && !isSidebarVisible,
          }
        )}
        onClick={(e) => handleNavigation(item, hasSubmenu, e)}
      >
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className={cn(
            "flex items-center w-full gap-2",
            !isSidebarVisible && !isMobile && "justify-center"
          )}
        >
          <div
            role="button"
            className={cn(
              "flex-shrink-0  cursor-pointer",
              !isSidebarVisible && !isMobile && "mx-auto"
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (!isSidebarVisible && !isMobile && item.collapsedHref) {
                if (item.titleKey === "nav.docs")
                  window.open(item.href, "_blank");
                else navigate(item.collapsedHref);
              } else {
                if (item.titleKey === "nav.docs")
                  window.open(item.href, "_blank");
                else navigate(item.href);
              }
            }}
          >
            {item.icon}
          </div>

          {(isSidebarVisible || isMobile) && (
            <>
              <Link
                to={item.href}
                target={item.titleKey === "nav.docs" ? "_blank" : "_self"}
                className="ml-2 font-medium truncate w-full flex justify-start"
                onClick={(e) => {
                  if (hasSubmenu) {
                    e.preventDefault();
                    toggleMenu(item.titleKey);
                  }
                }}
              >
                {t(item.titleKey)}
              </Link>
              {/* )} */}
              {hasSubmenu && (
                <ChevronDown
                  className={cn(
                    "w-6 h-6   transition-transform duration-200",
                    isMenuOpen(item.titleKey) && "transform rotate-180"
                  )}
                />
              )}
            </>
          )}
        </div>

        {item.subtitleKey && (isSidebarVisible || isMobile) && (
          <span
            className={cn(
              "ml-7 hidden  text-xs text-muted-foreground truncate",
              {
                "text-primary": isActive,
              }
            )}
          >
            {t(item.subtitleKey)}
          </span>
        )}
      </button>
    );

    if (showTooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1 ">
            <p className="font-medium">{t(item.titleKey)}</p>
            <p className="text-xs hidden text-muted-foreground">
              {item.subtitleKey && t(item.subtitleKey)}
            </p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return buttonContent;
  };
  // useEffect(() => {}, [tenant.image]);
  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        variants={variants}
        initial={false}
        animate={animationVariant}
        className={cn(
          "bg-background overflow-y-auto overflow-x-hidden flex-shrink-0 ",
          !isMobile && "border-r"
        )}
      >
        <div className="space-y-4 py-4 flex-col flex h-full">
          {showTenantLogo && tenant.image ? (
            <div className="flex w-full relative ">
              {isSidebarVisible && (
                <>
                  <Button
                    className={cn(
                      "absolute bottom-0 right-3  p-0.5 h-fit w-fit flex items-center",
                      {
                        "opacity-0 hover:opacity-100": !isMobile,
                      }
                    )}
                    variant={"outline"}
                    title="Remove Tenant Logo"
                    onClick={() => {
                      setShowTenantLogo(false);
                      localStorage.setItem("show_logo", "false");
                    }}
                  >
                    <ImageOff className="w-4 h-4" />
                  </Button>
                </>
              )}
              {!isSidebarVisible && !isMobile ? (
                <img
                  src={tenant.image}
                  className="w-[181px] h-[31px]  object-contain"
                />
              ) : (
                <img
                  src={tenant.image}
                  className="w-[181px] h-[60px] object-contain"
                />
              )}
            </div>
          ) : (
            <div className="flex  px-4 relative">
              {isSidebarVisible && (
                <Button
                  className={cn(
                    "absolute bottom-0 right-3  p-0.5  h-fit w-fit flex items-center",
                    {
                      "opacity-0 hover:opacity-100": !isMobile,
                    }
                  )}
                  variant={"outline"}
                  title="Show Tenant Logo"
                  onClick={() => {
                    setShowTenantLogo(true);
                    localStorage.setItem("show_logo", "true");
                  }}
                >
                  <Image className="w-4 h-4" />
                </Button>
              )}
              {!isSidebarVisible && !isMobile ? (
                <img src={imageMini} className=" w-9 h-9" />
              ) : (
                <img src={image} className="w-[181px] h-[31px]" />
              )}
            </div>
          )}
          <span className="text-muted-foreground px-4 text-sm dark:hover:text-white w-fit">
            v2.00-beta
          </span>

          <div
            className="space-y-1 flex h-full relative overflow-y-auto  flex-col"
            style={{ scrollbarWidth: "thin" }}
          >

            {navItemsWithUpdatedWorkflowRoute.map((item, index) => (
              <div
                key={item.href}
                className={cn(
                  "mb-4 ",
                  index === createNavItems().length - 1 && "md:!mt-auto"
                )}
              >
                {renderMenuItem(item)}

                {item.submenu &&
                  isMenuOpen(item.titleKey) &&
                  (isSidebarVisible || isMobile) && (
                    <div
                      className={` mt-2 space-y-2 ${isArabic ? "pr-7" : "pl-7"
                        }`}
                    >
                      {item.submenu.map((subItem) => {
                        return (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            dir={isArabic ? "rtl" : "ltr"}
                            className={cn(
                              "flex min-w-0 items-center gap-2 overflow-hidden  rounded-md p-2 text-sm outline-none hover:bg-muted",
                              subItem.href === location.pathname &&
                              "bg-secondary text-primary"
                            )}
                          >
                            {subItem.icon}
                            <div className="flex flex-col gap-1 font-bold">
                              <span>{t(subItem.titleKey)}</span>
                              <span className="text-xs hidden text-muted-foreground">
                                {subItem.subtitleKey && t(subItem.subtitleKey)}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
