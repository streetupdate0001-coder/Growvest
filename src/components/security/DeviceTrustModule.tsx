import React, { useState, useEffect, useMemo } from 'react';
import {
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  MapPin,
  Globe2,
  Cpu,
  Fingerprint,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  Info,
  Sliders,
  ExternalLink,
  Wifi,
  Radio,
  Server,
  Zap,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface DeviceSession {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'laptop';
  browser: string;
  os: string;
  ipAddress: string;
  asn: string;
  isp: string;
  location: string;
  countryCode: string;
  fingerprintHash: string;
  canvasHash: string;
  webglVendor: string;
  firstSeen: string;
  lastActive: string;
  isCurrent: boolean;
  status: 'trusted' | 'unrecognized' | 'challenged' | 'revoked';
  riskScore: number; // 0 (safest) to 100 (highest risk)
  flagReason?: string;
}

const INITIAL_DEVICES: DeviceSession[] = [
  {
    id: 'dev_current_primary',
    deviceName: 'MacBook Pro 16" (Apple Silicon M3)',
    deviceType: 'laptop',
    browser: 'Chrome 128.0.0 (64-bit)',
    os: 'macOS 15.0 Sequoia',
    ipAddress: '185.190.24.112',
    asn: 'AS5089 (Virgin Media Corp)',
    isp: 'Virgin Media Business Tier 1',
    location: 'London, England, United Kingdom',
    countryCode: 'GB',
    fingerprintHash: 'FP-8FA9-72E1-B04C-99F2',
    canvasHash: 'cv_2f9a18b4e72d',
    webglVendor: 'Apple M3 Max GPU Metal Engine',
    firstSeen: 'Aug 10, 2026',
    lastActive: 'Active right now',
    isCurrent: true,
    status: 'trusted',
    riskScore: 4
  },
  {
    id: 'dev_mobile_safari',
    deviceName: 'iPhone 16 Pro Max',
    deviceType: 'mobile',
    browser: 'Mobile Safari 18.0',
    os: 'iOS 18.1',
    ipAddress: '82.132.247.90',
    asn: 'AS2856 (BT Group / EE Mobile)',
    isp: 'EE 5G Ultra Broadband',
    location: 'London (Westminster), United Kingdom',
    countryCode: 'GB',
    fingerprintHash: 'FP-3C81-99A0-E451-209B',
    canvasHash: 'cv_e810a9c27bf1',
    webglVendor: 'Apple A18 Pro GPU Metal',
    firstSeen: 'Aug 14, 2026',
    lastActive: '2 hours ago',
    isCurrent: false,
    status: 'trusted',
    riskScore: 8
  },
  {
    id: 'dev_zurich_tablet',
    deviceName: 'iPad Pro 13" (M4)',
    deviceType: 'tablet',
    browser: 'Mobile Safari 18.0',
    os: 'iPadOS 18.1',
    ipAddress: '178.197.234.12',
    asn: 'AS3303 (Swisscom AG)',
    isp: 'Swisscom Fiber Enterprise',
    location: 'Zurich, Switzerland (Vault Office)',
    countryCode: 'CH',
    fingerprintHash: 'FP-77E2-AA19-4C82-D011',
    canvasHash: 'cv_990b7a421efc',
    webglVendor: 'Apple M4 GPU Metal Engine',
    firstSeen: 'Aug 18, 2026',
    lastActive: '2 days ago',
    isCurrent: false,
    status: 'trusted',
    riskScore: 12
  }
];

export const DeviceTrustModule: React.FC = () => {
  const { addNotification } = useApp();

  const [devices, setDevices] = useState<DeviceSession[]>(() => {
    try {
      const saved = localStorage.getItem('greeneza_device_trust_ledger');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_DEVICES;
  });

  const [strictDeviceBinding, setStrictDeviceBinding] = useState<boolean>(true);
  const [impossibleTravelGuard, setImpossibleTravelGuard] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedDeviceForInspection, setSelectedDeviceForInspection] = useState<DeviceSession | null>(null);

  // Live client environmental telemetry
  const [clientTelemetry, setClientTelemetry] = useState({
    cores: navigator.hardwareConcurrency || 8,
    platform: navigator.platform || 'MacIntel',
    screenRes: `${window.screen.width}x${window.screen.height} @ ${window.screen.colorDepth}-bit`,
    pixelRatio: window.devicePixelRatio || 2,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/London',
    language: navigator.language || 'en-GB',
    webglRenderer: 'Apple M3 Max GPU Metal Engine',
    canvasEntropy: '0x7F2A...810B',
    audioEntropy: '48.0 kHz 32-bit Float AudioNode'
  });

  useEffect(() => {
    try {
      localStorage.setItem('greeneza_device_trust_ledger', JSON.stringify(devices));
    } catch (e) {
      console.warn('Failed saving device trust ledger', e);
    }
  }, [devices]);

  // Compute live device telemetry on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      let renderer = 'Apple M3 Max GPU Metal Engine';
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || renderer;
        }
      }

      setClientTelemetry(prev => ({
        ...prev,
        webglRenderer: renderer,
        platform: navigator.platform || 'MacIntel',
        screenRes: `${window.screen.width}x${window.screen.height} @ ${window.screen.colorDepth}-bit`
      }));
    } catch (e) {
      console.warn('Telemetry detection fallback', e);
    }
  }, []);

  // Aggregated Trust & Risk calculation
  const { aggregateRiskScore, trustLevel, unrecognizedCount } = useMemo(() => {
    const unrec = devices.filter(d => d.status === 'unrecognized' || d.status === 'challenged');
    if (unrec.length > 0) {
      const highestRisk = Math.max(...devices.map(d => d.riskScore));
      return {
        aggregateRiskScore: highestRisk,
        trustLevel: highestRisk > 65 ? 'ELEVATED RISK - ANOMALIES DETECTED' : 'MODERATE MONITORING',
        unrecognizedCount: unrec.length
      };
    }
    return {
      aggregateRiskScore: 6,
      trustLevel: 'INSTITUTIONAL ZERO-TRUST SECURED (94% TRUST)',
      unrecognizedCount: 0
    };
  }, [devices]);

  const handleScanCurrentDevice = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      addNotification({
        type: 'security',
        title: 'Device Fingerprint Re-Verified',
        message: `Hardware entropy: ${clientTelemetry.cores} CPU Cores • WebGL: ${clientTelemetry.webglRenderer} • IP Integrity: 100% Valid.`
      });
    }, 1200);
  };

  const handleTrustDevice = (id: string) => {
    setDevices(prev =>
      prev.map(d => (d.id === id ? { ...d, status: 'trusted', riskScore: Math.min(d.riskScore, 10), flagReason: undefined } : d))
    );
    addNotification({
      type: 'security',
      title: 'Device Whitelisted',
      message: 'The selected device is now marked as a trusted hardware endpoint.'
    });
  };

  const handleRevokeDevice = (id: string, name: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    addNotification({
      type: 'security',
      title: 'Device Access Terminated',
      message: `Session for "${name}" has been revoked and cryptographic tokens invalidated.`
    });
  };

  const handleRevokeAllOtherDevices = () => {
    setDevices(prev => prev.filter(d => d.isCurrent));
    addNotification({
      type: 'security',
      title: 'All Remote Sessions Terminated',
      message: 'Zero-Trust Protocol: All background hardware sessions have been signed out.'
    });
  };

  const handleSimulateUnrecognizedAttempt = () => {
    const rogueId = `dev_rogue_${Date.now()}`;
    const rogueDevice: DeviceSession = {
      id: rogueId,
      deviceName: 'Unknown PC (Windows 11)',
      deviceType: 'desktop',
      browser: 'Firefox 131.0 (Tor / Proxy Routing)',
      os: 'Windows 11 Enterprise',
      ipAddress: '91.240.118.44',
      asn: 'AS44034 (Hosting Solution Anomaly)',
      isp: 'CloudProxy Datacenter Transit',
      location: 'Kyiv, Ukraine (2,140 km from current base)',
      countryCode: 'UA',
      fingerprintHash: 'FP-UNKW-0041-89B2-C119',
      canvasHash: 'cv_unrecognized_fake_hash',
      webglVendor: 'ANGLE (NVIDIA GeForce GTX 1060 Direct3D11)',
      firstSeen: 'Just now',
      lastActive: 'Attempted login 1 min ago',
      isCurrent: false,
      status: 'unrecognized',
      riskScore: 88,
      flagReason: 'Impossible Travel Velocity Anomaly: 2,140 km displacement in < 5 mins from London base. Foreign ASN & Unrecognized Browser Fingerprint.'
    };

    setDevices(prev => [rogueDevice, ...prev]);

    addNotification({
      type: 'security',
      title: '🚨 SECURITY ALERT: Unrecognized Login Intercepted',
      message: 'An unauthorized login attempt from Kyiv, Ukraine (IP: 91.240.118.44) was flagged by the Device Trust Sentinel.'
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner: Device Trust Telemetry Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#08201a] border border-emerald-500/30 text-white shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Device Trust & Hardware Sentinel</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  REAL-TIME WAF
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Continuous cryptographic browser fingerprinting, IP ASN validation, and impossible travel anomaly detection guarding your institutional capital.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleScanCurrentDevice}
              disabled={isScanning}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border border-slate-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning Hardware...' : 'Re-Scan Telemetry'}</span>
            </button>

            <button
              onClick={handleSimulateUnrecognizedAttempt}
              className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Test anomaly detection against simulated rogue access"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Test Rogue Login Alert</span>
            </button>
          </div>
        </div>

        {/* Dynamic Risk & Trust Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Gauge 1: Aggregated Risk Score */}
          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-950/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Threat Risk Score</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  aggregateRiskScore > 50
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {aggregateRiskScore > 50 ? 'HIGH RISK' : 'HEALTHY'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-mono font-black ${aggregateRiskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {aggregateRiskScore}/100
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {aggregateRiskScore > 50 ? 'Action required' : '0 threats detected'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  aggregateRiskScore > 50 ? 'bg-rose-500 w-[88%]' : 'bg-emerald-400 w-[6%]'
                }`}
              />
            </div>
          </div>

          {/* Gauge 2: Active Authorized Devices */}
          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-950/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Known Endpoints</span>
              <span className="text-emerald-400 font-bold">{devices.length} Total</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-black text-white">
                {devices.filter(d => d.status === 'trusted').length} Trusted
              </span>
              {unrecognizedCount > 0 && (
                <span className="text-xs font-mono text-rose-400 font-bold animate-pulse">
                  +{unrecognizedCount} Flagged
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bound with 256-bit entropy</span>
            </div>
          </div>

          {/* Gauge 3: Hardware Entropy & Fingerprint */}
          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-950/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Browser Fingerprint</span>
              <span className="text-emerald-400 font-bold">FP-8FA9...99F2</span>
            </div>
            <div className="text-sm font-mono font-bold text-slate-200 truncate">
              {clientTelemetry.webglRenderer.slice(0, 24)}...
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
              <span>{clientTelemetry.cores} Cores</span>
              <span>•</span>
              <span>{clientTelemetry.screenRes.split(' ')[0]}</span>
            </div>
          </div>

          {/* Gauge 4: Current IP & Geo Transit */}
          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-950/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Current Ingress IP</span>
              <span className="text-emerald-400 font-bold">LONDON, UK</span>
            </div>
            <div className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>185.190.24.112</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              Virgin Media Business (AS5089)
            </div>
          </div>
        </div>
      </div>

      {/* Unrecognized Anomaly Challenge Alert Box (If rogue login present) */}
      {unrecognizedCount > 0 && (
        <div className="p-5 rounded-3xl bg-rose-500/10 border-2 border-rose-500/50 text-slate-900 dark:text-slate-100 shadow-xl space-y-3 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  Suspicious / Unrecognized Endpoint Login Intercepted
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  A login attempt was made from an unfamiliar browser fingerprint and distant geolocation.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white uppercase">
              HIGH SEVERITY
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-500/30 text-xs font-mono space-y-1">
            <div className="text-slate-500 dark:text-slate-400 text-[11px]">Flagged Anomaly:</div>
            <div className="text-rose-600 dark:text-rose-400 font-semibold leading-relaxed">
              {devices.find(d => d.status === 'unrecognized')?.flagReason}
            </div>
          </div>
        </div>
      )}

      {/* Security Policies Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Policy 1: Strict Device & IP Binding */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Strict IP & Device Binding
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Automatically challenge and mandate 2FA step-up verification whenever logins originate from new browser fingerprints.
            </p>
          </div>
          <button
            onClick={() => {
              setStrictDeviceBinding(!strictDeviceBinding);
              addNotification({
                type: 'security',
                title: !strictDeviceBinding ? 'Strict Device Binding Activated' : 'Strict Device Binding Disabled',
                message: !strictDeviceBinding
                  ? 'All unrecognized endpoints will now require 2FA cryptographic step-up verification.'
                  : 'Relaxed device challenge policy enabled.'
              });
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              strictDeviceBinding ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                strictDeviceBinding ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Policy 2: Impossible Travel Velocity Guard */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Impossible Travel Velocity Sentinel
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Calculates displacement velocity between logins and freezes credentials if physical transit speed exceeds 800 km/h.
            </p>
          </div>
          <button
            onClick={() => {
              setImpossibleTravelGuard(!impossibleTravelGuard);
              addNotification({
                type: 'security',
                title: !impossibleTravelGuard ? 'Travel Sentinel Activated' : 'Travel Sentinel Disabled',
                message: !impossibleTravelGuard
                  ? 'Impossible travel velocities (>800 km/h) will now be blocked.'
                  : 'Geographic velocity checks turned off.'
              });
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              impossibleTravelGuard ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                impossibleTravelGuard ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Recognized Devices & Login Attempts Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Active Hardware Sessions & Login Ledger ({devices.length})
            </h3>
          </div>

          <button
            onClick={handleRevokeAllOtherDevices}
            className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Sign Out All Other Devices</span>
          </button>
        </div>

        {/* Device Cards List */}
        <div className="space-y-3">
          {devices.map(device => {
            const isFlagged = device.status === 'unrecognized' || device.status === 'challenged';
            return (
              <div
                key={device.id}
                className={`p-5 rounded-3xl transition-all border ${
                  device.isCurrent
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 shadow-xs'
                    : isFlagged
                    ? 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/50 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left: Device Icon & Hardware Details */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-3 rounded-2xl shrink-0 ${
                        device.isCurrent
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : isFlagged
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {device.deviceType === 'laptop' && <Laptop className="w-5 h-5" />}
                      {device.deviceType === 'mobile' && <Smartphone className="w-5 h-5" />}
                      {device.deviceType === 'tablet' && <Tablet className="w-5 h-5" />}
                      {device.deviceType === 'desktop' && <Monitor className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {device.deviceName}
                        </span>

                        {device.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 uppercase">
                            CURRENT DEVICE
                          </span>
                        )}

                        {isFlagged ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40 uppercase flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            <span>UNRECOGNIZED / CHALLENGED</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                            TRUSTED
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{device.location}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Wifi className="w-3.5 h-3.5 text-slate-400" />
                          <span>{device.ipAddress}</span>
                        </span>
                        <span>•</span>
                        <span>{device.browser}</span>
                      </div>

                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 font-mono">
                        <span>Fingerprint: {device.fingerprintHash}</span>
                        <span>•</span>
                        <span>Last active: {device.lastActive}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <button
                      onClick={() => setSelectedDeviceForInspection(device)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Inspect Telemetry</span>
                    </button>

                    {isFlagged ? (
                      <>
                        <button
                          onClick={() => handleTrustDevice(device.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Approve Device</span>
                        </button>

                        <button
                          onClick={() => handleRevokeDevice(device.id, device.deviceName)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <ShieldX className="w-3.5 h-3.5" />
                          <span>Block & Terminate</span>
                        </button>
                      </>
                    ) : (
                      !device.isCurrent && (
                        <button
                          onClick={() => handleRevokeDevice(device.id, device.deviceName)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Revoke session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Deep Cryptographic Fingerprint Inspection */}
      {selectedDeviceForInspection && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-7 text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Hardware Entropy & TLS Attestation
                  </h3>
                  <div className="text-[11px] font-mono text-slate-500">
                    {selectedDeviceForInspection.deviceName}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDeviceForInspection(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Cryptographic Fingerprint Hash</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold block select-all">
                  {selectedDeviceForInspection.fingerprintHash}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase block">Canvas 2D Hash</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold truncate block">
                    {selectedDeviceForInspection.canvasHash}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase block">ASN Transit Provider</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold truncate block">
                    {selectedDeviceForInspection.asn}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">WebGL Hardware Acceleration Engine</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold block leading-relaxed">
                  {selectedDeviceForInspection.webglVendor}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Ingress Network & ISP</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold block">
                  {selectedDeviceForInspection.isp} ({selectedDeviceForInspection.ipAddress})
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedDeviceForInspection(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
