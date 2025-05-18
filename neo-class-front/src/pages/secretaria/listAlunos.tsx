import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as ProfesorIcon } from "../../assets/icons/professor.svg";
import AlunoService from "../../app/service/alunoService";
import type { AlunoDTO } from "../../app/service/type";
import "../../styles/home.css";
import CardList from "../../components/cardsList/cardList"; // ajuste o caminho se necessário

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
];

const ListAlunos: React.FC = () => {
  const [alunos, setAlunos] = useState<AlunoDTO[]>([]);
  const alunoService = new AlunoService();
  const navigate = useNavigate();

  useEffect(() => {
    alunoService
      .listarTodos()
      .then((response) => {
        setAlunos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar alunos:", error);
      });
  }, );

  function handleEditar(id?: number) {
    if (!id) return;
    navigate(`/cadastroAluno/${id}`);
  }

  function handleDeletar(id?: number) {
    if (!id) return;
    if (window.confirm("Tem certeza que deseja deletar este aluno?")) {
      alunoService
        .deletar(id)
        .then(() => {
          setAlunos((prevAlunos) => prevAlunos.filter((aluno) => aluno.id !== id));
          alert("Aluno deletado com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao deletar aluno:", error);
          alert("Erro ao deletar aluno.");
        });
    }
  }

  return (
    <div className="gridTemplate">
      <div>
        <SideBar buttonText={"Sair"} navItems={navItems} />
      </div>
      <div className="home-container">
        <div className="container">
          <h1>ALUNO</h1>
          <div className="grid-rep3" >
            {alunos.length === 0 && (
              <p>Nenhum aluno cadastrado.</p>
            )}
            {alunos.map((aluno) => (
              <CardList
                key={aluno.id}
                data={[
                  { label: "Nome", value: aluno.nome },
                  { label: "Gênero", value: aluno.genero },
                  { label: "Situação Matrícula", value: aluno.situacaoMatricula },
                  { label: "Turno", value: aluno.turno },
                ]}
                onEditar={() => handleEditar(aluno.id)}
                onDeletar={() => handleDeletar(aluno.id)}
                />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAlunos;
