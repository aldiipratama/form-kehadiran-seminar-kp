import { Navigate, Outlet, useLocation } from "react-router-dom";

export const RouteGuard = () => {
  const location = useLocation();

  if (!location.state?.fromSubmit) return <Navigate to={"/"} replace />;

  return <Outlet />;
};
