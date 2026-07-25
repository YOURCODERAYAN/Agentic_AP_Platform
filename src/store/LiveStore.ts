import { create } from 'zustand';
import type { QueryClient } from '@tanstack/react-query';
import type { Invoice, InvoiceStage } from '../types';

const stageOrder: InvoiceStage[] = ['received', 'extracted', 'matched', 'human_review', 'approved', 'paid'];

interface LiveStatusState {
  isLive: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  startSimulation: (queryClient: QueryClient) => void;
  stopSimulation: () => void;
}

export const useLiveStatusStore = create<LiveStatusState>((set, get) => ({
  isLive: false,
  intervalId: null,

  startSimulation: (queryClient) => {
    if (get().isLive) return; // already running

    const id = setInterval(() => {
      queryClient.setQueryData<Invoice[]>(['invoices'], (oldInvoices) => {
        if (!oldInvoices) return oldInvoices;

        const advanceable = oldInvoices.filter(
          (inv) => stageOrder.indexOf(inv.stage) < stageOrder.length - 1
        );
        if (advanceable.length === 0) return oldInvoices;

        const target = advanceable[Math.floor(Math.random() * advanceable.length)];
        const nextStage = stageOrder[stageOrder.indexOf(target.stage) + 1];

        return oldInvoices.map((inv) =>
          inv.id === target.id ? { ...inv, stage: nextStage } : inv
        );
      });

      // dashboard stats/exception breakdown are derived from invoices —
      // refetch those too so the KPI cards reflect the change
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    }, 2500);

    set({ isLive: true, intervalId: id });
  },

  stopSimulation: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({ isLive: false, intervalId: null });
  },
}));