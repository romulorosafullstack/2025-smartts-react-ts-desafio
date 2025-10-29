import React, { useEffect, useState } from 'react';
import type { Card as CardType } from '../../types/types';
import Card from '../Card';
import './index.css';

// Função para embaralhar
const shuffle = (array: string[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

const Board: React.FC = () => {
  // Novos estados
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [canFlip, setCanFlip] = useState(true);
  const [time, setTime] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Inicializa cartas
  const initializeCards = () => {
    const contents = ['😁', '😍', '😎', '😀', '🤩', '😜', '🤤', '🤑', '🤡', '🤖', '👽', '👿'];
    const doubled = [...contents, ...contents];
    const shuffled = shuffle(doubled);

    const initialCards: CardType[] = shuffled.map((content, index) => ({
      id: index,
      content,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
  };

  useEffect(() => {
    initializeCards();
  }, []);

  // Timer
  useEffect(() => {
    if (gameActive && !gameWon) {
      const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameActive, gameWon]);

  // Comparação de cartas
  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanFlip(false);
      const [firstId, secondId] = flippedCards;
      const [firstCard, secondCard] = [
        cards.find((c) => c.id === firstId),
        cards.find((c) => c.id === secondId),
      ];

      if (firstCard && secondCard) {
        if (firstCard.content === secondCard.content) {
          // ✅ Par encontrado
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true, isFlipped: true }
                : card
            )
          );
          setMatchedCards((prev) => [...prev, firstId, secondId]);
          setFlippedCards([]);
          setTimeout(() => setCanFlip(true), 400);
        } else {
          // ❌ Não combinam → vira de volta
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) =>
                flippedCards.includes(card.id)
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
            setFlippedCards([]);
            setCanFlip(true);
          }, 1000);
        }
        setMoves((m) => m + 1);
      }
    }
  }, [flippedCards, cards]);

  // Verifica se o jogador venceu 🏆
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setGameWon(true);
      setGameActive(false);
    }
  }, [cards]);

  // Clique na carta
  const handleClickCard = (id: number) => {
    if (gameWon) return; // evita jogar depois de vencer
    if (!gameActive) setGameActive(true);
    if (!canFlip || flippedCards.includes(id) || matchedCards.includes(id)) return;

    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards((prev) => [...prev, id]);
  };

  // Reiniciar jogo
  const resetGame = () => {
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTime(0);
    setGameActive(false);
    setGameWon(false);
    setCanFlip(true);
    initializeCards();
  };

  // Formata tempo mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="board__wrapper">
      <div className="board__status">
        <p className="board__timer">
          🕒 Tempo: <span>{formatTime(time)}</span>
        </p>
        <p className="board__moves">
          🎯 Jogadas: <span>{moves}</span>
        </p>
        <button className="board__reset" onClick={resetGame}>
          Reiniciar
        </button>
      </div>

      <div className="board__cards">
        {cards.map((card) => (
          <Card key={card.id} card={card} handleClick={handleClickCard} />
        ))}
      </div>

      {gameWon && (
        <div className="board__message">
          🎉 Você venceu em {moves} jogadas e {formatTime(time)}!
        </div>
      )}
    </div>
  );
};

export default Board;
