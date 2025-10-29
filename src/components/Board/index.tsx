import React, { useEffect, useState } from 'react';
import { JogoDaMemoria } from '../../types/JogoMemoria';
import type { Card as CardType } from '../../types/types';
import Card from '../Card';
import './index.css';

const Board: React.FC = () => {
  const [jogo] = useState(() => new JogoDaMemoria());
  const [cards, setCards] = useState<CardType[]>(jogo.cards);
  const [time, setTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    jogo.on('update', () => {
      setCards([...jogo.cards]);
      setTime(jogo.time);
      setMoves(jogo.moves);
    });

    jogo.on('victory', () => {
      setWon(true);
    });
  }, [jogo]);

  const handleClickCard = (id: number) => {
    jogo.flipCard(id);
  };

  const resetGame = () => {
    jogo.reset();
    setCards([...jogo.cards]);
    setTime(0);
    setMoves(0);
    setWon(false);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60)
      .toString()
      .padStart(2, '0')}`;

  return (
    <div className="board__wrapper">
      <div className="board__status">
        <p className="board__timer">🕒 Tempo: <span>{formatTime(time)}</span></p>
        <p className="board__moves">🎯 Jogadas: <span>{moves}</span></p>
        <button className="board__reset" onClick={resetGame}>Reiniciar</button>
      </div>

      <div className="board__cards">
        {cards.map((card) => (
          <Card key={card.id} card={card} handleClick={handleClickCard} />
        ))}
      </div>

      {won && (
        <div className="board__message__wrapper">
          <h3>🏆 Você venceu!</h3>
          <div className="board__score">
            <p>🕒 Tempo: <span>{formatTime(time)}</span></p>
            <p>🎯 Jogadas: <span>{moves}</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
