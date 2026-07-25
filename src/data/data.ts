import type {
  Invoice,
  ExtractedField,
  MatchRecord,
  Escalation,
  ExceptionItem,
  Reviewer,
  NotificationItem,
} from '../types/index';

// ─── Reviewers ───
export const mockReviewers: Reviewer[] = [
  { id: 'REV-1', name: 'Priya Sharma', queueCount: 8, status: 'Available' },
  { id: 'REV-2', name: 'Rohit Kapoor', queueCount: 14, status: 'Busy' },
  { id: 'REV-3', name: 'Meera Joshi', queueCount: 3, status: 'Available' },
  { id: 'REV-4', name: 'Arjun Nair', queueCount: 0, status: 'Offline' },
];

// ─── Invoices ─── (one shared array every screen reads from)
export const mockInvoices: Invoice[] = [
  {
    id: 'INV-1023',
    vendor: 'Acme Steel Supplies Pvt Ltd',
    vendorGstin: '19AACCA1234F1Z5',
    uploadedAt: '2026-07-21T09:12:00Z',
    invoiceDate: '2026-07-20',
    amount: 42500,
    poNumber: 'PO-3391',
    matchStatus: '2-way',
    assignedTo: 'Priya Sharma',
    stage: 'human_review',
    documentUrl: '/mock-invoices/invoice-1023.png',
  },
  {
    id: 'INV-1024',
    vendor: 'Bharat Traders',
    vendorGstin: '27AAACB5678G1Z2',
    uploadedAt: '2026-07-21T10:03:00Z',
    invoiceDate: '2026-07-19',
    amount: 18200,
    poNumber: 'PO-3388',
    matchStatus: '3-way',
    assignedTo: 'Rohit Kapoor',
    stage: 'matched',
    documentUrl: '/mock-invoices/invoice-1024.png',
  },
  {
    id: 'INV-1025',
    vendor: 'Nexa Logistics',
    vendorGstin: '06AABCN9988H1Z7',
    uploadedAt: '2026-07-22T08:45:00Z',
    invoiceDate: '2026-07-22',
    amount: 96000,
    poNumber: null,
    matchStatus: 'exception',
    assignedTo: null,
    stage: 'extracted',
    documentUrl: '/mock-invoices/invoice-1025.png',
  },
  {
    id: 'INV-1026',
    vendor: 'Orbit Components',
    vendorGstin: '29AAFCO4433K1Z1',
    uploadedAt: '2026-07-22T11:20:00Z',
    invoiceDate: '2026-07-21',
    amount: 7300,
    poNumber: 'PO-3402',
    matchStatus: '2-way',
    assignedTo: 'Priya Sharma',
    stage: 'approved',
    documentUrl: '/mock-invoices/invoice-1026.png',
  },
  {
    id: 'INV-1027',
    vendor: 'Vega Freight Services',
    vendorGstin: '33AADCV2211L1Z9',
    uploadedAt: '2026-07-23T07:55:00Z',
    invoiceDate: '2026-07-23',
    amount: 31150,
    poNumber: 'PO-3410',
    matchStatus: '3-way',
    assignedTo: 'Meera Joshi',
    stage: 'received',
    documentUrl: '/mock-invoices/invoice-1027.png',
  },
  {
    id: 'INV-1028',
    vendor: 'Acme Steel Supplies Pvt Ltd',
    vendorGstin: '19AACCA1234F1Z5',
    uploadedAt: '2026-07-23T09:30:00Z',
    invoiceDate: '2026-07-22',
    amount: 12800,
    poNumber: 'PO-3391',
    matchStatus: 'exception',
    assignedTo: null,
    stage: 'extracted',
    documentUrl: '/mock-invoices/invoice-1028.png',
  },
  {
    id: 'INV-1029',
    vendor: 'GreenLeaf Packaging',
    vendorGstin: '24AABCG6677M1Z4',
    uploadedAt: '2026-07-24T13:10:00Z',
    invoiceDate: '2026-07-24',
    amount: 5600,
    poNumber: 'PO-3418',
    matchStatus: '2-way',
    assignedTo: 'Rohit Kapoor',
    stage: 'paid',
    documentUrl: '/mock-invoices/invoice-1029.png',
  },
  {
    id: 'INV-1030',
    vendor: 'Nexa Logistics',
    vendorGstin: '06AABCN9988H1Z7',
    uploadedAt: '2026-07-24T14:40:00Z',
    invoiceDate: '2026-07-23',
    amount: 21900,
    poNumber: 'PO-3421',
    matchStatus: '3-way',
    assignedTo: null,
    stage: 'matched',
    documentUrl: '/mock-invoices/invoice-1030.png',
  },
];

// ─── Extracted fields (Screen 3 — AI Workbench) ───
// keyed by invoiceId so useExtractedFields(invoiceId) can filter
export const mockExtractedFields: ExtractedField[] = [
  { invoiceId: 'INV-1023', label: 'Vendor Name', value: 'Acme Steel Supplies Pvt Ltd', confidence: 96 },
  { invoiceId: 'INV-1023', label: 'Invoice Number', value: 'INV-1023', confidence: 99 },
  { invoiceId: 'INV-1023', label: 'Invoice Date', value: '20 Jul 2026', confidence: 92 },
  { invoiceId: 'INV-1023', label: 'Total Amount', value: '₹42,500.00', confidence: 88 },
  { invoiceId: 'INV-1023', label: 'GST Breakdown', value: 'CGST 9% + SGST 9%', confidence: 76 },
  { invoiceId: 'INV-1023', label: 'PO Number', value: 'PO-3391', confidence: 61 },

  { invoiceId: 'INV-1025', label: 'Vendor Name', value: 'Nexa Logistics', confidence: 94 },
  { invoiceId: 'INV-1025', label: 'Invoice Number', value: 'INV-1025', confidence: 99 },
  { invoiceId: 'INV-1025', label: 'Invoice Date', value: '22 Jul 2026', confidence: 90 },
  { invoiceId: 'INV-1025', label: 'Total Amount', value: '₹96,000.00', confidence: 85 },
  { invoiceId: 'INV-1025', label: 'GST Breakdown', value: 'IGST 18%', confidence: 71 },
  { invoiceId: 'INV-1025', label: 'PO Number', value: 'Not found', confidence: 12 },
];

// ─── Matching workbench line items (Screen 4) ───
export const mockMatchRecords: MatchRecord[] = [
  {
    invoiceId: 'INV-1023',
    invoiceLines: [
      { name: 'Steel rods 12mm x200', quantity: 200, unitPrice: 200, amount: 40000 },
      { name: 'Delivery charge', quantity: 1, unitPrice: 2500, amount: 2500 },
    ],
    poLines: [
      { name: 'Steel rods 12mm x200', quantity: 200, unitPrice: 200, amount: 40000 },
      { name: 'Delivery charge', quantity: 1, unitPrice: 2000, amount: 2000 }, // price variance
    ],
    grnLines: [
      { name: 'Steel rods 12mm x200', quantity: 198, unitPrice: 200, amount: 39600 }, // qty variance
      { name: 'Delivery charge', quantity: 1, unitPrice: 2500, amount: 2500 },
    ],
  },
  {
    invoiceId: 'INV-1024',
    invoiceLines: [
      { name: 'Packaging cartons x500', quantity: 500, unitPrice: 36.4, amount: 18200 },
    ],
    poLines: [
      { name: 'Packaging cartons x500', quantity: 500, unitPrice: 36.4, amount: 18200 },
    ],
    grnLines: [
      { name: 'Packaging cartons x500', quantity: 500, unitPrice: 36.4, amount: 18200 },
    ],
  },
];

// ─── Escalations (Screen 4) ───
export const mockEscalations: Escalation[] = [
  {
    id: 'M-2291',
    matchId: 'INV-1023',
    escalatedTo: 'Priya Sharma',
    reason: 'Quantity mismatch exceeds 5% tolerance',
    isResolved: false,
    resolvedComments: null,
  },
  {
    id: 'M-2288',
    matchId: 'INV-1030',
    escalatedTo: 'Rohit Kapoor',
    reason: 'Price variance on delivery charge line',
    isResolved: true,
    resolvedComments: 'Confirmed with vendor — delivery pricing updated in July.',
  },
  {
    id: 'M-2280',
    matchId: 'INV-1027',
    escalatedTo: 'Meera Joshi',
    reason: 'GRN not yet logged for this PO',
    isResolved: false,
    resolvedComments: null,
  },
];

// ─── Exceptions (Screen 5) ───
export const mockExceptions: ExceptionItem[] = [
  {
    id: 'EXC-501',
    invoiceId: 'INV-1025',
    category: 'Missing PO',
    isResolved: false,
    aiSuggestion: 'AI suggests routing to John Doe in Procurement due to missing PO reference.',
    resolvedBy: null,
    resolverComments: null,
  },
  {
    id: 'EXC-502',
    invoiceId: 'INV-1028',
    category: 'Duplicate Invoice',
    isResolved: false,
    aiSuggestion: 'AI detected 92% similarity with INV-1023 from the same vendor — possible duplicate.',
    resolvedBy: null,
    resolverComments: null,
  },
  {
    id: 'EXC-498',
    invoiceId: 'INV-1019',
    category: 'GST Validation Error',
    isResolved: true,
    aiSuggestion: null,
    resolvedBy: 'Meera Joshi',
    resolverComments: 'Corrected HSN code, re-validated GSTIN against portal.',
  },
  {
    id: 'EXC-495',
    invoiceId: 'INV-1012',
    category: 'Vendor Mismatch',
    isResolved: true,
    aiSuggestion: null,
    resolvedBy: 'Rohit Kapoor',
    resolverComments: 'Vendor name confirmed as legal alias of registered vendor.',
  },
];

// ─── Notifications (top nav drawer) ───
export const mockNotifications: NotificationItem[] = [
  { id: 'N-1', message: 'INV-1023 OCR extraction completed', timestamp: '2026-07-25T09:14:00Z', isRead: false },
  { id: 'N-2', message: 'INV-1025 requires human review — missing PO', timestamp: '2026-07-25T09:02:00Z', isRead: false },
  { id: 'N-3', message: 'INV-1019 GST exception resolved by Meera Joshi', timestamp: '2026-07-24T17:30:00Z', isRead: false },
  { id: 'N-4', message: 'INV-1012 flagged as possible duplicate', timestamp: '2026-07-24T15:05:00Z', isRead: true },
  { id: 'N-5', message: 'INV-1029 payment completed', timestamp: '2026-07-24T11:40:00Z', isRead: true },
];

// ─── Volume trend (Dashboard chart) — last 7 days ───
export const mockVolumeTrend = [
  { day: 'Mon', intake: 118, processed: 102 },
  { day: 'Tue', intake: 142, processed: 129 },
  { day: 'Wed', intake: 109, processed: 114 },
  { day: 'Thu', intake: 163, processed: 148 },
  { day: 'Fri', intake: 181, processed: 170 },
  { day: 'Sat', intake: 88, processed: 95 },
  { day: 'Sun', intake: 71, processed: 79 },
];


// ─── Invoice funnel (Dashboard chart) ───
export const mockInvoiceFunnel = [
  { name: 'Received', value: 1284 },
  { name: 'Extracted', value: 1190 },
  { name: 'Matched', value: 1080 },
  { name: 'Approved', value: 1042 },
  { name: 'Paid', value: 960 },
];


