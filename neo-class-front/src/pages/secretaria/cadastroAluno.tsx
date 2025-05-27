import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AlunoService from "../../app/service/alunoService";
import TurmaService from "../../app/service/turmaService";
import type { AlunoDTO } from "../../app/service/type";
import Header from "../../components/header/header";
import Input from "../../components/input/input";
import "../../styles/cadastro.css";
import Select from "../../components/select/select";
import { buscaEnderecoPorCep } from "../../utils/buscaEnderecoPorCep";
import type { TurmaDTO } from "../../app/service/type";

const alunoService = new AlunoService();
const turmaService = new TurmaService();

const estadosCivis = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"];
const generos = ["Masculino", "Feminino", "Outro"];
const situacoesMatricula = ["Ativo", "Inativo", "Trancado"];



const CadastroAluno: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [aluno, setAluno] = useState<AlunoDTO>({
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
    serie: "",
    turno: "",
    dataMatricula: "",
    situacaoMatricula: "",
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
      .then((response) => setTurmas(response.data))
      .catch((error) => console.error("Erro ao carregar turmas:", error));
  }, []);

  useEffect(() => {
    if (id) {
      alunoService
        .buscarPorId(Number(id))
        .then((response) => setAluno(response.data))
        .catch(() => setMsgErro("Erro ao carregar dados do aluno."));
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
      setAluno((prev) => ({ ...prev, cep: value }));
      if (value.replace(/\D/g, "").length === 8) {
        buscaEnderecoPorCep(value).then((endereco) => {
          if (endereco) {
            setAluno((prev) => ({
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
      setAluno((prev) => ({
        ...prev,
        turmaId: value ? Number(value) : undefined,
        serie: turmaSelecionada?.serie ?? "",
        turno: turmaSelecionada?.turno ?? "",
      }));
    } else {
      setAluno((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsgSucesso(null);
    setMsgErro(null);
    setMsgCampoVazio(null);

const camposObrigatorios = Object.keys(aluno).filter(key => key !== "id");

// Verifica se todos os campos obrigatórios estão preenchidos
const camposPreenchidos = camposObrigatorios.every(key => {
  const valor = (aluno as any)[key];
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
      if (aluno.id) {
        await alunoService.editar(aluno);
        setMsgSucesso("Aluno atualizado com sucesso!");
      } else {
        await alunoService.salvar(aluno);
        setMsgSucesso("Aluno cadastrado com sucesso!");
        setAluno({
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
          serie: "",
          turno: "",
          dataMatricula: "",
          situacaoMatricula: "",
          emailInstitucional: "",
          senha: "",
          turmaId: undefined,
        });
      }
    } catch (error) {
      setMsgErro("Erro ao salvar aluno.");
      console.error(error);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (msgSucesso) setMsgSucesso(null);
      if (msgErro) setMsgErro(null);
      if (msgCampoVazio) setMsgCampoVazio(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [msgSucesso, msgErro, msgCampoVazio]);

  return (
    <div>
      <Header title={aluno.id ? "Editar Aluno" : "Cadastro de Aluno"} />
      <div className="container relative">
        <form className="form-cadastro" onSubmit={handleSubmit}>
          <h1>INFORMAÇÕES PESSOAIS</h1>
          <div className="grid-2e1">
            <Input
              label="NOME COMPLETO*"
              name="nome"
              value={aluno.nome ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o nome completo"
            />
            <Input
              label="DATA DE NASCIMENTO*"
              name="dataNascimento"
              value={aluno.dataNascimento ?? ""}
              onChange={handleChange}
              type="date"
            />
          </div>
          <div className="grid-1e1">
            <Input
              label="CPF*"
              name="cpf"
              value={aluno.cpf ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o CPF"
            />
            <Input
              label="RG*"
              name="rg"
              value={aluno.rg ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o RG"
            />
          </div>
          <div className="grid-rep3">
            <Select
              label="ESTADO CIVIL*"
              name="estadoCivil"
              value={aluno.estadoCivil ?? ""}
              onChange={handleChange}
              options={estadosCivis}
              title="o estado civil"
            />
            <Input
              label="CELULAR*"
              name="celular"
              value={aluno.celular ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o celular"
            />
            <Input
              label="TELEFONE*"
              name="telefone"
              value={aluno.telefone ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o telefone"
            />
          </div>
          <div className="grid-2e1">
            <Input
              label="EMAIL*"
              name="email"
              value={aluno.email ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o email"
            />
            <Select
              label="GÊNERO*"
              name="genero"
              value={aluno.genero ?? ""}
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
              value={aluno.cep ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o CEP"
            />
            <Input
              label="UF*"
              name="uf"
              value={aluno.uf ?? ""}
              onChange={handleChange}
              placeholder="Digite a UF"
              type="text"
            />
            <Input
              label="CIDADE*"
              name="cidade"
              value={aluno.cidade ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite a cidade"
            />
          </div>
          <div className="grid-2e1">
            <Input
              label="RUA*"
              name="rua"
              value={aluno.rua ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite a rua"
            />
            <Input
              label="NÚMERO*"
              name="numero"
              value={aluno.numero ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o número"
            />
          </div>
          <div className="grid-1e1">
            <Input
              label="BAIRRO*"
              name="bairro"
              value={aluno.bairro ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o bairro"
            />
            <Input
              label="COMPLEMENTO*"
              name="complemento"
              value={aluno.complemento ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite o complemento"
            />
          </div>

          <h1>INFORMAÇÕES ACADÊMICAS</h1>
          <div className="grid-rep3">
            <Select
              label="TURMA*"
              name="turmaId"
              value={aluno.turmaId?.toString() ?? ""}
              onChange={handleChange}
              options={turmas
                .filter((t) => t.id !== undefined)
                .map((t) => t.id!.toString())}
              title="a turma"
            />
            <Input
              label="SÉRIE*"
              name="serie"
              value={aluno.serie ?? ""}
              onChange={handleChange}
              type="text"
              placeholder="Digite a série"
              readonly
            />
            <Input
              label="TURNO*"
              name="turno"
              value={aluno.turno ?? ""}
              onChange={handleChange}
              placeholder="Turno do Aluno"
              readonly
              type="text"
            />
          </div>
          <div className="grid-1e1">
            <Input
              label="DATA DE MATRÍCULA*"
              name="dataMatricula"
              value={aluno.dataMatricula ?? ""}
              onChange={handleChange}
              type="date"
            />
            <Select
              label="SITUAÇÃO DA MATRÍCULA*"
              name="situacaoMatricula"
              value={aluno.situacaoMatricula ?? ""}
              onChange={handleChange}
              options={situacoesMatricula}
              title="a situação"
            />
          </div>

          <h1>INFORMAÇÕES DE LOGIN</h1>
          <div className="grid-1e1">
            <Input
              label="E-MAIL INSTITUCIONAL*"
              name="emailInstitucional"
              value={aluno.emailInstitucional ?? ""}
              onChange={handleChange}
              type="email"
              placeholder="Digite o e-mail"
            />
            <Input
              label="SENHA*"
              name="senha"
              value={aluno.senha ?? ""}
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
              {aluno.id ? "Atualizar" : "Cadastrar"}
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

export default CadastroAluno;
