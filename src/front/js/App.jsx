import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./views/Home.jsx";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import Dashboard from "./views/Dashboard.jsx";
import TransactionList from "./views/TransactionList.jsx";
import AddTransaction from "./views/AddTransaction.jsx";
import Budgets from "./views/Budgets.jsx"; 
import Projects from "./views/Projects.jsx"; 
import Payments from "./views/Payments.jsx"; 
import PrivateRoute from "./components/PrivateRoute.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <div className="container">
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Rutas protegidas */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/transactions" element={<TransactionList />} />
                        <Route path="/transactions/new" element={<AddTransaction />} />
                        <Route path="/budgets" element={<Budgets />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/payments" element={<Payments />} />
                    </Route>

                    {/* Ruta por defecto */}
                    <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
                </Routes>
            </div>
            <Footer />
        </BrowserRouter>
    );
};

export default App;
