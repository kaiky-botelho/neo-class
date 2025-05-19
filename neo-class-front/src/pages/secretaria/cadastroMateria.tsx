import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const CadastroMateria: React.FC = () => {
    const navigate = useNavigate();

    // O estado agora armazena apenas os nomes selecionados
    const [materia, setMateria] = useState({
        nome: "",
        bimestre: "",
        turmaNome: "",        // nome da turma selecionada
        professorNome: "",    // nome do professor selecionado
    });

    const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
    const [professores, setProfessores] = useState<ProfessorDTO[]>([]);
    const [msgSucesso, setMsgSucesso] = useState<string | null>(null);
    const [msgErro, setMsgErro] = useState<string | null>(null);
    const [msgCampoVazio, setMsgCampoVazio] = useState<string | null>(null);

    useEffect(() => {
        turmaService.listarTodos()
            .then((response) => setTurmas(response.data))
            .catch((error) => console.error("Erro ao buscar turmas:", error));

        professorService.listarTodos()
            .then((response) => setProfessores(response.data))
            .catch((error) => console.error("Erro ao buscar professores:", error));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMateria((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Busca o objeto turma e professor pelo nome selecionado
        const turmaSelecionada = turmas.find((t) => t.nome === materia.turmaNome);
        const professorSelecionado = professores.find((p) => p.nome === materia.professorNome);

        if (
            !materia.nome ||
            !materia.bimestre ||
            !turmaSelecionada ||
            !professorSelecionado
        ) {
            setMsgCampoVazio("Preencha todos os campos obrigatórios.");
            setMsgErro(null);
            setMsgSucesso(null);
            return;
        }

        const dto: MateriaDTO = {
            nome: materia.nome,
            bimestre: Number(materia.bimestre),
            turmaId: turmaSelecionada.id,
            professorId: professorSelecionado.id,
        };

        try {
            await materiaService.salvar(dto);
            setMsgSucesso("Matéria cadastrada com sucesso!");
            setMsgErro(null);
            setMsgCampoVazio(null);
            setTimeout(() => navigate("/aluno/materias"), 1500);
        } catch (err) {
            setMsgErro("Erro ao cadastrar matéria.");
            setMsgSucesso(null);
            setMsgCampoVazio(null);
        }
    };

    return (
        <div>
            <Header title="Cadastro de Matéria" />
            <div className="container relative">
                <form className="form-cadastro center" onSubmit={handleSubmit}>
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
                        <Input
                            label="Bimestre*"
                            name="bimestre"
                            value={materia.bimestre}
                            onChange={handleChange}
                            type="number"
                            placeholder="Digite o bimestre"
                        />
                        <Select
                            label="Turma*"
                            name="turmaNome"
                            value={materia.turmaNome}
                            onChange={handleChange}
                            options={turmas.map((t) => t.nome)}
                            title="Selecione a turma"
                        />
                        <Select
                            label="Professor*"
                            name="professorNome"
                            value={materia.professorNome}
                            onChange={handleChange}
                            options={professores.map((p) => p.nome ?? "").filter((nome) => nome !== "")}
                            title="Selecione o professor"
                        />

                    </div>
                    <div className="buttons">
                        <a href="/#/homeSecretaria" className="btn-voltar">
                            Voltar
                        </a>
                        <button type="submit" className="btn-cadastrar">
                            Cadastrar
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
