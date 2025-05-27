import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfessorService from "../../app/service/professorService";
import type { ProfessorDTO } from "../../app/service/type";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import Calendario from "../../components/calendario/calendario";
import LinkButton from "../../components/linkButtons/linkButtons";
import SideBar from "../../components/sideBar/sideBar";
import "../../styles/home.css";
import "../../styles/template.css";

const navItems = [
  { icon: <HomeIcon className="sideBar-icon" />, text: "Início", href: "/homeSecretaria" },
  { icon: <TurmaIcon className="sideBar-icon" />, text: "Prova", href: "/turmas" },
  { icon: <AlunoIcon className="sideBar-icon" />, text: "Trabalhos", href: "/alunos" },

];

const HomeProfessor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [professor, setProfessor] = useState<ProfessorDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID do professor não informado");
      setLoading(false);
      return;
    }

    const professorService = new ProfessorService();

    professorService
      .buscarPorId(Number(id))
      .then(response => {
        setProfessor(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Erro ao carregar dados do professor");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Carregando dados do professor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
         <div className="gridTemplate">
      <div>
        <SideBar buttonText="Sair" navItems={navItems} />
      </div>

      <div className="home-container">
        <div className="container-h">
          <h1 className="title">Seja Bem-Vindo(a), {professor?.nome || "Professor"}!</h1>
          <h2 className="subtitle">O que deseja fazer hoje?</h2>

          <div className="home-container-professor">
            <div className="acoes-container">
              <div className="title-home acoes">
                <h2>Ações</h2>
              </div>
              <div className="link-buttons-professor">
                <LinkButton text={"Cadastrar\nAluno"} href="/cadastroAluno" image={require("../../assets/chapeu.png")} className={"professor"} />
                <LinkButton text={"Cadastrar\nProfessor"} href="/cadastroProfessor" image={require("../../assets/lousa.png")}  className={"professor"}/>
                <LinkButton text={"Cadastrar\nTurma"} href="/cadastroTurma" image={require("../../assets/turma.png")} className={"professor"}  />
                <LinkButton text={"Cadastrar\nMatéria"} href="/cadastroMateria" image={require("../../assets/papeis.png")} className={"professor"} />
              </div>
            </div>
          </div>

          <div className="home-container-secundario">
            <div className="calendario-container">
              <Calendario />
            </div>

            <div className="estatistica-container">
              <div className="title-home estat">
                <h2>ESTATÍSTICAS</h2>
              </div>
              <div className="estatistica-cards">

              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeProfessor;
