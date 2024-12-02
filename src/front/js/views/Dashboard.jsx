import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const Dashboard = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getTransactions(); // Llama a la función para obtener transacciones al cargar
    }, []);

    return (
        <div className="container mt-5">
            <h2>Dashboard</h2>
            {store.loading && <p>Cargando datos...</p>}
            {store.transactions.length === 0 && !store.loading && (
                <p>No hay transacciones disponibles.</p>
            )}
            <div className="row">
                {store.transactions.map((transaction) => (
                    <div className="col-md-4" key={transaction.id}>
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Transacción: {transaction.id}</h5>
                                <p className="card-text">Monto: {transaction.amount}</p>
                                <p className="card-text">Tipo: {transaction.transaction_type}</p>
                                <p className="card-text">Descripción: {transaction.description || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
