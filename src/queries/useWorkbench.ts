import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExtractedFields, updateExtractedField, reprocessExtraction } from '../api/workbench';

export function useExtractedFields(invoiceId: string) {
  return useQuery({
    queryKey: ['extractedFields', invoiceId],
    queryFn: () => fetchExtractedFields(invoiceId),
    enabled: !!invoiceId,
  });
}


export function useUpdateExtractedField(invoiceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ label, value }: { label: string; value: string }) =>
      updateExtractedField(invoiceId, label, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extractedFields', invoiceId] });
    },
  });
}


export function useReprocessExtraction(invoiceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => reprocessExtraction(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extractedFields', invoiceId] });
    },
  });
}
