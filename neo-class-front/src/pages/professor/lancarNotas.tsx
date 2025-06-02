// src/pages/professor/lancarNotas.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import TurmaService from "../../app/service/turmaService";
import MateriaService from "../../app/service/materiaService";
import AlunoService from "../../app/service/alunoService";
import NotaService from "../../app/service/notaService";
import type { TurmaDTO, MateriaDTO, AlunoDTO, NotaDTO } from "../../app/service/type";
import Select from "../../components/select/select";
import Input from "../../components/input/input";
import Header from "../../components/header/header";

import "../../styles/cadastro.css"; // importar o CSS separado

const turmaService = new TurmaService();
const materiaService = new MateriaService();
const alunoService = new AlunoService();
const notaService = new NotaService();

const LancarNotas: React.FC = () => {
  // 1) Lê professorId do localStorage
  const rawId = localStorage.getItem("id");
  const professorId: number | null = rawId ? Number(rawId) : null;

  // 2) Estados iniciais
  const [todasTurmas, setTodasTurmas] = useState<TurmaDTO[]>([]);
  const [todasMaterias, setTodasMaterias] = useState<MateriaDTO[]>([]);
  const [materiasDoProfessor, setMateriasDoProfessor] = useState<MateriaDTO[]>([]);
  const [listaTurmasDoProfessor, setListaTurmasDoProfessor] = useState<TurmaDTO[]>([]);

  // Nome da turma selecionada (string)
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");

  // Nome da matéria selecionada
  const [materiaSelecionada, setMateriaSelecionada] = useState<string>("");

  // Matérias filtradas para a turma selecionada (objetos)
  const [materiasFiltradas, setMateriasFiltradas] = useState<MateriaDTO[]>([]);

  const [todosAlunos, setTodosAlunos] = useState<AlunoDTO[]>([]);
  const [alunosDaTurma, setAlunosDaTurma] = useState<AlunoDTO[]>([]);

  // notas: { [alunoId]: { 0: string, 1: string, 2: string, 3: string } }
  const [notas, setNotas] = useState<Record<number, Record<number, string>>>({});

  // 2.1) Todas as notas vindas do backend
  const [todasNotas, setTodasNotas] = useState<NotaDTO[]>([]);

  // Mensagens de feedback
  const [msgSucesso, setMsgSucesso] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);

  // 3) Carrega turmas, matérias, alunos e notas ao montar
  useEffect(() => {
    turmaService
      .listarTodos()
      .then((res) => setTodasTurmas(res.data || []))
      .catch((err) => console.error("Erro ao buscar turmas:", err));

    materiaService
      .listarTodos()
      .then((res) => setTodasMaterias(res.data || []))
      .catch((err) => console.error("Erro ao buscar matérias:", err));

    alunoService
      .listarTodos()
      .then((res) => setTodosAlunos(res.data || []))
      .catch((err) => console.error("Erro ao buscar alunos:", err));

    notaService
      .listarTodas()
      .then((res) => setTodasNotas(res.data || []))
      .catch((err) => console.error("Erro ao buscar notas:", err));
  }, []);

  // 4) Filtra “turmas do professor” e “matérias do professor”
  useEffect(() => {
    if (professorId == null) {
      setListaTurmasDoProfessor([]);
      setMateriasDoProfessor([]);
      return;
    }
    if (todasTurmas.length === 0 || todasMaterias.length === 0) return;

    // 4.1) todas as matérias cujo professorId === professorId
    const matProf = todasMaterias.filter((m) => m.professorId === professorId);
    setMateriasDoProfessor(matProf);

    // 4.2) agora descubro quais turmas aparecem nessas matérias
    const turmaIdsSet = new Set<number>();
    matProf.forEach((m) => {
      if (m.turmaId != null) turmaIdsSet.add(m.turmaId);
    });
    const turmasFiltradas = todasTurmas.filter(
      (t) => t.id != null && turmaIdsSet.has(t.id)
    );
    setListaTurmasDoProfessor(turmasFiltradas);
  }, [professorId, todasTurmas, todasMaterias]);

  // 5) Quando mudar “turmaSelecionada”, filtra “alunosDaTurma”
  useEffect(() => {
    if (turmaSelecionada === "" || todosAlunos.length === 0) {
      setAlunosDaTurma([]);
      return;
    }
    // Procura o objeto Turma com esse nome
    const turmaObj = listaTurmasDoProfessor.find((t) => t.nome === turmaSelecionada);
    if (!turmaObj) {
      setAlunosDaTurma([]);
      return;
    }
    const turmaIdNum = turmaObj.id!;
    const filtrados = todosAlunos.filter((a) => a.turmaId === turmaIdNum);
    setAlunosDaTurma(filtrados);
  }, [turmaSelecionada, todosAlunos, listaTurmasDoProfessor]);

  // 6) Quando mudar “turmaSelecionada” ou “materiasDoProfessor”, filtra “materiasFiltradas”
  useEffect(() => {
    if (turmaSelecionada === "" || materiasDoProfessor.length === 0) {
      setMateriasFiltradas([]);
      setMateriaSelecionada("");
      return;
    }
    const turmaObj = listaTurmasDoProfessor.find((t) => t.nome === turmaSelecionada);
    if (!turmaObj) {
      setMateriasFiltradas([]);
      setMateriaSelecionada("");
      return;
    }
    const turmaIdNum = turmaObj.id!;
    const filtradas = materiasDoProfessor.filter((m) => m.turmaId === turmaIdNum);
    setMateriasFiltradas(filtradas);

    // Se a matéria antes escolhida não existir mais nesta turma, limpa
    if (
      materiaSelecionada !== "" &&
      !filtradas.some((m) => m.nome === materiaSelecionada)
    ) {
      setMateriaSelecionada("");
    }
  }, [turmaSelecionada, materiasDoProfessor, listaTurmasDoProfessor]);

  // 7A) Limpar mensagem de sucesso/erro após 1s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (msgSucesso) setMsgSucesso(null);
      if (msgErro) setMsgErro(null);
    }, 1000);
    return () => clearTimeout(timer);
  }, [msgSucesso, msgErro]);

  // 7B) Reconstrói “notas” sempre que mudar turma, alunos ou todasNotas
  useEffect(() => {
    if (turmaSelecionada === "" || alunosDaTurma.length === 0) {
      setNotas({});
      return;
    }

    // Inicializa notas vazias para cada aluno e cada bimestre (0..3)
    const inicialNotas: Record<number, Record<number, string>> = {};
    alunosDaTurma.forEach((a) => {
      if (a.id != null) inicialNotas[a.id] = { 0: "", 1: "", 2: "", 3: "" };
    });

    // Preenche com as notas existentes (todasNotas) na turma selecionada
    const turmaObj = listaTurmasDoProfessor.find((t) => t.nome === turmaSelecionada);
    const turmaIdNum = turmaObj ? turmaObj.id! : null;

    todasNotas.forEach((n) => {
      if (
        turmaIdNum !== null &&
        n.turmaId === turmaIdNum &&
        n.alunoId != null &&
        n.bimestre != null
      ) {
        const alunoId = n.alunoId;
        const idxBimestre = n.bimestre - 1; // 1→0, 2→1, ...
        if (
          inicialNotas[alunoId] !== undefined &&
          idxBimestre >= 0 &&
          idxBimestre <= 3
        ) {
          inicialNotas[alunoId][idxBimestre] = n.valor != null ? n.valor.toString() : "";
        }
      }
    });

    setNotas(inicialNotas);
  }, [turmaSelecionada, alunosDaTurma, todasNotas, listaTurmasDoProfessor]);

  // 8) Atualiza nota individualmente
  const handleChangeNota = (
    alunoId: number,
    indiceBimestre: number,
    valor: string
  ) => {
    setNotas((prev) => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        [indiceBimestre]: valor,
      },
    }));
  };

  // 9) Controle da aba ativa (0..3)
  const [abaAtiva, setAbaAtiva] = useState<number>(0);

  // 10) Ao submeter, monta payload e envia para o backend
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMsgSucesso(null);
    setMsgErro(null);

    if (turmaSelecionada === "") {
      setMsgErro("Selecione uma turma antes de cadastrar.");
      return;
    }
    if (alunosDaTurma.length === 0) {
      setMsgErro("Não há alunos para cadastrar notas nesta turma.");
      return;
    }

    // Encontra objeto Turma para obter ID
    const turmaObj = listaTurmasDoProfessor.find((t) => t.nome === turmaSelecionada);
    const turmaIdNum = turmaObj ? turmaObj.id! : null;
    if (turmaIdNum === null) {
      setMsgErro("Turma selecionada inválida.");
      return;
    }

    // Converte abaAtiva (0..3) → bimestre (1..4)
    const bimestreEnviado = abaAtiva + 1;

    // Monta o array NotaDTO (sem incluir matéria, pois o backend atual não a consome)
    const payload: NotaDTO[] = alunosDaTurma.map((a) => ({
      bimestre: bimestreEnviado,
      valor: parseFloat(notas[a.id!][abaAtiva] || "0"),
      turmaId: turmaIdNum,
      alunoId: a.id!,
    }));

    Promise.all(payload.map((n) => notaService.salvar(n)))
      .then(() => {
        setMsgSucesso(`Notas do ${bimestreEnviado}º bimestre cadastradas com sucesso!`);
        return notaService.listarTodas();
      })
      .then((res) => {
        setTodasNotas(res.data || []);
      })
      .catch((erro) => {
        console.error("Erro ao salvar notas:", erro);
        setMsgErro("Ocorreu um erro ao salvar as notas. Tente novamente.");
      });
  };

  return (
    <div>
      <Header title="Lançar Notas" />
      <div className="container">
          <div className="grid-1e1">
            {/* Select de Turma */}
            <Select
              label="Turma"
              name="turma"
              value={turmaSelecionada}
              options={listaTurmasDoProfessor.map((t) => t.nome!)}
              title="a turma"
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setTurmaSelecionada(e.target.value)
              }
              required
            />

            {/* Select de Matéria */}
            <Select
              label="Matéria"
              name="materia"
              value={materiaSelecionada}
              options={materiasFiltradas.map((m) => m.nome!)}
              title="a matéria"
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setMateriaSelecionada(e.target.value)
              }
            />
          </div>


          {/* 2) Abas de bimestres */}
          <div className="abas-bimestres">
            {["1º BIMESTRE", "2º BIMESTRE", "3º BIMESTRE", "4º BIMESTRE"].map(
              (rotulo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAbaAtiva(idx)}
                  className={abaAtiva === idx ? "aba-ativa" : ""}
                >
                  {rotulo}
                </button>
              )
            )}
          </div>

          {/* 3) Tabela de Alunos + Nota */}
          <form onSubmit={handleSubmit}>
            <div className="table-notas-wrapper">
              <div className="cabecalho-notas">
                <span>ALUNOS</span>
                <span>NOTA</span>
              </div>

              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {alunosDaTurma.length === 0 ? (
                  <div className="sem-alunos">
                    {turmaSelecionada === ""
                      ? "Selecione uma turma acima."
                      : "Nenhum aluno cadastrado nesta turma."}
                  </div>
                ) : (
                  alunosDaTurma.map((aluno) => (
                    <div key={aluno.id} className="linha-nota">
                      <span>{aluno.nome}</span>
                      <span>
                        <Input
                          type="text"
                          placeholder="0.0"
                          value={notas[aluno.id!]?.[abaAtiva] || ""}
                          onChange={(e) =>
                            handleChangeNota(aluno.id!, abaAtiva, e.target.value)
                          }
                          label=""
                        />
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 4) Botões “Voltar” e “Cadastrar” */}
            <div className="buttons">
              <button type="button" onClick={() => window.history.back()} className="btn-voltar">
                VOLTAR
              </button>
              <button
                type="submit"
                disabled={turmaSelecionada === "" || alunosDaTurma.length === 0}
                className="btn-cadastrar"
              >
                CADASTRAR
              </button>
            </div>
          </form>
          <div className="avisos">
            {msgSucesso && <div className="msg-sucesso">{msgSucesso}</div>}
            {msgErro && <div className="msg-erro">{msgErro}</div>}
          </div>
          </div>
    </div>
  );
};

export default LancarNotas;
