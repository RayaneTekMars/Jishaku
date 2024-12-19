"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Mountain, Heart, Target, Book, User, ArrowRight, ArrowLeft } from 'lucide-react';

type RiddleSection = 'chapter1' | 'chapter2' | 'chapter3';
type NonRiddleSection = 'intro' | 'character' | 'objectives' | 'hrp';
type SectionKey = RiddleSection | NonRiddleSection;

interface Riddle {
  question: string;
  answer: string;
}

interface Section {
  title: string;
  content: string;
  needsRiddle: boolean;
}

interface SandParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  life: number;
}

const riddles: Record<RiddleSection, Riddle> = {
  chapter1: {
    question: "Quel est le prénom de la mère d'Ibuki ?",
    answer: "mizuki",
  },
  chapter2: {
    question: "Dans quel village Ibuki a-t-il grandi ? (en minuscule)",
    answer: "suna",
  },
  chapter3: {
    question: "Quel est le titre visé par Mizuki ? (en minuscule)",
    answer: "kazekage",
  }
};

const sections: Record<SectionKey, Section> = {
  intro: {
    title: "Ibuki Jishaku",
    content: "Fils de Mizuki Jishaku, aspirant à devenir un grand ninja de Suna",
    needsRiddle: false
  },
  chapter1: {
    title: "Chapitre 1 - La naissance d'Ibuki",
    content: "Né sous les vents chauds de Suna, Ibuki est le fils de Mizuki Jishaku, une kunoichi respectée et Tokubetsu Jônin du village. Sa naissance fut marquée par une tempête de sable particulièrement intense, comme si le désert lui-même célébrait la venue d'un nouveau maître du sable.",
    needsRiddle: true
  },
  chapter2: {
    title: "Chapitre 2 - L'enfance d'Ibuki",
    content: "Grandissant dans l'ombre protectrice de sa mère, Ibuki développa très tôt une fascination pour le sable qui dansait autour de lui. Les villageois racontent qu'encore bambin, il créait déjà de petits tourbillons de sable pour amuser les autres enfants.",
    needsRiddle: true
  },
  chapter3: {
    title: "Chapitre 3 - L'entrée à l'académie",
    content: "Son entrée à l'académie marqua un tournant dans sa vie. Héritier des techniques du clan Jishaku, il commença à développer sa propre approche de la manipulation du sable, mêlant tradition et innovation.",
    needsRiddle: true
  },
  character: {
    title: "Caractère & Nindô",
    content: "Ibuki est un jeune ninja réfléchi et déterminé. Son Nindô : 'Comme le sable qui s'adapte à tout obstacle, je trouverai toujours un chemin vers mes objectifs.'",
    needsRiddle: false
  },
  objectives: {
    title: "Objectifs",
    content: "1. Maîtriser pleinement le Kekkei Genkai du clan Jishaku\n2. Soutenir sa mère dans son parcours vers le titre de Kazekage\n3. Protéger Sunagakure et ses habitants",
    needsRiddle: false
  },
  hrp: {
    title: "Expérience HRP",
    content: "Présentation de mon expérience en RP, mes anciennes candidatures et mes réalisations.",
    needsRiddle: false
  }
};

const IbukiCandidature = () => {
  const [currentSection, setCurrentSection] = useState<SectionKey>('intro');
  const [sandParticles, setSandParticles] = useState<SandParticle[]>([]);
  const [riddleAnswer, setRiddleAnswer] = useState('');

  const [showError, setShowError] = useState(false);

  const handleRiddleSubmit = () => {
    if (currentSection in riddles) {
      const currentRiddle = riddles[currentSection as RiddleSection];
      if (riddleAnswer.toLowerCase() === currentRiddle.answer) {
        const sectionKeys = Object.keys(sections) as SectionKey[];
        const currentIndex = sectionKeys.indexOf(currentSection);
        setCurrentSection(sectionKeys[currentIndex + 1]);
        setRiddleAnswer('');
        setShowError(false);
      } else {
        setShowError(true);
      }
    }
  };

  const handleNextSection = () => {
    const sectionKeys = Object.keys(sections) as SectionKey[];
    const currentIndex = sectionKeys.indexOf(currentSection);
    if (currentIndex < sectionKeys.length - 1) {
      setCurrentSection(sectionKeys[currentIndex + 1]);
    }
  };

  const handlePrevSection = () => {
    const sectionKeys = Object.keys(sections) as SectionKey[];
    const currentIndex = sectionKeys.indexOf(currentSection);
    if (currentIndex > 0) {
      setCurrentSection(sectionKeys[currentIndex - 1]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSandParticles(prev =>
        prev.map(particle => ({
          ...particle,
          x: particle.x + Math.cos(particle.angle) * particle.speed,
          y: particle.y + Math.sin(particle.angle) * particle.speed,
          life: particle.life - 1
        })).filter(particle => particle.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;

    setSandParticles(prev => {
      if (prev.length >= 30) return prev;

      const newParticles = Array.from({ length: Math.floor(Math.random() * 2) + 1 }, () => ({
        id: Math.random(),
        x: clientX,
        y: clientY,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 1.5 + 0.5,
        size: Math.random() * 2 + 1,
        life: 50
      }));

      return [...prev, ...newParticles];
    });
  }, []);

  const SectionIcon = ({ section }: { section: SectionKey }) => {
    switch (section) {
      case 'chapter1':
      case 'chapter2':
      case 'chapter3':
        return <Book size={24} className="text-amber-700" />;
      case 'character':
        return <Heart size={24} className="text-amber-700" />;
      case 'objectives':
        return <Target size={24} className="text-amber-700" />;
      case 'hrp':
        return <User size={24} className="text-amber-700" />;
      default:
        return <Mountain size={24} className="text-amber-700" />;
    }
  };

  return (
    <div
      className="relative h-screen w-full bg-gradient-to-b from-amber-100 to-amber-200 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {sandParticles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-amber-600 mix-blend-multiply"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.life / 100,
            transform: `translate(-50%, -50%)`,
            transition: 'all 0.016s linear'
          }}
        />
      ))}

      <div className="fixed top-0 left-0 w-full bg-amber-800/20 backdrop-blur-sm p-4 z-20">
        <div className="flex justify-center space-x-4 flex-wrap gap-y-2">
          {(Object.entries(sections) as [SectionKey, Section][]).map(([key, section]) => (
            <button
              key={key}
              onClick={() => !section.needsRiddle && setCurrentSection(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                currentSection === key
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100/50 text-amber-800 hover:bg-amber-200/50'
              }`}
              style={{ flex: '1 1 auto', minWidth: '150px' }}
            >
              <SectionIcon section={key} />
              <span className="text-sm">{section.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-4 pt-20">
        <div className="bg-amber-100/40 p-8 rounded-lg shadow-lg backdrop-blur-md w-full transform transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-amber-900">{sections[currentSection].title}</h1>
            <SectionIcon section={currentSection} />
          </div>

          <div className="text-lg text-amber-800 whitespace-pre-wrap mb-6">
            {sections[currentSection].content}
          </div>

          {sections[currentSection].needsRiddle && currentSection in riddles && (
            <div className="mt-4">
              <p className="text-amber-800">{riddles[currentSection as RiddleSection].question}</p>
              <input
                type="text"
                value={riddleAnswer}
                onChange={(e) => setRiddleAnswer(e.target.value)}
                className="mt-2 px-4 py-2 bg-white text-amber-800 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
                placeholder="Votre réponse"
              />
              <button
                onClick={handleRiddleSubmit}
                className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg"
              >
                Soumettre
              </button>
              {showError && <p className="text-red-500 mt-2">Mauvaise réponse. Essayez encore.</p>}
            </div>
          )}

          {!sections[currentSection].needsRiddle && (
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevSection}
                className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg"
                disabled={Object.keys(sections).indexOf(currentSection) === 0}
              >
                <ArrowLeft />
                <span>Précédent</span>
              </button>
              <button
                onClick={handleNextSection}
                className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg"
                disabled={Object.keys(sections).indexOf(currentSection) === Object.keys(sections).length - 1}
              >
                <span>Suivant</span>
                <ArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IbukiCandidature;