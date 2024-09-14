import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const STARTING_POSITION = { left: 50, bottom: 0 };
  const [runnerPosition, setRunnerPosition] = useState(STARTING_POSITION);
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const runnerRef = useRef(null);
  const obstacleRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' && !isJumping && !gameOver) {
        jump();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const gameLoop = setInterval(updateGame, 20);
    const scoreInterval = setInterval(() => {
      if (!gameOver) {
        setScore(s => s + 1);
        setTime(t => t + 0.1);
      }
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(gameLoop);
      clearInterval(scoreInterval);
    };
  }, [isJumping, gameOver]);

  const jump = () => {
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
  };

  const updateGame = () => {
    if (gameOver) return;

    const runner = runnerRef.current.getBoundingClientRect();
    const obstacle = obstacleRef.current.getBoundingClientRect();

    if (
      runner.bottom > obstacle.top &&
      runner.top < obstacle.bottom &&
      runner.right > obstacle.left &&
      runner.left < obstacle.right
    ) {
      setGameOver(true);
      // Don't reset position here
    }
  };

  const restartGame = () => {
    setScore(0);
    setTime(0);
    setGameOver(false);
    setRunnerPosition(STARTING_POSITION); // Reset to starting position
    if (obstacleRef.current) {
      obstacleRef.current.style.right = '-20px';
    }
  };

  return (
    <div className="game-container">
      <div className="game">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {time.toFixed(1)}s</div>
        <div 
          ref={runnerRef}
          className={`runner ${isJumping ? 'jump' : ''}`}
          style={{
            left: `${runnerPosition.left}px`,
            bottom: `${runnerPosition.bottom}px`,
            transition: 'none' // Remove transition to prevent sliding
          }}
        >
          <div className="head"></div>
          <div className="body"></div>
          <div className="leg left"></div>
          <div className="leg right"></div>
          <div className="arm left"></div>
          <div className="arm right"></div>
        </div>
        <div 
          ref={obstacleRef}
          className={`obstacle ${gameOver ? 'paused' : ''}`}
        ></div>
        {gameOver && (
          <div className="game-over">
            <h2>Game Over</h2>
            <p>Final Score: {score}</p>
            <p>Time: {time.toFixed(1)}s</p>
            <button onClick={restartGame}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;