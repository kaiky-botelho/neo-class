import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/header";
import Input from "../../components/input/input";
import { TurmaDTO } from "../../app/service/type";
import "../../styles/cadastro.css";
import Select from "../../components/select/select";
import TurmaService from "../../app/service/turmaService";

const turmaService = new TurmaService();

const Turno = ["MANHA", "TARDE", "NOITE"];

const CadastroTurma: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [msgSucesso, setMsgSucesso] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);
  const [msgCampoVazio, setMsgCampoVazio] = useState<string | null>(null);

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

    const camposObrigatorios = Object.keys(turma).filter((key) => key !== "id");

    const camposPreenchidos = camposObrigatorios.every((key) => {
      const valor = (turma as any)[key];
      if (typeof valor === "string") {
        return valor.trim() !== "";
      }
      return valor !== undefined && valor !== null;
    });

    if (!camposPreenchidos) {
      setMsgCampoVazio("Preencha todos os campos obrigatórios.");
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
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
      setMsgErro("Erro ao salvar turma. Tente novamente mais tarde.");
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
      <Header title={turma.id ? "editar Turma" : "Cadastro de Turma"} />

      <div className="container relative">
        <form className="form-cadastro center" onSubmit={handleSubmit}>
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
          <div className="grid-rep4">
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
              label="CAPACIDADE*"
              name="capacidade"
              value={
                turma.capacidade === undefined
                  ? ""
                  : turma.capacidade.toString()
              }
              onChange={handleChange}
              type="number"
              placeholder="Digite a capacidade da turma"
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
            <a href="/#/homeSecretaria" className="btn-voltar">
              Voltar
            </a>
            <button type="submit" className="btn-cadastrar">
              {turma.id ? "Atualizar" : "Cadastrar"}
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
