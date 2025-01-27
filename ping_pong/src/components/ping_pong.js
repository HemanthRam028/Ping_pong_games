import React, { useEffect, useRef, useState } from 'react';

const PingPong = () => {
  const canvasRef = useRef(null);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 10,
      speed: 5,
      velocityX: 5,
      velocityY: 5,
    };

    const paddleHeight = 100;
    const paddleWidth = 10;

    const leftPaddle = {
      x: 0,
      y: canvas.height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
      speed: 8,
      score: 0,
    };

    const rightPaddle = {
      x: canvas.width - paddleWidth,
      y: canvas.height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
      speed: 8,
      score: 0,
    };

    const keys = {
      w: false,
      s: false,
      ArrowUp: false,
      ArrowDown: false,
    };

    const handleKeyDown = (e) => {
      if (e.key in keys) {
        keys[e.key] = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key in keys) {
        keys[e.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const collision = (b, p) => {
      return (
        b.x + b.radius > p.x &&
        b.x - b.radius < p.x + p.width &&
        b.y + b.radius > p.y &&
        b.y - b.radius < p.y + p.height
      );
    };

    const gameLoop = () => {
      context.fillStyle = '#000';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.beginPath();
      context.setLineDash([5, 15]);
      context.moveTo(canvas.width / 2, 0);
      context.lineTo(canvas.width / 2, canvas.height);
      context.strokeStyle = 'white';
      context.stroke();

      context.fillStyle = '#FFF';
      context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
      context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

      context.beginPath();
      context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      context.fillStyle = '#FFF';
      context.fill();
      context.closePath();

      if (keys.w && leftPaddle.y > 0) {
        leftPaddle.y -= leftPaddle.speed;
      }

      if (keys.s && leftPaddle.y < canvas.height - leftPaddle.height) {
        leftPaddle.y += leftPaddle.speed;
      }
      if (keys.ArrowUp && rightPaddle.y > 0) {
        rightPaddle.y -= rightPaddle.speed;
      }
      if (keys.ArrowDown && rightPaddle.y < canvas.height - rightPaddle.height) {
        rightPaddle.y += rightPaddle.speed;
      }

      ball.x += ball.velocityX;
      ball.y += ball.velocityY;

      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
      }

      let player = ball.x < canvas.width / 2 ? leftPaddle : rightPaddle;
      if (collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = ball.x < canvas.width / 2 ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.5;
      }

      if (ball.x - ball.radius < 0) {
        rightPaddle.score++;
        setRightScore(rightPaddle.score);
        if (rightPaddle.score === 5) {
          setWinner('Right Player Wins!');
        }
        resetBall();
      } else if (ball.x + ball.radius > canvas.width) {
        leftPaddle.score++;
        setLeftScore(leftPaddle.score);
        if (leftPaddle.score === 5) {
          setWinner('Left Player Wins!');
        }
        resetBall();
      }

      requestAnimationFrame(gameLoop);
    };

    const resetBall = () => {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.speed = 5;
      ball.velocityX = -ball.velocityX;
      ball.velocityY = ball.velocityY < 0 ? 5 : -5;
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="ping-pong-container">
      <div className="score-board">
        <div className="score">{leftScore}</div>
        <div className="score">{rightScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="ping-pong-canvas"
      />
      {winner && <div className="winner-message">{winner}</div>}
      <div className="controls-info">
        <div>
          <p>Left Player: W (up) / S (down)</p>
          <p>Right Player: ↑ (up) / ↓ (down)</p>
        </div>
      </div>
    </div>
  );
};

export default PingPong;
