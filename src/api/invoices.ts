import { mockInvoices } from '../data/data';
import type { Invoice, InvoiceStage } from '../types';

const DELAY = 400; // ms — fake network latency
const wait = (ms = DELAY) => new Promise((res) => setTimeout(res, ms));

// GET /api/invoices 
export async function fetchInvoices(): Promise<Invoice[]> {
  await wait();
  return [...mockInvoices];
}

// ----GET /api/invoices/:id ----
export async function fetchInvoiceById(id: string): Promise<Invoice | undefined> {
  await wait();
  return mockInvoices.find((inv) => inv.id === id);
}

// ----> PATCH /api/invoices/:id — stage change (approve/reject/live-sim) ---->
export async function updateInvoiceStage(id: string, stage: InvoiceStage): Promise<Invoice> {
  await wait(200);
  const invoice = mockInvoices.find((inv) => inv.id === id);
  if (!invoice) throw new Error(`Invoice ${id} not found`);
  invoice.stage = stage;
  return invoice;
}

// ----->PATCH /api/invoices/:id — reassign to a reviewer---->
export async function reassignInvoice(id: string, reviewerName: string): Promise<Invoice> {
  await wait(200);
  const invoice = mockInvoices.find((inv) => inv.id === id);
  if (!invoice) throw new Error(`Invoice ${id} not found`);
  invoice.assignedTo = reviewerName;
  return invoice;
}

