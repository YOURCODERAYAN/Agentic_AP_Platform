import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInvoices, fetchInvoiceById, updateInvoiceStage, reassignInvoice } from '../api/invoices';
import { fetchReviewers } from '../api/dashboard';
import type { InvoiceStage } from '../types/index';

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });
}

export function useInvoiceById(id: string) {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => fetchInvoiceById(id),
    enabled: !!id, // don't fire until we actually have an id
  });
}

export function useReviewers() {
  return useQuery({
    queryKey: ['reviewers'],
    queryFn: fetchReviewers,
  });
}


export function useUpdateInvoiceStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: InvoiceStage }) =>
      updateInvoiceStage(id, stage),
    onSuccess: () => {
      // any screen reading invoices or dashboard stats will now refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

export function useReassignInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewer }: { id: string; reviewer: string }) =>
      reassignInvoice(id, reviewer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}
