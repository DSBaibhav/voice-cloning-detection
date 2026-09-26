import React from 'react';
import {
  Mic,
  LayoutDashboard,
  ShieldAlert,
  Settings,
  ShieldCheck,
  Radio,
  BookOpen
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'live-shield', label: 'Live Voice Shield', icon: Mic, desc: 'Real-time detection' },
  { id: 'dashboard',   label: 'Security Dashboard', icon: LayoutDashboard, desc: 'Executive overview' },
  { id: 'threats',     label: 'Threat & Call Log',  icon: ShieldAlert, desc: 'Session incident history' },
  { id: 'settings',    label: 'Security Policies',  icon: Settings, desc: 'Lockout & alert rules' },
];

export function Sidebar({ current = 'live-shield', onNavigate, onOpenGuide, liveThreatCount = 0 }) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col z-30 border-r border-slate-200 bg-white">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-slate-900">SATYA VAANI</div>
            <div className="text-[10px] text-slate-500 font-medium">AI Voice Defense Shield</div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-3 py-4 flex-1 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Workspaces
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs leading-none">{item.label}</div>
                <div className="text-[10px] text-slate-400 font-normal mt-1 truncate">{item.desc}</div>
              </div>
              {item.id === 'threats' && liveThreatCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                  {liveThreatCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Guide & System Status */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
        <button
          onClick={onOpenGuide}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 text-xs font-semibold shadow-2xs transition-colors"
        >
          <BookOpen size={14} className="text-blue-600" />
          <span>How to Test & Demo</span>
        </button>

        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Detection Engine</span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Model Architecture</span>
            <span className="font-mono text-slate-700 text-[10px]">Wav2Vec2 + Vocoder</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
