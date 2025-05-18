import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { AxiosResponse } from "axios";
import ProfessorService from "../../app/service/professorService";
import TurmaService from "../../app/service/turmaService";
import type { ProfessorDTO, TurmaDTO } from "../../app/service/type";
import Header from "../../components/header/header";
import Input from "../../components/input/input";
import Select from "../../components/select/select";
import "../../styles/cadastro.css";
import { buscaEnderecoPorCep } from "../../utils/buscaEnderecoPorCep";

const professorService = new ProfessorService();
const turmaService = new TurmaService();

const estadosCivis = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"];
const generos = ["Masculino", "Feminino", "Outro"];
const tiposContrato = ["CLT", "Estatutário", "Temporário", "Outro"];
const materiasFixas = [
  "Matemática",
  "Português",
  "História",
  "Geografia",
  "Física",
  "Química",
  "Biologia",
  "Inglês",
  "Espanhol",
  "Artes",
  "Educação Física",
  "Outra",
];

const CadastroProfessor: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [professor, setProfessor] = useState<ProfessorDTO>({
    nome: "",
    dataNascimento: "",
    rg: "",
    cpf: "",
    estadoCivil: "",
    celular: "",
    telefone: "",
    email: "",
    genero: "",
    cep: "",
    uf: "",
    cidade: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    areaFormacao: "",
    dataAdmissao: "",
    tipoContrato: "",
    serie: "",
    materia: "",
    turno: "",
    emailInstitucional: "",
    senha: "",
    turmaId: undefined,
  });

  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const [msgSucesso, setMsgSucesso] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);
  const [msgCampoVazio, setMsgCampoVazio] = useState<string | null>(null);

  useEffect(() => {
    turmaService
      .listarTodos()
      .then((response: AxiosResponse<TurmaDTO[]>) => setTurmas(response.data))
      .catch((error) => console.error("Erro ao carregar turmas:", error));
  }, []);

  useEffect(() => {
    if (id) {
      professorService
        .buscarPorId(Number(id))
        .then((response: AxiosResponse<ProfessorDTO>) =>
          setProfessor(response.data)
        )
        .catch(() => setMsgErro("Erro ao carregar dados do professor."));
    }
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setMsgErro(null);
    setMsgSucesso(null);
    setMsgCampoVazio(null);

    const { name, value } = e.target;

    if (name === "cep") {
      setProfessor((prev) => ({ ...prev, cep: value }));
      if (value.replace(/\D/g, "").length === 8) {
        buscaEnderecoPorCep(value).then((endereco) => {
          if (endereco) {
            setProfessor((prev) => ({
              ...prev,
              uf: endereco.uf,
              cidade: endereco.cidade,
              rua: endereco.rua,
              bairro: endereco.bairro,
            }));
          }
        });
      }
    } else if (name === "turmaId") {
      const turmaSelecionada = turmas.find((t) => t.id === Number(value));
      setProfessor((prev) => ({
        ...prev,
        turmaId: value ? Number(value) : undefined,
        serie: turmaSelecionada?.serie ?? "",
        turno: turmaSelecionada?.turno ?? "",
      }));
    } else {
      setProfessor((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsgSucesso(null);
    setMsgErro(null);
    setMsgCampoVazio(null);

// Pega todas as chaves de professor, exceto 'id'
const camposObrigatorios = Object.keys(professor).filter(key => key !== "id");

// Verifica se todos os campos obrigatórios estão preenchidos
const camposPreenchidos = camposObrigatorios.every(key => {
  const valor = (professor as any)[key];
  if (typeof valor === "string") {
    return valor.trim() !== "";
  }
  return valor !== undefined && valor !== null;
});

if (!camposPreenchidos) {
  setMsgCampoVazio("Preencha todos os campos obrigatórios antes de salvar.");
  return;
}


    try {
      if (professor.id) {
        await professorService.editar(professor);
        setMsgSucesso("Professor atualizado com sucesso!");
      } else {
        await professorService.salvar(professor);
        setMsgSucesso("Professor cadastrado com sucesso!");
        setProfessor({
          nome: "",
          dataNascimento: "",
          rg: "",
          cpf: "",
          estadoCivil: "",
          celular: "",
          telefone: "",
          email: "",
          genero: "",
          cep: "",
          uf: "",
          cidade: "",
          rua: "",
          numero: "",
          complemento: "",
          bairro: "",
          areaFormacao: "",
          dataAdmissao: "",
          tipoContrato: "",
          serie: "",
          materia: "",
          turno: "",
          emailInstitucional: "",
          senha: "",
          turmaId: undefined,
        });
      }
    } catch (error) {
      setMsgErro("Erro ao salvar professor.");
      console.error(error);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (msgSucesso) setMsgSucesso(null);
      if (msgErro) setMsgErro(null);
      if (msgCampoVazio) setMsgCampoVazio(null);
    }, 1500);
    return () => clearTimeout(timer);
  }, [msgSucesso, msgErro, msgCampoVazio]);

  return (
    <div>
      <Header
        title={professor.id ? "Editar Professor" : "Cadastro de Professor"}
      />
      <div className="container relative">
        <form className="form-cadastro" onSubmit={handleSubmit}>
          <h1>INFORMAÇÕES PESSOAIS</h1>
          <div className="grid-2e1">
            <Input
              label="NOME COMPLETO*"
              name="nome"
              value={professor.nome ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o nome completo"
            />
            <Input
              label="DATA DE NASCIMENTO*"
              name="dataNascimento"
              value={professor.dataNascimento ?? ""}
              onChange={handleChange}
              type="date"
            />
          </div>
          <div className="grid-1e1">
            <Input
              label="CPF*"
              name="cpf"
              value={professor.cpf ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o CPF"
            />
            <Input
              label="RG*"
              name="rg"
              value={professor.rg ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o RG"
            />
          </div>
          <div className="grid-rep3">
            <Select
              label="ESTADO CIVIL*"
              name="estadoCivil"
              value={professor.estadoCivil ?? ""}
              onChange={handleChange}
              options={estadosCivis}
              title="o estado civil"
            />
            <Input
              label="CELULAR*"
              name="celular"
              value={professor.celular ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o celular"
            />
            <Input
              label="TELEFONE*"
              name="telefone"
              value={professor.telefone ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o telefone"
            />
          </div>
          <div className="grid-2e1">
            <Input
              label="EMAIL*"
              name="email"
              value={professor.email ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o email"
            />
            <Select
              label="GÊNERO*"
              name="genero"
              value={professor.genero ?? ""}
              onChange={handleChange}
              options={generos}
              title="o gênero"
            />
          </div>
          <h1>ENDEREÇO</h1>
          <div className="grid-rep3">
            <Input
              label="CEP*"
              name="cep"
              value={professor.cep ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o CEP"
            />
            <Input
              label="UF*"
              name="uf"
              value={professor.uf ?? ""}
              onChange={handleChange}
              placeholder="Digite a UF"
              type="text"
            />
            <Input
              label="CIDADE*"
              name="cidade"
              value={professor.cidade ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite a cidade"
            />
          </div>
          <div className="grid-2e1">
            <Input
              label="RUA*"
              name="rua"
              value={professor.rua ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite a rua"
            />
            <Input
              label="NÚMERO*"
              name="numero"
              value={professor.numero ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o número"
            />
          </div>
          <div className="grid-1e1">
            <Input
              label="BAIRRO*"
              name="bairro"
              value={professor.bairro ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o bairro"
            />
            <Input
              label="COMPLEMENTO*"
              name="complemento"
              value={professor.complemento ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o complemento"
            />
          </div>
          <h1>INFORMAÇÕES PROFISSIONAIS</h1>
          <div className="grid-rep3">
            <Input
              label="ÁREA DE FORMAÇÃO*"
              name="areaFormacao"
              value={professor.areaFormacao ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Ex: Letras, Matemática..."
            />
            <Input
              label="DATA DE ADMISSÃO*"
              name="dataAdmissao"
              value={professor.dataAdmissao ?? ""}
              onChange={handleChange}
              type="date"
            />
            <Select
              label="TIPO DE CONTRATO*"
              name="tipoContrato"
              value={professor.tipoContrato ?? ""}
              onChange={handleChange}
              options={tiposContrato}
              title="o tipo de contrato"
            />
          </div>
          <div className="grid-2e1">
            <Select
              label="TURMA*"
              name="turmaId"
              value={professor.turmaId?.toString() ?? ""}
              onChange={handleChange}
              options={turmas
                .filter((t) => t.id !== undefined)
                .map((t) => t.id!.toString())}
              title="a turma"
            />
            <Input
              label="SÉRIE*"
              name="serie"
              value={professor.serie ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite a série"
              readonly
            />
          </div>
          <div className="grid-1e1">
            <Input
              label="TURNO*"
              name="turno"
              value={professor.turno ?? ""}
              onChange={handleChange}
              placeholder="Turno do professor"
              type="text"
              readonly
            />
            <Select
              label="MATÉRIA*"
              name="materia"
              value={professor.materia ?? ""}
              onChange={handleChange}
              options={materiasFixas}
              title="a matéria"
            />
          </div>
          <h1>INFORMAÇÕES DE LOGIN</h1>
          <div className="grid-1e1">
            <Input
              label="E-MAIL INSTITUCIONAL*"
              name="emailInstitucional"
              value={professor.emailInstitucional ?? ""}
              onChange={handleChange}
              type="email"
              placeholder="Digite o e-mail"
            />
            <Input
              label="SENHA*"
              name="senha"
              value={professor.senha ?? ""}
              onChange={handleChange}
              type="password"
              placeholder="Digite a senha"
            />
          </div>
          <div className="buttons">
            <a href="/#/homeSecretaria" className="btn-voltar">
              Voltar
            </a>
            <button type="submit" className="btn-cadastrar">
              {professor.id ? "Atualizar" : "Cadastrar"}
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

export default CadastroProfessor;
