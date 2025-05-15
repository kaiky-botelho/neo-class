import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import SideBar from "../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../assets/icons/aluno.svg";
import { ReactComponent as ProfesorIcon } from "../assets/icons/professor.svg";
import AlunoService from "../app/service/alunoService";
import type { AlunoDTO } from "../app/service/type";
import "../styles/homeSecretaria.css";

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
  }, []);

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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {alunos.length === 0 && (
              <p>Nenhum aluno cadastrado.</p>
            )}
            {alunos.map((aluno) => (
              <div
                key={aluno.id}
                style={{
                  backgroundColor: "#a4c0e8",
                  borderRadius: "10px",
                  padding: "20px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  color: "#fff",
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "160px"
                }}
              >
                <div style={{ marginBottom: "15px" }}>
                  <p><strong>ALUNO:</strong> <span style={{ fontWeight: "normal" }}>{aluno.nome ?? "N/A"}</span></p>
                  <p><strong>GÊNERO</strong> <span style={{ fontWeight: "normal" }}>{aluno.genero ?? "N/A"}</span></p>
                  <p>
                    <strong>data Matricula:</strong> <span style={{ fontWeight: "normal" }}>{aluno.dataMatricula ?? "N/A"}</span>{" "}
                    | <strong>TURNO</strong> <span style={{ fontWeight: "normal" }}>{aluno.turno ?? "N/A"}</span>
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleEditar(aluno.id)}
                    style={{
                      backgroundColor: "#f39c12",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDeletar(aluno.id)}
                    style={{
                      backgroundColor: "#ff6b6b",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    🗑️ Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAlunos;
