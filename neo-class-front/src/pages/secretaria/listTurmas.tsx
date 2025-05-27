import React, { useEffect, useMemo, useState } from "react";
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
import Input from "../../components/input/input";
import Select from "../../components/select/select";


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

const ListTurmas: React.FC = () => {
  const [turmas, setTurmas] = useState<TurmaDTO[]>([]);
  const turmaService = new TurmaService();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [searchTerm, setSearchTerm] = useState("");
  const [turnoFilter, setTurnoFilter] = useState("");
  const [serieFilter, setSerieFilter] = useState("");

  useEffect(() => {
    turmaService
      .listarTodos()
      .then((response) => {
        setTurmas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar turmas:", error);
      });
  }, []);

  const turnoOptions = useMemo<string[]>(() => {
    const uniq = new Set<string>();
    turmas.forEach(t => t.turno && uniq.add(t.turno));
    return Array.from(uniq);
  }, [turmas]);

  const serieOptions = useMemo<string[]>(() => {
    const uniq = new Set<string>();
    turmas.forEach(t => t.serie && uniq.add(t.serie));
    return Array.from(uniq);
  }, [turmas]);

  const filtered = turmas
    .filter(t =>
      (t.nome ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter(t =>
      turnoFilter ? t.turno === turnoFilter : true
    )
    .filter(t =>
      serieFilter ? t.serie === serieFilter : true
    );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

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
          <div className="grid-rep4">
            <h1 className="listTitle">TURMAS</h1>
            <Input
              label={"Buscar nome"}
              name="search"
              type={"text"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome"
            />
            <Select 
              label={"Turno"} 
              name={turnoFilter}   
              value={turnoFilter}
              onChange={e => {setTurnoFilter(e.target.value); setPage(1)}} 
              options={turnoOptions} 
              title={"o turno"} 
              />
            <Select
              label={"Série"}
              name={serieFilter}
              value={serieFilter}
              onChange={e => {setSerieFilter(e.target.value); setPage(1)}}
              options={serieOptions}
              title={"a série"}
            />
          </div>
          <div className="grid-rep3">
            {turmas.length === 0 && <p>nenhuma turma cadastrada.</p>}
            {pageItems.map((turma) => (
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

export default ListTurmas;
