import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as ProfesorIcon } from "../../assets/icons/professor.svg";
import "../../styles/home.css";
import CardList from "../../components/cardsList/cardList";
import ProfessorService from "../../app/service/professorService";
import type { ProfessorDTO } from "../../app/service/type";

const navItems = [
  {
    icon: <HomeIcon className="sideBar-icon" />,
    text: "Início",
    href: "/homeSecretaria",
  },
  {
    icon: <TurmaIcon className="sideBar-icon" />,
    text: "Turmas",
    href: "/turmas",
  },
  {
    icon: <AlunoIcon className="sideBar-icon" />,
    text: "Alunos",
    href: "/alunos",
  },
  {
    icon: <ProfesorIcon className="sideBar-icon" />,
    text: "Professores",
    href: "/professores",
  },
    {
      icon: <ProfesorIcon className="sideBar-icon" />,
      text: "Materias",
      href: "/materias",
    },
];

const ListProfessores: React.FC = () => {
  const [professores, setProfessores] = useState<ProfessorDTO[]>([]);
  const professorService = new ProfessorService();
  const navigate = useNavigate();

  useEffect(() => {
    professorService
      .listarTodos()
      .then((response) => {
        setProfessores(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar professores:", error);
      });
  },);

  function handleEditar(id?: number) {
    if (!id) return;
    navigate(`/cadastroProfessor/${id}`);
  }

  function handleDeletar(id?: number) {
    if (!id) return;
    professorService
      .deletar(id)
      .then(() => {
        setProfessores((prevProfessores) =>
          prevProfessores.filter((professor) => professor.id !== id)
        );
      })
      .catch((error) => {
        console.error("Erro ao deletar professor:", error);
      });
  }

  return (
    <div className="gridTemplate">
      <div>
        <SideBar buttonText="Sair" navItems={navItems} />
      </div>
      <div className="home-container">
        <div className="container">
          <h1>PROFESSORES</h1>
          
          <div className="grid-rep3">
            {professores.length === 0 && (
              <p>Nenhum professor cadastrado</p>
            )}
            {professores.map((professor) => (
              <CardList
                key={professor.id}
                data={[
                  { label: "Nome", value: professor.nome },
                  { label: "Data de Admissão", value: professor.dataAdmissao },
                  { label: "Tipo de Contrato", value: professor.tipoContrato },
                  { label: "Área de Formação", value: professor.areaFormacao },
                ]}
                onEditar={() => handleEditar(professor.id)}
                onDeletar={() => handleDeletar(professor.id)}
              />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListProfessores;