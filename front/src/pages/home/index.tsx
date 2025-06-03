import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function LandingPageLayout() {
  const location = useLocation();
  return (
    <div className="   flex flex-col gap-0 min-h-screen bg-neutral-800">
      <div
        style={{
          background:
            location.pathname === "/"
              ? "linear-gradient(to left, #F2994A, #F2C94C)"
              : "",
        }}
      >
        <Header />
      </div>
      <main className="flex-1 ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
