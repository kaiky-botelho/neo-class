import React from "react";
import './blueCard.css';

interface BlueCardProps {
    title: string;
    text: number;
}

const BlueCard: React.FC<BlueCardProps> = ({ title, text }) => {
    return (
        <div className="blue-card-container">
            <h5 className="blue-card-title">{title}</h5>
            <p className="blue-card-text">{text}</p>
        </div>
    );
};

export default BlueCard;