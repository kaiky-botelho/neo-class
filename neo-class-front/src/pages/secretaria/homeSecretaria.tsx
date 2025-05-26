import React, { useEffect, useState } from "react";
import SideBar from "../../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as ProfesorIcon } from "../../assets/icons/professor.svg";
import { ReactComponent as MateriaIcon } from "../../assets/icons/materia.svg";
import "../../styles/home.css";
import LinkButton from "../../components/linkButtons/linkButtons";
import Calendario from "../../components/calendario/calendario";
import NotificacaoService from "../../app/service/notificacaoService";
import AlunoService from "../../app/service/alunoService";
import ProfessorService from "../../app/service/professorService";
import { NotificacaoDTO, AlunoDTO, ProfessorDTO } from "../../app/service/type";
import NotificacaoText from "../../components/notificacaoText/notificacaoText";
import BlueCard from "../../components/blueCard/blueCard";

// Extensão para incluir possível nome do aluno vindo embutido
interface NotificacaoExt extends NotificacaoDTO {
  alunoNome?: string;
}

const notificacaoService = new NotificacaoService();
const alunoService = new AlunoService();
const professorService = new ProfessorService();

const navItems = [
  { icon: <HomeIcon className="sideBar-icon" />, text: "Início", href: "/homeSecretaria" },
  { icon: <TurmaIcon className="sideBar-icon" />, text: "Turmas", href: "/turmas" },
  { icon: <AlunoIcon className="sideBar-icon" />, text: "Alunos", href: "/alunos" },
  { icon: <ProfesorIcon className="sideBar-icon" />, text: "Professores", href: "/professores" },
  { icon: <MateriaIcon className="sideBar-icon" />, text: "Matérias", href: "/materias" },
];

const HomeSecretaria: React.FC = () => {
  const [alunos, setAlunos] = useState<AlunoDTO[]>([]);
  const [professores, setProfessores] = useState<ProfessorDTO[]>([]);
  const [notificacoes, setNotificacoes] = useState<NotificacaoExt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca alunos, professores e notificações em paralelo
        const [alunosRes, profRes, notRes] = await Promise.all([
          alunoService.listarTodos(),
          professorService.listarTodos(),
          notificacaoService.listarPendentes()
        ]);

        setAlunos(alunosRes.data);
        setProfessores(profRes.data);

        const rawData = notRes.data as any[];
        const normalized: NotificacaoExt[] = rawData.map(n => ({
          ...n,
          alunoId: n.alunoId ?? n.aluno_id,
          alunoNome: n.aluno?.nome ?? n.alunoNome
        }));
        setNotificacoes(normalized);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="gridTemplate">
      <div>
        <SideBar buttonText="Sair" navItems={navItems} />
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
                <LinkButton text={"Cadastrar\nAluno"} href="/cadastroAluno" image={require("../../assets/chapeu.png")} />
                <LinkButton text={"Cadastrar\nProfessor"} href="/cadastroProfessor" image={require("../../assets/lousa.png")} />
                <LinkButton text={"Cadastrar\nTurma"} href="/cadastroTurma" image={require("../../assets/turma.png")} />
                <LinkButton text={"Cadastrar\nMatéria"} href="/cadastroMateria" image={require("../../assets/papeis.png")} />
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
                {loading ? (
                  <p>Carregando notificações...</p>
                ) : notificacoes.length === 0 ? (
                  <p>Nenhuma notificação aqui</p>
                ) : (
                  notificacoes.map(n => {
                    const nome = n.alunoNome || alunos.find(a => a.id === n.alunoId)?.nome;
                    if (!nome) console.warn(`Aluno não encontrado para ID ${n.alunoId}`);
                    return (
                      <NotificacaoText
                        key={n.id}
                        title={nome ?? "Aluno desconhecido"}
                        text={n.texto}
                      />
                    );
                  })
                )}
              </div>
            </div>

            <div className="estatistica-container">
              <div className="title-home estat">
                <h2>ESTATÍSTICAS</h2>
              </div>
              <div className="estatistica-cards">
                <BlueCard title={"ALUNOS\nMATRICULADOS"} text={alunos.length} />
                <BlueCard title={"PROFESSORES\nCADASTRADOS"} text={professores.length} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSecretaria;
