import { mockMatchRecords, mockEscalations } from '../data/data';
import type { MatchRecord, Escalation } from '../types/index';

const wait = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// GET /api/matching/:invoiceId 
export async function fetchMatchRecord(invoiceId: string): Promise<MatchRecord | undefined> {
  await wait();
  return mockMatchRecords.find((m) => m.invoiceId === invoiceId);
}

// GET /api/escalations 
export async function fetchEscalations(): Promise<Escalation[]> {
  await wait();
  return [...mockEscalations];
}

// PATCH /api/escalations/:id — resolve 
export async function resolveEscalation(id: string, comments: string): Promise<Escalation> {
  await wait(200);
  const escalation = mockEscalations.find((e) => e.id === id);
  if (!escalation) throw new Error(`Escalation ${id} not found`);
  escalation.isResolved = true;
  escalation.resolvedComments = comments;
  return escalation;
}

//  POST /api/escalations — log a new one 
export async function createEscalation(
  matchId: string,
  escalatedTo: string,
  reason: string
): Promise<Escalation> {
  await wait(200);
  const newEscalation: Escalation = {
    id: `M-${Math.floor(2000 + Math.random() * 900)}`,
    matchId,
    escalatedTo,
    reason,
    isResolved: false,
    resolvedComments: null,
  };
  mockEscalations.unshift(newEscalation);
  return newEscalation;
}
