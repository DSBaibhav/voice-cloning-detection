import React, { useState } from 'react';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

export function normalizeWsUrl(input) {
  if (!input || typeof input !== 'string') return '';
  let url = input.trim();

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  // Convert HTTP/HTTPS to WS/WSS
  if (url.startsWith('https://')) {
    url = 'wss://' + url.slice(8);
  } else if (url.startsWith('http://')) {
    url = 'ws://' + url.slice(7);
  } else if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
    // Default to wss:// if no protocol provided (production cloud)
    url = (url.includes('localhost') || url.includes('127.0.0.1')) ? 'ws://' + url : 'wss://' + url;
  }

  // Ensure path ends with /ws/monitor
  if (!url.endsWith('/ws/monitor')) {
    if (url.endsWith('/ws')) {
      url = url + '/monitor';
    } else {
      url = url + '/ws/monitor';
    }
  }

  return url;
}

export function BackendConfigModal({ isOpen, onClose, currentUrl, onSaveUrl }) {
  const [inputUrl, setInputUrl] = useState(currentUrl || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, msg: string }

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    const formatted = normalizeWsUrl(inputUrl);
    if (!formatted) {
      setTestResult({ success: false, msg: 'Please enter a valid backend URL.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    // Derive HTTP health URL from WS URL
    let httpUrl = formatted;
    if (httpUrl.startsWith('wss://')) {
      httpUrl = 'https://' + httpUrl.slice(6);
    } else if (httpUrl.startsWith('ws://')) {
      httpUrl = 'http://' + httpUrl.slice(5);
    }
    httpUrl = httpUrl.replace(/\/ws\/monitor$/, '/health');

    try {
      const res = await fetch(httpUrl, { method: 'GET', mode: 'cors' });
      if (res.ok) {
        const data = await res.json();
        setTestResult({
          success: true,
          msg: `✓ Connected! Backend is online (${data.app || 'SATYA VAANI'} - ${data.mode || 'Acoustic Defense'})`,
        });
      } else {
        setTestResult({
          success: false,
          msg: `Server returned HTTP ${res.status}. Check URL or CORS settings.`,
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        msg: `Unable to reach ${httpUrl}. If Render was sleeping, it takes ~30-45s to spin up.`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    const formatted = normalizeWsUrl(inputUrl);
    onSaveUrl(formatted);
    onClose();
  };

  const handleSetLocalhost = () => {
    setInputUrl('ws://localhost:8000/ws/monitor');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs anim-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Server size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Connect SATYA VAANI Backend</h2>
              <p className="text-xs text-slate-500">Configure your deployed Render or local WebSocket server</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Backend Service URL
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="e.g. https://your-service.onrender.com or wss://..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs text-slate-800 placeholder:text-slate-400"
            />
            <p className="mt-1.5 text-[11px] text-slate-500">
              Paste your Render Web Service URL. We automatically format it into a secure WebSocket endpoint (<code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">wss://.../ws/monitor</code>).
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500">Presets:</span>
            <button
              type="button"
              onClick={handleSetLocalhost}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
            >
              Localhost (Port 8000)
            </button>
          </div>

          {/* Test Status feedback */}
          {testResult && (
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {testResult.success ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              )}
              <span className="text-xs leading-relaxed">{testResult.msg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={testing ? 'animate-spin' : ''} />
            <span>{testing ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/60 font-medium text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              Save & Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
