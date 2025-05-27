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
import Input from "../../components/input/input";
import Select from "../../components/select/select";
import "../../styles/home.css";
import CardList from "../../components/cardsList/cardList";

const navItems = [
  { icon: <HomeIcon className="sideBar-icon" />, text: "Início", href: "/homeSecretaria" },
  { icon: <TurmaIcon className="sideBar-icon" />, text: "Turmas", href: "/turmas" },
  { icon: <AlunoIcon className="sideBar-icon" />, text: "Alunos", href: "/alunos" },
  { icon: <ProfesorIcon className="sideBar-icon" />, text: "Professores", href: "/professores" },
  { icon: <MateriaIcon className="sideBar-icon" />, text: "Matérias", href: "/materias" },
];

// somente valores reais, sem "Todos"
const generoOptions = ["Masculino", "Feminino", "Outro"];
const situacaoOptions = ["Ativo", "Inativo", "Trancado"];

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 7;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
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
        &#x276E;
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="pagination-ellipsis">…</span>
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
        &#x276F;
      </button>
    </div>
  );
};

const ListAlunos: React.FC = () => {
  const [alunos, setAlunos] = useState<AlunoDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [generoFilter, setGeneroFilter] = useState("");      // vazio = sem filtro
  const [situacaoFilter, setSituacaoFilter] = useState("");    // vazio = sem filtro
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const navigate = useNavigate();
  const alunoService = new AlunoService();

  useEffect(() => {
    alunoService
      .listarTodos()
      .then(res => setAlunos(res.data))
      .catch(err => console.error("Erro ao buscar alunos:", err));
  }, []);

  const alunosFiltrados = alunos
    .filter(aluno =>
      (aluno.nome ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter(aluno =>
      generoFilter
        ? aluno.genero === generoFilter
        : true
    )
    .filter(aluno =>
      situacaoFilter
        ? aluno.situacaoMatricula === situacaoFilter
        : true
    );

  const totalPages = Math.ceil(alunosFiltrados.length / pageSize);
  const alunosPagina = alunosFiltrados.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  function handleEditar(id?: number) {
    if (id) navigate(`/cadastroAluno/${id}`);
  }

  return (
    <div className="gridTemplate">
      <SideBar buttonText="Sair" navItems={navItems} />

      <div className="home-container">
        <div className="container">
          <div className="grid-rep4">
            <h1 className="listTitle">ALUNOS</h1>

            <Input
              label="Buscar aluno"
              name="search"
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Digite o nome do aluno"
            />
            <Select
              label="Gênero"
              name="generoFilter"
              value={generoFilter}
              onChange={e => {
                setGeneroFilter(e.target.value);
                setPage(1);
              }}
              options={generoOptions}
              title="selecione o gênero"
            />
            <Select
              label="Situação Matrícula"
              name="situacaoFilter"
              value={situacaoFilter}
              onChange={e => {
                setSituacaoFilter(e.target.value);
                setPage(1);
              }}
              options={situacaoOptions}
              title="selecione a situação"
            />
          </div>

          <div className="grid-rep3">
            {alunosPagina.length === 0 ? (
              <p>Nenhum aluno cadastrado.</p>
            ) : (
              alunosPagina.map(aluno => (
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
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListAlunos;
