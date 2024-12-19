import React, { useState, useEffect } from 'react';

interface SandParticle {
  id: number;
  x: number;
  y: number;
  speed: number;
  angle: number;
  size: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
}

const NUM_PARTICLES = 150;

const generateParticle = (width: number, height: number): SandParticle => ({
  id: Math.random(),
  x: Math.random() * width,
  y: Math.random() * height,
  speed: Math.random() * 1 + 0.5,
  angle: Math.random() * Math.PI * 2,
  size: Math.random() * 3 + 2,
  opacity: Math.random() * 0.4 + 0.3,
  wobble: Math.random() * Math.PI * 2,
  wobbleSpeed: (Math.random() - 0.5) * 0.02
});

const FloatingSand = () => {
  const [particles, setParticles] = useState<SandParticle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const initialParticles = Array.from(
      { length: NUM_PARTICLES },
      () => generateParticle(window.innerWidth, window.innerHeight)
    );
    setParticles(initialParticles);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const updateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          // Mise à jour de l'oscillation
          const wobble = particle.wobble + particle.wobbleSpeed;

          // Calcul du mouvement avec oscillation
          const angleWithWobble = particle.angle + Math.sin(wobble) * 0.2;

          // Mise à jour des positions
          let x = particle.x + Math.cos(angleWithWobble) * particle.speed;
          let y = particle.y + Math.sin(angleWithWobble) * particle.speed;

          // Wrap around quand les particules sortent de l'écran
          if (x < -10) x = dimensions.width + 10;
          if (x > dimensions.width + 10) x = -10;
          if (y < -10) y = dimensions.height + 10;
          if (y > dimensions.height + 10) y = -10;

          return { ...particle, x, y, wobble };
        })
      );
    };

    const intervalId = setInterval(updateParticles, 16);
    return () => clearInterval(intervalId);
  }, [dimensions]);

  return (
    <div className="fixed inset-0 pointer-events-none">
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

export default FloatingSand;