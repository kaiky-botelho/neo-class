import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as ProfesorIcon } from "../../assets/icons/professor.svg";
import { ReactComponent as MateriaIcon } from "../../assets/icons/materia.svg";
import ProfessorService from "../../app/service/professorService";
import type { ProfessorDTO } from "../../app/service/type";
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

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxToShow = 7;
    if (totalPages <= maxToShow) {
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
        aria-label="Anterior"
      >
        &#x276E;
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className="pagination-ellipsis">…</span>
        ) : (
          <button
            key={i}
            className={`pagination-page-button ${p === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(Number(p))}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}
      <button
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Próxima"
      >
        &#x276F;
      </button>
    </div>
  );
};

const ListProfessores: React.FC = () => {
  const [professores, setProfessores] = useState<ProfessorDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const navigate = useNavigate();
  const service = new ProfessorService();

  // carrega a lista completa
  useEffect(() => {
    service
      .listarTodos()
      .then(res => setProfessores(res.data))
      .catch(err => console.error("Erro ao buscar professores:", err));
  }, []);

  const statusOptions = useMemo<string[]>(() => {
    const uniq = new Set<string>();
    professores.forEach(p => p.situacaoContrato && uniq.add(p.situacaoContrato));
    return Array.from(uniq);
  }, [professores]);

  const areaOptions = useMemo<string[]>(() => {
    const uniq = new Set<string>();
    professores.forEach(p => p.areaFormacao && uniq.add(p.areaFormacao));
    return Array.from(uniq);
  }, [professores]);

  // aplica os três filtros + busca
  const filtered = professores
    .filter(p =>
      (p.nome ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter(p =>
      statusFilter
        ? p.situacaoContrato === statusFilter
        : true
    )
    .filter(p =>
      areaFilter
        ? p.areaFormacao === areaFilter
        : true
    );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleEditar = (id?: number) => {
    id && navigate(`/cadastroProfessor/${id}`);
  };

  return (
    <div className="gridTemplate">
      <SideBar buttonText="Sair" navItems={navItems} />

      <div className="home-container">
        <div className="container">
          <div className="grid-rep4">
            <h1 className="listTitle">PROFESSORES</h1>
            <Input
              label="Buscar nome"
              name="search"
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Digite o nome"
            />

            <Select
              label="Situação Contrato"
              name="statusFilter"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              options={statusOptions}
              title="selecione a situação"
            />

            <Select
              label="Área de Formação"
              name="areaFilter"
              value={areaFilter}
              onChange={e => { setAreaFilter(e.target.value); setPage(1); }}
              options={areaOptions}
              title="selecione a área"
            />
          </div>

          {/* lista paginada */}
          <div className="grid-rep3">
            {pageItems.length === 0 ? (
              <p>Nenhum professor encontrado.</p>
            ) : (
              pageItems.map(prof => (
                <CardList
                  key={prof.id}
                  data={[
                    { label: "Nome", value: prof.nome },
                    { label: "Área de Formação", value: prof.areaFormacao },
                    { label: "Situação Contrato", value: prof.situacaoContrato },
                  ]}
                  onEditar={() => handleEditar(prof.id)}
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

export default ListProfessores;
