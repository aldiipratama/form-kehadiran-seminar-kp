import { Navigate, Outlet, useLocation } from "react-router-dom";

export const RouteGuard = () => {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname === "/form" && !location.state?.fromHome)
    return <Navigate to={"/"} replace />;
  if (pathname === "/success" && !location.state?.fromSubmit)
    return <Navigate to={"/form"} replace />;

  return <Outlet />;
};
