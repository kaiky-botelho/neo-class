// src/pages/professor/cadastroTrabalho.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/cadastro.css";
import Header from "../../components/header/header";
import Input from "../../components/input/input";
import Select from "../../components/select/select";
import TurmaService from "../../app/service/turmaService";
import MateriaService from "../../app/service/materiaService";
import TrabalhoService from "../../app/service/trabalhoService";
import { TurmaDTO, MateriaDTO, TrabalhoDTO } from "../../app/service/type";
import ReactLoading from "react-loading";

const CadastroTrabalho: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const turmaService = new TurmaService();
  const materiaService = new MateriaService();
  const trabalhoService = new TrabalhoService();
  const professorId = Number(localStorage.getItem("id")!);

  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const [materias, setMaterias] = useState<MateriaDTO[]>([]);
  const [form, setForm] = useState({
    nome: "",
    bimestre: "",
    turmaNome: "",
    materiaNome: "",
    dataEntrega: "",
    nota: ""
  });
  const [msgSucesso, setMsgSucesso] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);
  const [msgCampoVazio, setMsgCampoVazio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([materiaService.listarTodos(), turmaService.listarTodos()])
      .then(([resMat, resTur]) => {
        const matProf = resMat.data.filter(m => m.professorId === professorId);
        setMaterias(matProf);
        const turmaIds = Array.from(new Set(matProf.map(m => m.turmaId!).filter(Boolean)));
        const turProf = resTur.data.filter(t => turmaIds.includes(t.id!));
        setTurmas(turProf);
      })
      .catch(err => console.error("Erro ao carregar dados:", err));
  }, [professorId]);

  useEffect(() => {
    if (id) {
      trabalhoService.buscarPorId(Number(id))
        .then(res => {
          const t = res.data;
          const turma = turmas.find(x => x.id === t.turmaId);
          const materia = materias.find(x => x.id === t.materiaId);
          setForm({
            nome: t.nome || "",
            bimestre: `${t.bimestre}º Bimestre`,
            turmaNome: turma?.nome || "",
            materiaNome: materia?.nome || "",
            dataEntrega: t.data || "",
            nota: t.nota?.toString() || ""
          });
        })
        .catch(err => console.error("Erro ao carregar trabalho:", err));
    }
  }, [id, turmas, materias]);

  useEffect(() => {
    if (msgSucesso || msgErro || msgCampoVazio) {
      const timer = setTimeout(() => {
        setMsgSucesso(null);
        setMsgErro(null);
        setMsgCampoVazio(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [msgSucesso, msgErro, msgCampoVazio]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setMsgErro(null);
    setMsgSucesso(null);
    setMsgCampoVazio(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgErro(null);
    setMsgSucesso(null);
    setMsgCampoVazio(null);
    setLoading(true);

    // validação incluindo nota
    const campos = [form.nome, form.bimestre, form.turmaNome, form.materiaNome, form.dataEntrega, form.nota];
    if (campos.some(c => !c.trim())) {
      setMsgCampoVazio("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    const turmaSel = turmas.find(t => t.nome === form.turmaNome);
    const materiaSel = materias.find(m => m.nome === form.materiaNome);
    if (!turmaSel || !materiaSel) {
      setMsgErro("Selecione turma e matéria válidas.");
      setLoading(false);
      return;
    }

    const payload: TrabalhoDTO = {
      id: id ? Number(id) : undefined,
      nome: form.nome,
      bimestre: Number(form.bimestre.replace("º Bimestre", "")),
      data: form.dataEntrega,
      nota: parseFloat(form.nota),
      turmaId: turmaSel.id!,
      materiaId: materiaSel.id!,
      professorId
    };

    try {
      if (id) {
        await trabalhoService.editar(payload);
        setMsgSucesso("Trabalho atualizado com sucesso!");
      } else {
        await trabalhoService.salvar(payload);
        setMsgSucesso("Trabalho cadastrado com sucesso!");
      }
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      console.error("Erro ao salvar trabalho", err);
      setMsgErro("Erro ao salvar trabalho. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title={id ? "Editar Trabalho" : "Cadastro de Trabalho"} />
      <div className="container relative">
        <form onSubmit={handleSubmit} className="form-cadastro center">
          <h1>INFORMAÇÕES DO TRABALHO</h1>
          <div className="grid-rep3">
            <Input
              label="Nome do Trabalho*"
              type="text"
              name="nome"
              value={form.nome}
              placeholder="Digite o nome do trabalho"
              onChange={handleChange}
            />
            <Select
              label="Bimestre*"
              name="bimestre"
              value={form.bimestre}
              options={["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"]}
              title="o bimestre"
              onChange={handleChange}
            />
            <Input
              label="Peso do Trabalho*"
              type="number"
              name="nota"
              value={form.nota}
              placeholder="Digite o peso do trabalho"
              onChange={handleChange}
            />
          </div>
          <div className="grid-rep3">
            <Select
              label="Turma*"
              name="turmaNome"
              value={form.turmaNome}
              options={turmas.map(t => t.nome)}
              title="a turma"
              onChange={handleChange}
            />
            <Select
              label="Matéria*"
              name="materiaNome"
              value={form.materiaNome}
              options={materias.map(m => m.nome)}
              title="a matéria"
              onChange={handleChange}
            />
            <Input
              label="Data de Entrega*"
              type="date"
              name="dataEntrega"
              value={form.dataEntrega}
              onChange={handleChange}
            />
          </div>
          <div className="buttons">
            <button
              type="button"
              className="btn-voltar"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Voltar
            </button>
            <button
              type="submit"
              className="btn-cadastrar"
              disabled={loading}
            >
              {loading ? (
                <ReactLoading type="spin" color="#fff" height={20} width={20} />
              ) : id ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </form>
        <div className="avisos">
          {msgSucesso && <div className="msg-sucesso">{msgSucesso}</div>}
          {msgErro && <div className="msg-erro">{msgErro}</div>}
          {msgCampoVazio && <div className="msg-vazio">{msgCampoVazio}</div>}
        </div>
      </div>
    </div>
  );
};

export default CadastroTrabalho;
