import React from 'react';
import type { Card as CardType } from '../../types/types';
import './Card.css';

//1) Criei a interface pra usar nos cartões
interface CardProps {
  card: CardType;
}

// 2) const Card: React.FC - Criei o Crad como um componente funcional do React
// <CardProps> - O componente tem como tipo CardProps
// ({ card }) - A função Card recebe um objeto card como props
//  return (<div className={`card... - E retorna um elemento div com a classe card
const Card: React.FC<CardProps> = ({ card }) => {
  return (
    <div className={`card ${card.isFlipped ? 'flipped' : ''}`}>
    {/* Adiciono a class card a div e caso o card esteja virado tb adiciono a class flipped */}
      <div className="card-inner">
        <div className="card-front">
          {/* Mostro o conteúdo da carta quando virada */}
          {card.content}
        </div>
        <div className="card-back">
          {/* Mostro o verso da carta quando virada para baixo */}
          ?
        </div>
      </div>
    </div>
  );
};

// 3) Exporto o componente Card para qque possa usar em outros components
export default Card;
