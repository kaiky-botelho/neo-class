import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as CalendarioIcon } from "../../assets/icons/calendario.svg";
import ProvaService from "../../app/service/provaService";
import type { ProvaDTO } from "../../app/service/type";
import CardList from "../../components/cardsList/cardList";
import Input from "../../components/input/input";
import Select from "../../components/select/select";
import "../../styles/home.css";

// itens de navegação
const navItems = [
    { icon: <HomeIcon className="sideBar-icon" />, text: "Início", href: "/homeProfessor" },
    { icon: <TurmaIcon className="sideBar-icon" />, text: "Prova", href: "/provas" },
    { icon: <AlunoIcon className="sideBar-icon" />, text: "Trabalhos", href: "/trabalhos" },
    { icon: <CalendarioIcon className="sideBar-icon" />, text: "Calendário", href: "/calendarioProfessor" },
];

// opções de bimestre sem rótulo "Todos"
const bimestreOptions = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"];

// componente de paginação, semelhante ao ListAlunos
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
                    <span key={idx} className="pagination-ellipsis">
                        …
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
                &#x276F;
            </button>
        </div>
    );
};

const ListProvas: React.FC = () => {
    const navigate = useNavigate();
    const [provas, setProvas] = useState<ProvaDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [bimestreFilter, setBimestreFilter] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 9;
    const service = new ProvaService();

    // Obtem o ID do professor armazenado (exemplo do localStorage)
    const professorId = Number(localStorage.getItem("id"));

    useEffect(() => {
        service
            .listarTodas()
            .then(res => setProvas(res.data))
            .catch(err => console.error("Erro ao buscar provas:", err));
    }, []);

    const provasFiltradas = provas
        .filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(p =>
            bimestreFilter ? `${p.bimestre}º Bimestre` === bimestreFilter : true
        )
        .filter(p => p.professorId === professorId);  // Filtro pelo professorId

    const totalPages = Math.ceil(provasFiltradas.length / pageSize);
    const provasPagina = provasFiltradas.slice((page - 1) * pageSize, page * pageSize);

    const handleEditar = (id?: number) => {
        if (id) navigate(`/cadastroProva/${id}`);
    };

    const handleDeletar = (id?: number) => {
        if (typeof id !== "number") return;
        service
            .deletar(id)
            .then(() => {
                setProvas(provas.filter(p => p.id !== id));
            })
            .catch(err => console.error("Erro ao excluir prova:", err));
    };

    return (
        <div className="gridTemplate">
            <SideBar buttonText="Sair" navItems={navItems} />
            <div className="home-container">
                <div className="container">
                    <div className="grid-rep4">
                        <h1 className="listTitle">PROVAS</h1>
                        <Input
                            label="Buscar prova"
                            name="search"
                            type="text"
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                            placeholder="Digite o nome da prova"
                        />
                        <Select
                            label="Bimestre"
                            name="bimestreFilter"
                            value={bimestreFilter}
                            onChange={e => { setBimestreFilter(e.target.value); setPage(1); }}
                            options={bimestreOptions}
                            title="selecione o bimestre"
                        />
                    </div>
                    <div className="grid-rep3">
                        {provasPagina.length === 0 ? (
                            <p>Nenhuma prova cadastrada.</p>
                        ) : (
                            provasPagina.map(p => (
                                <CardList
                                    key={p.id}
                                    data={[
                                        { label: "Nome", value: p.nome },
                                        { label: "Bimestre", value: `${p.bimestre}º Bimestre` },
                                        { label: "Data", value: p.data },
                                    ]}
                                    onEditar={() => handleEditar(p.id)}
                                    onDeletar={() => handleDeletar(p.id)}
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

export default ListProvas;
