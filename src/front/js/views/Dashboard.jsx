import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const Dashboard = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getCurrentUser();
    }, []);

    return (
        <div className="container mt-5">
            <h2>Bienvenido al Dashboard</h2>
            {store.currentUser ? (
                <div>
                    <p>Nombre: {store.currentUser.name}</p>
                    <p>Email: {store.currentUser.email}</p>
                </div>
            ) : (
                <p>Cargando información del usuario...</p>
            )}
        </div>
    );
};

export default Dashboard;
