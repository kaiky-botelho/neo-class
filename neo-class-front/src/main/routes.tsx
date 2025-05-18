import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import HomeSecretaria from "../pages/secretaria/homeSecretaria";
import ListTurmas from "../pages/secretaria/listTurmas";
import ListAlunos from "../pages/secretaria/listAlunos";
import ListProfessores from "../pages/secretaria/listProfessores";
import CadastroAluno from "../pages/secretaria/cadastroAluno";
import CadastroProfessor from "../pages/secretaria/cadastroProfessor";
import CadastroTurma from "../pages/secretaria/cadastroTurma"; 

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas para a secretaria */}
        <Route path="/homeSecretaria" element={<HomeSecretaria />} />
        <Route path="/turmas" element={<ListTurmas />} />
        <Route path="/alunos" element={<ListAlunos />} />
        <Route path="/professores" element={<ListProfessores />} />
        <Route path="/cadastroAluno/:id?" element={<CadastroAluno />} />
        <Route path="/cadastroProfessor/:id?" element={<CadastroProfessor />} />
        <Route path="/cadastroTurma/:id?" element={<CadastroTurma />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
