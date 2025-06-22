import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import TurmaService from "../../app/service/turmaService";
import MateriaService from "../../app/service/materiaService";
import AlunoService from "../../app/service/alunoService";
import NotaService from "../../app/service/notaService";
import type { TurmaDTO, MateriaDTO, AlunoDTO, NotaDTO } from "../../app/service/type";
import Select from "../../components/select/select";
import Input from "../../components/input/input";
import Header from "../../components/header/header";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import "../../styles/cadastro.css";

const turmaService = new TurmaService();
const materiaService = new MateriaService();
const alunoService = new AlunoService();
const notaService = new NotaService();

const LancarNotas: React.FC = () => {
  const navigate = useNavigate();
  const rawId = localStorage.getItem("id");
  const professorId = rawId ? Number(rawId) : null;

  const [todasTurmas, setTodasTurmas] = useState<TurmaDTO[]>([]);
  const [todasMaterias, setTodasMaterias] = useState<MateriaDTO[]>([]);
  const [materiasDoProfessor, setMateriasDoProfessor] = useState<MateriaDTO[]>([]);
  const [listaTurmasDoProfessor, setListaTurmasDoProfessor] = useState<TurmaDTO[]>([]);
  const [todosAlunos, setTodosAlunos] = useState<AlunoDTO[]>([]);
  const [todasNotas, setTodasNotas] = useState<NotaDTO[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");
  const [materiaSelecionada, setMateriaSelecionada] = useState<string>("");
  const [materiasFiltradas, setMateriasFiltradas] = useState<MateriaDTO[]>([]);
  const [alunosDaTurma, setAlunosDaTurma] = useState<AlunoDTO[]>([]);
  const [notas, setNotas] = useState<Record<number, Record<number, string>>>({});
  const [abaAtiva, setAbaAtiva] = useState<number>(0);
  const [msgSucesso, setMsgSucesso] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    turmaService.listarTodos().then(r => setTodasTurmas(r.data)).catch(console.error);
    materiaService.listarTodos().then(r => setTodasMaterias(r.data)).catch(console.error);
    alunoService.listarTodos().then(r => setTodosAlunos(r.data)).catch(console.error);
    notaService.listarTodas().then(r => setTodasNotas(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!professorId) return;
    const matProf = todasMaterias.filter(m => m.professorId === professorId);
    setMateriasDoProfessor(matProf);
    const turmaIds = new Set(matProf.map(m => m.turmaId).filter(id => id != null));
    setListaTurmasDoProfessor(todasTurmas.filter(t => t.id != null && turmaIds.has(t.id)));
  }, [professorId, todasMaterias, todasTurmas]);

  useEffect(() => {
    if (!turmaSelecionada) return setAlunosDaTurma([]);
    const turma = listaTurmasDoProfessor.find(t => t.nome === turmaSelecionada);
    setAlunosDaTurma(turma ? todosAlunos.filter(a => a.turmaId === turma.id) : []);
  }, [turmaSelecionada, todosAlunos, listaTurmasDoProfessor]);

  useEffect(() => {
    if (!turmaSelecionada) {
      setMateriasFiltradas([]);
      return;
    }
    const turma = listaTurmasDoProfessor.find(t => t.nome === turmaSelecionada);
    setMateriasFiltradas(turma ? materiasDoProfessor.filter(m => m.turmaId === turma.id) : []);
  }, [turmaSelecionada, materiasDoProfessor, listaTurmasDoProfessor]);

  useEffect(() => {
    if (!turmaSelecionada) return setNotas({});
    const turma = listaTurmasDoProfessor.find(t => t.nome === turmaSelecionada);
    if (!turma) return setNotas({});
    const init: Record<number, Record<number, string>> = {};
    alunosDaTurma.forEach(a => init[a.id!] = {0:"",1:"",2:"",3:""});

    if (!materiaSelecionada) {
      setNotas(init);
      return;
    }

    const materia = materiasFiltradas.find(m => m.nome === materiaSelecionada);
    if (!materia) {
      setNotas(init);
      return;
    }

    todasNotas.forEach(n => {
      if (
        n.turmaId === turma.id &&
        n.materiaId === materia.id &&
        n.alunoId != null &&
        n.bimestre != null
      ) {
        const bi = n.bimestre - 1;
        if (init[n.alunoId] && bi >= 0 && bi < 4) {
          init[n.alunoId][bi] = n.valor?.toString() ?? "";
        }
      }
    });
    setNotas(init);
  }, [turmaSelecionada, materiaSelecionada, alunosDaTurma, todasNotas, listaTurmasDoProfessor, materiasFiltradas]);

  const handleChangeNota = (alunoId: number, bix: number, val: string) => {
    setNotas(prev => ({ ...prev, [alunoId]: { ...prev[alunoId], [bix]: val } }));
  };

  useEffect(() => {
    if (!msgSucesso && !msgErro) return;
    const t = setTimeout(() => {
      setMsgSucesso(null); setMsgErro(null);
      if (msgSucesso) setTimeout(() => navigate(-1), 500);
    }, 1200);
    return () => clearTimeout(t);
  }, [msgSucesso, msgErro, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setMsgSucesso(null); setMsgErro(null); setLoading(true);
    if (!turmaSelecionada) { setMsgErro("Selecione uma turma."); setLoading(false); return; }
    if (!alunosDaTurma.length) { setMsgErro("Sem alunos nesta turma."); setLoading(false); return; }
    const turma = listaTurmasDoProfessor.find(t => t.nome === turmaSelecionada)!;
    const bimestre = abaAtiva + 1;
    const materiaObj = materiasFiltradas.find(m => m.nome === materiaSelecionada);
    if (!materiaObj) { setMsgErro("Selecione uma matéria."); setLoading(false); return; }

    const dtos: NotaDTO[] = alunosDaTurma.map(a => {
      const valorNum = parseFloat(notas[a.id!][abaAtiva] || "0");
      const existente = todasNotas.find(n =>
        n.alunoId === a.id &&
        n.turmaId === turma.id &&
        n.materiaId === materiaObj.id &&
        n.bimestre === bimestre
      );
      return {
        id: existente?.id,
        alunoId: a.id!,
        turmaId: turma.id!,
        materiaId: materiaObj.id!,
        bimestre,
        valor: valorNum
      };
    }).filter(d => d.valor > 0);

    try {
      await Promise.all(dtos.map(dto => dto.id ? notaService.editar(dto) : notaService.salvar(dto)));
      setMsgSucesso(`${bimestre}º bimestre salvo!`);
      const res = await notaService.listarTodas(); setTodasNotas(res.data);
    } catch (e) {
      console.error(e); setMsgErro("Erro ao salvar notas.");
    }
    setLoading(false);
  };

  return (
    <div>
      <Header title="Lançar Notas" />
      <div className="container">
        <div className="grid-1e1">
          <Select label="Turma" name="turma" value={turmaSelecionada}
            options={listaTurmasDoProfessor.map(t => t.nome!)} title="a turma"
            onChange={e => setTurmaSelecionada(e.target.value)} required />
          <Select label="Matéria" name="materia" value={materiaSelecionada}
            options={materiasFiltradas.map(m => m.nome!)} title="a matéria"
            onChange={e => setMateriaSelecionada(e.target.value)} required />
        </div>
        <div className="abas-bimestres">
          {["1º BIMESTRE", "2º BIMESTRE", "3º BIMESTRE", "4º BIMESTRE"].map((r, i) => (
            <button key={i} type="button"
              className={abaAtiva === i ? "aba-ativa" : ""}
              onClick={() => setAbaAtiva(i)}>{r}</button>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="table-notas-wrapper">
            <div className="cabecalho-notas"><span>ALUNOS</span><span>NOTA</span></div>
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {alunosDaTurma.length === 0 ?
                <div className="sem-alunos">{turmaSelecionada ? "Nenhum aluno nesta turma." : "Selecione uma turma."}</div>
                : alunosDaTurma.map(a => (
                  <div key={a.id} className="linha-nota">
                    <span>{a.nome}</span>
                    <span><Input type="text" placeholder="0.0"
                      value={notas[a.id!]?.[abaAtiva] ?? ""}
                      onChange={e => handleChangeNota(a.id!, abaAtiva, e.target.value)} label="" /></span>
                  </div>
                ))}
            </div>
          </div>
          <div className="buttons">
            <button type="button" className="btn-voltar" onClick={() => navigate(-1)} disabled={loading}>VOLTAR</button>
            <button type="submit" className="btn-cadastrar"
              disabled={!turmaSelecionada || alunosDaTurma.length === 0 || loading}>
              {loading ? <ReactLoading type="spin" color="#fff" height={20} width={20} /> : "CADASTRAR"}
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
