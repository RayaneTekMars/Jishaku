"use client";
import React, { useState, useEffect, useRef } from 'react';
import Suna from "@/components/Suna";
import { useVolume } from '@/context/VolumeContext';

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
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isExploding, setIsExploding] = useState(false);
  const [iconScale, setIconScale] = useState(1);
  const [iconOpacity, setIconOpacity] = useState(1);
  const [animationComplete, setAnimationComplete] = useState(false);
  const { volume } = useVolume();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialisation de l'audio
  useEffect(() => {
    try {
      audioRef.current = new Audio('/gaara.wav');
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    } catch (error) {
      console.warn('Audio non supporté ou fichier manquant:', error);
    }
  }, []);

  // Mise à jour du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Création des vagues de particules d'avalanche
  const createAvalancheWave = (waveNumber: number): TransitionParticle[] => {
    const screenWidth = window.innerWidth;
    const particlesPerWave = 20;

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
        acceleration: 1 + (Math.random() * 0.1)
      };
    });
  };

  // Démarrage de l'explosion
  const startExplosion = () => {
    if (!isExploding) {
      setIsExploding(true);

      // Lecture du son
      if (audioRef.current) {
        try {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(error => {
            console.warn('Erreur lors de la lecture audio:', error);
          });
        } catch (error) {
          console.warn('Erreur audio:', error);
        }
      }

      // Création des particules initiales
      const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
      const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 500;

      const initialParticles = Array.from({ length: 100 }, () => ({
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

      setParticles(initialParticles);
      setIconScale(0);
      setIconOpacity(0);

      // Déclenchement des vagues d'avalanche
      setTimeout(() => {
        const waves = Array.from({ length: 5 }, (_, i) => createAvalancheWave(i));
        waves.forEach((wave, index) => {
          setTimeout(() => {
            setParticles(prev => [...prev, ...wave]);
          }, index * 100);
        });
      }, 500);
    }
  };

  // Animation des particules
  useEffect(() => {
    if (animationComplete && !isTransitioning) {
      onAnimationComplete();
      return;
    }

    if (!isExploding) return;

    const interval = setInterval(() => {
      setParticles(prev => {
        const updatedParticles = prev.map(particle => {
          if (particle.isTransitionParticle) {
            // Animation des particules de transition
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
            // Animation des particules d'explosion
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

        if (remainingParticles.length === 0 && isExploding) {
          setAnimationComplete(true);
          setIsExploding(false);
        }

        return remainingParticles;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [animationComplete, onAnimationComplete, isTransitioning, isExploding]);

  return (
    <div className={`fixed inset-0 ${isTransitioning ? 'bg-transparent' : 'bg-amber-100'} z-50 
                    transition-all duration-500 ${isTransitioning || animationComplete ? 'opacity-0' : 'opacity-100'}`}>
      {/* Rendu des particules */}
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

      {/* Logo cliquable */}
      <button
        className="absolute left-1/2 top-1/2 text-amber-800 cursor-pointer
                   hover:text-amber-600 focus:outline-none group"
        style={{
          transform: `translate(-50%, -50%) scale(${iconScale})`,
          opacity: iconOpacity,
          transition: 'all 0.3s ease-out'
        }}
        onClick={startExplosion}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-amber-200 rounded-full opacity-0
                        group-hover:opacity-100 group-hover:animate-ping" />
          <div className="transform group-hover:scale-110 group-hover:rotate-3
                        transition-all duration-300 ease-out">
            <Suna width={128} height={128} strokeWidth={1.5} />
          </div>
        </div>
      </button>
    </div>
  );
};

export default SandExplosion;