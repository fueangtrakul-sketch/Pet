import React, { useEffect, useRef, useState } from 'react';
import { darkForestAnimalsBg } from '../assets';

interface Particle {
  x: number;
  y: number;
  z: number; // 3D depth layer
  size: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  alpha: number;
  type: 'pollen' | 'petal' | 'clover' | 'firefly';
  rotation: number;
  vRot: number;
}

export const Parallax3DBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Smooth mouse coordinates with physics damping (target vs current)
  const targetMouse = useRef({ x: 0, y: 0 }); // range -1 to 1
  const currentMouse = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to +1 from screen center
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      targetMouse.current = { x, y };
      setIsHovering(true);
    };

    // Device orientation support for mobile devices
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const x = Math.min(Math.max(e.gamma / 35, -1), 1);
        const y = Math.min(Math.max((e.beta - 45) / 35, -1), 1);
        targetMouse.current = { x, y };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = (touch.clientY / window.innerHeight) * 2 - 1;
        targetMouse.current = { x, y };
        setIsHovering(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  // Canvas particle simulation (Floating dandelion seeds, golden pollen, fireflies)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize 3D particles
    const particleCount = Math.min(75, Math.floor(window.innerWidth / 22));
    const particles: Particle[] = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.85 + 0.15,
      size: Math.random() * 4 + 2,
      vx: (Math.random() - 0.5) * 0.5,
      vy: Math.random() * 0.35 + 0.15,
      baseAlpha: Math.random() * 0.65 + 0.25,
      alpha: 0.5,
      type: Math.random() > 0.65 ? 'firefly' : Math.random() > 0.35 ? 'pollen' : 'petal',
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.02,
    }));

    let clock = 0;

    const render = () => {
      clock += 0.02;

      // Smooth lerp damping for mouse motion
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.055;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.055;

      ctx.clearRect(0, 0, width, height);

      const mx = currentMouse.current.x;
      const my = currentMouse.current.y;

      particles.forEach(p => {
        p.x += p.vx + Math.sin(clock + p.y * 0.01) * 0.35;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;
        if (p.y > height + 30) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        const parallaxOffsetX = mx * p.z * 45;
        const parallaxOffsetY = my * p.z * 32;

        const drawX = p.x + parallaxOffsetX;
        const drawY = p.y + parallaxOffsetY;

        ctx.save();
        ctx.translate(drawX, drawY);
        ctx.rotate(p.rotation);

        if (p.type === 'firefly') {
          const pulse = (Math.sin(clock * 2.8 + p.x) + 1) * 0.5;
          const glowAlpha = (p.baseAlpha * (0.65 + pulse * 0.35)).toFixed(2);

          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3.8 * p.z);
          grad.addColorStop(0, `rgba(250, 204, 21, ${glowAlpha})`);
          grad.addColorStop(0.35, `rgba(163, 230, 53, ${Number(glowAlpha) * 0.6})`);
          grad.addColorStop(1, 'rgba(34, 197, 94, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 3.8 * p.z, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'petal') {
          ctx.fillStyle = `rgba(217, 249, 157, ${(p.baseAlpha * 0.6).toFixed(2)})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.6 * p.z, p.size * 0.7 * p.z, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(134, 239, 172, ${(p.baseAlpha * 0.55).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.75 * p.z, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update 3D CSS transforms directly via requestAnimationFrame on container
  useEffect(() => {
    let animId: number;

    const update3DTransforms = () => {
      const container = containerRef.current;
      if (container) {
        const mx = currentMouse.current.x;
        const my = currentMouse.current.y;

        // 3D rotation angles in degrees
        const rotY = mx * 8.5;
        const rotX = -my * 7.0;
        const transX = -mx * 32;
        const transY = -my * 26;

        container.style.transform = `scale(1.14) translate3d(${transX}px, ${transY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }
      animId = requestAnimationFrame(update3DTransforms);
    };

    animId = requestAnimationFrame(update3DTransforms);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
      style={{ perspective: '1200px', perspectiveOrigin: 'center center' }}
    >
      {/* 3D Moving Scene Container */}
      <div
        ref={containerRef}
        className="absolute -inset-12 w-[calc(100%+96px)] h-[calc(100%+96px)] will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.08s cubic-bezier(0.1, 0.9, 0.2, 1)',
        }}
      >
        {/* Layer 0: Dark Emerald Deep Forest Biome with 3D Realistic Animals (Deer, Puppy, Fluffy Cat, Owl) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat shadow-2xl brightness-95"
          style={{
            backgroundImage: `url(${darkForestAnimalsBg})`,
            transform: 'translateZ(-50px) scale(1.06)',
          }}
        />

        {/* Layer 1: Atmospheric Deep Forest Dark Emerald Vignette & Shading */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: 'translateZ(10px)',
            background:
              'linear-gradient(180deg, rgba(2, 20, 9, 0.72) 0%, rgba(3, 35, 15, 0.42) 40%, rgba(1, 15, 6, 0.78) 100%)',
          }}
        />

        {/* Layer 2: Volumetric Golden Forest Glow filtering through mossy branches */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: 'translateZ(25px)',
            background:
              'radial-gradient(circle at 68% 28%, rgba(253, 224, 71, 0.22) 0%, rgba(74, 222, 128, 0.12) 35%, transparent 70%)',
          }}
        />

        {/* Layer 3: Floating 3D Living Animal Silhouette & Sprite Accents in Forest Space */}
        <div
          className="absolute top-1/5 right-1/4 select-none drop-shadow-2xl"
          style={{ transform: 'translateZ(70px)' }}
        >
          <div className="bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 px-3 py-1.5 rounded-2xl shadow-xl flex items-center space-x-2 animate-bounce">
            <span className="text-xl">🦌</span>
            <div className="text-left">
              <p className="text-[10px] text-emerald-300 font-bold leading-tight">Forest Guardian</p>
              <p className="text-[9px] text-emerald-400/80 font-mono">3D Ambient Animal</p>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-1/3 left-1/6 select-none drop-shadow-2xl"
          style={{ transform: 'translateZ(85px)' }}
        >
          <div className="bg-emerald-950/85 backdrop-blur-md border border-yellow-400/40 px-3 py-1.5 rounded-2xl shadow-xl flex items-center space-x-2 animate-pulse">
            <span className="text-xl">🦉</span>
            <div className="text-left">
              <p className="text-[10px] text-yellow-300 font-bold leading-tight">Night Watcher</p>
              <p className="text-[9px] text-yellow-400/80 font-mono">Sensory Hearing</p>
            </div>
          </div>
        </div>

        <div
          className="absolute top-2/5 left-1/12 select-none drop-shadow-md text-emerald-300/40 text-2xl"
          style={{ transform: 'translateZ(45px)' }}
        >
          🍃
        </div>
        <div
          className="absolute bottom-1/4 right-1/8 select-none drop-shadow-md text-yellow-300/50 text-2xl"
          style={{ transform: 'translateZ(65px)' }}
        >
          🐾
        </div>
        <div
          className="absolute top-1/3 left-3/4 select-none drop-shadow-md text-emerald-400/40 text-xl"
          style={{ transform: 'translateZ(55px)' }}
        >
          ✨
        </div>
      </div>


      {/* Layer 2: Floating Canvas Particles (Parallax Dandelions, Pollen, Fireflies) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Vignette depth framing */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-transparent to-black/60 z-20" />
    </div>
  );
};
