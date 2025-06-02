// src/pages/professor/RegistrarPresenca.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "../../styles/registrarPresenca.css";
import Header from "../../components/header/header";
import Select from "../../components/select/select";

interface Aluno {
  id: number;
  nome: string;
}

/**
 * Agora 'turmas' é um array de strings: 
 *   ["1EM", "2EM", "3EM"]
 * Dessa forma, a tipagem bate com 'string[]' que o <Select /> espera.
 */
const turmas: string[] = ["1EM", "2EM", "3EM"];

/**
 * Simulação de fetch de alunos por turma.
 * As chaves do objeto 'base' devem ser exatamente "1EM", "2EM" e "3EM".
 */
const fetchAlunosPorTurma = (turmaValue: string): Promise<Aluno[]> => {
  const base: Record<string, Aluno[]> = {
    "1EM": [
      { id: 1, nome: "MARIANA SILVA" },
      { id: 2, nome: "PAULO SANTOS" },
      { id: 3, nome: "TEREZA DE PAULA" },
      { id: 4, nome: "JOSÉ DE SOUZA" },
      { id: 5, nome: "CARLOS ANDRADE" },
      { id: 6, nome: "ANA GABRIELA MARTINS" },
      { id: 7, nome: "PEDRO MARTINS" },
      { id: 8, nome: "MARINA ANDRADE" },
    ],
    "2EM": [
      { id: 11, nome: "LUCAS ALMEIDA" },
      { id: 12, nome: "RENATA OLIVEIRA" },
    ],
    "3EM": [
      { id: 21, nome: "BRUNO FERREIRA" },
      { id: 22, nome: "LAURA COSTA" },
    ],
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(base[turmaValue] || []);
    }, 200);
  });
};

const RegistrarPresenca: React.FC = () => {
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");
  const [dataAula, setDataAula] = useState<string>("");
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [presencas, setPresencas] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Mostra no console qual valor de turma foi escolhido:
    console.log("Turma selecionada mudou para:", turmaSelecionada);

    if (turmaSelecionada) {
      fetchAlunosPorTurma(turmaSelecionada).then((lista) => {
        console.log("Fetch retornou alunos:", lista);
        setAlunos(lista);

        // Inicializa todos os checkboxes como 'false'
        const inicial: Record<number, boolean> = {};
        lista.forEach((a) => (inicial[a.id] = false));
        setPresencas(inicial);
      });
    } else {
      setAlunos([]);
      setPresencas({});
    }
  }, [turmaSelecionada]);

  const handleTogglePresenca = (alunoId: number) => {
    setPresencas((old) => ({
      ...old,
      [alunoId]: !old[alunoId],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const presencaEnviavel = alunos.map((a) => ({
      alunoId: a.id,
      presente: presencas[a.id] || false,
    }));

    const payload = {
      turma: turmaSelecionada,
      dataAula,
      presencas: presencaEnviavel,
    };

    console.log("Payload de presença:", payload);
    // Aqui você faria: axios.post("/api/presencas", payload)...
  };

  return (
    <div className="wrapper-presenca">
      <Header title="PRESENÇA" />

      <div className="card-presenca">
        <form onSubmit={handleSubmit} className="form-presenca">
          {/* ===== Linha de filtros: TURMA + DATA DA AULA ===== */}
          <div className="filtros-presenca">
            {/* Agora options={turmas} é string[] */}
            <Select
                          options={turmas}
                          value={turmaSelecionada}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setTurmaSelecionada(e.target.value)} label={""} name={""} title={""}            />

            <input
              type="date"
              className="input-data-aula"
              value={dataAula}
              onChange={(e) => setDataAula(e.target.value)}
              placeholder="DATA DA AULA"
              required
            />
          </div>

          {/* ===== Tabela de presenças ===== */}
          <div className="container-tabela-presenca">
            <div className="linha-header">
              <span className="col-aluno">ALUNOS</span>
              <span className="col-presenca">PRESENÇA</span>
            </div>

            <div className="corpo-tabela-presenca">
              {alunos.length > 0 ? (
                alunos.map((aluno) => (
                  <div key={aluno.id} className="linha-aluno">
                    <span className="col-aluno">{aluno.nome}</span>
                    <span className="col-presenca">
                      <input
                        type="checkbox"
                        checked={presencas[aluno.id] || false}
                        onChange={() => handleTogglePresenca(aluno.id)}
                      />
                    </span>
                  </div>
                ))
              ) : (
                <div className="linha-aluno vazio">
                  <span className="sem-alunos">
                    {turmaSelecionada
                      ? "Nenhum aluno nesta turma."
                      : "Selecione uma turma."}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ===== Botão “SALVAR PRESENÇA” ===== */}
          <div className="area-botao-salvar">
            <button type="submit" className="btn-salvar-presenca">
              SALVAR PRESENÇA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarPresenca;
