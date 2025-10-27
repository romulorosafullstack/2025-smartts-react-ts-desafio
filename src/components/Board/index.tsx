import React, { useState, useEffect } from 'react';
import Card from '../Card';
import type { Card as CardType } from '../../types/types';
import './index.css';

// 2) Crio uma função para embaralhar o array de strings (content)
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
  // 5) Crio novos states para controlar as cartas viradas e suas correspondentes
  // State pras Cartas viradas
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  // State pra pares encontrados
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  // State pra travar viradas
  const [canFlip, setCanFlip] = useState<boolean>(true);

  // 3) Crio o useEffect para inicializar as cartas
  useEffect(() => {
    // Conteúdo das cartas
    const cardContents = ['😁', '😍', '😎', '😀', '🤩', '😜', '🤤', '🤑', '🤡', '🤖', '👽', '👿'];
    // Duplico o conteúdo das cartas para formar um array de duas cartas por índice
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

    // Atualizo o estado de cards
    setCards(initialCards);
  }, []); // 4) O useEffect é chamado só quando o componente é montado ou desmontado, não quando os seus filhos são montados ou desmontados

  // Verifico os pares quando duas cartas são viradas
  useEffect(() => {
    // Se cardas viradas igual a 2
    if (flippedCards.length === 2) {
      setCanFlip(false); // Impedir de virar se não forem igiais a 2

      const [firstCardId, secondCardId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);

      // Se as cartas forem iguais, adicionar os ids à matchedCards e limpar o array
      if (firstCard?.content === secondCard?.content) {
        setMatchedCards(prev => [...prev, firstCardId, secondCardId]);
        setFlippedCards([]); // Limpar o array
        setTimeout(() => setCanFlip(true), 500); // Liberar viradas após um tempo
      } else {
        // Se não for um par, virar de volta
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              flippedCards.includes(card.id) ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCards([]);
          setCanFlip(true);
        }, 1000); // Virar as cartas de volta após 1 segundo
      }
    }
  }, [flippedCards, cards]);

  // Manipulo o clique na carta
  const handleClickCard = (id: number) => {
    // Apenas viro se puder clicar, a carta não estiver virada ou já tiver sido combinada
    if (!canFlip || flippedCards.includes(id) || matchedCards.includes(id)) {
      return;
    }
    
    // Viro a carta
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);
    setFlippedCards(prev => [...prev, id]);
  };

  return (
    <div className="board">
      {/* 5) Utilizo um map para renderizar as cartas do state cards} */}
      {cards.map(card => (
        <Card
          key={card.id}
          card={card}
          handleClick={handleClickCard}
        />
      ))}
    </div>
  );
};

export default Board;
