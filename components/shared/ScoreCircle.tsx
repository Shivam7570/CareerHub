
import React from 'react';

interface ScoreCircleProps {
  score: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getStrokeColor = (value: number) => {
    if (value < 50) return '#ef4444'; // red-500
    if (value < 80) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 140 140">
        <circle
          className="text-slate-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="70"
          cy="70"
        />
        <circle
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={getStrokeColor(score)}
          fill="transparent"
          r={radius}
          cx="70"
          cy="70"
          className="transform -rotate-90 origin-center transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-3xl font-bold text-white">
        {score}
        <span className="text-xl">%</span>
      </span>
    </div>
  );
};

export default ScoreCircle;
