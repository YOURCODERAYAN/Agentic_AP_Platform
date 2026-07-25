import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExceptions, resolveException } from '../api/exceptions';

export function useExceptions() {
  return useQuery({
    queryKey: ['exceptions'],
    queryFn: fetchExceptions,
  });
}


export function useResolveException() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolvedBy, comments }: { id: string; resolvedBy: string; comments: string }) =>
      resolveException(id, resolvedBy, comments),
    onSuccess: () => {
   
      queryClient.invalidateQueries({ queryKey: ['exceptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['exceptionBreakdown'] });
    },
  });
}
