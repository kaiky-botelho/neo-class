import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as ProfesorIcon } from "../../assets/icons/professor.svg";
import { ReactComponent as MateriaIcon } from "../../assets/icons/materia.svg";
import MateriaService from "../../app/service/materiaService";
import ProfessorService from "../../app/service/professorService";
import TurmaService from "../../app/service/turmaService";
import type { MateriaDTO, ProfessorDTO, TurmaDTO } from "../../app/service/type";
import Input from "../../components/input/input";
import Select from "../../components/select/select";
import CardList from "../../components/cardsList/cardList";
import "../../styles/home.css";

const navItems = [
  { icon: <HomeIcon className="sideBar-icon" />,     text: "Início",      href: "/homeSecretaria" },
  { icon: <TurmaIcon className="sideBar-icon" />,    text: "Turmas",      href: "/turmas"         },
  { icon: <AlunoIcon className="sideBar-icon" />,    text: "Alunos",      href: "/alunos"         },
  { icon: <ProfesorIcon className="sideBar-icon" />, text: "Professores", href: "/professores"   },
  { icon: <MateriaIcon className="sideBar-icon" />,  text: "Matérias",    href: "/materias"       },
];

// Reutiliza o mesmo Pagination
const Pagination: React.FC<{
  currentPage: number;
  totalPages:  number;
  onPageChange:(page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages: (number|string)[] = [];
    const maxPagesToShow = 7;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 4) {
      pages.push(1,2,3,4,5,"...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1,"...", totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages);
    } else {
      pages.push(1,"...", currentPage-1, currentPage, currentPage+1, "...", totalPages);
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

const ListMateria: React.FC = () => {
  const [materias, setMaterias]         = useState<MateriaDTO[]>([]);
  const [professores, setProfessores]   = useState<ProfessorDTO[]>([]);
  const [turmas, setTurmas]             = useState<TurmaDTO[]>([]);

  const [searchTerm, setSearchTerm]     = useState("");
  const [bimestreFilter, setBimestreFilter]     = useState("");
  const [profFilter, setProfFilter]     = useState("");
  const [page, setPage]                 = useState(1);

  const pageSize    = 9;
  const navigate    = useNavigate();
  const materiaSvc  = new MateriaService();
  const profSvc     = new ProfessorService();
  const turmaSvc    = new TurmaService();

  useEffect(() => {
    materiaSvc.listarTodos()
      .then(res => setMaterias(res.data))
      .catch(err => console.error("Erro matérias:", err));
    profSvc.listarTodos()
      .then(res => setProfessores(res.data))
      .catch(err => console.error("Erro professores:", err));
    turmaSvc.listarTodos()
      .then(res => setTurmas(res.data))
      .catch(err => console.error("Erro turmas:", err));
  }, []);

  // opções de filtros extraídas dinamicamente
  const bimestreOptions = useMemo<string[]>(() => {
    return Array.from(new Set(materias.map(m => String(m.bimestre))));
  }, [materias]);

  const profOptions = useMemo<string[]>(() => {
    return Array.from(
      new Set(
        materias
          .map(m => professores.find(p => p.id === m.professorId)?.nome)
          .filter((n): n is string => Boolean(n))
      )
    );
  }, [materias, professores]);

  const turmaOptions = useMemo<string[]>(() => {
    return Array.from(
      new Set(
        materias
          .map(m => turmas.find(t => t.id === m.turmaId)?.nome)
          .filter((n): n is string => Boolean(n))
      )
    );
  }, [materias, turmas]);

  // aplica busca + filtros
  const filtered = materias
    .filter(m =>
      m.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(m =>
      bimestreFilter
        ? String(m.bimestre) === bimestreFilter
        : true
    )
    .filter(m =>
      profFilter
        ? professores.find(p => p.id === m.professorId)?.nome === profFilter
        : true
    )

  const totalPages     = Math.ceil(filtered.length / pageSize);
  const pageItems      = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleEditar = (id?: number) => {
    id && navigate(`/cadastroMateria/${id}`);
  };

  return (
    <div className="gridTemplate">
      <SideBar buttonText="Sair" navItems={navItems} />
      <div className="home-container">
        <div className="container">
          <div className="grid-rep4">
          <h1 className="listTitle">MATÉRIAS</h1>

            <Input
              label="Buscar matéria"
              name="search"
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Digite o nome"
            />
            <Select
              label="Bimestre"
              name="bimestre"
              value={bimestreFilter}
              onChange={e => { setBimestreFilter(e.target.value); setPage(1); }}
              options={bimestreOptions}
              title="o bimestre"
            />
            <Select
              label="Professor"
              name="professor"
              value={profFilter}
              onChange={e => { setProfFilter(e.target.value); setPage(1); }}
              options={profOptions}
              title="o professor"
            />
          </div>

          {/* lista paginada */}
          <div className="grid-rep3">
            {pageItems.length === 0 ? (
              <p>Nenhuma matéria encontrada.</p>
            ) : (
              pageItems.map(m => {
                const prof = professores.find(p => p.id === m.professorId);
                const turm = turmas.find(t => t.id === m.turmaId);
                return (
                  <CardList
                    key={m.id}
                    data={[
                      { label: "Nome",     value: m.nome },
                      { label: "Bimestre", value: String(m.bimestre) },
                      { label: "Professor",value: prof?.nome ?? "—" },
                      { label: "Turma",    value: turm?.nome ?? "—" },
                    ]}
                    onEditar={() => handleEditar(m.id)}
                  />
                );
              })
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

export default ListMateria;
