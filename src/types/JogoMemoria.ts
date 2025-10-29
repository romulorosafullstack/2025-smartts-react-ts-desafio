import type { Card as CardType } from '../types/types';

export class JogoDaMemoria {
  private contents: string[] = ['😁', '😍', '😎', '😀', '🤩', '😜', '🤤', '🤑', '🤡', '🤖', '👽', '👿'];
  public cards: CardType[] = [];
  public flippedCards: number[] = [];
  public matchedCards: number[] = [];
  public moves: number = 0;
  public time: number = 0;
  public gameActive: boolean = false;
  public gameWon: boolean = false;
  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    this.initializeCards();
  }

  // Embaralha o array
  private shuffle(array: string[]): string[] {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  // Inicializa as cartas do jogo
  public initializeCards(): void {
    const doubled = [...this.contents, ...this.contents];
    const shuffled = this.shuffle(doubled);

    this.cards = shuffled.map((content, index) => ({
      id: index,
      content,
      isFlipped: false,
      isMatched: false,
    }));

    this.flippedCards = [];
    this.matchedCards = [];
    this.moves = 0;
    this.time = 0;
    this.gameActive = false;
    this.gameWon = false;

    if (this.timer) clearInterval(this.timer);
  }

  // Inicia o cronômetro
  public startTimer(): void {
    if (!this.gameActive) {
      this.gameActive = true;
      this.timer = setInterval(() => this.time++, 1000);
    }
  }

  // Para o cronômetro
  public stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  // Verifica vitória
  private checkVictory(): void {
    if (this.cards.every((c) => c.isMatched)) {
      this.gameWon = true;
      this.gameActive = false;
      this.stopTimer();
    }
  }

  // Lógica ao clicar em uma carta
  public flipCard(id: number): void {
    if (this.gameWon) return;
    if (!this.gameActive) this.startTimer();

    const card = this.cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    this.flippedCards.push(id);

    if (this.flippedCards.length === 2) {
      this.moves++;

      const [firstId, secondId] = this.flippedCards;
      const first = this.cards[firstId];
      const second = this.cards[secondId];

      if (first.content === second.content) {
        first.isMatched = true;
        second.isMatched = true;
        this.matchedCards.push(firstId, secondId);
        this.flippedCards = [];
        this.checkVictory();
      } else {
        setTimeout(() => {
          first.isFlipped = false;
          second.isFlipped = false;
          this.flippedCards = [];
        }, 800);
      }
    }
  }

  // Reinicia o jogo
  public reset(): void {
    this.initializeCards();
  }
}
