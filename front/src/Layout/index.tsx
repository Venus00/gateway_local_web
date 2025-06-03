import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { apiClient } from "@/features/api";
import { useQuery } from "react-query";
import { SideBarProvider, useSideBar } from "./SideBarProvider/SideBarProvider";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageProvider, useLanguage } from "@/context/language-context";

const contentVariants = {
  open: {
    marginLeft: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    marginLeft: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  mobile: {
    marginLeft: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

function LayoutContent() {
  const { isSidebarVisible } = useSideBar();
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const arabic = language === "ar";

  return (
    <div
      className={`flex h-screen overflow-y-hidden bg-gray-100 dark:bg-neutral-900 font-extralight ${
        arabic ? "flex-row-reverse" : ""
      }`}
    >
      {!isMobile && <SideBar />}
      <motion.div
        variants={contentVariants}
        initial={false}
        animate={isMobile ? "mobile" : isSidebarVisible ? "open" : "closed"}
        className="flex-1 flex flex-col  overflow-y-auto"
      >
        <NavBar />
        <Outlet />
      </motion.div>
    </div>
  );
}

function Layout() {
  useQuery("me", () => fetchMe(), { initialData: [] });

  const fetchMe = async () => {
    try {
      const response = await apiClient.get("/me");
      return response.data;
    } catch (error) {
      return [];
    }
  };

  return (
    <LanguageProvider>
      {" "}
      <SideBarProvider>
        <LayoutContent />
      </SideBarProvider>
    </LanguageProvider>
  );
}

export default Layout;
