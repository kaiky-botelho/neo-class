import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as ProfesorIcon } from "../../assets/icons/professor.svg";
import { ReactComponent as MateriaIcon } from "../../assets/icons/materia.svg";
import "../../styles/home.css";
import TurmaService from "../../app/service/turmaService";
import CardList from "../../components/cardsList/cardList";
import { TurmaDTO } from "../../app/service/type";

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
      icon: <MateriaIcon className="sideBar-icon" />,
      text: "Materias",
      href: "/materias",
    },
];


const ListTurmas: React.FC = () => {
  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const turmaService = new TurmaService();
  const navigate = useNavigate();

  useEffect(() => {
    turmaService
      .listarTodos()
      .then((response) => {
        setTurmas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar turmas:", error);
      });
  });

  function handleEditar(id?: number) {
    if (!id) return;
    navigate(`/cadastroTurma/${id}`);
  }

  function handleDeletar(id?: number) {
    if (id === undefined) return;

    turmaService
      .deletar(id)
      .then(() => {
        setTurmas(turmas.filter((turma) => turma.id !== id));
      })
      .catch((error) => {
        console.error("Erro ao deletar turma:", error);
      });
  }

  return (
    <div className="gridTemplate">
      <div>
        <SideBar buttonText={"Sair"} navItems={navItems} />
      </div>
      <div className="home-container">
        <div className="container">
          <h1>TURMAS</h1>
          <div className="grid-rep3">
            {turmas.length === 0 && <p>nenhuma turma cadastrada.</p>}
            {turmas.map((turma) => (
              <CardList
                key={turma.id}
                data={[
                  { label: "Nome", value: turma.nome },
                  { label: "Série", value: turma.serie },
                  { label: "Turno", value: turma.turno },
                  
                ]}
                onEditar={() => handleEditar(turma.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListTurmas;
