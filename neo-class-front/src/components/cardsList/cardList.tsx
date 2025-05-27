import React from "react";
import "./cardList.css";

interface CardListProps {
  data: { label: string; value: string | number | undefined }[];
  onEditar?: () => void;
  onDeletar?: () => void;
}

const CardList: React.FC<CardListProps> = ({

  data,
  onEditar,
  onDeletar,
}) => {
  return (

    <div className="card-list">
      <div className="card-info">
        {data.map((item, index) => (
          <p key={index}>
            <strong>{item.label}:</strong> <span>{item.value ?? "N/A"}</span>
          </p>
        ))}
      </div>
      <div className="card-buttons">
        {onEditar && (
          <button className="btn-editar" onClick={onEditar}>
            Editar
          </button>
        )}
        {onDeletar && (
          <button className="btn-deletar" onClick={onDeletar}>
            Deletar
          </button>
        )}
      </div>
    </div>
  );
};

export default CardList;
