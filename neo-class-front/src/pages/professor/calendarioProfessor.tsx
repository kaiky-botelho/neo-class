// src/pages/professor/CalendarioProfessor.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer, Event as RBCEvent } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as TurmaIcon } from "../../assets/icons/turma.svg";
import { ReactComponent as AlunoIcon } from "../../assets/icons/aluno.svg";
import { ReactComponent as CalendarioIcon } from "../../assets/icons/calendario.svg";

import SideBar from "../../components/sideBar/sideBar";

import ProvaService from "../../app/service/provaService";
import TrabalhoService from "../../app/service/trabalhoService";
import type { ProvaDTO, TrabalhoDTO } from "../../app/service/type";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const navItems = [
  { icon: <HomeIcon className="sideBar-icon" />, text: "Início", href: "/homeProfessor" },
  { icon: <TurmaIcon className="sideBar-icon" />, text: "Provas", href: "/provas" },
  { icon: <AlunoIcon className="sideBar-icon" />, text: "Trabalhos", href: "/trabalhos" },
  { icon: <CalendarioIcon className="sideBar-icon" />, text: "Calendário", href: "/calendarioProfessor" },
];

const CalendarioProfessor: React.FC = () => {
  const navigate = useNavigate();
  const provaService = new ProvaService();
  const trabalhoService = new TrabalhoService();
  const professorId = Number(localStorage.getItem("id")!);

  const [events, setEvents] = useState<RBCEvent[]>([]);

  useEffect(() => {
    Promise.all([
      provaService.listarTodas(),
      trabalhoService.listarTodos()
    ])
      .then(([resProva, resTrab]) => {
        const provas: ProvaDTO[] = resProva.data.filter(p => p.professorId === professorId);
        const trabalhos: TrabalhoDTO[] = resTrab.data
          .filter(t => t.professorId === professorId)
          .filter(t => !!t.data);

        const evts: RBCEvent[] = [];

        provas.forEach(p => {
          const date = new Date(p.data);
          evts.push({
            title: `Prova: ${p.nome}`,
            start: date,
            end: date,
            allDay: true
          });
        });

        trabalhos.forEach(t => {
          const date = new Date(t.data!);
          evts.push({
            title: `Trabalho: ${t.nome}`,
            start: date,
            end: date,
            allDay: true
          });
        });

        setEvents(evts);
      })
      .catch(err => console.error("Erro ao carregar eventos:", err));
  }, [professorId]);

  // Define estilo por tipo de evento
  const eventStyleGetter = (event: RBCEvent) => {
    const title = typeof event.title === 'string' ? event.title : '';
    if (title.startsWith('Prova:')) {
      return { style: { backgroundColor: '#EA9216', borderRadius: '4px', border: 'none' } };
    }
    return { style: {} };
  };

  return (
    <div className="gridTemplate">
      <aside>
        <SideBar navItems={navItems} buttonText="Sair" />
      </aside>
      <main className="home-container">
        <h2>Calendário de Provas e Trabalhos</h2>
        <Calendar
          localizer={localizer}
          culture="pt-BR"
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600, margin: "20px" }}
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
          }}
          eventPropGetter={eventStyleGetter}
        />
      </main>
    </div>
  );
};

export default CalendarioProfessor;
