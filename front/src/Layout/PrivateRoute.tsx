import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function PrivateRoutes() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return <Outlet />;
}

export default PrivateRoutes;
