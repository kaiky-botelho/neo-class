import React from "react";
import './notificacaoText.css';

interface NotificacaoTextProps {
    title: string
    text: string
}

const NotificacaoText: React.FC<NotificacaoTextProps> = ({ title, text }) => {
    return (
        <div className="notificacao-text-container">
            <h3 className="notificacao-title">{title}</h3>
            <p className="notificacao-text">{text}</p>
        </div>
    );
};

export default NotificacaoText;