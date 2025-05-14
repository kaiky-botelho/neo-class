import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login";

import HomeSecretaria from "../pages/secretaria/homeSecretaria";
import ListTurmas from "../pages/secretaria/listTurmas";
import ListAlunos from "../pages/secretaria/listAlunos";
import ListProfessores from "../pages/secretaria/listProfessores";

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homeSecretaria" element={<HomeSecretaria />} />
        <Route path="/turmas" element={<ListTurmas />} />
        <Route path="/alunos" element={<ListAlunos />} />
        <Route path="/professores" element={<ListProfessores />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
