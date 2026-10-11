import React, { useEffect, useState } from 'react';
import { PetProfile, PetSpecies } from '../types/pet';
import { SoundEffects } from '../services/soundEffects';

interface PetRunnerOverlayProps {
  currentScreen: 'home' | 'choose' | 'analysis' | 'dashboard' | 'review';
  activePet: PetProfile | null;
}

interface RunningPetState {
  id: number;
  direction: 'left-to-right' | 'right-to-left';
  species: PetSpecies;
  avatar: string;
  name: string;
}

export const PetRunnerOverlay: React.FC<PetRunnerOverlayProps> = ({
  currentScreen,
  activePet,
}) => {
  const [runningPet, setRunningPet] = useState<RunningPetState | null>(null);
  const [pawTrails, setPawTrails] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [prevScreen, setPrevScreen] = useState(currentScreen);

  useEffect(() => {
    if (prevScreen !== currentScreen) {
      // Determine screen order to decide direction
      const screenOrder = ['home', 'choose', 'analysis', 'dashboard', 'review'];
      const prevIdx = screenOrder.indexOf(prevScreen);
      const nextIdx = screenOrder.indexOf(currentScreen);
      const direction = nextIdx >= prevIdx ? 'left-to-right' : 'right-to-left';

      // Play scampering footsteps patter sound
      SoundEffects.playFootstepsPatter(5);

      const runnerId = Date.now();
      setRunningPet({
        id: runnerId,
        direction,
        species: activePet?.species || 'dog',
        avatar: activePet?.avatar || '',
        name: activePet?.name || 'Pet',
      });

      // Generate trail of paw prints
      const newPaws = Array.from({ length: 8 }).map((_, i) => ({
        id: runnerId + i,
        x: direction === 'left-to-right' ? 10 + i * 11 : 90 - i * 11,
        y: 82 + (i % 2 === 0 ? -1.5 : 1.5),
      }));
      setPawTrails(newPaws);

      // Clean up after run animation completes (1.4s)
      const timer = setTimeout(() => {
        setRunningPet(null);
        setPawTrails([]);
      }, 1400);

      setPrevScreen(currentScreen);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, prevScreen, activePet]);

  if (!runningPet) return null;

  const isLeftToRight = runningPet.direction === 'left-to-right';

  return (
    <div className="fixed inset-x-0 bottom-14 z-50 pointer-events-none overflow-hidden h-28">
      {/* Scampering Pet Character with 3D Depth Bounce */}
      <div
        className={`absolute bottom-2 flex items-center space-x-2 select-none ${
          isLeftToRight ? 'animate-run-right' : 'animate-run-left'
        }`}
        style={{
          filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.7))',
        }}
      >
        <div className="relative">
          {runningPet.avatar ? (
            <img
              src={runningPet.avatar}
              alt={runningPet.name}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-yellow-300 ring-2 ring-emerald-500 animate-pet-gallop ${
                !isLeftToRight ? 'scale-x-[-1]' : ''
              }`}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-emerald-900 border-2 border-yellow-300 ring-2 ring-emerald-500 flex items-center justify-center text-2xl animate-pet-gallop">
              🐾
            </div>
          )}

          {/* Scampering dust puff effect */}
          <div className="absolute -bottom-1 -left-2 text-xs opacity-75 animate-ping">
            💨
          </div>
        </div>

        {/* Floating Cute Tag bubble with pet name */}
        <div className="bg-emerald-950/90 border border-emerald-400 text-yellow-300 text-[11px] font-game font-bold px-2.5 py-1 rounded-xl shadow-lg whitespace-nowrap backdrop-blur-sm -translate-y-2">
          <span>{runningPet.name ? `${runningPet.name} 🐾` : '🐾'}</span>
        </div>
      </div>

      {/* Trailing Glowing Paw Prints */}
      {pawTrails.map((paw, i) => (
        <div
          key={paw.id}
          className="absolute text-yellow-300/80 animate-paw-fade text-sm pointer-events-none select-none"
          style={{
            left: `${paw.x}%`,
            top: `${paw.y}%`,
            animationDelay: `${i * 0.12}s`,
            transform: `rotate(${isLeftToRight ? 25 : -25}deg)`,
          }}
        >
          🐾
        </div>
      ))}
    </div>
  );
};
