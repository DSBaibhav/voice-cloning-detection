import React from 'react';
import {
  Volume2,
  VolumeX,
  HelpCircle,
  Wifi,
  ChevronRight,
  Shield,
  Radio
} from 'lucide-react';

const TITLES = {
  'live-shield': { section: 'Monitoring', title: 'Live Voice Shield' },
  dashboard:     { section: 'Executive', title: 'Security Dashboard' },
  threats:       { section: 'Intelligence', title: 'Threat & Call Incident Log' },
  settings:      { section: 'Policy Engine', title: 'Security Policies & Rules' },
};

export function Topbar({
  current = 'live-shield',
  monitorState = 'idle',
  soundEnabled = true,
  onToggleSound,
  onOpenGuide,
}) {
  const currentInfo = TITLES[current] || TITLES['live-shield'];

  return (
    <header className="fixed top-0 left-64 right-0 h-14 z-20 flex items-center justify-between px-6 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">{currentInfo.section}</span>
        <ChevronRight size={12} className="text-slate-300" />
        <span className="font-semibold text-slate-800">{currentInfo.title}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live Mic Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs">
          <span className={`w-2 h-2 rounded-full ${
            monitorState === 'active' 
              ? 'bg-emerald-500 animate-pulse' 
              : monitorState === 'connecting'
              ? 'bg-blue-500 animate-ping'
              : 'bg-slate-400'
          }`} />
          <span className="text-[11px] font-medium text-slate-600">
            {monitorState === 'active' ? 'Mic Shield Active' : monitorState === 'connecting' ? 'Connecting...' : 'Mic Standby'}
          </span>
        </div>

        {/* Backend API Connection Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium">
          <Wifi size={12} className="text-emerald-600" />
          <span>Port 8000</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Security Alarm Audio: Enabled' : 'Security Alarm Audio: Muted'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
            soundEnabled
              ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
          }`}
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span>{soundEnabled ? 'Alarm Sound ON' : 'Alarm Sound OFF'}</span>
        </button>

        {/* Demo Guide Button */}
        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-colors shadow-xs"
        >
          <HelpCircle size={14} />
          <span>Demo Guide</span>
        </button>
      </div>
    </header>
  );
}
