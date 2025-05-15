import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AlunoService from "../app/service/alunoService";
import TurmaService from "../app/service/turmaService";
import type { AlunoDTO } from "../app/service/type";
import Header from "../components/header/header";

const alunoService = new AlunoService();
const turmaService = new TurmaService();

const estadosCivis = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"];
const generos = ["Masculino", "Feminino", "Outro"];
const situacoesMatricula = ["Ativo", "Inativo", "Trancado"];

const ufs = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO"
];

const turnos = ["Manhã", "Tarde", "Noite"];

type TurmaDTO = {
  id: number;
  nome: string;
  serie: string;
  turno: string;
};

const CadastroAlunoCompleto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  useEffect(() => {
    turmaService.listarTodos()
      .then(response => setTurmas(response.data))
      .catch(error => console.error("Erro ao carregar turmas:", error));
  }, []);

  useEffect(() => {
    if (id) {
      alunoService.buscarPorId(Number(id))
        .then(response => {
          const dados = response.data;
          setAluno({
            id: dados.id,
            nome: dados.nome ?? "",
            dataNascimento: dados.dataNascimento ?? "",
            rg: dados.rg ?? "",
            cpf: dados.cpf ?? "",
            estadoCivil: dados.estadoCivil ?? "",
            celular: dados.celular ?? "",
            telefone: dados.telefone ?? "",
            email: dados.email ?? "",
            genero: dados.genero ?? "",
            cep: dados.cep ?? "",
            uf: dados.uf ?? "",
            cidade: dados.cidade ?? "",
            rua: dados.rua ?? "",
            numero: dados.numero ?? "",
            complemento: dados.complemento ?? "",
            bairro: dados.bairro ?? "",
            serie: dados.serie ?? "",
            turno: dados.turno ?? "",
            dataMatricula: dados.dataMatricula ?? "",
            situacaoMatricula: dados.situacaoMatricula ?? "",
            emailInstitucional: dados.emailInstitucional ?? "",
            senha: dados.senha ?? "",
            turmaId: dados.turmaId,
          });
        })
        .catch(() => setMsgErro("Erro ao carregar dados do aluno."));
    }
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    if (name === "turmaId") {
      const turmaSelecionada = turmas.find(t => t.id === Number(value));
      setAluno(prev => ({
        ...prev,
        turmaId: value ? Number(value) : undefined,
        serie: turmaSelecionada ? turmaSelecionada.serie : "",
        turno: turmaSelecionada ? turmaSelecionada.turno : "",
      }));
    } else {
      setAluno(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsgSucesso(null);
    setMsgErro(null);

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
  
  return (
    <>
    <Header title={"CADASTRO ALUNO"} />
    <div style={{
      maxWidth: 900,
      margin: "40px auto",
      padding: 20,
      backgroundColor: "#fff",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      fontFamily: "Arial, sans-serif",
      color: "#333"
    }}>
      <h2 style={{ marginBottom: 24, borderBottom: "2px solid #ccc", paddingBottom: 8 }}>
        {aluno.id ? "Editar Aluno" : "Cadastro de Aluno"}
      </h2>

      <form onSubmit={handleSubmit}>

        {/* Informações Pessoais */}
        <fieldset style={{ border: "none", marginBottom: 20 }}>
          <legend style={{ fontWeight: "bold", marginBottom: 16 }}>Informações Pessoais</legend>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 12 }}>
            <label style={{ display: "flex", flexDirection: "column" }}>
              Nome Completo*
              <input
                type="text"
                name="nome"
                placeholder="Digite o nome completo"
                value={aluno.nome}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column" }}>
              Data de Nascimento*
              <input
                type="date"
                name="dataNascimento"
                value={aluno.dataNascimento || ""}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr", gap: 16, marginBottom: 12 }}>
            <label style={{ display: "flex", flexDirection: "column" }}>
              RG*
              <input
                type="text"
                name="rg"
                placeholder="Digite o RG"
                value={aluno.rg}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              CPF*
              <input
                type="text"
                name="cpf"
                placeholder="Digite o CPF"
                maxLength={11}
                value={aluno.cpf}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Estado Civil*
              <select
                name="estadoCivil"
                value={aluno.estadoCivil}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              >
                <option value="">Selecione</option>
                {estadosCivis.map(ec => <option key={ec} value={ec}>{ec}</option>)}
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Celular*
              <input
                type="tel"
                name="celular"
                placeholder="Digite o celular"
                value={aluno.celular}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <label style={{ display: "flex", flexDirection: "column" }}>
              Telefone
              <input
                type="tel"
                name="telefone"
                placeholder="Digite o telefone"
                value={aluno.telefone}
                onChange={handleChange}
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              E-mail*
              <input
                type="email"
                name="email"
                placeholder="Digite o e-mail"
                value={aluno.email}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", marginBottom: 20 }}>
            Gênero*
            <select
              name="genero"
              value={aluno.genero}
              onChange={handleChange}
              required
              style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            >
              <option value="">Selecione</option>
              {generos.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
        </fieldset>

        {/* Endereço */}
        <fieldset style={{ border: "none", marginBottom: 20 }}>
          <legend style={{ fontWeight: "bold", marginBottom: 16 }}>Endereço</legend>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 12 }}>
            <label style={{ display: "flex", flexDirection: "column" }}>
              CEP*
              <input
                type="text"
                name="cep"
                placeholder="Digite o CEP"
                maxLength={9}
                value={aluno.cep}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              UF*
              <select
                name="uf"
                value={aluno.uf}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              >
                <option value="">Selecione</option>
                {ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Cidade*
              <input
                type="text"
                name="cidade"
                placeholder="Digite a cidade"
                value={aluno.cidade}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Complemento
              <input
                type="text"
                name="complemento"
                placeholder="Digite o complemento"
                value={aluno.complemento}
                onChange={handleChange}
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 16 }}>
            <label style={{ display: "flex", flexDirection: "column" }}>
              Rua*
              <input
                type="text"
                name="rua"
                placeholder="Digite a rua"
                value={aluno.rua}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Número*
              <input
                type="text"
                name="numero"
                placeholder="Digite o número"
                value={aluno.numero}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Bairro*
              <input
                type="text"
                name="bairro"
                placeholder="Digite o bairro"
                value={aluno.bairro}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>
          </div>
        </fieldset>

        {/* Informações Acadêmicas */}
        <fieldset style={{ border: "none", marginBottom: 20 }}>
          <legend style={{ fontWeight: "bold", marginBottom: 16 }}>Informações Acadêmicas</legend>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                      <label style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
            Turma*
            <select
              name="turmaId"
              value={aluno.turmaId ?? ""}
              onChange={handleChange}
              required
              style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            >
              <option value="">Selecione a turma</option>
              {turmas.map(turma => (
                <option key={turma.id} value={turma.id}>
                  {turma.nome}
                </option>
              ))}
            </select>
          </label>
            <label style={{ display: "flex", flexDirection: "column" }}>
              Série*
              <input
                type="text"
                name="serie"
                placeholder="Série"
                value={aluno.serie}
                readOnly
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Turno*
              <select
                name="turno"
                value={aluno.turno}
                disabled
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc", backgroundColor: "#f0f0f0" }}
              >
                <option value="">Selecione</option>
                {turnos.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
            <label style={{ display: "flex", flexDirection: "column" }}>
              Data Matrícula*
              <input
                type="date"
                name="dataMatricula"
                value={aluno.dataMatricula || ""}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Situação Matrícula*
              <select
                name="situacaoMatricula"
                value={aluno.situacaoMatricula}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              >
                <option value="">Selecione</option>
                {situacoesMatricula.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
            Email Institucional*
            <input
              type="email"
              name="emailInstitucional"
              placeholder="Digite o e-mail institucional"
              value={aluno.emailInstitucional}
              onChange={handleChange}
              required
              style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
            Senha*
            <input
              type="password"
              name="senha"
              placeholder="Digite a senha"
              value={aluno.senha}
              onChange={handleChange}
              required
              style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </label>


        </fieldset>

        {/* Botões */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 30 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "#f39c12",
              color: "#fff",
              border: "none",
              padding: "10px 25px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 16,
              minWidth: 120,
            }}
          >
            Voltar
          </button>

          <button
            type="submit"
            style={{
              backgroundColor: "#333",
              color: "#fff",
              border: "none",
              padding: "10px 25px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 16,
              minWidth: 120,
            }}
          >
            {aluno.id ? "Atualizar" : "Cadastrar"}
          </button>
        </div>
      </form>

      {msgSucesso && (
        <p style={{ color: "green", marginTop: 20, textAlign: "center" }}>{msgSucesso}</p>
      )}
      {msgErro && (
        <p style={{ color: "red", marginTop: 20, textAlign: "center" }}>{msgErro}</p>
      )}
    </div>
    </>
  );
};

export default CadastroAlunoCompleto;
