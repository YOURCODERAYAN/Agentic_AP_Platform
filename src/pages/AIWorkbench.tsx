import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInvoiceById } from '../queries/useInvoices';
import {
  useExtractedFields,
  useUpdateExtractedField,
  useReprocessExtraction,
} from '../queries/useWorkbench';

function getBadgeClass(confidence: number) {
  if (confidence > 90) return 'bg-green-100 text-green-700';
  if (confidence >= 70) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

function getFieldClass(confidence: number) {
  if (confidence < 70) return 'border-red-400 bg-red-50';
  return 'border-gray-200';
}

export default function AIWorkbench() {
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const { data: invoice } = useInvoiceById(invoiceId!);
  const { data: fields, isLoading } = useExtractedFields(invoiceId!);
  const { mutate: saveField } = useUpdateExtractedField(invoiceId!);
  const { mutate: reprocess, isPending: isReprocessing } = useReprocessExtraction(invoiceId!);

  const [isEditing, setIsEditing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [page, setPage] = useState(1);

  // local draft values while editing — only pushed to the server on Save
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});

  function startEditing() {
    if (!fields) return;
    setDraftValues(Object.fromEntries(fields.map((f) => [f.label, f.value])));
    setIsEditing(true);
  }

  function saveEditing() {
    Object.entries(draftValues).forEach(([label, value]) => {
      saveField({ label, value });
    });
    setIsEditing(false);
  }

  if (!invoiceId) {
    return <div className="p-6 text-xl font-serif text-slate-500 dark:text-slate-300">No invoice selected.</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-slate-950 dark:text-slate-200 p-6">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xl font-semibold  text-slate-800 dark:text-gray-400 ">
          Invoice Details — AI Workbench
          {invoice && <span className="ml-2 text-sm font-normal text-slate-500">({invoice.id})</span>}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* LEFT: document preview */}
        <div className="flex h-125 flex-col rounded-lg border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="border rounded px-2 py-1"
              >
                ‹
              </button>
              <span>Page {page} / 2</span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, 2))}
                className="border rounded px-2 py-1"
              >
                ›
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
                className="border rounded px-2 py-1"
              >
                −
              </button>
              <span className="w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
                className="border rounded px-2 py-1"
              >
                +
              </button>
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="border rounded px-2 py-1"
              >
                ⟳
              </button>
            </div>
          </div>

          <div className="flex-1 rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 flex items-center justify-center overflow-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <div
              style={{ transform: `scale(${zoom}) rotate(${rotation}deg)`, transition: 'transform 0.15s' }}
            >
              {invoice ? `${invoice.id}.pdf — page ${page}` : 'PDF preview will appear here.'}
            </div>
          </div>
        </div>

        {/* RIGHT: extracted data */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">Extracted Data</span>
            <div className="flex gap-2">
              <button
                onClick={() => reprocess()}
                disabled={isReprocessing}
                className="rounded border px-2 py-1 text-xs disabled:opacity-50"
              >
                {isReprocessing ? 'Reprocessing…' : '↻ Reprocess'}
              </button>
              <button
                onClick={isEditing ? saveEditing : startEditing}
                className="rounded border px-2 py-1 text-xs"
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {isLoading || isReprocessing ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 rounded bg-gray-100 animate-pulse" />
              ))
            ) : fields?.length === 0 ? (
              <div className="text-sm text-gray-400">No extracted fields for this invoice yet.</div>
            ) : (
              fields?.map((field) => {
                const isLow = field.confidence < 70;
                return (
                  <div
                    key={field.label}
                    className={`rounded border p-2 ${getFieldClass(field.confidence)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{field.label}</div>
                        {isEditing ? (
                          <input
                            value={draftValues[field.label] ?? field.value}
                            onChange={(e) =>
                              setDraftValues((prev) => ({ ...prev, [field.label]: e.target.value }))
                            }
                            className="w-full border-b border-indigo-300 bg-transparent text-sm outline-none"
                          />
                        ) : (
                          <div className="text-sm">{field.value}</div>
                        )}
                      </div>
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${getBadgeClass(field.confidence)}`}
                      >
                        {field.confidence}%
                      </span>
                    </div>
                    {isLow && (
                      <div className="mt-1 text-[11px] text-red-500">
                        ⚠️ Low confidence — please verify manually
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button className="bg-indigo-600 text-white text-xs rounded px-3 py-1.5">
              Submit for Approval
            </button>
            <button className="border text-xs rounded px-3 py-1.5">Escalate</button>
          </div>
        </div>
      </div>
    </div>
  );
}