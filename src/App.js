import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

function App() {
  const STARTING_POSITION = { left: 50, bottom: 0 };
  const [runnerPosition, setRunnerPosition] = useState(STARTING_POSITION);
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [obstacleActive, setObstacleActive] = useState(true);
  const [obstacleKey, setObstacleKey] = useState(0);
  const runnerRef = useRef(null);
  const obstacleRef = useRef(null);

  const jump = useCallback(() => {
    if (!isJumping) {
      setIsJumping(true);
      setRunnerPosition(prev => ({ ...prev, bottom: 100 }));
      setTimeout(() => {
        setIsJumping(false);
        setRunnerPosition(prev => ({ ...prev, bottom: 0 }));
      }, 500);
    }
  }, [isJumping]);

  const updateGame = useCallback(() => {
    if (gameOver) return;

    if (runnerRef.current && obstacleRef.current) {
      const runner = runnerRef.current.getBoundingClientRect();
      const obstacle = obstacleRef.current.getBoundingClientRect();

      if (
        runner.bottom > obstacle.top &&
        runner.top < obstacle.bottom &&
        runner.right > obstacle.left &&
        runner.left < obstacle.right
      ) {
        setGameOver(true);
      }
    }
  }, [gameOver]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' && !isJumping && !gameOver) {
        jump();
      }
    };

    const handleTouch = (event) => {
      if (!isJumping && !gameOver) {
        event.preventDefault();
        jump();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouch);

    const gameLoop = setInterval(updateGame, 20);
    const scoreInterval = setInterval(() => {
      if (!gameOver) {
        setScore(s => s + 1);
        setTime(t => +(t + 0.1).toFixed(1));
      }
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouch);
      clearInterval(gameLoop);
      clearInterval(scoreInterval);
    };
  }, [isJumping, gameOver, updateGame, jump]);

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    setIsJumping(false);
    setTime(0);
    setRunnerPosition(STARTING_POSITION);
    setObstacleActive(false);
    setObstacleKey(prevKey => prevKey + 1);

    setTimeout(() => {
      setObstacleActive(true);
    }, 1000);
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Trackstars</h1>
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <div className="game">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {time.toFixed(1)}s</div>
        <div 
          ref={runnerRef}
          className={`runner ${isJumping ? 'jump' : ''}`}
          style={{
            left: `${runnerPosition.left}px`,
            bottom: `${runnerPosition.bottom}px`,
          }}
        >
          <div className="head"></div>
          <div className="body"></div>
          <div className="legs"></div>
        </div>
        {obstacleActive && (
          <div 
            key={obstacleKey}
            ref={obstacleRef}
            className={`obstacle ${gameOver ? 'paused' : ''}`}
          ></div>
        )}
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