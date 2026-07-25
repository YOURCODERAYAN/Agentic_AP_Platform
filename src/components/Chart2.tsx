import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useExceptionBreakdown } from '../queries/useDashboard';

const DONUT_COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981'];

export function ExceptionDonutChart() {
  const { data: exceptionData, isLoading } = useExceptionBreakdown();

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 dark:bg-slate-900 dark:border-slate-700">
        <div className="text-sm font-semibold mb-2 text-slate-900 dark:text-slate-100">Exception breakdown</div>
        <div className="h-[220px] bg-gray-100 rounded animate-pulse dark:bg-slate-800" />
      </div>
    );
  }

  if (!exceptionData) return null;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 dark:bg-slate-900 dark:border-slate-700">
      <div className="text-sm font-semibold mb-2 text-slate-900 dark:text-slate-100">Exception breakdown</div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={exceptionData}
            dataKey="count"
            nameKey="category"
            innerRadius={40}
            outerRadius={80}
          >
            {exceptionData.map((_, i) => (
              <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}