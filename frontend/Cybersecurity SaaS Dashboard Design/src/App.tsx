import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './screens/Dashboard';
import { LiveCalls } from './screens/LiveCalls';
import { LiveCallAnalysis } from './screens/LiveCallAnalysis';
import { ThreatCenter } from './screens/ThreatCenter';
import { ThreatInvestigation } from './screens/ThreatInvestigation';
import { TrustedSpeakers } from './screens/TrustedSpeakers';
import { SpeakerProfile } from './screens/SpeakerProfile';
import { ThreatAnalytics } from './screens/ThreatAnalytics';
import { AttackPatterns } from './screens/AttackPatterns';
import { SecurityPolicies } from './screens/SecurityPolicies';
import { AuditLogs } from './screens/AuditLogs';
import { Evidence } from './screens/Evidence';
import { Integrity } from './screens/Integrity';
import { Notifications } from './screens/Notifications';
import { Settings } from './screens/Settings';
import type { Page } from './types';

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center anim-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
        <span className="text-2xl">🛡️</span>
      </div>
      <h2 className="text-lg font-semibold text-text-primary mb-2">{title}</h2>
      <p className="text-sm text-text-muted max-w-sm">This section is available in the full platform. Navigate using the sidebar.</p>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [pageData, setPageData] = useState<any>(null);

  const navigate = (newPage: Page, data?: any) => {
    setPage(newPage);
    setPageData(data ?? null);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (page) {
      case 'dashboard':           return <Dashboard onNavigate={navigate} />;
      case 'live-calls':          return <LiveCalls onNavigate={navigate} />;
      case 'live-call-analysis':  return <LiveCallAnalysis onNavigate={navigate} />;
      case 'call-history':        return <Placeholder title="Call History" />;
      case 'threat-center':       return <ThreatCenter onNavigate={navigate} />;
      case 'threat-investigation': return <ThreatInvestigation onNavigate={navigate} threatId={pageData?.id} />;
      case 'trusted-speakers':    return <TrustedSpeakers onNavigate={navigate} />;
      case 'speaker-profile':     return <SpeakerProfile onNavigate={navigate} />;
      case 'voice-profiles':      return <Placeholder title="Voice Profiles" />;
      case 'verification':        return <Placeholder title="Verification" />;
      case 'threat-analytics':    return <ThreatAnalytics onNavigate={navigate} />;
      case 'attack-patterns':     return <AttackPatterns onNavigate={navigate} />;
      case 'prevention-center':   return <Placeholder title="Prevention Center" />;
      case 'security-policies':   return <SecurityPolicies />;
      case 'audit-logs':          return <AuditLogs onNavigate={navigate} />;
      case 'evidence':            return <Evidence />;
      case 'integrity':           return <Integrity />;
      case 'notifications':       return <Notifications />;
      case 'integrations':        return <Placeholder title="Integrations" />;
      case 'settings':            return <Settings />;
      default:                    return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary" style={{ fontFamily: 'var(--font-sans)' }}>
      <Sidebar current={page} onNavigate={navigate} />

      <div className="ml-60">
        <Topbar current={page} />

        <main className="pt-14 min-h-screen">
          <div className="p-6 max-w-[1280px]">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
