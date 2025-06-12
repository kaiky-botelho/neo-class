// src/pages/secretaria/HomeSecretaria.tsx
import React, { useEffect, useState } from "react";
import SideBar from "../../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as ProfesorIcon } from "../../assets/icons/professor.svg";
import { ReactComponent as MateriaIcon } from "../../assets/icons/materia.svg";
import LinkButton from "../../components/linkButtons/linkButtons";
import Calendario from "../../components/calendario/calendario";
import NotificacaoService from "../../app/service/notificacaoService";
import AlunoService from "../../app/service/alunoService";
import ProfessorService from "../../app/service/professorService";
import type {
  NotificacaoDTO,
  AlunoDTO,
  ProfessorDTO,
  RespostaDTO
} from "../../app/service/type";
import NotificacaoText from "../../components/notificacaoText/notificacaoText";
import BlueCard from "../../components/blueCard/blueCard";
import Modal from "../../components/modal/modal";
import Input from "../../components/input/input";
import TextArea from "../../components/textArea/textArea";
import ReactLoading from "react-loading"; // IMPORTANTE!
import "../../styles/home.css";

// Estende NotificacaoDTO para incluir nome do aluno
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

  // Modal e estado de resposta
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotificacao, setSelectedNotificacao] = useState<NotificacaoExt | null>(null);
  const [resposta, setResposta] = useState("");
  const [sending, setSending] = useState(false); // NOVO: estado de loading do envio

  // Carrega secretariaId (ajuste conforme seu auth)
  const [secretariaId, setSecretariaId] = useState<number | null>(null);
  useEffect(() => {
    const sid = localStorage.getItem("secretariaId");
    if (sid) setSecretariaId(Number(sid));
  }, []);

  // Busca inicial de dados
  useEffect(() => {
    (async () => {
      try {
        const [alunosRes, profRes, notRes] = await Promise.all([
          alunoService.listarTodos(),
          professorService.listarTodos(),
          notificacaoService.listarPendentes()
        ]);
        setAlunos(alunosRes.data);
        setProfessores(profRes.data);

        // Anexa alunoNome em cada notificação
        const enriched: NotificacaoExt[] = notRes.data.map(n => ({
          ...n,
          alunoNome: alunosRes.data.find(a => a.id === n.alunoId)?.nome
        }));
        setNotificacoes(enriched);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Abre o modal e inicializa o form
  const handleResponderClick = (notifica: NotificacaoExt) => {
    setSelectedNotificacao(notifica);
    setResposta("");             // limpa resposta anterior
    setIsModalOpen(true);
  };

  // Envia apenas { resposta, secretariaId }
  const handleEnviarResposta = async () => {
    if (!selectedNotificacao?.id || secretariaId == null) {
      console.warn("Faltam dados para enviar:", selectedNotificacao, secretariaId);
      return;
    }

    setSending(true); // ATIVA O LOADING DO BOTÃO

    const payload: RespostaDTO = {
      resposta,
      secretariaId
    };

    try {
      await notificacaoService.responder(selectedNotificacao.id, payload);
      // Recarrega notificações pendentes
      const pend = await notificacaoService.listarPendentes();
      const enriched: NotificacaoExt[] = pend.data.map(n => ({
        ...n,
        alunoNome: alunos.find(a => a.id === n.alunoId)?.nome
      }));
      setNotificacoes(enriched);
    } catch (err) {
      console.error("Erro ao enviar resposta:", err);
    } finally {
      setSending(false); // DESATIVA O LOADING DO BOTÃO
      setIsModalOpen(false);
      setSelectedNotificacao(null);
    }
  };

  return (
    <div className="gridTemplate">
      <SideBar buttonText="Sair" navItems={navItems} />

      <div className="home-container">
        <div className="container-h">
          <h1 className="title">Seja Bem-Vindo(a)!</h1>
          <h2 className="subtitle">O que deseja fazer hoje?</h2>

          <div className="home-container-principal">
            <div className="acoes-container">
              <div className="title-home acoes"><h2>Ações</h2></div>
              <div className="link-buttons-container">
                <LinkButton text={"Cadastrar\nAluno"} href="/cadastroAluno" image={require("../../assets/chapeu.png")} />
                <LinkButton text={"Cadastrar\nProfessor"} href="/cadastroProfessor" image={require("../../assets/lousa.png")} />
                <LinkButton text={"Cadastrar\nTurma"} href="/cadastroTurma" image={require("../../assets/turma.png")} />
                <LinkButton text={"Cadastrar\nMatéria"} href="/cadastroMateria" image={require("../../assets/papeis.png")} />
              </div>
            </div>
            <div className="calendario-container"><Calendario /></div>
          </div>

          <div className="home-container-secundario">
            <div className="notificacao-container">
              <div className="title-home noti"><h2>NOTIFICAÇÕES</h2></div>
              <div className="noti-list">
                {loading
                  ? <p>Carregando notificações...</p>
                  : notificacoes.length === 0
                    ? <p className="SemNotificacao">Nenhuma notificação aqui</p>
                    : notificacoes.map(n => (
                        <NotificacaoText
                          key={n.id}
                          title={n.alunoNome ?? "Aluno desconhecido"}
                          text={n.texto}
                          onResponder={() => handleResponderClick(n)}
                        />
                      ))
                }
              </div>
            </div>

            <div className="estatistica-container">
              <div className="title-home estat"><h2>ESTATÍSTICAS</h2></div>
              <div className="estatistica-cards">
                <BlueCard title={"ALUNOS\nMATRICULADOS"} text={alunos.length} />
                <BlueCard title={"PROFESSORES\nCADASTRADOS"} text={professores.length} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Resposta */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3>Responder Notificação</h3>

        <Input
          label="Aluno"
          value={selectedNotificacao?.alunoNome || ""}
          disabled
        />

        <TextArea
          label="Notificação"
          value={selectedNotificacao?.texto || ""}
          disabled
        />

        <TextArea
          label="Sua Resposta"
          value={resposta}
          placeholder="Digite sua resposta..."
          onChange={setResposta}
        />

        <button
          type="button"
          className="button-not"
          onClick={handleEnviarResposta}
          disabled={sending}
        >
          {sending ? (
            <ReactLoading type="spin" color="#fff" height={20} width={20} />
          ) : (
            "Enviar"
          )}
        </button>
      </Modal>
    </div>
  );
};

export default HomeSecretaria;
