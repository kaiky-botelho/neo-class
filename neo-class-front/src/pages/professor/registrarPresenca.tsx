// src/pages/professor/RegistrarPresenca.tsx

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import TurmaService from "../../app/service/turmaService";
import MateriaService from "../../app/service/materiaService";
import AlunoService from "../../app/service/alunoService";
import FrequenciaService from "../../app/service/frequenciaService"; // <<-- importe o serviço de frequência
import type {
  TurmaDTO,
  MateriaDTO,
  AlunoDTO,
  FrequenciaDTO,
} from "../../app/service/type";
import Header from "../../components/header/header";
import Input from "../../components/input/input";
import Select from "../../components/select/select";
import "../../styles/registrarPresenca.css";
import "../../styles/cadastro.css";

interface PresencaDTO {
  alunoId: number;
  presente: boolean;
}

const RegistrarPresenca: React.FC = () => {
  // 1) Lê professorId do localStorage
  const rawId = localStorage.getItem("id");
  const professorId: number | null = rawId ? Number(rawId) : null;

  const turmaService = new TurmaService();
  const materiaService = new MateriaService();
  const alunoService = new AlunoService();
  const frequenciaService = new FrequenciaService(); // <<-- instância do serviço

  // 2) Estados iniciais
  const [todasTurmas, setTodasTurmas] = useState<TurmaDTO[]>([]);
  const [todasMaterias, setTodasMaterias] = useState<MateriaDTO[]>([]);
  const [listaTurmasDoProfessor, setListaTurmasDoProfessor] = useState<
    TurmaDTO[]
  >([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");
  const [materiasDoProfessor, setMateriasDoProfessor] = useState<
    MateriaDTO[]
  >([]);
  const [materiasFiltradas, setMateriasFiltradas] = useState<MateriaDTO[]>([]);
  const [materiaSelecionada, setMateriaSelecionada] = useState<string>("");

  const [todosAlunos, setTodosAlunos] = useState<AlunoDTO[]>([]);
  const [alunosDaTurma, setAlunosDaTurma] = useState<AlunoDTO[]>([]);
  const [presencas, setPresencas] = useState<Record<number, boolean>>({});

  // Data da aula: inicial = hoje
  const hoje = new Date().toISOString().slice(0, 10);
  const [dataAula, setDataAula] = useState<string>(hoje);

  // Mensagens de feedback
  const [msgSucesso, setMsgSucesso] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);

  // 3) Carrega turmas, matérias e alunos ao montar
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
  }, []);

  // 4) Filtra turmas e matérias do professor
  useEffect(() => {
    if (professorId == null) {
      setListaTurmasDoProfessor([]);
      setMateriasDoProfessor([]);
      return;
    }
    if (!todasTurmas.length || !todasMaterias.length) return;

    // matérias do professor
    const matProf = todasMaterias.filter((m) => m.professorId === professorId);
    setMateriasDoProfessor(matProf);

    // turmas do professor (pelas matérias)
    const turmaIdsSet = new Set<number>();
    matProf.forEach((m) => {
      if (m.turmaId != null) turmaIdsSet.add(m.turmaId);
    });
    const turmasFiltradas = todasTurmas.filter(
      (t) => t.id != null && turmaIdsSet.has(t.id)
    );
    setListaTurmasDoProfessor(turmasFiltradas);
  }, [professorId, todasTurmas, todasMaterias]);

  // 5) Filtra matérias para a turma selecionada
  useEffect(() => {
    if (!turmaSelecionada || !materiasDoProfessor.length) {
      setMateriasFiltradas([]);
      setMateriaSelecionada("");
      return;
    }
    const turmaObj = listaTurmasDoProfessor.find(
      (t) => t.nome === turmaSelecionada
    );
    if (!turmaObj) {
      setMateriasFiltradas([]);
      setMateriaSelecionada("");
      return;
    }
    const turmaIdNum = turmaObj.id!;
    const filtradas = materiasDoProfessor.filter((m) => m.turmaId === turmaIdNum);
    setMateriasFiltradas(filtradas);

    if (
      materiaSelecionada &&
      !filtradas.some((m) => m.nome === materiaSelecionada)
    ) {
      setMateriaSelecionada("");
    }
  }, [turmaSelecionada, materiasDoProfessor, listaTurmasDoProfessor]);

  // 6) Quando mudar turma ou alunos, filtra alunosDaTurma e inicializa presenças
  useEffect(() => {
    if (!turmaSelecionada || !todosAlunos.length) {
      setAlunosDaTurma([]);
      setPresencas({});
      return;
    }
    const turmaObj = listaTurmasDoProfessor.find(
      (t) => t.nome === turmaSelecionada
    );
    if (!turmaObj) {
      setAlunosDaTurma([]);
      setPresencas({});
      return;
    }
    const turmaIdNum = turmaObj.id!;
    const filtrados = todosAlunos.filter((a) => a.turmaId === turmaIdNum);
    setAlunosDaTurma(filtrados);

    const inicial: Record<number, boolean> = {};
    filtrados.forEach((a) => (inicial[a.id!] = false));
    setPresencas(inicial);
  }, [turmaSelecionada, todosAlunos, listaTurmasDoProfessor]);

  // 7) Limpar mensagem de sucesso/erro após 1s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (msgSucesso) setMsgSucesso(null);
      if (msgErro) setMsgErro(null);
    }, 1000);
    return () => clearTimeout(timer);
  }, [msgSucesso, msgErro]);

  // 8) Atualiza presença individualmente
  const handleTogglePresenca = (alunoId: number) => {
    setPresencas((old) => ({
      ...old,
      [alunoId]: !old[alunoId],
    }));
  };

  // 9) Submeter presença
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!turmaSelecionada) {
      setMsgErro("Selecione uma turma antes de salvar.");
      return;
    }
    if (!materiaSelecionada) {
      setMsgErro("Selecione uma matéria antes de salvar.");
      return;
    }
    if (!alunosDaTurma.length) {
      setMsgErro("Não há alunos para salvar presença nesta turma.");
      return;
    }

    const turmaObj = listaTurmasDoProfessor.find(
      (t) => t.nome === turmaSelecionada
    );
    const turmaIdNum = turmaObj ? turmaObj.id! : null;
    if (turmaIdNum === null) {
      setMsgErro("Turma selecionada inválida.");
      return;
    }

    const materiaObj = materiasFiltradas.find(
      (m) => m.nome === materiaSelecionada
    );
    const materiaIdNum = materiaObj ? materiaObj.id! : null;
    if (materiaIdNum === null) {
      setMsgErro("Matéria selecionada inválida.");
      return;
    }

    // Para cada aluno da turma, cria um FrequenciaDTO e chama o serviço de salvar:
    const promises: Promise<any>[] = alunosDaTurma.map((aluno) => {
      const freqObj: FrequenciaDTO = {
        data: dataAula, // formato ISO: "2025-06-05"
        presente: presencas[aluno.id!] || false,
        alunoId: aluno.id!,
        turmaId: turmaIdNum,
        materiaId: materiaIdNum,
      };
      return frequenciaService
        .salvar(freqObj)
        .catch((err) => {
          console.error(
            `Erro ao salvar frequência do aluno ${aluno.nome}:`,
            err
          );
          throw err;
        });
    });

    try {
      await Promise.all(promises);
      setMsgSucesso("Presenças salvas com sucesso!");
      // Opcional: zerar o estado de checkboxes ou atualizar lista, se necessário
    } catch (error) {
      setMsgErro("Ocorreu um erro ao salvar as presenças.");
    }
  };

  return (
    <div>
      <Header title="Registrar Presença" />

      {msgSucesso && <div className="msg-sucesso">{msgSucesso}</div>}
      {msgErro && <div className="msg-erro">{msgErro}</div>}

      <div className="container">
        {/* 1) Filtros: Turma, Matéria e Data da Aula */}
        <div className="grid-rep3">
          <Select
            label="Turma"
            name="turma"
            options={listaTurmasDoProfessor.map((t) => t.nome!)}
            value={turmaSelecionada}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setTurmaSelecionada(e.target.value)
            }
            title="a turma"
            required
          />

          <Select
            label="Matéria"
            name="materia"
            options={materiasFiltradas.map((m) => m.nome!)}
            value={materiaSelecionada}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setMateriaSelecionada(e.target.value)
            }
            title="a matéria"
            required
          />

          <Input
            type="date"
            value={dataAula}
            onChange={(e) => setDataAula(e.target.value)}
            required
            label="Data"
          />
        </div>

        {/* 2) Tabela de Alunos + Checkboxes */}
        <form onSubmit={handleSubmit} className="form-presenca">
          <div className="table-notas-wrapper">
            <div className="cabecalho-notas">
              <span>ALUNOS</span>
              <span>PRESENÇA</span>
            </div>
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {alunosDaTurma.length === 0 ? (
                <div className="sem-alunos">
                  {turmaSelecionada
                    ? "Nenhum aluno nesta turma."
                    : "Selecione uma turma."}
                </div>
              ) : (
                alunosDaTurma.map((aluno) => (
                  <div key={aluno.id} className="linha-nota">
                    <span>{aluno.nome}</span>
                    <span>
                      <input
                        type="checkbox"
                        checked={presencas[aluno.id!] || false}
                        onChange={() => handleTogglePresenca(aluno.id!)}
                      />
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 3) Botões “Voltar” e “Salvar Presença” */}
          <div className="buttons">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn-voltar"
            >
              VOLTAR
            </button>
            <button
              type="submit"
              disabled={
                !turmaSelecionada ||
                !materiaSelecionada ||
                !alunosDaTurma.length
              }
              className="btn-cadastrar"
            >
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarPresenca;
