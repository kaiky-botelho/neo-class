import React from "react";
import NotificacaoText from "../components/notificacaoText/notificacaoText";
import BlueCard from "../components/blueCard/blueCard";

const Teste: React.FC = () => {
  return (
    <div className="container">
       <BlueCard title="Teste" text={123} />
    </div>
  );
};

export default Teste;