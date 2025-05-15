import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login";

import HomeSecretaria from "../pages/secretaria/homeSecretaria";
import ListTurmas from "../pages/secretaria/listTurmas";
import ListAlunos from "../testes/listAlunos";
import ListProfessores from "../pages/secretaria/listProfessores";
import CadastroAlunoCompleto from "../testes/cadastroAluno";


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
        <Route path="/cadastrarAluno/:id?" element={<CadastroAlunoCompleto />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
