import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/cadastro.css";
import Header from "../../components/header/header";
import Input from "../../components/input/input";
import Select from "../../components/select/select";
import TurmaService from "../../app/service/turmaService";
import MateriaService from "../../app/service/materiaService";
import ProvaService from "../../app/service/provaService";
import type { TurmaDTO, MateriaDTO, ProvaDTO } from "../../app/service/type";
import ReactLoading from "react-loading";

const CadastroProva: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const turmaService = new TurmaService();
  const materiaService = new MateriaService();
  const provaService = new ProvaService();
  const professorId = Number(localStorage.getItem("id")!);

  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const [materias, setMaterias] = useState<MateriaDTO[]>([]);
  const [form, setForm] = useState({
    nome: "",
    bimestre: "",
    turmaNome: "",
    materiaNome: "",
    dataProva: "",
    nota: ""
  });
  const [msgSucesso, setMsgSucesso] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);
  const [msgCampoVazio, setMsgCampoVazio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // carrega turmas e matérias (filtra apenas matérias do professor)
  useEffect(() => {
    Promise.all([turmaService.listarTodos(), materiaService.listarTodos()])
      .then(([resTur, resMat]) => {
        setTurmas(resTur.data);
        const materiasDoProfessor = resMat.data.filter((m: MateriaDTO) => m.professorId === professorId);
        setMaterias(materiasDoProfessor);
      })
      .catch(err => console.error("Erro ao carregar turmas/matérias:", err));
  }, []);

  // se existe id, busca prova e popula o formulário
  useEffect(() => {
    if (!id || turmas.length === 0 || materias.length === 0) return;
    provaService.buscarPorId(Number(id))
      .then(res => {
        const p = res.data as ProvaDTO;
        const turma = turmas.find(t => t.id === p.turmaId);
        const materia = materias.find(m => m.id === p.materiaId);
        setForm({
          nome: p.nome || "",
          bimestre: p.bimestre.toString(),
          turmaNome: turma?.nome || "",
          materiaNome: materia?.nome || "",
          dataProva: p.data || "",
          nota: p.nota?.toString() || ""
        });
      })
      .catch(err => console.error("Erro ao carregar prova:", err));
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    const campos = [
      form.nome,
      form.bimestre,
      form.turmaNome,
      form.materiaNome,
      form.dataProva,
      form.nota
    ];
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

    const payload: ProvaDTO = {
      id: id ? Number(id) : undefined,
      nome: form.nome,
      bimestre: parseInt(form.bimestre, 10),
      data: form.dataProva,
      nota: parseFloat(form.nota),
      professorId,
      materiaId: materiaSel.id!,
      turmaId: turmaSel.id!
    };

    try {
      if (id) {
        await provaService.editar(payload);
        setMsgSucesso("Prova atualizada com sucesso!");
      } else {
        await provaService.salvar(payload);
        setMsgSucesso("Prova cadastrada com sucesso!");
      }
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      console.error("Erro ao salvar prova:", err);
      setMsgErro("Erro ao salvar prova. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title={id ? "Editar Prova" : "Cadastro de Prova"} />
      <div className="container relative">
        <form onSubmit={handleSubmit} className="form-cadastro center">
          <h1>INFORMAÇÕES DA PROVA</h1>

          <div className="grid-rep3">
            <Input
              label="Nome da Prova*"
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Digite o nome da prova"
            />
            <Select
              label="Bimestre*"
              name="bimestre"
              value={form.bimestre}
              options={["1", "2", "3", "4"]}
              title="o bimestre"
              onChange={handleChange}
            />
            <Input
              label="Peso da prova*"
              type="number"
              name="nota"
              value={form.nota}
              onChange={handleChange}
              placeholder="Digite o peso da prova"
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
              label="Data da Prova*"
              type="date"
              name="dataProva"
              value={form.dataProva}
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
            <button type="submit" className="btn-cadastrar" disabled={loading}>
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

export default CadastroProva;
