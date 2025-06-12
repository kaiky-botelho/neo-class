import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header/header";
import Input from "../../components/input/input";
import { TurmaDTO } from "../../app/service/type";
import "../../styles/cadastro.css";
import Select from "../../components/select/select";
import TurmaService from "../../app/service/turmaService";
import ReactLoading from "react-loading";

const turmaService = new TurmaService();
const Turno = ["MANHA", "TARDE", "NOITE"];

const CadastroTurma: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [msgSucesso, setMsgSucesso] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);
  const [msgCampoVazio, setMsgCampoVazio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [turma, setTurma] = useState<TurmaDTO>({
    nome: "",
    anoLetivo: undefined,
    serie: "",
    turno: "",
    capacidade: undefined,
    sala: "",
  });

  useEffect(() => {
    if (id) {
      turmaService
        .buscarPorId(parseInt(id))
        .then((response) => {
          setTurma(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar turma:", error);
        });
    }
  }, [id]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setMsgSucesso(null);
    setMsgErro(null);
    setMsgCampoVazio(null);

    const { name, value } = event.target;
    setTurma((prevState) => ({
      ...prevState,
      [name]:
        name === "anoLetivo" || name === "capacidade"
          ? parseInt(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsgSucesso(null);
    setMsgErro(null);
    setMsgCampoVazio(null);
    setLoading(true);

    // Somente os campos obrigatórios!
    const camposObrigatorios = ["nome", "anoLetivo", "serie", "turno", "sala"];

    const camposPreenchidos = camposObrigatorios.every((key) => {
      const valor = (turma as any)[key];
      if (typeof valor === "string") {
        return valor.trim() !== "";
      }
      return valor !== undefined && valor !== null;
    });

    if (!camposPreenchidos) {
      setMsgCampoVazio("Preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      if (turma.id) {
        await turmaService.editar(turma);
        setMsgSucesso("Turma editada com sucesso!");
      } else {
        await turmaService.salvar(turma);
        setMsgSucesso("Turma cadastrada com sucesso!");
      }
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
      setMsgErro("Erro ao salvar turma. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
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
      <Header title={turma.id ? "Editar Turma" : "Cadastro de Turma"} />

      <div className="container relative">
        <form className="form-cadastro center" onSubmit={handleSubmit}>
          <h1>INFORMAÇÕES DA TURMA</h1>
          <div className="grid-2e1">
            <Input
              label="NOME DA TURMA*"
              name="nome"
              value={turma.nome}
              onChange={handleChange}
              type="text"
              placeholder="Digite o nome da turma"
            />
            <Input
              label="ANO LETIVO*"
              name="anoLetivo"
              value={
                turma.anoLetivo === undefined
                  ? ""
                  : turma.anoLetivo.toString()
              }
              onChange={handleChange}
              type="number"
              placeholder="Digite o ano letivo"
            />
          </div>
          <div className="grid-rep3">
            <Input
              label="SÉRIE*"
              name="serie"
              value={turma.serie}
              onChange={handleChange}
              type="text"
              placeholder="Digite a série"
            />
            <Select
              label="TURNO*"
              name="turno"
              value={turma.turno}
              onChange={handleChange}
              options={Turno}
              title={"o Turno"}
            />
            <Input
              label="SALA*"
              name="sala"
              value={turma.sala}
              onChange={handleChange}
              type="text"
              placeholder="Digite a sala"
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
              ) : turma.id ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </form>
        <div className="avisos">
          {msgSucesso && <div className="msg-sucesso">{msgSucesso}</div>}
          {msgErro && <div className="msg-erro"><p>{msgErro}</p></div>}
          {msgCampoVazio && <div className="msg-vazio">{msgCampoVazio}</div>}
        </div>
      </div>
    </div>
  );
};

export default CadastroTurma;
