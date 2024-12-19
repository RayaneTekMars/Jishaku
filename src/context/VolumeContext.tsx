'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface VolumeContextType {
  volume: number;
  setVolume: (volume: number) => void;
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

export const VolumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [volume, setVolumeState] = useState(0.5);

  useEffect(() => {
    // Charger le volume depuis localStorage au montage
    const savedVolume = localStorage.getItem('audioVolume');
    if (savedVolume !== null) {
      setVolumeState(parseFloat(savedVolume));
    }
  }, []);

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem('audioVolume', newVolume.toString());
  };

  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
      {children}
      <div className="fixed bottom-4 right-4 bg-amber-100/90 p-4 rounded-lg shadow-lg backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          <span className="text-amber-800 text-sm">Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-32 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-amber-600
                     hover:[&::-webkit-slider-thumb]:bg-amber-700"
          />
          <span className="text-amber-800 text-sm w-8">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </VolumeContext.Provider>
  );
};

export const useVolume = () => {
  const context = useContext(VolumeContext);
  if (context === undefined) {
    throw new Error('useVolume must be used within a VolumeProvider');
  }
  return context;
};