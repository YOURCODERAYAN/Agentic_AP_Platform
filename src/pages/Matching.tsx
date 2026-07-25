import { useState } from 'react';
import { useMatchRecord, useEscalations, useResolveEscalation, useCreateEscalation } from '../queries/useMatching';
import { useReviewers } from '../queries/useInvoices';
import type { Escalation } from '../types/index';
import {toast} from 'sonner'

function LineItemCard({
  name,
  quantity,
  amount,
  isMismatch,
}: {
  name: string;
  quantity: number;
  amount: number;
  isMismatch?: boolean;
}) {
  return (
    <div className={`p-2 rounded border text-xs ${isMismatch ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
      <div className="dark:text-slate-400">{name}</div>
      <div className="text-slate-500 dark:text-gray-350">
        Qty {quantity} · ₹{amount.toLocaleString('en-IN')}
      </div>
    </div>
  );
}

// TODO: make this dynamic via a route param (like Workbench's :invoiceId) once
// Matching is linked from the Inbox row actions — hardcoded for now since this
// is the only invoice with full match-record mock data.
const DEFAULT_INVOICE_ID = 'INV-1023';

export default function Matching() {
  const { data: matchRecord, isLoading: isMatchLoading } = useMatchRecord(DEFAULT_INVOICE_ID);
  const { data: escalations, isLoading: isEscalationsLoading } = useEscalations();
  const { data: reviewers } = useReviewers();

  const { mutate: resolveEscalation } = useResolveEscalation();
  const { mutate: createEscalation } = useCreateEscalation();

  // Override Variance modal
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideComment, setOverrideComment] = useState('');

  // Escalation modal — shared for both "Resolve" and "+ New Escalation"
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [escalationReason, setEscalationReason] = useState('');
  const [escalationTo, setEscalationTo] = useState('');

  function handleAcceptMatch() {
    toast.success("Match Accepted"); // swap for toast.success once sonner is set up
  }

  function handleConfirmOverride() {
    if (!overrideComment.trim()) return;
    alert(`Override logged: ${overrideComment}`);
    setOverrideComment('');
    setShowOverrideModal(false);
  }

  function openResolveModal(esc: Escalation) {
    setSelectedEscalation(esc);
    setEscalationReason('');
    setShowEscalationModal(true);
  }

  function openNewEscalationModal() {
    setSelectedEscalation(null);
    setEscalationReason('');
    setEscalationTo(reviewers?.[0]?.name ?? '');
    setShowEscalationModal(true);
  }

  function handleConfirmEscalationModal() {
    if (selectedEscalation) {
      // resolving an existing escalation
      if (!escalationReason.trim()) return;
      resolveEscalation({ id: selectedEscalation.id, comments: escalationReason });
    } else {
      // logging a brand new one
      if (!escalationReason.trim() || !escalationTo) return;
      createEscalation({ matchId: DEFAULT_INVOICE_ID, escalatedTo: escalationTo, reason: escalationReason });
    }
    setShowEscalationModal(false);
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-slate-950 dark:text-slate-200 p-6">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xl font-semibold font-serif dark:text-gray-400 text-slate-950">
          Matching workbench (3-way)
          {matchRecord && <span className="ml-2 text-sm font-serif  dark:text-gray-400 text-slate-950 ">({matchRecord.invoiceId})</span>}
        </span>
      </div>

      {/* Three columns */}
      {isMatchLoading ? (
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : !matchRecord ? (
        <div className="text-sm text-gray-400 bg-white border border-gray-200 rounded-lg p-4">
          No match record found for this invoice.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div className="border border-gray-200 rounded-lg p-3 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">Invoice Line Items</div>
            <div className="flex flex-col gap-2">
              {matchRecord.invoiceLines.map((item, i) => (
                <LineItemCard key={i} name={item.name} quantity={item.quantity} amount={item.amount} />
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-3 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">PO Line Items</div>
            <div className="flex flex-col gap-2">
              {matchRecord.poLines.map((item, i) => {
                const invoiceLine = matchRecord.invoiceLines[i];
                const isMismatch = invoiceLine && invoiceLine.amount !== item.amount;
                return (
                  <LineItemCard key={i} name={item.name} quantity={item.quantity} amount={item.amount} isMismatch={isMismatch} />
                );
              })}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-3 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">GRN Line Items</div>
            <div className="flex flex-col gap-2">
              {matchRecord.grnLines.map((item, i) => {
                const invoiceLine = matchRecord.invoiceLines[i];
                const isMismatch = invoiceLine && invoiceLine.quantity !== item.quantity;
                return (
                  <LineItemCard key={i} name={item.name} quantity={item.quantity} amount={item.amount} isMismatch={isMismatch} />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-3">
        <button onClick={handleAcceptMatch} className="bg-emerald-500 text-white text-xs rounded px-3 py-1.5 cursor-pointer">
          Accept Match
        </button>
        <button onClick={() => setShowOverrideModal(true)} className="bg-white dark:bg-gray-600 border text-xs rounded px-3 py-1.5 cursor-pointer">
          Override Variance
        </button>
      </div>

      {/* Override Variance modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4  dark:text-gray-500 w-96">
            <h3 className="font-medium mb-2">Override Variance</h3>
            <textarea
              value={overrideComment}
              onChange={(e) => setOverrideComment(e.target.value)}
              placeholder="Reason for override..."
              className="w-full border rounded p-2 text-sm h-20"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setShowOverrideModal(false)} className="border rounded px-3 py-1.5 text-sm">
                Cancel
              </button>
              <button onClick={handleConfirmOverride} className="bg-indigo-600 text-white rounded px-3 py-1.5 text-sm">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escalation table — real data via useEscalations() */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mt-4 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="p-3 text-left font-medium">Match ID</th>
              <th className="p-3 text-left font-medium">Escalated To</th>
              <th className="p-3 text-left font-medium">Reason</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isEscalationsLoading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : escalations?.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  No escalations logged yet.
                </td>
              </tr>
            ) : (
              escalations?.map((esc) => (
                <tr key={esc.id} className="border-t border-gray-100">
                  <td className="p-3 font-medium">{esc.id}</td>
                  <td className="p-3">{esc.escalatedTo}</td>
                  <td className="p-3 text-gray-600">{esc.reason}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        esc.isResolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {esc.isResolved ? 'Resolved' : 'Open'}
                    </span>
                  </td>
                  <td className="p-3">
                    {!esc.isResolved && (
                      <button
                        onClick={() => openResolveModal(esc)}
                        className="text-xs text-indigo-600 border border-indigo-200 rounded px-2 py-1 hover:bg-indigo-50"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={openNewEscalationModal}
        className="mt-3 text-xs bg-indigo-600 text-white rounded px-3 py-1.5 hover:bg-indigo-700"
      >
        + New Escalation
      </button>

      {/* Escalation modal — handles BOTH "Resolve" and "+ New Escalation" */}
      {showEscalationModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg  dark:text-gray-400 p-4 w-96">
            <h3 className="font-medium mb-3">
              {selectedEscalation ? `Resolve ${selectedEscalation.id}` : 'Log New Escalation'}
            </h3>

            {!selectedEscalation && (
              <div className="mb-3">
                <label className="text-xs text-gray-500">Escalate to</label>
                <select
                  value={escalationTo}
                  onChange={(e) => setEscalationTo(e.target.value)}
                  className="w-full border rounded p-2 text-sm mt-1"
                >
                  {reviewers?.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <label className="text-xs text-gray-500">
              {selectedEscalation ? 'Resolution notes' : 'Reason'}
            </label>
            <textarea
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              placeholder={selectedEscalation ? 'How was this resolved?' : 'Why is this being escalated?'}
              className="w-full border rounded p-2 text-sm h-20 mt-1"
            />

            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setShowEscalationModal(false)} className="border rounded px-3 py-1.5 text-sm">
                Cancel
              </button>
              <button onClick={handleConfirmEscalationModal} className="bg-indigo-600 text-white rounded px-3 py-1.5 text-sm">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}