/**
 * Declaracion de dependencias
 */
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./components/Sidebar"
import GestionEmpresas from './pages/GestionEmpresas.jsx';
import GestionInventario from './pages/GestionInventario.jsx';
import Login from './pages/Login';

/**
 * Componente principal de la aplicacion
 */
const App = () => {
  return (
    <main className='App'>
      <ToastContainer />
      <Login>
        <BrowserRouter>
          {/* <Sidebar> */}
          <Routes>
            <Route path="/" element={<GestionEmpresas />} />
            <Route path="/gestion-inventario" element={<GestionInventario />} />
          </Routes>
          {/* </Sidebar> */}
        </BrowserRouter>
      </Login>
    </main>
  );
};

export default App;