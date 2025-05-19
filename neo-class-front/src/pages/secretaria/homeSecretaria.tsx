import React from "react";
import SideBar from "../../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as ProfesorIcon } from "../../assets/icons/professor.svg";
import "../../styles/home.css";
import LinkButton from "../../components/linkButtons/linkButtons";
import Calendario from "../../components/calendario/calendario";



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
  {
    icon: <ProfesorIcon className="sideBar-icon" />,
    text: "Materias",
    href: "/materias",
  },
];

const HomeSecretaria: React.FC = () => {
  return (
    <div className="gridTemplate">
      <div>
        <SideBar buttonText={"Sair"} navItems={navItems} />
      </div>
      <div className="home-container">
        <div className="container-h">
          <h1 className="title">Seja Bem-Vindo(a)!</h1>
          <h2 className="subtitle">O que deseja fazer hoje?</h2>
          <div className="home-container-principal">
            <div className="acoes-container">
              <div className="title-home acoes">
                <h2>Ações</h2>
              </div>
              <div className="link-buttons-container">

                <LinkButton
                  text={"Cadastrar\nAluno"}
                  href={"/cadastroAluno"}
                  image={require("../../assets/chapeu.png")}
                />
                <LinkButton
                  text={"Cadastrar\nPofessor"}
                  href={"/cadastroProfessor"}
                  image={require("../../assets/lousa.png")}
                />
                <LinkButton
                  text={"Cadastrar\nTurma"}
                  href={"/cadastroTurma"}
                  image={require("../../assets/turma.png")}
                />
                <LinkButton
                  text={"Cadastrar\nMatéria"}
                  href={"/cadastroMateria"}
                  image={require("../../assets/papeis.png")}
                />
              </div>
            </div>
            <div className="calendario-container">
              <Calendario />
            </div>
          </div>
          <div className="home-container-secundario">
            <div className="notificacao-container">
              <div className="title-home noti">
                <h2>NOTIFICAÇÕES</h2>
              </div>
                              <div className="noti-list">
                  <div className="noti-item">
                    <h3>Notificação 1</h3>
                    <p>Descrição da notificação 1</p>
                  </div>
                  <div className="noti-item">
                    <h3>Notificação 2</h3>
                    <p>Descrição da notificação 2</p>
                  </div>
                  <div className="noti-item">
                    <h3>Notificação 3</h3>
                    <p>Descrição da notificação 3</p>
                  </div>
                </div>
            </div>
            <div className="estatistica-container">

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSecretaria;
