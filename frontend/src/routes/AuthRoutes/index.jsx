import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {
  return !localStorage.getItem("uid") ? (
    <Outlet />
  ) : (
    <Navigate to={"/todo"} />
  );
};

export default AuthRoute;