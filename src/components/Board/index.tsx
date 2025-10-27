import React, { useState, useEffect } from 'react';
import Card from '../Card';
import type { Card as CardType } from '../../types/types';
import './Board.css';

// 2) Crio uma função para embaralhar o array
const shuffle = (array: string[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] =
    [array[randomIndex], array[currentIndex]];
  }
  return array;
};


// 1) Crio o component Board que renderiza as cartas
const Board: React.FC = () => {
  // 2) Crio o state para controlar as cartas
  const [cards, setCards] = useState<CardType[]>([]);

  // 3) Crio o useEffect para inicializar as cartas
  useEffect(() => {
    // Conteúdo das cartas
    const cardContents = ['😁', '😍', '😎', '😀', '🤩', '😜','🤤', '🤑', '🤡', '🤖', '👽', '👿'];
    const doubledCards = [...cardContents, ...cardContents];

    // Embaralho as cartas e crio um array com duas cartas por índice
    // Adiciona um id à cada carta e altera o estado do state em setCards(initialCards)
    // O estado é atualizado automaticamente quando o array de cartas é alterado
    // O useEffect é chamado apenas quando o state é alterado
    const initialCards: CardType[] = shuffle(doubledCards).map((content, index) => ({
      id: index,
      content,
      isFlipped: false,
    }));

    setCards(initialCards);
  }, []); // 4) O useEffect é chamado só quando o componente é montado ou desmontado, não quando os seus filhos são montados ou desmontados

  return (
    <div className="board">
      {/* 5) Utilizo um map para renderizar as cartas do state cards} */}
      {cards.map(card => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  );
};

export default Board;
