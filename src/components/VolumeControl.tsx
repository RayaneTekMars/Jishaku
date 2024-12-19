'use client';
import React from 'react';
import { useVolume } from '@/context/VolumeContext';

const VolumeControl = () => {
  const { volume, setVolume } = useVolume();

  return (
    <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999 }}
         className="bg-amber-100/90 p-4 rounded-lg shadow-lg backdrop-blur-sm">
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
  );
};

export default VolumeControl;