import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as ProfesorIcon } from "../../assets/icons/professor.svg";
import MateriaService from "../../app/service/materiaService";
import ProfessorService from "../../app/service/professorService";
import TurmaService from "../../app/service/turmaService";
import type { MateriaDTO, ProfessorDTO, TurmaDTO } from "../../app/service/type";
import "../../styles/home.css";
import CardList from "../../components/cardsList/cardList";

const navItems = [
  { icon: <HomeIcon className="sideBar-icon" />, text: "Início", href: "/homeSecretaria" },
  { icon: <TurmaIcon className="sideBar-icon" />, text: "Turmas", href: "/turmas" },
  { icon: <AlunoIcon className="sideBar-icon" />, text: "Alunos", href: "/alunos" },
  { icon: <ProfesorIcon className="sideBar-icon" />, text: "Professores", href: "/professores" },
  { icon: <ProfesorIcon className="sideBar-icon" />, text: "Matérias", href: "/materias" },
];

const ListMateria: React.FC = () => {
  const [materias, setMaterias] = useState<MateriaDTO[]>([]);
  const [professores, setProfessores] = useState<ProfessorDTO[]>([]);
  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);

  const materiaService = new MateriaService();
  const professorService = new ProfessorService();
  const turmaService = new TurmaService();
  const navigate = useNavigate();

  useEffect(() => {
    materiaService.listarTodos()
      .then(response => setMaterias(response.data))
      .catch(error => console.error("Erro ao buscar matérias:", error));

    professorService.listarTodos()
      .then(response => setProfessores(response.data))
      .catch(error => console.error("Erro ao buscar professores:", error));

    turmaService.listarTodos()
      .then(response => setTurmas(response.data))
      .catch(error => console.error("Erro ao buscar turmas:", error));
  }, []);

  function handleEditar(id?: number) {
    if (!id) return;
    navigate(`/cadastroMateria/${id}`);
  }

  function handleDeletar(id?: number) {
    if (!id) return;
    materiaService.deletar(id)
      .then(() => setMaterias(prev => prev.filter(m => m.id !== id)))
      .catch(error => console.error("Erro ao deletar matéria:", error));
  }

  return (
    <div className="gridTemplate">
      <div>
        <SideBar buttonText={"Sair"} navItems={navItems} />
      </div>
      <div className="home-container">
        <div className="container">
          <h1>MATÉRIAS</h1>
          <div className="grid-rep3">
            {materias.length === 0 && <p>Nenhuma matéria cadastrada</p>}

            {materias.map(materia => {
              const prof = professores.find(p => p.id === materia.professorId);
              const turm = turmas.find(t => t.id === materia.turmaId);
              return (
                <CardList
                  key={materia.id}
                  data={[
                    { label: "Nome",      value: materia.nome },
                    { label: "Bimestre",  value: materia.bimestre },
                    { label: "Professor", value: prof?.nome  ?? "—" },
                    { label: "Turma",     value: turm?.nome  ?? "—" },
                  ]}
                  onEditar={() => handleEditar(materia.id)}
                  onDeletar={() => handleDeletar(materia.id)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListMateria;
