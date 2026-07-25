import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchMatchRecord,
  fetchEscalations,
  resolveEscalation,
  createEscalation,
} from '../api/matching';

export function useMatchRecord(invoiceId: string) {
  return useQuery({
    queryKey: ['matchRecord', invoiceId],
    queryFn: () => fetchMatchRecord(invoiceId),
    enabled: !!invoiceId,
  });
}

export function useEscalations() {
  return useQuery({
    queryKey: ['escalations'],
    queryFn: fetchEscalations,
  });
}


export function useResolveEscalation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comments }: { id: string; comments: string }) =>
      resolveEscalation(id, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escalations'] });
    },
  });
}


export function useCreateEscalation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ matchId, escalatedTo, reason }: { matchId: string; escalatedTo: string; reason: string }) =>
      createEscalation(matchId, escalatedTo, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escalations'] });
    },
  });
}
