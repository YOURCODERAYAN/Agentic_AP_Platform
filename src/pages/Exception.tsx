import { useState } from 'react';
import { useExceptions, useResolveException } from '../queries/useExceptions';
import type { ExceptionItem } from '../types/index';
import {toast} from 'sonner'

export default function Exception() {
  const { data: exceptions, isLoading } = useExceptions();
  const { mutate: resolveException } = useResolveException();

  // Resolve modal — spec requires this: "opens modal form to capture notes
  // and update global UI state to Resolved"
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [activeException, setActiveException] = useState<ExceptionItem | null>(null);
  const [resolverName, setResolverName] = useState('');
  const [resolverComments, setResolverComments] = useState('');

  function openResolveModal(exc: ExceptionItem) {
    setActiveException(exc);
    setResolverName('');
    setResolverComments('');
    setShowResolveModal(true);
  }

  function handleConfirmResolve() {
    if (!activeException || !resolverName.trim() || !resolverComments.trim()) return;
    resolveException({
      id: activeException.id,
      resolvedBy: resolverName,
      comments: resolverComments,
    });
    setShowResolveModal(false);
  }

  function handleReassign(exc: ExceptionItem) {
    // NOTE: ExceptionItem has no "assignedTo" field in the current data model —
    // this is a UI-only action for now (fires a toast) rather than a real mutation.
    
    toast.success(`${exc.id} reassigned`);
  }

  function handleArchive(exc: ExceptionItem) {
    // Same limitation as Reassign — no "archived" field on ExceptionItem yet.
    // This is only for UI Actions
    toast.success(`${exc.id} archived`);
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-slate-950 dark:text-slate-200 p-6">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xl font-semibold font-serif dark:text-gray-400 text-slate-950">Exception Management</span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : exceptions?.length === 0 ? (
        <div className="text-sm text-gray-400 bg-white border border-gray-200 rounded-lg p-4 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
          No exceptions to review.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {exceptions?.map((exc) => (
            <div key={exc.id} className="border border-gray-200 rounded-lg p-3 bg-white dark:border-slate-700 dark:bg-slate-900">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">{exc.category}</div>
                  <div className="text-xs text-gray-500">{exc.invoiceId}</div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    exc.isResolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {exc.isResolved ? 'Resolved' : 'Open'}
                </span>
              </div>

              {exc.isResolved ? (
                <div className="text-xs text-gray-500 mt-2">
                  Resolved by {exc.resolvedBy}: "{exc.resolverComments}"
                </div>
              ) : (
                <>
                  {exc.aiSuggestion && (
                    <div className="text-xs  dark:bg-slate-950 bg-gray-100 rounded p-2 mt-2">💡 {exc.aiSuggestion}</div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => openResolveModal(exc)}
                      className="text-xs border rounded px-2 py-1 hover:bg-gray-50"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleReassign(exc)}
                      className="text-xs border rounded px-2 py-1 hover:bg-gray-50"
                    >
                      Reassign
                    </button>
                    <button
                      onClick={() => handleArchive(exc)}
                      className="text-xs border rounded px-2 py-1 hover:bg-gray-50"
                    >
                      Archive
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resolve modal */}
      {showResolveModal && activeException && (
        <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg dark:text-gray-600 p-4 w-96">
            <h3 className="font-medium mb-1">Resolve {activeException.id}</h3>
            <div className="text-xs text-slate-500 dark:text-slate-300 mb-3">{activeException.category}</div>

            <label className="text-xs text-gray-500">Resolved by</label>
            <input
              value={resolverName}
              onChange={(e) => setResolverName(e.target.value)}
              placeholder="Your name"
              className="w-full border rounded p-2 text-sm mt-1 mb-3"
            />

            <label className="text-xs text-gray-500">Resolution notes</label>
            <textarea
              value={resolverComments}
              onChange={(e) => setResolverComments(e.target.value)}
              placeholder="What was done to resolve this?"
              className="w-full border rounded p-2 text-sm h-20 mt-1"
            />

            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setShowResolveModal(false)} className="border rounded px-3 py-1.5 text-sm">
                Cancel
              </button>
              <button onClick={handleConfirmResolve} className="bg-indigo-600 text-white rounded px-3 py-1.5 text-sm">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}