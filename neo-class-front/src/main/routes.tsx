import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login";

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
