import React, { useState, useRef, useCallback, useEffect } from 'react';
import './index.css';

// Components
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DemoGuideModal } from './components/Modals';

// Views
import { LiveVoiceShieldView } from './views/LiveVoiceShieldView';
import { OverviewDashboard } from './views/OverviewDashboard';
import { ThreatHistoryView } from './views/ThreatHistoryView';
import { SettingsPoliciesView } from './views/SettingsPoliciesView';

// Audio alerts
import {
  playAttackAlertSound,
  playVerifiedSound,
} from './utils/audioAlerts';

const WS_URL = import.meta.env.VITE_BACKEND_WS_URL || 'ws://localhost:8000/ws/monitor';
const TARGET_SR = 16000;
const BUFFER_SEC = 2.0; // 2-second chunks = 32,000 samples for responsive live feedback

function downSample(buffer, fromSr, toSr) {
  if (fromSr === toSr) return buffer;
  const ratio = fromSr / toSr;
  const newLen = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLen);
  for (let i = 0; i < newLen; i++) {
    const pos = i * ratio;
    const lo = Math.floor(pos);
    const hi = Math.min(lo + 1, buffer.length - 1);
    const frac = pos - lo;
    result[i] = buffer[lo] * (1 - frac) + buffer[hi] * frac;
  }
  return result;
}

export default function App() {
  // Navigation
  const [currentRoute, setCurrentRoute] = useState('live-shield');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Security policies
  const [strictLockout, setStrictLockout] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Real-time audio & WebSocket state
  const [monitorState, setMonitorState] = useState('idle'); // 'idle' | 'connecting' | 'active' | 'error'
  const [verdict, setVerdict] = useState({ label: 'idle', confidence: 0, raw_score: 0, is_speech: false });
  const [analyserNode, setAnalyserNode] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Live Microphone Telemetry
  const [liveRms, setLiveRms] = useState(0);
  const [bufferProgress, setBufferProgress] = useState(0);

  // Session activity counters
  const [sessionCalls, setSessionCalls] = useState(0);
  const [bonafideCount, setBonafideCount] = useState(0);
  const [spoofCount, setSpoofCount] = useState(0);
  const [sessionHistory, setSessionHistory] = useState([]);

  // Audio processing refs
  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);
  const pcmBufferRef = useRef([]);

  // Stop monitoring callback
  const stopMonitoring = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    pcmBufferRef.current = [];
    setAnalyserNode(null);
    setLiveRms(0);
    setBufferProgress(0);
    setVerdict({ label: 'idle', confidence: 0, raw_score: 0, is_speech: false });
    setMonitorState('idle');
  }, []);

  // Start monitoring callback
  const startMonitoring = useCallback(async () => {
    setErrorMsg(null);
    setMonitorState('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: TARGET_SR,
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: false,
      });
      streamRef.current = stream;

      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      setAnalyserNode(analyser);

      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      source.connect(processor);
      processor.connect(audioCtx.destination);

      const ws = new WebSocket(WS_URL);
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      ws.onopen = () => {
        setMonitorState('active');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const label = data.label;

          if (label) {
            setVerdict({
              label: label,
              confidence: data.confidence || 0,
              raw_score: data.raw_score || 0,
              is_speech: data.is_speech ?? (label !== 'idle'),
            });

            // Log non-idle events (bonafide or spoof)
            if (label === 'bonafide' || label === 'spoof') {
              const now = new Date().toLocaleTimeString();
              setSessionCalls((prev) => prev + 1);

              if (label === 'spoof') {
                setSpoofCount((prev) => prev + 1);
                if (soundEnabled) playAttackAlertSound();
              } else if (label === 'bonafide') {
                setBonafideCount((prev) => prev + 1);
                if (soundEnabled) playVerifiedSound();
              }

              setSessionHistory((prev) => [
                {
                  time: now,
                  label: label,
                  confidence: data.confidence,
                  raw_score: data.raw_score,
                },
                ...prev.slice(0, 49),
              ]);
            }
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message', err);
        }
      };

      ws.onerror = () => {
        setErrorMsg('WebSocket connection failed. Verify backend server is running on port 8000.');
        setMonitorState('error');
        stopMonitoring();
      };

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);

        // Compute instant RMS volume to verify microphone reception
        let sumSq = 0;
        for (let i = 0; i < inputData.length; i++) {
          sumSq += inputData[i] * inputData[i];
        }
        const currentRms = Math.sqrt(sumSq / inputData.length);
        setLiveRms(currentRms);

        // Downsample to 16kHz PCM
        const downsampled = downSample(inputData, audioCtx.sampleRate, TARGET_SR);
        pcmBufferRef.current.push(...downsampled);

        const requiredSamples = Math.round(TARGET_SR * BUFFER_SEC);
        const progress = Math.min(100, Math.round((pcmBufferRef.current.length / requiredSamples) * 100));
        setBufferProgress(progress);

        if (pcmBufferRef.current.length >= requiredSamples) {
          const chunk = pcmBufferRef.current.slice(0, requiredSamples);
          pcmBufferRef.current = pcmBufferRef.current.slice(requiredSamples);

          if (ws.readyState === WebSocket.OPEN) {
            ws.send(new Float32Array(chunk).buffer);
          }
        }
      };
    } catch (err) {
      setErrorMsg(`Microphone error: ${err.message}`);
      setMonitorState('error');
      stopMonitoring();
    }
  }, [stopMonitoring, soundEnabled]);

  // Simulated verdict trigger for instant demonstrations
  const handleSimulateVerdict = (type) => {
    const conf = type === 'spoof' ? 0.86 : type === 'bonafide' ? 0.98 : 0.0;
    const now = new Date().toLocaleTimeString();

    setVerdict({
      label: type,
      confidence: conf,
      raw_score: type === 'spoof' ? 0.58 : type === 'bonafide' ? 0.02 : 0.0,
      is_speech: type !== 'idle',
    });

    if (type === 'spoof' || type === 'bonafide') {
      setSessionCalls((prev) => prev + 1);
      if (type === 'spoof') {
        setSpoofCount((prev) => prev + 1);
        if (soundEnabled) playAttackAlertSound();
      } else {
        setBonafideCount((prev) => prev + 1);
        if (soundEnabled) playVerifiedSound();
      }
      setSessionHistory((prev) => [
        {
          time: now,
          label: type,
          confidence: conf,
          raw_score: type === 'spoof' ? 0.58 : 0.02,
        },
        ...prev.slice(0, 49),
      ]);
    }
  };

  const handleClearHistory = () => {
    setSessionHistory([]);
    setSessionCalls(0);
    setBonafideCount(0);
    setSpoofCount(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex antialiased">
      {/* ── Fixed Sidebar Navigation ─────────────────────────────────────── */}
      <Sidebar
        current={currentRoute}
        onNavigate={(route) => {
          setCurrentRoute(route);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGuide={() => setIsGuideOpen(true)}
        liveThreatCount={spoofCount}
      />

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <div className="ml-64 flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50">
        <Topbar
          current={currentRoute}
          monitorState={monitorState}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((v) => !v)}
          onOpenGuide={() => setIsGuideOpen(true)}
        />

        <main className="pt-20 px-8 pb-12 max-w-6xl w-full mx-auto">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center justify-between">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg(null)} className="underline font-bold ml-4">
                Dismiss
              </button>
            </div>
          )}

          {currentRoute === 'live-shield' && (
            <LiveVoiceShieldView
              monitorState={monitorState}
              verdict={verdict}
              analyserNode={analyserNode}
              liveRms={liveRms}
              bufferProgress={bufferProgress}
              onStartMonitoring={startMonitoring}
              onStopMonitoring={stopMonitoring}
              onSimulateVerdict={handleSimulateVerdict}
              sessionHistory={sessionHistory}
              strictLockout={strictLockout}
            />
          )}

          {currentRoute === 'dashboard' && (
            <OverviewDashboard
              sessionCalls={sessionCalls}
              bonafideCount={bonafideCount}
              spoofCount={spoofCount}
              sessionHistory={sessionHistory}
              onNavigate={(route) => setCurrentRoute(route)}
            />
          )}

          {currentRoute === 'threats' && (
            <ThreatHistoryView
              sessionHistory={sessionHistory}
              onClearHistory={handleClearHistory}
              onNavigate={(route) => setCurrentRoute(route)}
            />
          )}

          {currentRoute === 'settings' && (
            <SettingsPoliciesView
              strictLockout={strictLockout}
              onToggleStrictLockout={() => setStrictLockout((v) => !v)}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled((v) => !v)}
            />
          )}
        </main>
      </div>

      {/* Interactive Testing & Demo Guide Modal */}
      {isGuideOpen && <DemoGuideModal onClose={() => setIsGuideOpen(false)} />}
    </div>
  );
}
