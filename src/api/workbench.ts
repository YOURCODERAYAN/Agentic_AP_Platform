import { mockExtractedFields } from '../data/data';
import type { ExtractedField } from '../types/index';

const wait = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ----GET /api/invoices/:id/extracted-fields ----------
export async function fetchExtractedFields(invoiceId: string): Promise<ExtractedField[]> {
  await wait();
  return mockExtractedFields.filter((f) => f.invoiceId === invoiceId);
}

// ─── PATCH /api/invoices/:id/extracted-fields — save manual edits ───
export async function updateExtractedField(
  invoiceId: string,
  label: string,
  newValue: string
): Promise<ExtractedField> {
  await wait(200);
  const field = mockExtractedFields.find(
    (f) => f.invoiceId === invoiceId && f.label === label
  );
  if (!field) throw new Error(`Field "${label}" not found for ${invoiceId}`);
  field.value = newValue;
  return field;
}

// POST /api/invoices/:id/reprocess — re-run AI extraction (moved here from invoices.ts)
export async function reprocessExtraction(invoiceId: string): Promise<ExtractedField[]> {
  await wait(1200); // longer delay — this is what your skeleton loader shows during
  return mockExtractedFields.filter((f) => f.invoiceId === invoiceId);
}
