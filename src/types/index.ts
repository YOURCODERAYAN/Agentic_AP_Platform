// ─── Shared entity types for the Agentic AP Platform ───

export type InvoiceStage =
  | 'received'
  | 'extracted'
  | 'matched'
  | 'human_review'
  | 'approved'
  | 'paid';

export type MatchStatus = '2-way' | '3-way' | 'exception';

export type ExceptionCategory =
  | 'Missing PO'
  | 'Vendor Mismatch'
  | 'GST Validation Error'
  | 'Duplicate Invoice';

export interface Invoice {
  id: string;                  // e.g. "INV-1023"
  vendor: string;
  vendorGstin: string;
  uploadedAt: string;          // ISO date
  invoiceDate: string;         // ISO date
  amount: number;
  poNumber: string | null;
  matchStatus: MatchStatus;
  assignedTo: string | null;   // reviewer name, or null = unassigned
  stage: InvoiceStage;
  documentUrl: string;         // path to mock invoice image/pdf
}

export interface ExtractedField {
  invoiceId: string;
  label: string;
  value: string;
  confidence: number;          // 0-100
}

export interface LineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface MatchRecord {
  invoiceId: string;
  invoiceLines: LineItem[];
  poLines: LineItem[];
  grnLines: LineItem[];
}

export interface Escalation {
  id: string;                  // e.g. "M-2291"
  matchId: string;              // ties back to an invoiceId
  escalatedTo: string;
  reason: string;
  isResolved: boolean;
  resolvedComments: string | null;
}

export interface ExceptionItem {
  id: string;                  // e.g. "EXC-501"
  invoiceId: string;
  category: ExceptionCategory;
  isResolved: boolean;
  aiSuggestion: string | null;
  resolvedBy: string | null;
  resolverComments: string | null;
}

export interface Reviewer {
  id: string;
  name: string;
  queueCount: number;
  status: 'Available' | 'Busy' | 'Offline';
}

export interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;           // ISO date
  isRead: boolean;
}

export interface VolumeTrendPoint {
  day: string;
  intake: number;
  processed: number;
}

export interface ExceptionBreakdownPoint {
  category: ExceptionCategory;
  count: number;
}

export interface DashboardStats {
  totalInvoices: number;
  processedInvoices: number;
  pendingApprovals: number;
  activeExceptions: number;
  stpRate: number;             // straight-through processing %, 0-100
  avgProcessingTimeHrs: number;
}
