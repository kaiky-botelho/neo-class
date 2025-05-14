import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Teste from "../pages/teste";


function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teste" element={<Teste />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
