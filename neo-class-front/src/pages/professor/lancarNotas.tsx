// src/pages/professor/RegistrarNotas.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import TurmaService from "../../app/service/turmaService";
import MateriaService from "../../app/service/materiaService";
import AlunoService from "../../app/service/alunoService";
import NotaService from "../../app/service/notaService";
import type { TurmaDTO, MateriaDTO, AlunoDTO, NotaDTO } from "../../app/service/type";

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
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | "">("");
  const [materiaSelecionada, setMateriaSelecionada] = useState<number | "">("");
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

  // 4) Filtra “turmas do professor” e também “matérias do professor”
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
    const filtrados = todosAlunos.filter(
      (a) => a.turmaId === Number(turmaSelecionada)
    );
    setAlunosDaTurma(filtrados);
  }, [turmaSelecionada, todosAlunos]);

  // 6) Quando mudar “turmaSelecionada” ou “materiasDoProfessor”, filtra “materiasFiltradas”
  useEffect(() => {
    if (turmaSelecionada === "" || materiasDoProfessor.length === 0) {
      setMateriasFiltradas([]);
      setMateriaSelecionada("");
      return;
    }
    const filtradas = materiasDoProfessor.filter(
      (m) => m.turmaId === Number(turmaSelecionada)
    );
    setMateriasFiltradas(filtradas);

    // Se a matéria antes escolhida não existir mais nesta turma, limpa
    if (
      materiaSelecionada !== "" &&
      !filtradas.some((m) => m.id === materiaSelecionada)
    ) {
      setMateriaSelecionada("");
    }
  }, [turmaSelecionada, materiasDoProfessor]);

  // 7) Reconstrói “notas” sempre que mudar turma, alunos ou todasNotas
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
    todasNotas.forEach((n) => {
      if (
        n.turmaId === Number(turmaSelecionada) &&
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
  }, [turmaSelecionada, alunosDaTurma, todasNotas]);

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

    // Converte abaAtiva (0..3) → bimestre (1..4)
    const bimestreEnviado = abaAtiva + 1;

    // Monta o array NotaDTO (sem incluir matéria, pois o backend atual não a consome)
    const payload: NotaDTO[] = alunosDaTurma.map((a) => ({
      bimestre: bimestreEnviado,
      valor: parseFloat(notas[a.id!][abaAtiva] || "0"),
      turmaId: Number(turmaSelecionada),
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
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h2>Registrar Notas</h2>

      {/* Feedback ao usuário */}
      {msgSucesso && (
        <div
          style={{
            margin: "1rem 0",
            padding: "0.75rem",
            backgroundColor: "#D1FAE5",
            color: "#065F46",
            borderRadius: "4px",
          }}
        >
          {msgSucesso}
        </div>
      )}
      {msgErro && (
        <div
          style={{
            margin: "1rem 0",
            padding: "0.75rem",
            backgroundColor: "#FEE2E2",
            color: "#991B1B",
            borderRadius: "4px",
          }}
        >
          {msgErro}
        </div>
      )}

      {/* 1) Dropdown de Turmas + Matérias (lado a lado) */}
      {professorId == null ? (
        <p style={{ color: "red" }}>
          Você precisa fazer login como professor para continuar.
        </p>
      ) : (
        <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", marginBottom: "1rem" }}>
          {/* Select de Turma */}
          <label style={{ display: "flex", flexDirection: "column" }}>
            <span>Turma:</span>
            <select
              value={turmaSelecionada}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setTurmaSelecionada(e.target.value === "" ? "" : Number(e.target.value))
              }
              style={{
                width: "260px",
                height: "36px",
                fontSize: "1rem",
                padding: "0 0.5rem",
              }}
              required
            >
              <option value="">-- Selecione a Turma --</option>
              {listaTurmasDoProfessor.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome} — {t.serie} ({t.anoLetivo})
                </option>
              ))}
            </select>
          </label>

          {/* Select de Matéria */}
          <label style={{ display: "flex", flexDirection: "column" }}>
            <span>Matéria:</span>
            <select
              value={materiaSelecionada}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setMateriaSelecionada(e.target.value === "" ? "" : Number(e.target.value))
              }
              style={{
                width: "260px",
                height: "36px",
                fontSize: "1rem",
                padding: "0 0.5rem",
              }}
            >
              <option value="">-- Selecione a Matéria --</option>
              {materiasFiltradas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* 2) Abas de bimestres */}
      <div style={{ marginBottom: "1rem" }}>
        {["1º BIMESTRE", "2º BIMESTRE", "3º BIMESTRE", "4º BIMESTRE"].map(
          (rotulo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setAbaAtiva(idx)}
              style={{
                marginRight: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: abaAtiva === idx ? "#FFFFFF" : "#F3F4F6",
                border: "1px solid #E5E7EB",
                borderBottom: abaAtiva === idx ? "2px solid #FFFFFF" : undefined,
                cursor: "pointer",
                fontWeight: abaAtiva === idx ? "600" : "400",
              }}
            >
              {rotulo}
            </button>
          )
        )}
      </div>

      {/* 3) Tabela de Alunos + Nota */}
      <form onSubmit={handleSubmit}>
        <div style={{ border: "1px solid #D1D5DB", borderRadius: "6px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "4fr 1fr",
              backgroundColor: "#F9FAFB",
              padding: "0.75rem 1rem",
              fontWeight: 600,
              color: "#374151",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <span>ALUNOS</span>
            <span>NOTA</span>
          </div>

          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {alunosDaTurma.length === 0 ? (
              <div
                style={{
                  padding: "1rem",
                  fontStyle: "italic",
                  color: "#6B7280",
                }}
              >
                {turmaSelecionada === ""
                  ? "Selecione uma turma acima."
                  : "Nenhum aluno cadastrado nesta turma."}
              </div>
            ) : (
              alunosDaTurma.map((aluno) => (
                <div
                  key={aluno.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "4fr 1fr",
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid #E5E7EB",
                    color: "#1F2937",
                  }}
                >
                  <span>{aluno.nome}</span>
                  <span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.0"
                      value={notas[aluno.id!]?.[abaAtiva] || ""}
                      onChange={(e) =>
                        handleChangeNota(aluno.id!, abaAtiva, e.target.value)
                      }
                      style={{
                        width: "80px",
                        height: "32px",
                        padding: "0 0.5rem",
                        textAlign: "center",
                        border: "1px solid #9CA3AF",
                        borderRadius: "4px",
                      }}
                    />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Botões “Voltar” e “Cadastrar” */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <button
            type="button"
            onClick={() => window.history.back()}
            style={{
              marginRight: "0.5rem",
              backgroundColor: "#F59E0B",
              color: "#FFFFFF",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            VOLTAR
          </button>
          <button
            type="submit"
            disabled={turmaSelecionada === "" || alunosDaTurma.length === 0}
            style={{
              backgroundColor:
                turmaSelecionada === "" || alunosDaTurma.length === 0
                  ? "#9CA3AF"
                  : "#374151",
              color: "#FFFFFF",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "6px",
              cursor:
                turmaSelecionada === "" || alunosDaTurma.length === 0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            CADASTRAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default LancarNotas;
