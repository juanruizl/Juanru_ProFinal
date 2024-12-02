import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Context } from "../store/appContext";

const PrivateRoute = () => {
    const { store } = React.useContext(Context);

    // Si no hay token, redirigir al login
    return store.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
