import { useState } from 'react';
import { useInvoices, useUpdateInvoiceStage, useReviewers, useReassignInvoice } from '../queries/useInvoices';
import {useNavigate} from 'react-router-dom';
import type { Invoice } from '../types/index';
import {toast} from 'sonner'

function StageBadge({ stage }: { stage: string }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-200">
      {stage.replace('_', ' ')}
    </span>
  );
}

export function Inbox() {

  const navigate = useNavigate();
  const { data: invoices, isLoading } = useInvoices();
  const { mutate: updateStage } = useUpdateInvoiceStage();

  // filter state
  const [invoiceFilter, setInvoiceFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [matchStatusFilter, setMatchStatusFilter] = useState('');

  // selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // reviewer workload modal state
  const { data: reviewers } = useReviewers();
  const { mutate: reassignInvoice } = useReassignInvoice();
  const [showReviewerModal, setShowReviewerModal] = useState(false);

  const filteredInvoices = invoices?.filter((inv) => {
    const matchesInvoice = inv.id.toLowerCase().includes(invoiceFilter.toLowerCase());
    const matchesVendor = inv.vendor.toLowerCase().includes(vendorFilter.toLowerCase());
    const matchesStage = stageFilter === '' || inv.stage === stageFilter;
    const matchesMatchStatus = matchStatusFilter === '' || inv.matchStatus === matchStatusFilter;
    const matchesMinAmount = minAmount === '' || inv.amount >= Number(minAmount);
    const matchesMaxAmount = maxAmount === '' || inv.amount <= Number(maxAmount);
    const matchesDate = dateFilter === '' || inv.invoiceDate === dateFilter;

    return (
      matchesInvoice && matchesVendor && matchesStage && matchesMatchStatus &&
      matchesMinAmount && matchesMaxAmount && matchesDate
    );
  });

  function toggleAll(checked: boolean) {
    if (checked && filteredInvoices) {
      setSelectedIds(new Set(filteredInvoices.map((inv) => inv.id)));
    } else {
      setSelectedIds(new Set());
    }
  }

  function toggleOne(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const allVisibleSelected =
    !!filteredInvoices?.length && filteredInvoices.every((inv) => selectedIds.has(inv.id));

  return (
    <div className="p-2 bg-white text-black dark:bg-slate-950 dark:text-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-semibold">Invoice Inbox</h1>
        <button
          onClick={() => setShowReviewerModal(true)}
          className="text-xs border rounded-md px-3 py-1.5 dark:border-slate-700"
        >
          👥 Reviewer Workload
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <input placeholder="Invoice #" value={invoiceFilter} onChange={(e) => setInvoiceFilter(e.target.value)} className="text-sm px-2 py-1.5 border border-gray-300 rounded-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" />
        <input placeholder="Vendor" value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)} className="text-sm px-2 py-1.5 border border-gray-300 rounded-md" />
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="text-sm px-2 py-1.5 border dark:text-slate-400 border-gray-300 rounded-md">
          <option value="">All statuses</option>
          <option value="received">Received</option>
          <option value="extracted">Extracted</option>
          <option value="matched">Matched</option>
          <option value="human_review">Human Review</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
        </select>
        <input type="number" placeholder="Min amount" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} className="text-sm px-2 py-1.5 border border-gray-300 rounded-md w-28" />
        <input type="number" placeholder="Max amount" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} className="text-sm px-2 py-1.5 border border-gray-300 rounded-md w-28" />
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="text-sm px-2 py-1.5  dark:text-slate-400 border border-gray-300 rounded-md" />
        <select value={matchStatusFilter} onChange={(e) => setMatchStatusFilter(e.target.value)} className="text-sm px-2 py-1.5 border dark:text-slate-400 border-gray-300 rounded-md">
          <option value="">Match status</option>
          <option value="2-way">2-Way</option>
          <option value="3-way">3-Way</option>
          <option value="exception">Exception</option>
        </select>
        <select className="text-sm px-2 py-1.5 border border-gray-300  dark:text-slate-400 rounded-md">
          <option value="">Exception type</option>
          <option value="Missing PO">Missing PO</option>
          <option value="Vendor Mismatch">Vendor Mismatch</option>
          <option value="GST Validation Error">GST Validation Error</option>
          <option value="Duplicate Invoice">Duplicate Invoice</option>
        </select>
      </div>

      {selectedIds.size > 0 && (
        <div className="bg-indigo-50 dark:bg-slate-950 border border-indigo-100 rounded-md p-2 mb-3 text-xs flex justify-between items-center">
          <span>{selectedIds.size} invoice(s) selected</span>
          <button className="text-indigo-600 font-medium">Reassign selected</button>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs bg-gray-50 dark:bg-slate-900 dark:text-slate-400">
              <th className="p-3 text-left w-10">
                <input type="checkbox" checked={allVisibleSelected} onChange={(e) => toggleAll(e.target.checked)} />
              </th>
              <th className="p-3 text-left">Invoice #</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Match</th>
              <th className="p-3 text-left">Assigned</th>
              <th className="p-3 text-left">Stage</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} className="p-4 text-center text-gray-400">Loading...</td></tr>
            ) : filteredInvoices?.length === 0 ? (
              <tr><td colSpan={8} className="p-4 text-center text-gray-400">No invoices match these filters</td></tr>
            ) : (
              filteredInvoices?.map((inv: Invoice) => (
                <tr key={inv.id} className="border-t border-gray-100">
                  <td className="p-3">
                    <input type="checkbox" checked={selectedIds.has(inv.id)} onChange={(e) => toggleOne(inv.id, e.target.checked)} />
                  </td>
                  <td className="p-3 font-medium">{inv.id}</td>
                  <td className="p-3">{inv.vendor}</td>
                  <td className="p-3">₹{inv.amount.toLocaleString('en-IN')}</td>
                  <td className="p-3">{inv.matchStatus}</td>
                  <td className="p-3">{inv.assignedTo ?? 'Unassigned'}</td>
                  <td className="p-3"><StageBadge stage={inv.stage} /></td>
                  <td className="p-3 flex gap-2 text-xs">
                    <button onClick={()=> navigate(`/invoices/${inv.id}`)}>view</button>
                    <button onClick={() => updateStage({ id: inv.id, stage: 'approved' })} className="text-emerald-600">Approve</button>
                    <button onClick={() => updateStage({ id: inv.id, stage: 'human_review' })} className="text-red-600">Reject</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showReviewerModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 w-[420px]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-sm">Reviewer Workload</h3>
              <button onClick={() => setShowReviewerModal(false)} className="text-gray-400 text-sm">✕</button>
            </div>

            <table className="w-full text-xs">
              <thead className="text-gray-500">
                <tr>
                  <th className="text-left p-1">Name</th>
                  <th className="text-left p-1">Queue</th>
                  <th className="text-left p-1">Status</th>
                  <th className="text-left p-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {reviewers?.map((r) => (
                  <tr key={r.id} className="border-t border-gray-100 dark:border-slate-700">
                    <td className="p-1">{r.name}</td>
                    <td className="p-1">{r.queueCount}</td>
                    <td className="p-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        r.status === 'Available' ? 'bg-green-100 text-green-700' :
                        r.status === 'Busy' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-1">
                      <button
                        onClick={() => {
                          if (selectedIds.size === 0) {
                            toast.error('Select invoices first to reassign');
                            return;
                          }
                          selectedIds.forEach((id) => reassignInvoice({ id, reviewer: r.name }));
                          setSelectedIds(new Set());
                          setShowReviewerModal(false);
                        }}
                        className="text-indigo-600"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}