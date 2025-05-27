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
import CadastroMateria from "../pages/secretaria/cadastroMateria";
import ListMateria from "../pages/secretaria/listMateria";
import Teste from "../pages/teste";

import HomeProfessor from "../pages/professor/homeProfessor";

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
        <Route path="/cadastroMateria/:id?" element={<CadastroMateria />} />
        <Route path="/materias" element={<ListMateria />} />
        {/* Rota para o calendário */}
        <Route path="/homeProfessor" element={<HomeProfessor />} />

        {/* Rota de teste */}
        <Route path="/teste" element={<Teste />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
