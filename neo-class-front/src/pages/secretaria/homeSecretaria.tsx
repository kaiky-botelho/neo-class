import React from "react";
import SideBar from "../../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as ProfesorIcon } from "../../assets/icons/professor.svg";
import "../../styles/homeSecretaria.css";
import LinkButton from "../../components/linkButtons/linkButtons";


const navItems = [
  {
    icon: <HomeIcon className="sideBar-icon" />,
    text: "Início",
    href: "/homeSecretaria",
  },
  {
    icon: <TurmaIcon className="sideBar-icon" />,
    text: "Turmas",
    href: "/turmas",
  },
  {
    icon: <AlunoIcon className="sideBar-icon" />,
    text: "Alunos",
    href: "/alunos",
  },
  {
    icon: <ProfesorIcon className="sideBar-icon" />,
    text: "Professores",
    href: "/professores",
  },
];

const HomeSecretaria: React.FC = () => {
  return (
    <div className="gridTemplate">
      <div>
        <SideBar buttonText={"Sair"} navItems={navItems} />
      </div>
      <div className="gridTemplate-content">
        <div className="container">
          <h1 className="title">Seja Bem-Vindo(a)!</h1>
          <h2 className="subtitle">O que deseja fazer hoje?</h2>
          <div className="gridTemplate-content-principal">
            <div className="acoes-container">
              <div className="acoes-title">
              <h2>Ações</h2>
              </div>
              <div className="link-buttons-container">
              <LinkButton
                text={"Cadastrar\nAluno"}
                href={"/cadastrarAluno"}
                image={require("../../assets/chapeu.png")}
              />
              <LinkButton
                text={"Cadastrar\nPofessor"}
                href={"/cadastrarProfessor"}
                image={require("../../assets/lousa.png")}
              />
              <LinkButton
                text={"Cadastrar\nTurma"}
                href={"/cadastrarTurma"}
                image={require("../../assets/turma.png")}
              />
              </div>
            </div>
            <div className="calendario-container"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSecretaria;
