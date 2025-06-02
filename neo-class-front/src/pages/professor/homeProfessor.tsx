// src/pages/professor/homeProfessor.tsx
import React, { useEffect, useState } from "react";
import ProfessorService from "../../app/service/professorService";
import ProvaService from "../../app/service/provaService";
import TrabalhoService from "../../app/service/trabalhoService";
import AlunoService from "../../app/service/alunoService";
import type {
  ProfessorDTO,
  ProvaDTO,
  TrabalhoDTO,
  AlunoDTO
} from "../../app/service/type";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import Calendario from "../../components/calendario/calendario";
import LinkButton from "../../components/linkButtons/linkButtons";
import SideBar from "../../components/sideBar/sideBar";
import "../../styles/home.css";
import "../../styles/template.css";
import BlueCard from "../../components/blueCard/blueCard";

const navItems = [
  { icon: <HomeIcon className="sideBar-icon" />, text: "Início", href: "/homeProfessor" },
  { icon: <TurmaIcon className="sideBar-icon" />, text: "Prova", href: "/turmas" },
  { icon: <AlunoIcon className="sideBar-icon" />, text: "Trabalhos", href: "/alunos" },
];

const HomeProfessor: React.FC = () => {
  // Lê o ID do localStorage
  const storedId = localStorage.getItem("id");
  const professorId = storedId ? Number(storedId) : null;

  const [professor, setProfessor] = useState<ProfessorDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provasCount, setProvasCount] = useState(0);
  const [trabalhosCount, setTrabalhosCount] = useState(0);
  const [totalAlunos, setTotalAlunos] = useState(0);

  useEffect(() => {
    if (!professorId) {
      setError("ID do professor não encontrado");
      setLoading(false);
      return;
    }

    const profService = new ProfessorService();
    const provaService = new ProvaService();
    const trabalhoService = new TrabalhoService();
    const alunoService = new AlunoService();

    // 1. Buscar dados do professor
    profService
      .buscarPorId(professorId)
      .then(res => setProfessor(res.data))
      .catch(() => setError("Erro ao carregar dados do professor"))
      .finally(() => setLoading(false));

    // 2. Contar provas
    provaService
      .listarTodas()
      .then(res => {
        const lista = res.data as ProvaDTO[];
        setProvasCount(lista.filter(p => p.professorId === professorId).length);
      })
      .catch(() => console.warn("Falha ao buscar provas"));

    // 3. Contar trabalhos
    trabalhoService
      .listarTodos()
      .then(res => {
        const lista = res.data as TrabalhoDTO[];
        setTrabalhosCount(lista.filter(t => t.professorId === professorId).length);
      })
      .catch(() => console.warn("Falha ao buscar trabalhos"));

    // 4. Contar alunos
    alunoService
      .listarTodos()
      .then(res => {
        const lista = res.data as AlunoDTO[];
        setTotalAlunos(lista.length);
      })
      .catch(() => console.warn("Falha ao buscar alunos"));

  }, [professorId]);

  if (loading) return <p>Carregando dados do professor...</p>;
  if (error)   return <p>{error}</p>;

  return (
    <div className="gridTemplate">
      <aside>
        <SideBar buttonText="Sair" navItems={navItems} />
      </aside>
      <main className="home-container">
        <header className="container-h">
          <h1 className="title">Seja Bem-Vindo(a), {professor?.nome}!</h1>
          <h2 className="subtitle">O que deseja fazer hoje?</h2>
        </header>

        <section className="home-container-professor">
          <div className="acoes-container">
            <div className="title-home acoes">
              <h2>Ações</h2>
            </div>
            <div className="link-buttons-professor">
              <LinkButton text={"Lançar\nNotas"} href="/registrarNotas" image={require("../../assets/tabela.png")} className="professor" />
              <LinkButton text={"Registrar\nPresenças"} href="/registrarPresenca" image={require("../../assets/prancheta.png")} className="professor" />
              <LinkButton text={"Cadastrar\nProva"} href="/cadastroProva" image={require("../../assets/papeis.png")} className="professor" />
              <LinkButton text={"Cadastrar\nTrabalho"} href="/cadastroTrabalho" image={require("../../assets/pasta.png")} className="professor" />
            </div>
          </div>
        </section>

        <section className="grid-1e2">
          <div className="calendario-container">
            <Calendario />
          </div>
          <div className="estatistica-container">
            <div className="title-home estat">
              <h2>ESTATÍSTICAS</h2>
            </div>
            <div className="estatistica-cards">
              <BlueCard title={"PROVAS\nCADASTRADAS"} text={provasCount} />
              <BlueCard title={"TRABALHOS\nCADASTRADOS"} text={trabalhosCount} />
              <BlueCard title={"ALUNOS\nTOTAL"} text={totalAlunos} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeProfessor;
