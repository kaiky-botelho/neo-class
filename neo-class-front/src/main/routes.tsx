import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./privateRoute";

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
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas para a secretaria protegidas */}
        <Route
          path="/homeSecretaria"
          element={
            <PrivateRoute allowedRoles={["SECRETARIA"]}>
              <HomeSecretaria />
            </PrivateRoute>
          }
        />
        <Route
          path="/turmas"
          element={
            <PrivateRoute allowedRoles={["SECRETARIA"]}>
              <ListTurmas />
            </PrivateRoute>
          }
        />
        <Route
          path="/alunos"
          element={
            <PrivateRoute allowedRoles={["SECRETARIA"]}>
              <ListAlunos />
            </PrivateRoute>
          }
        />
        <Route
          path="/professores"
          element={
            <PrivateRoute allowedRoles={["SECRETARIA"]}>
              <ListProfessores />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastroAluno/:id?"
          element={
            <PrivateRoute allowedRoles={["SECRETARIA"]}>
              <CadastroAluno />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastroProfessor/:id?"
          element={
            <PrivateRoute allowedRoles={["SECRETARIA"]}>
              <CadastroProfessor />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastroTurma/:id?"
          element={
            <PrivateRoute allowedRoles={["SECRETARIA"]}>
              <CadastroTurma />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastroMateria/:id?"
          element={
            <PrivateRoute allowedRoles={["SECRETARIA"]}>
              <CadastroMateria />
            </PrivateRoute>
          }
        />
        <Route
          path="/materias"
          element={
            <PrivateRoute allowedRoles={["SECRETARIA"]}>
              <ListMateria />
            </PrivateRoute>
          }
        />

        {/* Rotas para o professor protegidas */}
        <Route
          path="/homeProfessor/:id?"
          element={
            <PrivateRoute allowedRoles={["PROFESSOR"]}>
              <HomeProfessor />
            </PrivateRoute>
          }
        />

        {/* Rota de teste (pública) */}
        <Route path="/teste" element={<Teste />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
