import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/input/input";
import Select from "../../components/select/select";
import Header from "../../components/header/header";
import MateriaService from "../../app/service/materiaService";
import TurmaService from "../../app/service/turmaService";
import ProfessorService from "../../app/service/professorService";
import { MateriaDTO, TurmaDTO, ProfessorDTO } from "../../app/service/type";
import "../../styles/cadastro.css";

const materiaService = new MateriaService();
const turmaService = new TurmaService();
const professorService = new ProfessorService();

const bimestres = [ "1", "2", "3", "4" ];

interface FormState {
  id?: number;
  nome: string;
  bimestre: string;
  turmaNome: string;
  professorNome: string;
}

const CadastroMateria: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [materia, setMateria] = useState<FormState>({
    nome: "",
    bimestre: "",
    turmaNome: "",
    professorNome: "",
  });
  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const [professores, setProfessores] = useState<ProfessorDTO[]>([]);
  const [msgSucesso, setMsgSucesso] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);
  const [msgCampoVazio, setMsgCampoVazio] = useState<string | null>(null);

  // Carrega listas de turmas e professores
  useEffect(() => {
    turmaService.listarTodos()
      .then(res => setTurmas(res.data))
      .catch(err => console.error("Erro ao buscar turmas:", err));
    professorService.listarTodos()
      .then(res => setProfessores(res.data))
      .catch(err => console.error("Erro ao buscar professores:", err));
  }, []);

  // Se em modo edição, busca matéria existente
  useEffect(() => {
    if (id) {
      materiaService.buscarPorId(parseInt(id))
        .then(response => {
          const data: MateriaDTO = response.data;
          setMateria({
            id: data.id,
            nome: data.nome,
            bimestre: data.bimestre.toString(),
            turmaNome: turmas.find(t => t.id === data.turmaId)?.nome || "",
            professorNome: professores.find(p => p.id === data.professorId)?.nome || "",
          });
        })
        .catch(err => console.error("Erro ao buscar matéria:", err));
    }
  }, [id, turmas, professores]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMateria(prev => ({ ...prev, [name]: value }));
    setMsgSucesso(null);
    setMsgErro(null);
    setMsgCampoVazio(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validação
    const turmaSel = turmas.find(t => t.nome === materia.turmaNome);
    const profSel = professores.find(p => p.nome === materia.professorNome);
    if (!materia.nome || !materia.bimestre || !turmaSel || !profSel) {
      setMsgCampoVazio("Preencha todos os campos obrigatórios.");
      return;
    }
    const dto: MateriaDTO = {
      id: materia.id,
      nome: materia.nome,
      bimestre: Number(materia.bimestre),
      turmaId: turmaSel.id,
      professorId: profSel.id,
    };
    try {
      if (dto.id) {
        await materiaService.editar(dto);
        setMsgSucesso("Matéria editada com sucesso!");
      } else {
        await materiaService.salvar(dto);
        setMsgSucesso("Matéria cadastrada com sucesso!");
      }
      setMsgErro(null);
      setMsgCampoVazio(null);
      // Redireciona após sucesso
      setTimeout(() => navigate("/materias"), 1500);
    } catch (err) {
      console.error(err);
      setMsgErro("Erro ao salvar matéria. Tente novamente mais tarde.");
      setMsgSucesso(null);
    }
  };

  // Limpa mensagens após tempo
  useEffect(() => {
    const timer = setTimeout(() => {
      setMsgSucesso(null);
      setMsgErro(null);
      setMsgCampoVazio(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [msgSucesso, msgErro, msgCampoVazio]);

  return (
    <div>
      <Header title={materia.id ? "Editar Matéria" : "Cadastro de Matéria"} />
      <div className="container relative">
        <form className="form-cadastro center" onSubmit={handleSubmit}>
          <h1>INFORMAÇÕES DA MATÉRIA</h1>
          <div className="grid-1">
            <Input
              label="Nome da Matéria*"
              name="nome"
              value={materia.nome}
              onChange={handleChange}
              type="text"
              placeholder="Digite o nome da matéria"
            />
          </div>
          <div className="grid-rep3">
            <Select
              label="Bimestre*"
              name="bimestre"
              value={materia.bimestre}
              onChange={handleChange}
              options={bimestres}
              title=" o bimestre"
            />
            <Select
              label="Turma*"
              name="turmaNome"
              value={materia.turmaNome}
              onChange={handleChange}
              options={turmas.map(t => t.nome)}
              title=" a turma"
            />
            <Select
              label="Professor*"
              name="professorNome"
              value={materia.professorNome}
              onChange={handleChange}
              options={professores.map(p => p.nome ?? "").filter(n => n)}
              title="Selecione o professor"
            />
          </div>
          <div className="buttons">
            <a href="/#/homeSecretaria" className="btn-voltar">Voltar</a>
            <button type="submit" className="btn-cadastrar">
              {materia.id ? "Atualizar" : "Cadastrar"}
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

export default CadastroMateria;
