import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
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
import CadastroProva from "../pages/professor/cadastroProva";
import CadastroTrabalho from "../pages/professor/cadastroTrabalho";
import RegistrarPresenca from "../pages/professor/registrarPresenca";
import LancarNotas from "../pages/professor/lancarNotas";
import ListProvas from "../pages/professor/listProva";
import ListTrabalhos from "../pages/professor/listTrabalho";
import CalendarioProfessor from "../pages/professor/calendarioProfessor";


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

        <Route
          path="/cadastroProva/:id?"
          element={
            <PrivateRoute allowedRoles={["PROFESSOR"]}>
              <CadastroProva />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastroTrabalho/:id?"
          element={
            <PrivateRoute allowedRoles={["PROFESSOR"]}>
              <CadastroTrabalho />
            </PrivateRoute>
          }/>
        <Route path="/registrarPresenca" element={
          <PrivateRoute allowedRoles={["PROFESSOR"]}>
          <RegistrarPresenca />
        </PrivateRoute>}
        />
    
        <Route
          path="/lancarNotas"
          element={
            <PrivateRoute allowedRoles={["PROFESSOR"]}>
              <LancarNotas />
            </PrivateRoute>
          } />

        <Route
          path="/calendarioProfessor"
          element={
            <PrivateRoute allowedRoles={["PROFESSOR"]}>
              <CalendarioProfessor />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/provas"
          element={
            <PrivateRoute allowedRoles={["PROFESSOR"]}>
              <ListProvas />
            </PrivateRoute>
          }
        />

        <Route 
          path="/trabalhos"
          element={
            <PrivateRoute allowedRoles={["PROFESSOR"]}>
              <ListTrabalhos />
            </PrivateRoute>
          }
        />
        {/* Rota de teste (pública) */}
        <Route path="/teste" element={<Teste />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
