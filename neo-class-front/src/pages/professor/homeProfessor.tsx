import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfessorService from "../../app/service/professorService";
import type { ProfessorDTO } from "../../app/service/type";

const HomeProfessor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [professor, setProfessor] = useState<ProfessorDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID do professor não informado");
      setLoading(false);
      return;
    }

    const professorService = new ProfessorService();

    professorService
      .buscarPorId(Number(id))
      .then(response => {
        setProfessor(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Erro ao carregar dados do professor");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Carregando dados do professor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Bem-vindo, {professor?.nome || "Professor"}</h1>
      {/* Aqui você pode adicionar o resto da tela do professor */}
    </div>
  );
};

export default HomeProfessor;
