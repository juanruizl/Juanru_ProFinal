import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener datos principales al cargar el dashboard
        actions.getTransactions();
        actions.getPayments();
        actions.getProjects();
        actions.getBudgets();
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Resumen General</h1>
                <button
                    className="btn btn-danger"
                    onClick={() => {
                        actions.logout();
                        navigate("/login");
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>

            {/* Resumen en tarjetas */}
            <div className="row">
                <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Transacciones</h5>
                            <p className="card-text fs-4">{store.transactions.length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Pagos</h5>
                            <p className="card-text fs-4">{store.payments.length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Proyectos</h5>
                            <p className="card-text fs-4">{store.projects.length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Presupuestos</h5>
                            <p className="card-text fs-4">{store.budgets.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buscador */}
            <div className="mt-5">
                <h3>Buscar</h3>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar transacciones, pagos o proyectos..."
                    onChange={(e) => {
                        const query = e.target.value.toLowerCase();
                        // Filtrar las transacciones
                        const filteredTransactions = store.transactions.filter((transaction) =>
                            transaction.description.toLowerCase().includes(query)
                        );
                        // Guardar las transacciones filtradas en el store o renderizar dinámicamente
                        console.log("Filtrado:", filteredTransactions);
                    }}
                />
            </div>
        </div>
    );
};

export default Dashboard;

