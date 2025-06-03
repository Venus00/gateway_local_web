import { ThemeProvider } from "@/components/theme-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router";

interface SidebarContextType {
  isSidebarVisible: boolean;
  isFullScreen: boolean;
  isLayoutTooTall: boolean;
  toggleSidebar: () => void;
  toggleFullScreen: () => void;
  toggleIsLayoutTooTall: (value: boolean) => void;
}

const SideBarContext = createContext<SidebarContextType | undefined>(undefined);

export const SideBarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarVisible, setSideBarVisible] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLayoutTooTall, setIsLayoutTooTall] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setSideBarVisible(false);
    } else {
      setSideBarVisible(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setSideBarVisible(false);
    }
  }, [location, isMobile]);

  const toggleSidebar = () => {
    setSideBarVisible((prev) => !prev);
  };
  const toggleIsLayoutTooTall = (value: boolean) => {
    setIsLayoutTooTall(value);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      setIsFullScreen(isFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (isLayoutTooTall)
      return alert(
        "Please resize or move some widgets to fit the screen before fullscreen."
      );
    setIsFullScreen((prev) => !prev);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });

      if (isSidebarVisible) toggleSidebar();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();

        // toggleFullScreen();
      }
      if (!isSidebarVisible) toggleSidebar();
    }
  };

  return (
    <SideBarContext.Provider
      value={{
        isSidebarVisible,
        toggleSidebar,
        isFullScreen,
        toggleFullScreen,
        isLayoutTooTall,
        toggleIsLayoutTooTall,
      }}
    >
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        {children}
      </ThemeProvider>
    </SideBarContext.Provider>
  );
};

export const useSideBar = () => {
  const context = useContext(SideBarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SideBarProvider");
  }

  return context;
};
