// src/pages/secretaria/cadastroProfessor.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { AxiosResponse } from "axios";
import ProfessorService from "../../app/service/professorService";
import TurmaService from "../../app/service/turmaService";
import type { ProfessorDTO, TurmaDTO } from "../../app/service/type";
import Header from "../../components/header/header";
import Input from "../../components/input/input";
import Select from "../../components/select/select";
import "../../styles/cadastro.css";
import { buscaEnderecoPorCep } from "../../utils/buscaEnderecoPorCep";
import ReactLoading from "react-loading";

const professorService = new ProfessorService();
const turmaService = new TurmaService();

const estadosCivis = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"];
const generos = ["Masculino", "Feminino", "Outro"];
const situacaoContratos = ["Ativo", "Inativo"];

const CadastroProfessor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Inclui campo turmaNome para o select pelo nome
  const [professor, setProfessor] = useState<ProfessorDTO & { turmaNome?: string }>({
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
    situacaoContrato: "",
    emailInstitucional: "",
    senha: "",
    turmaId: undefined,
    turmaNome: "",
  });

  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const [msgSucesso, setMsgSucesso] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);
  const [msgCampoVazio, setMsgCampoVazio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Carrega turmas
  useEffect(() => {
    turmaService
      .listarTodos()
      .then((response: AxiosResponse<TurmaDTO[]>) => setTurmas(response.data))
      .catch((error) => console.error("Erro ao carregar turmas:", error));
  }, []);

  // Carrega dados para edição
  useEffect(() => {
    if (id) {
      professorService
        .buscarPorId(Number(id))
        .then((response: AxiosResponse<ProfessorDTO>) => {
          // Encontra o nome da turma pelo id
          const turmaSelecionada = turmas.find((t) => t.id === response.data.turmaId);
          setProfessor({
            ...response.data,
            turmaNome: turmaSelecionada ? turmaSelecionada.nome : "",
          });
        })
        .catch(() => setMsgErro("Erro ao carregar dados do professor."));
    }
    // Depende das turmas para preencher turmaNome corretamente
  }, [id, turmas]);

  // Gera array só com os nomes das turmas
  const nomesTurmas = turmas
    .filter((t) => t.id !== undefined)
    .map((t) => t.nome);

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
    } else if (name === "turmaNome") {
      // Atualiza o id da turma de acordo com o nome selecionado
      const turmaSelecionada = turmas.find((t) => t.nome === value);
      setProfessor((prev) => ({
        ...prev,
        turmaNome: value,
        turmaId: turmaSelecionada ? turmaSelecionada.id : undefined,
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
    setLoading(true);

    // Exclui o campo turmaNome na validação
    const camposObrigatorios = Object.keys(professor).filter(
      (key) => key !== "id" && key !== "turmaNome"
    );

    const camposPreenchidos = camposObrigatorios.every((key) => {
      const valor = (professor as any)[key];
      if (typeof valor === "string") {
        return valor.trim() !== "";
      }
      return valor !== undefined && valor !== null;
    });

    if (!camposPreenchidos) {
      setMsgCampoVazio(
        "Preencha todos os campos obrigatórios antes de salvar."
      );
      setLoading(false);
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
          situacaoContrato: "",
          emailInstitucional: "",
          senha: "",
          turmaId: undefined,
          turmaNome: "",
        });
      }
      setTimeout(() => {
        navigate(-1); // volta para tela anterior após sucesso
      }, 1000);
    } catch (error) {
      setMsgErro("Erro ao salvar professor.");
      console.error(error);
    } finally {
      setLoading(false);
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
            <Select
              label="SITUAÇÃO DO CONTRATO*"
              name="situacaoContrato"
              value={professor.situacaoContrato ?? ""}
              onChange={handleChange}
              options={situacaoContratos}
              title="a sintuação do contrato"
            />
            <Select
              label="TURMA*"
              name="turmaNome"
              value={professor.turmaNome ?? ""}
              onChange={handleChange}
              options={nomesTurmas}
              title="a turma"
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
              ) : professor.id ? "Atualizar" : "Cadastrar"}
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
