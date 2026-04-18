import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, RefreshCw, Rocket } from 'lucide-react';
import './DebtRun.css';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: 'debris' | 'shard';
  rotation: number;
  rotationSpeed: number;
}

const DebtRun: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE');
  const [debt, setDebt] = useState(1000000);
  const [distance, setDistance] = useState(0);

  // Game Settings
  const SHIP_WIDTH = 40;
  const SHIP_HEIGHT = 60;
  const DEBRIS_SIZE = 35;
  const SHARD_SIZE = 25;
  const BASE_SPEED = 5;

  // Refs for game loop state
  const shipPos = useRef({ x: 200, y: 500 });
  const objects = useRef<GameObject[]>([]);
  const frameCount = useRef(0);
  const scoreRef = useRef(1000000);
  const distanceRef = useRef(0);

  const startGame = () => {
    setGameState('PLAYING');
    setDebt(1000000);
    setDistance(0);
    scoreRef.current = 1000000;
    distanceRef.current = 0;
    objects.current = [];
    shipPos.current = { x: 200, y: 500 };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'PLAYING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    shipPos.current.x = Math.max(SHIP_WIDTH / 2, Math.min(canvas.width - SHIP_WIDTH / 2, x));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const spawnObject = () => {
      const type = Math.random() > 0.85 ? 'shard' : 'debris';
      const size = type === 'shard' ? SHARD_SIZE : DEBRIS_SIZE;
      objects.current.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size,
        speed: BASE_SPEED + (distanceRef.current / 1000),
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      });
    };

    const update = () => {
      if (gameState !== 'PLAYING') return;

      frameCount.current++;
      distanceRef.current += 1;
      setDistance(Math.floor(distanceRef.current / 10));

      if (frameCount.current % 35 === 0) spawnObject();

      objects.current.forEach((obj, index) => {
        obj.y += obj.speed;
        obj.rotation += obj.rotationSpeed;

        const shipX = shipPos.current.x - SHIP_WIDTH / 2;
        const shipY = shipPos.current.y - SHIP_HEIGHT / 2;

        if (
          obj.x < shipX + SHIP_WIDTH - 5 &&
          obj.x + obj.width > shipX + 5 &&
          obj.y < shipY + SHIP_HEIGHT - 5 &&
          obj.y + obj.height > shipY + 5
        ) {
          if (obj.type === 'debris') {
            scoreRef.current += 75000;
          } else {
            scoreRef.current = Math.max(0, scoreRef.current - 25000);
          }
          objects.current.splice(index, 1);
          setDebt(scoreRef.current);
        }

        if (obj.y > canvas.height) {
          objects.current.splice(index, 1);
        }
      });

      if (scoreRef.current >= 5000000) {
        setGameState('GAMEOVER');
      }
    };

    const draw = () => {
      // Clear with "The Veil" effect
      ctx.fillStyle = '#0a0505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant stars/particles
      ctx.fillStyle = 'rgba(255, 62, 62, 0.1)';
      for(let i=0; i<10; i++) {
        const y = (frameCount.current * 2 + (i * 100)) % canvas.height;
        ctx.fillRect((i * 45) % canvas.width, y, 1, 20);
      }

      // Scanlines
      ctx.fillStyle = 'rgba(255, 62, 62, 0.05)';
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 1);
      }

      if (gameState === 'PLAYING') {
        // Draw Ship (Stealth Silhouette)
        ctx.save();
        ctx.translate(shipPos.current.x, shipPos.current.y);
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff3e3e';
        ctx.fillStyle = '#ff3e3e';
        
        ctx.beginPath();
        ctx.moveTo(0, -SHIP_HEIGHT/2);
        ctx.lineTo(-SHIP_WIDTH/2, SHIP_HEIGHT/2);
        ctx.lineTo(0, SHIP_HEIGHT/3);
        ctx.lineTo(SHIP_WIDTH/2, SHIP_HEIGHT/2);
        ctx.closePath();
        ctx.fill();
        
        // Engine Glow
        ctx.fillStyle = '#fff';
        ctx.fillRect(-2, SHIP_HEIGHT/3, 4, 10);
        ctx.restore();

        // Draw Objects
        objects.current.forEach((obj) => {
          ctx.save();
          ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
          ctx.rotate(obj.rotation);
          
          if (obj.type === 'debris') {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff0000';
            ctx.strokeStyle = '#ff3e3e';
            ctx.lineWidth = 2;
            ctx.strokeRect(-obj.width/2, -obj.height/2, obj.width, obj.height);
            // X pattern inside
            ctx.beginPath();
            ctx.moveTo(-obj.width/2, -obj.height/2);
            ctx.lineTo(obj.width/2, obj.height/2);
            ctx.moveTo(obj.width/2, -obj.height/2);
            ctx.lineTo(-obj.width/2, obj.height/2);
            ctx.stroke();
          } else {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#fff';
            ctx.fillStyle = '#fff';
            // Star/Diamond shape
            ctx.beginPath();
            ctx.moveTo(0, -obj.height/2);
            ctx.lineTo(obj.width/2, 0);
            ctx.lineTo(0, obj.height/2);
            ctx.lineTo(-obj.width/2, 0);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(() => {
        update();
        draw();
      });
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState]);

  return (
    <div className="game-container terminal-window">
      <div className="terminal-header">
        <div className="mono">VEIL_RUNNER_v1.2 // PRIMITIVE_MODE_ACTIVE</div>
        <div className="game-stats">
          <div className={`stat ${debt > 2000000 ? 'blink' : ''}`}>
            <TrendingUp size={14} /> DEBT: {debt.toLocaleString()} ALPHA
          </div>
          <div className="stat">
            <Shield size={14} /> DISTANCE: {distance} KM
          </div>
        </div>
      </div>

      <div className="canvas-wrapper">
        <canvas ref={canvasRef} width={400} height={600} onMouseMove={handleMouseMove} />

        <AnimatePresence>
          {gameState === 'IDLE' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="game-overlay"
            >
              <div className="overlay-content">
                <Rocket className="gold-text mb-20" size={40} />
                <h2 className="mono">THE DEBT RUN</h2>
                <div className="instructions-box mono">
                  <p>OBJECTIVE: SURVIVE THE DEEP VEIL</p>
                  <p>• [ WHITE_DIAMONDS ]: ALPHA SHARDS (-25k DEBT)</p>
                  <p>• [ RED_BOXES ]: RADIOACTIVE DEBRIS (+75k DEBT)</p>
                  <p>• [ MOUSE ]: STEER YOUR STEALTH SHIP</p>
                </div>
                <div className="controls-hint">
                  <p>WARNING: IF DEBT EXCEEDS 5.0M ALPHA, YOUR LIFE-LEASE IS TERMINATED.</p>
                </div>
                <button onClick={startGame} className="btn-start">
                  INITIATE_VEIL_JUMP
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'GAMEOVER' && (
            <motion.div 
              key="gameover"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="game-overlay fatal"
            >
              <div className="overlay-content">
                <h2 className="mono">LEASE_TERMINATED</h2>
                <div className="final-stats">
                  <p>FINAL_DEBT: {debt.toLocaleString()} ALPHA</p>
                  <p>DISTANCE_REACHED: {distance} KM</p>
                </div>
                <p className="error-text">REASON: EXCEEDED DEBT LIMIT / INSOLVENCY DETECTED.</p>
                <button onClick={startGame} className="btn-start">
                  <RefreshCw size={14} /> RE-ESTABLISH_CONTRACT
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DebtRun;
