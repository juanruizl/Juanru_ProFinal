import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./views/Home.jsx";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import Dashboard from "./views/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx"; // Ruta protegida
import TransactionList from "./views/TransactionList.jsx"; // Vista de transacciones
import AddTransaction from "./views/AddTransaction.jsx"; // Vista para agregar transacciones

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

