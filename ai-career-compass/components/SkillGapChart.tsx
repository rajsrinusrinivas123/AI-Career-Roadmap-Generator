
import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';
import { SkillPoint } from '../types';

interface SkillGapChartProps {
  data: SkillPoint[];
}

const SkillGapChart: React.FC<SkillGapChartProps> = ({ data }) => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Current Proficiency"
            dataKey="current"
            stroke="#818cf8"
            fill="#818cf8"
            fillOpacity={0.6}
          />
          <Radar
            name="Target Proficiency"
            dataKey="target"
            stroke="#ec4899"
            fill="#ec4899"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillGapChart;
