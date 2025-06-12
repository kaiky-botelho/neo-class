import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as CalendarioIcon } from "../../assets/icons/calendario.svg";
import TrabalhoService from "../../app/service/trabalhoService";
import type { TrabalhoDTO } from "../../app/service/type";
import CardList from "../../components/cardsList/cardList";
import Input from "../../components/input/input";
import Select from "../../components/select/select";
import "../../styles/home.css";

// itens de navegação (ajuste o href para /trabalhos)
const navItems = [
    { icon: <HomeIcon className="sideBar-icon" />, text: "Início", href: "/homeProfessor" },
    { icon: <TurmaIcon className="sideBar-icon" />, text: "Provas", href: "/provas" },
    { icon: <AlunoIcon className="sideBar-icon" />, text: "Trabalhos", href: "/trabalhos" },
    { icon: <CalendarioIcon className="sideBar-icon" />, text: "Calendário", href: "/calendarioProfessor" },
];

// opções de bimestre
const bimestreOptions = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"];

// componente de paginação (igual ao de provas)
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

const ListTrabalhos: React.FC = () => {
    const navigate = useNavigate();
    const [trabalhos, setTrabalhos] = useState<TrabalhoDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [bimestreFilter, setBimestreFilter] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 9;
    const service = new TrabalhoService();

    useEffect(() => {
        service
            .listarTodos()
            .then(res => setTrabalhos(res.data))
            .catch(err => console.error("Erro ao buscar trabalhos:", err));
    }, []);

    const filtrados = trabalhos
        .filter(t => t.nome.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(t =>
            bimestreFilter
                ? `${t.bimestre}º Bimestre` === bimestreFilter
                : true
        );

    const totalPages = Math.ceil(filtrados.length / pageSize);
    const pageItems = filtrados.slice((page - 1) * pageSize, page * pageSize);

    const handleEditar = (id?: number) => {
        if (id) navigate(`/cadastroTrabalho/${id}`);
    };

    const handleDeletar = (id?: number) => {
        if (typeof id !== "number") return;
        service
            .deletar(id)
            .then(() => {
                setTrabalhos(trabalhos.filter(t => t.id !== id));
                alert("Trabalho excluído com sucesso!");
            })
            .catch(err => console.error("Erro ao excluir trabalho:", err));
    };

    return (
        <div className="gridTemplate">
            <SideBar buttonText="Sair" navItems={navItems} />
            <div className="home-container">
                <div className="container">
                    <div className="grid-rep4">
                        <h1 className="listTitle">TRABALHOS</h1>
                        <Input
                            label="Buscar trabalho"
                            name="search"
                            type="text"
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                            placeholder="Digite o nome do trabalho"
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
                        {pageItems.length === 0 ? (
                            <p>Nenhum trabalho cadastrado.</p>
                        ) : (
                            pageItems.map(t => (
                                <CardList
                                    key={t.id}
                                    data={[
                                        { label: "Nome", value: t.nome },
                                        { label: "Bimestre", value: `${t.bimestre}º Bimestre` },
                                        { label: "Entrega", value: t.data },
                                    ]}
                                    onEditar={() => handleEditar(t.id)}
                                    onDeletar={() => handleDeletar(t.id)}
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

export default ListTrabalhos;
