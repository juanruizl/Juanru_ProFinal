import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const AddTransaction = () => {
    const { actions } = useContext(Context);
    const [amount, setAmount] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.createTransaction({
            amount,
            transaction_type: transactionType,
            description,
        });
        if (success) {
            navigate("/transactions"); // Redirigir a la lista de transacciones
        }
    };

    return (
        <div className="container mt-5">
            <h2>Agregar Transacción</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Monto</label>
                    <input
                        type="number"
                        className="form-control"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tipo de Transacción</label>
                    <select
                        className="form-select"
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Ingreso">Ingreso</option>
                        <option value="Gasto">Gasto</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <input
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Agregar
                </button>
            </form>
        </div>
    );
};

export default AddTransaction;
