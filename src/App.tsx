import Board from './components/Board';
import './App.css'

export default function App(){
  return (
    <div className="app__wrapper">
      <h1 className="app__title">Jogo da Memória</h1>
      <h1 className="app__subtitle">by Romulo Rosa</h1>
      <div className="app__content">
        <Board />
      </div>
    </div>
  );
};
