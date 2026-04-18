import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, RefreshCw } from 'lucide-react';
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
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Assets
  const images = useRef<{ [key: string]: HTMLImageElement }>({});

  // Game Settings
  const SHIP_WIDTH = 50;
  const SHIP_HEIGHT = 70;
  const DEBRIS_SIZE = 40;
  const SHARD_SIZE = 35;
  const BASE_SPEED = 5;

  // Refs for game loop state
  const shipPos = useRef({ x: 200, y: 500 });
  const objects = useRef<GameObject[]>([]);
  const frameCount = useRef(0);
  const scoreRef = useRef(1000000);
  const distanceRef = useRef(0);
  const bgScrollY = useRef(0);

  // Image Loading
  useEffect(() => {
    const assetList = {
      ship: '/images/game/ship.jpeg',
      shard: '/images/game/shard.jpeg',
      asteroid: '/images/game/asteroid.jpeg',
      bg: '/images/game/veil_bg.png',
    };

    let loadedCount = 0;
    const totalAssets = Object.keys(assetList).length;

    Object.entries(assetList).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        images.current[key] = img;
        loadedCount++;
        if (loadedCount === totalAssets) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  const startGame = () => {
    if (!imagesLoaded) return;
    setGameState('PLAYING');
    setDebt(1000000);
    setDistance(0);
    scoreRef.current = 1000000;
    distanceRef.current = 0;
    objects.current = [];
    shipPos.current = { x: 200, y: 500 };
    bgScrollY.current = 0;
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

      // BG Scroll
      bgScrollY.current += 1;
      if (bgScrollY.current >= canvas.height) bgScrollY.current = 0;

      // Spawn objects
      if (frameCount.current % 35 === 0) spawnObject();

      // Update objects
      objects.current.forEach((obj, index) => {
        obj.y += obj.speed;
        obj.rotation += obj.rotationSpeed;

        // Collision detection
        const shipX = shipPos.current.x - SHIP_WIDTH / 2;
        const shipY = shipPos.current.y - SHIP_HEIGHT / 2;

        if (
          obj.x < shipX + SHIP_WIDTH - 10 &&
          obj.x + obj.width > shipX + 10 &&
          obj.y < shipY + SHIP_HEIGHT - 10 &&
          obj.y + obj.height > shipY + 10
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Scrolling Background
      if (images.current.bg) {
        ctx.drawImage(images.current.bg, 0, bgScrollY.current - canvas.height, canvas.width, canvas.height);
        ctx.drawImage(images.current.bg, 0, bgScrollY.current, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#0a0505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw scanlines
      ctx.fillStyle = 'rgba(255, 62, 62, 0.05)';
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 1);
      }

      if (gameState === 'PLAYING') {
        // Draw Ship
        if (images.current.ship) {
          ctx.save();
          ctx.translate(shipPos.current.x, shipPos.current.y);
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#ff3e3e';
          ctx.drawImage(images.current.ship, -SHIP_WIDTH / 2, -SHIP_HEIGHT / 2, SHIP_WIDTH, SHIP_HEIGHT);
          ctx.restore();
        }

        // Draw Objects
        objects.current.forEach((obj) => {
          const img = obj.type === 'shard' ? images.current.shard : images.current.asteroid;
          if (img) {
            ctx.save();
            ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
            ctx.rotate(obj.rotation);
            ctx.shadowBlur = 10;
            ctx.shadowColor = obj.type === 'shard' ? '#ffffff' : '#ff0000';
            ctx.drawImage(img, -obj.width / 2, -obj.height / 2, obj.width, obj.height);
            ctx.restore();
          }
        });
      }

      animationFrameId = requestAnimationFrame(() => {
        update();
        draw();
      });
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, imagesLoaded]);

  return (
    <div className="game-container terminal-window">
      <div className="terminal-header">
        <div className="mono">VEIL_RUNNER_v1.1 // DEBT_MITIGATION_INTERFACE</div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="game-overlay">
              <div className="overlay-content">
                <h2 className="mono">THE DEBT RUN</h2>
                <p>Pilot through the Deep Veil. Collecting Alpha Shards reduces your Life-Lease debt. Hitting debris increases it.</p>
                <div className="controls-hint">
                  <p>[ MOUSE_MOVE ] TO STEER</p>
                  <p>IF DEBT REACHES 5.0M, YOUR LEASE IS TERMINATED.</p>
                </div>
                <button onClick={startGame} className="btn-start" disabled={!imagesLoaded}>
                  {imagesLoaded ? 'INITIATE_VEIL_JUMP' : 'LOADING_ASSETS...'}
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'GAMEOVER' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="game-overlay fatal">
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
