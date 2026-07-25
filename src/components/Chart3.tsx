// components/dashboard/VolumeTrendChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useVolumeTrend } from '../queries/useDashboard';

export function VolumeTrendChart() {
  const { data, isLoading } = useVolumeTrend();

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 dark:bg-slate-900 dark:border-slate-700">
      <div className="text-sm font-medium mb-2 text-slate-900 dark:text-slate-100">Volume trend (7 days)</div>

      {isLoading ? (
        <div className="h-[220px] bg-gray-100 rounded animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="intake" name="Intake" stroke="#6366f1" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="processed" name="Processed" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}