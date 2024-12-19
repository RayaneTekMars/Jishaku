"use client";
import React, { useState, useEffect } from 'react';

interface BaseParticle {
  id: string | number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  life: number;
  opacity: number;
  isTransitionParticle: boolean;
}

interface ExplosionParticle extends BaseParticle {
  isTransitionParticle: false;
}

interface TransitionParticle extends BaseParticle {
  isTransitionParticle: true;
  wobble: number;
  wobbleSpeed: number;
  acceleration: number;
}

type Particle = ExplosionParticle | TransitionParticle;

interface SandExplosionProps {
  onAnimationComplete: () => void;
  isTransitioning: boolean;
}

const SandExplosion: React.FC<SandExplosionProps> = ({ onAnimationComplete, isTransitioning }) => {
  const [particles, setParticles] = useState<Particle[]>(() => {
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 500;

    return Array.from({ length: 100 }, () => ({
      id: Math.random(),
      x: centerX,
      y: centerY,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 15 + 5,
      size: Math.random() * 4 + 2,
      life: 100,
      opacity: 1,
      isTransitionParticle: false
    } as ExplosionParticle));
  });

  const [animationComplete, setAnimationComplete] = useState(false);

  const createAvalancheWave = (waveNumber: number): TransitionParticle[] => {
    const screenWidth = window.innerWidth;
    const particlesPerWave = 10;

    return Array.from({ length: particlesPerWave }, () => {
      const startX = Math.random() * screenWidth;
      const startY = -10 - (Math.random() * 100 * waveNumber);

      return {
        id: Math.random() + 'transition' + waveNumber,
        x: startX,
        y: startY,
        angle: Math.PI / 2 + (Math.random() * 0.6 - 0.3),
        speed: Math.random() * 15 + 10 + (waveNumber * 2),
        size: Math.random() * 5 + 2,
        life: 150,
        opacity: 0.8,
        isTransitionParticle: true,
        wobble: Math.random() * 0.1,
        wobbleSpeed: Math.random() * 0.05,
        acceleration: 1 + (Math.random() * 0.2)
      };
    });
  };

  useEffect(() => {
    if (isTransitioning) {
      const waves = Array.from({ length: 5 }, (_, i) => createAvalancheWave(i));

      waves.forEach((wave, index) => {
        setTimeout(() => {
          setParticles(prev => [...prev, ...wave]);
        }, index * 100);
      });
    }
  }, [isTransitioning]);

  useEffect(() => {
    if (animationComplete && !isTransitioning) {
      onAnimationComplete();
      return;
    }

    const interval = setInterval(() => {
      setParticles(prev => {
        const updatedParticles = prev.map(particle => {
          if (particle.isTransitionParticle) {
            const wobbleX = Math.sin(Date.now() * particle.wobbleSpeed) * particle.wobble;
            return {
              ...particle,
              x: particle.x + wobbleX,
              y: particle.y + (particle.speed * particle.acceleration),
              speed: particle.speed * 1.01,
              opacity: particle.y > window.innerHeight ? 0 : particle.opacity,
              life: particle.y > window.innerHeight ? 0 : particle.life
            };
          } else {
            return {
              ...particle,
              x: particle.x + Math.cos(particle.angle) * particle.speed,
              y: particle.y + Math.sin(particle.angle) * particle.speed,
              life: particle.life - 1,
              opacity: particle.life / 100,
              speed: particle.speed * 0.98
            };
          }
        });

        const remainingParticles = updatedParticles.filter(particle => particle.life > 0);

        if (remainingParticles.length === 0 && !isTransitioning) {
          setAnimationComplete(true);
        }

        return remainingParticles;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [animationComplete, onAnimationComplete, isTransitioning]);

  return (
    <div className={`fixed inset-0 ${isTransitioning ? 'bg-transparent' : 'bg-amber-100'} z-50`}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-amber-600 mix-blend-multiply"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.016s linear'
          }}
        />
      ))}
    </div>
  );
};

export default SandExplosion;