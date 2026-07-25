import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchVolumeTrend, fetchExceptionBreakdown, fetchInvoiceFunnel } from '../api/dashboard';


export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });
}

export function useVolumeTrend() {
  return useQuery({
    queryKey: ['volumeTrend'],
    queryFn: fetchVolumeTrend,
  });
}

export function useExceptionBreakdown() {
  return useQuery({
    queryKey: ['exceptionBreakdown'],
    queryFn: fetchExceptionBreakdown,
  });
}

export function useInvoiceFunnel() {
  return useQuery({
    queryKey: ['invoiceFunnel'],
    queryFn: fetchInvoiceFunnel,
  });
}