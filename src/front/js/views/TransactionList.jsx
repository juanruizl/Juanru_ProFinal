import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const TransactionList = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getTransactions(); // Obtener transacciones al cargar la vista
    }, []);

    return (
        <div className="container mt-5">
            <h2>Transacciones</h2>
            {store.transactions && store.transactions.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Monto</th>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.transactions.map((transaction, index) => (
                            <tr key={transaction.id}>
                                <td>{index + 1}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.transaction_type}</td>
                                <td>{transaction.description || "Sin descripción"}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => actions.editTransaction(transaction.id)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => actions.deleteTransaction(transaction.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay transacciones disponibles.</p>
            )}
        </div>
    );
};

export default TransactionList;
