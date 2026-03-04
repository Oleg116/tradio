import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  positive?: boolean | null;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, positive }) => (
  <div className="rounded-xl border bg-card p-4">
    <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
    <p className="text-lg font-semibold font-mono">{value}</p>
    {subValue && (
      <p className={`text-xs font-mono mt-1 ${
        positive === true ? 'text-success' : positive === false ? 'text-danger' : 'text-muted-foreground'
      }`}>
        {subValue}
      </p>
    )}
  </div>
);

export default StatCard;
