import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as ProfesorIcon } from "../../assets/icons/professor.svg";
import { ReactComponent as MateriaIcon } from "../../assets/icons/materia.svg";
import AlunoService from "../../app/service/alunoService";
import type { AlunoDTO } from "../../app/service/type";
import "../../styles/home.css";
import CardList from "../../components/cardsList/cardList";

const navItems = [
  { icon: <HomeIcon className="sideBar-icon" />, text: "Início", href: "/homeSecretaria" },
  { icon: <TurmaIcon className="sideBar-icon" />, text: "Turmas", href: "/turmas" },
  { icon: <AlunoIcon className="sideBar-icon" />, text: "Alunos", href: "/alunos" },
  { icon: <ProfesorIcon className="sideBar-icon" />, text: "Professores", href: "/professores" },
  { icon: <MateriaIcon className="sideBar-icon" />, text: "Materias", href: "/materias" },
];

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  // Função para criar o array de páginas com elipses
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7; // 1 ... 3 4 5 ... total
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination-container">
      <button
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        &#x276E; {/* seta esquerda */}
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={idx} className="pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={idx}
            className={`pagination-page-button ${page === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(Number(page))}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
      >
        &#x276F; {/* seta direita */}
      </button>
    </div>
  );
};

const ListAlunos: React.FC = () => {
  const [alunos, setAlunos] = useState<AlunoDTO[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 9; // 9 alunos por página (3x3)
  const navigate = useNavigate();
  const alunoService = new AlunoService();

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

  const totalPages = Math.ceil(alunos.length / pageSize);
  const alunosPagina = alunos.slice((page - 1) * pageSize, page * pageSize);

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
          <h1>ALUNOS</h1>
          <div className="grid-rep3">
            {alunosPagina.length === 0 ? (
              <p>Nenhum aluno cadastrado.</p>
            ) : (
              alunosPagina.map((aluno) => (
                <CardList
                  key={aluno.id}
                  data={[
                    { label: "Nome", value: aluno.nome },
                    { label: "Gênero", value: aluno.genero },
                    { label: "Situação Matrícula", value: aluno.situacaoMatricula },
                    { label: "Data de Matrícula", value: aluno.dataMatricula },
                  ]}
                  onEditar={() => handleEditar(aluno.id)}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListAlunos;
