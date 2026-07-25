import { mockInvoices, mockExceptions, mockVolumeTrend, mockInvoiceFunnel, mockReviewers } from '../data/data';

import type { DashboardStats, ExceptionBreakdownPoint, ExceptionCategory, Reviewer } from '../types/index';

const wait = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// GET /api/dashboard/stats 
export async function fetchDashboardStats(): Promise<DashboardStats> {
  await wait();

  const total = mockInvoices.length;
  const processed = mockInvoices.filter((i) => i.stage === 'approved' || i.stage === 'paid').length;
  const pendingApprovals = mockInvoices.filter((i) => i.stage === 'human_review').length;
  const activeExceptions = mockExceptions.filter((e) => !e.isResolved).length;
  const stpRate = Math.round((processed / total) * 100);

  return {
    totalInvoices: total,
    processedInvoices: processed,
    pendingApprovals,
    activeExceptions,
    stpRate,
    avgProcessingTimeHrs: 6.2,
  };
}

// GET /api/dashboard/volume-trend 
export async function fetchVolumeTrend() {
  await wait();
  return mockVolumeTrend;
}

// GET /api/dashboard/exception-breakdown 
export async function fetchExceptionBreakdown(): Promise<ExceptionBreakdownPoint[]> {
  await wait();
  const categories: ExceptionCategory[] = [
    'Missing PO',
    'Vendor Mismatch',
    'GST Validation Error',
    'Duplicate Invoice',
  ];
  return categories.map((category) => ({
    category,
    count: mockExceptions.filter((e) => e.category === category).length,
  }));
}

//  GET /api/reviewers 
export async function fetchReviewers(): Promise<Reviewer[]> {
  await wait();
  return [...mockReviewers];
}

// GET /api/dashboard/funnel 
export async function fetchInvoiceFunnel() {
  await wait();
  return mockInvoiceFunnel;
}