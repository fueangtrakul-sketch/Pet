import React, { useRef, useState } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  depth?: number; // max tilt degrees (default 6)
  glare?: boolean;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  onClick,
  depth = 8,
  glare = true,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [shadow, setShadow] = useState<string>('0 20px 40px -15px rgba(0,0,0,0.6)');
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * depth;
    const rotateY = ((x - centerX) / centerX) * depth;

    // Shift shadow opposite to light direction
    const shadowX = -rotateY * 2.5;
    const shadowY = Math.max(rotateX * 2.5 + 20, 10);

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`
    );
    setShadow(`${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 45px -10px rgba(0, 0, 0, 0.75), 0 0 25px rgba(74, 222, 128, 0.2)`);

    if (glare) {
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.38,
      });
    }
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setShadow('0 20px 40px -15px rgba(0,0,0,0.6)');
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative will-change-transform preserve-3d ${className}`}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        boxShadow: shadow,
        transition: 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.22s ease',
      }}
    >
      {children}

      {/* Dynamic Specular Light Glare that follows mouse */}
      {glare && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 overflow-hidden z-30"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)`,
          }}
        />
      )}
    </div>
  );
};
