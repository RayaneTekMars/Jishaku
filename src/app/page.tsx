"use client";

import React, { useState, useEffect } from 'react';
import SandExplosion from '@/components/SandExplosion';
import IbukiCandidature from '@/components/JishakuApplication';

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnimationComplete = () => {
    setIsTransitioning(true);
    // Commencer à montrer le contenu immédiatement quand la transition commence
    setShowContent(true);
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="relative min-h-screen">
      {/* La candidature est toujours rendue mais initialement invisible */}
      <div className={`transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <IbukiCandidature />
      </div>

      {/* L'animation de sable reste au-dessus */}
      <div className={`fixed inset-0 z-50 pointer-events-none`}>
        <SandExplosion
          onAnimationComplete={handleAnimationComplete}
          isTransitioning={isTransitioning}
        />
      </div>
    </main>
  );
}