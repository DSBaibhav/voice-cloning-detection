/**
 * HoldTransactionModal — Section 21 of Master Specification
 * Critical prevention confirmation modal for placing financial transactions on hold.
 */

import React from 'react'
import { ShieldAlert, AlertTriangle, X, Check, Lock } from 'lucide-react'

export function HoldTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  transactionAmount = '₹85,000',
  recipient = 'Vendor Account #092144 (Unlisted)',
  riskScore = 87,
  reason = 'Critical Voice Impersonation & Synthetic Audio Anomaly'
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 sm:p-7 flex flex-col gap-5 relative overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(244,63,94,0.4)',
          boxShadow: '0 0 50px rgba(244,63,94,0.25), 0 25px 50px rgba(0,0,0,0.8)',
        }}
      >
        {/* Pulsing red top strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 shadow-[0_0_12px_#f43f5e]" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Hold Transaction</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 font-mono">
                Active Prevention Control
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Are you sure you want to place the associated wire transfer on hold and alert the banking fraud operations desk?
        </p>

        {/* Transaction Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Transaction Value:</span>
            <span className="text-base font-bold text-rose-400 font-mono">{transactionAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Target Beneficiary:</span>
            <span className="font-semibold text-slate-200">{recipient}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Model Risk Estimate:</span>
            <span className="font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950 border border-rose-800">
              {riskScore}/100 (Critical)
            </span>
          </div>
          <div className="pt-2 border-t border-white/5">
            <span className="text-slate-400 block text-[11px] mb-0.5">Flagged Reason:</span>
            <span className="text-slate-300 font-medium text-[11px]">{reason}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] transition"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Confirm Transaction Hold</span>
          </button>
        </div>
      </div>
    </div>
  )
}
