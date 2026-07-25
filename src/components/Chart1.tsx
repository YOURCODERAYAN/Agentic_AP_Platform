// components/dashboard/InvoiceFunnel.tsx
import { useInvoiceFunnel } from '../queries/useDashboard';

export function InvoiceFunnel() {
  const { data: funnelData, isLoading } = useInvoiceFunnel();

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 dark:bg-slate-900 dark:border-slate-700">
        <div className="text-sm font-semibold mb-2 text-slate-900 dark:text-slate-100">Invoice funnel</div>
        <div className="h-[180px] bg-gray-100 rounded animate-pulse dark:bg-slate-800" />
      </div>
    );
  }

  if (!funnelData) return null;

  const maxValue = funnelData[0].value; // Received — the tallest bar

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 dark:bg-slate-900 dark:border-slate-700">
      <div className="text-sm font-semibold mb-4 text-slate-900 dark:text-slate-100">Invoice funnel</div>

      <div className="flex gap-3 items-end">
        {funnelData.map((stage) => (
          <div key={stage.name} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-indigo-500 rounded-md"
              style={{ height: `${(stage.value / maxValue) * 200}px` }}
            />
            <div className="text-xs text-gray-500 mt-2">{stage.name}</div>
            <div className="text-sm font-semibold text-gray-800">{stage.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}