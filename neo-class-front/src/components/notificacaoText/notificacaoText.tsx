// src/components/notificacaoText/notificacaoText.tsx
import React from "react";
import './notificacaoText.css';
import { ReactComponent as Envelope } from "../../assets/icons/responder.svg";

interface NotificacaoTextProps {
  title: string;
  text: string;
  onResponder: () => void;
}

const NotificacaoText: React.FC<NotificacaoTextProps> = ({ title, text, onResponder }) => {
  return (
    <div className="notificacao-text-container">
      <div>
        <h3 className="notificacao-title">{title}</h3>
        <p className="notificacao-text">{text}</p>
      </div>
      <button className="responder-btn" onClick={onResponder}>
        <Envelope />
      </button>
    </div>
  );
};

export default NotificacaoText;
