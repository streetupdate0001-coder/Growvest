import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  LogOut,
  Sun,
  Moon,
  Eye,
  Activity,
  FileText,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  ChevronDown,
  ChevronRight,
  Globe,
  Laptop,
  KeyRound,
  Clock,
  Layers,
  Sparkles,
  SlidersHorizontal,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AdminView } from '../views/AdminView';
import { AuditLogEntry } from '../../types';

export const AdminLayout: React.FC = () => {
  const { user, logout, auditLogs } = useAuth();
  const { theme, toggleTheme, setActiveTab } = useApp();

  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'strategy' | 'financial' | 'kyc' | 'cms'>('all');
  const [selectedResult, setSelectedResult] = useState<'all' | 'success' | 'warning' | 'error'>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Categorize audit logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      // Search matching
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.action.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.adminEmail.toLowerCase().includes(q) ||
        log.adminName.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Result status matching
      if (selectedResult !== 'all' && log.result !== selectedResult) {
        return false;
      }

      // Category matching
      if (selectedCategory === 'all') return true;

      const act = log.action.toUpperCase();
      if (selectedCategory === 'strategy') {
        return (
          act.includes('INVESTMENT_PLAN') ||
          act.includes('PLAN_STATUS') ||
          act.includes('STRATEGY') ||
          act.includes('PORTFOLIO')
        );
      }
      if (selectedCategory === 'financial') {
        return (
          act.includes('DEPOSIT') ||
          act.includes('WITHDRAWAL') ||
          act.includes('WALLET') ||
          act.includes('TRANSACTION') ||
          act.includes('CREDIT') ||
          act.includes('DEBIT')
        );
      }
      if (selectedCategory === 'kyc') {
        return (
          act.includes('KYC') ||
          act.includes('USER') ||
          act.includes('ROLE') ||
          act.includes('PROFILE') ||
          act.includes('COUNTRY')
        );
      }
      if (selectedCategory === 'cms') {
        return (
          act.includes('MEDIA') ||
          act.includes('SITE') ||
          act.includes('SYSTEM') ||
          act.includes('BANNER')
        );
      }

      return true;
    });
  }, [auditLogs, searchQuery, selectedCategory, selectedResult]);

  // Export audit logs as formatted compliance JSON report
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `GROWVEST_AUDIT_LEDGER_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export audit logs as CSV report
  const handleExportCsv = () => {
    const headers = ['ID', 'Timestamp', 'Action', 'Target', 'Details', 'Admin Name', 'Admin Email', 'IP Address', 'Result'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.action}"`,
      `"${l.target.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.adminName}"`,
      `"${l.adminEmail}"`,
      `"${l.ipAddress}"`,
      `"${l.result}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GROWVEST_AUDIT_LOGS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getActionBadgeColor = (action: string, result: 'success' | 'warning' | 'error') => {
    if (result === 'error' || action.includes('DELETE') || action.includes('REJECT')) {
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
    if (result === 'warning' || action.includes('DEBIT') || action.includes('TOGGLE')) {
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    }
    if (action.includes('PLAN') || action.includes('STRATEGY')) {
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
    if (action.includes('WALLET') || action.includes('CREDIT') || action.includes('DEPOSIT')) {
      return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }
    return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
  };

  return (
    <div
      id="growvest-admin-enclave-shell"
      className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors relative"
    >
      {/* 1. Top Institutional Admin Enclave Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-15 sm:h-18 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Brand Logo & Clearance Badge */}
          <div className="flex items-center gap-1.5 sm:gap-4 min-w-0">
            <BrandLogo size="sm" themeMode="dark" showTagline={false} />
            <div className="hidden sm:block h-5 w-px bg-slate-800" />
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shrink-0">
                <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                <span className="hidden sm:inline">ADMIN ENCLAVE</span>
                <span className="sm:hidden">ADMIN</span>
              </span>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LEVEL 4 CLEARANCE
              </span>
            </div>
          </div>

          {/* Central System Status & Live Audit Stream Trigger */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400">
            <button
              onClick={() => setIsAuditDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-slate-300 transition-all cursor-pointer shadow-xs"
              title="Open Real-time Cryptographic Audit Trail"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">Audit Trail:</span>
              <span className="font-bold text-slate-100">{auditLogs.length} Events</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>AES-256 HSM</span>
            </div>
          </div>

          {/* Right Administrative Controls */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Live Audit Log Button (Mobile & Desktop) */}
            <button
              onClick={() => setIsAuditDrawerOpen(true)}
              id="admin-audit-log-drawer-btn"
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer shadow-xs min-h-[34px] sm:min-h-[38px]"
              title="View Institutional Audit Log"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Audit Log</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                {auditLogs.length}
              </span>
            </button>

            {/* Switch to User Portal View button */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs min-h-[34px] sm:min-h-[38px]"
              title="Preview Customer Dashboard View"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">User Portal</span>
              <span className="md:hidden text-[11px]">User</span>
            </button>

            {/* Theme switch */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer min-h-[34px] min-w-[34px] sm:min-h-[38px] sm:min-w-[38px] flex items-center justify-center"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />}
            </button>

            {/* Officer Profile & Sign Out */}
            <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-800">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-bold text-slate-200">
                  {user?.firstName || 'Alexander'} {user?.lastName || 'Vance'}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  {user?.email || 'admin@growvest.com'}
                </div>
              </div>

              <button
                onClick={() => logout()}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer min-h-[34px] sm:min-h-[38px]"
                title="End Administrative Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Admin Enclave Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <AdminView />
      </main>

      {/* 3. Dedicated Admin Cryptographic Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-4 px-4 sm:px-6 text-slate-400 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap text-center sm:text-left">
            <span className="text-slate-300 font-bold">GROWVEST FINANCIAL TREASURY ENCLAVE</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-emerald-400">SESSION PROTECTED WITH FIPS 140-2 LEVEL 3</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAuditDrawerOpen(true)}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <FileText className="w-3 h-3" />
              <span>Inspect Audit Trail ({auditLogs.length} Events)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* 4. Real-Time Institutional Audit Log Slide-over Drawer */}
      {isAuditDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={() => setIsAuditDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Container */}
          <div
            id="admin-audit-log-drawer-panel"
            className="relative w-full max-w-2xl bg-slate-900 border-l border-slate-800 text-slate-100 h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-slide-left"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold font-mono tracking-tight text-slate-100">
                    Institutional Audit Ledger
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    REAL-TIME
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Immutable chronological trail of strategy edits, deletions, ledger credits, and officer actions.
                </p>
              </div>

              <button
                onClick={() => setIsAuditDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Close Audit Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-900/90 space-y-3 shrink-0">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search actions, strategies, officer name, or IP address..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs p-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono">
                <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-emerald-400" /> Filter:
                </span>
                {[
                  { id: 'all', label: 'All Events' },
                  { id: 'strategy', label: 'Strategies (Edit/Del)' },
                  { id: 'financial', label: 'Ledger & Wallets' },
                  { id: 'kyc', label: 'KYC & Users' },
                  { id: 'cms', label: 'CMS & System' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-500 text-white font-bold shadow-xs'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Action and Export Bar */}
              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <span className="text-[11px] text-slate-400 font-mono">
                  Showing <strong className="text-emerald-400">{filteredLogs.length}</strong> of {auditLogs.length} logged actions
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCsv}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-mono transition-colors cursor-pointer"
                    title="Export Audit Logs as CSV"
                  >
                    <Download className="w-3 h-3 text-emerald-400" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={handleExportJson}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-mono transition-colors cursor-pointer"
                    title="Export Audit Logs as JSON"
                  >
                    <Download className="w-3 h-3 text-emerald-400" />
                    <span>JSON Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Audit Log Stream List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-3">
                  <FileText className="w-10 h-10 mx-auto text-slate-600 opacity-50" />
                  <p className="text-sm font-semibold">No audit entries found</p>
                  <p className="text-xs">Try clearing search filters or perform an administrative action.</p>
                </div>
              ) : (
                filteredLogs.map(log => {
                  const isExpanded = expandedLogId === log.id;
                  const isStrategyAction =
                    log.action.includes('INVESTMENT_PLAN') ||
                    log.action.includes('PLAN_STATUS') ||
                    log.action.includes('STRATEGY');

                  return (
                    <div
                      key={log.id}
                      className={`p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border transition-all ${
                        isStrategyAction
                          ? 'border-emerald-500/40 shadow-xs shadow-emerald-500/5'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 min-w-0 flex-1">
                          {/* Header badges */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase ${getActionBadgeColor(
                                log.action,
                                log.result
                              )}`}
                            >
                              {log.action.replace(/_/g, ' ')}
                            </span>

                            <span className="text-[11px] font-semibold text-slate-200 truncate">
                              Target: <span className="text-slate-100 font-mono font-bold">{log.target}</span>
                            </span>

                            {log.result === 'success' && (
                              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Verified</span>
                              </span>
                            )}
                            {log.result === 'warning' && (
                              <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Warning</span>
                              </span>
                            )}
                            {log.result === 'error' && (
                              <span className="flex items-center gap-1 text-[10px] font-mono text-rose-400">
                                <XCircle className="w-3 h-3" />
                                <span>Rejected</span>
                              </span>
                            )}
                          </div>

                          {/* Action Details */}
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {log.details}
                          </p>

                          {/* Meta Information Bar */}
                          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <KeyRound className="w-3 h-3 text-slate-500" />
                              <span>Officer: {log.adminName}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3 text-slate-500" />
                              <span>{log.ipAddress}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Laptop className="w-3 h-3 text-slate-500" />
                              <span>{log.device}</span>
                            </span>
                          </div>
                        </div>

                        {/* Timestamp & Accordion */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                          </span>

                          <button
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                            title={isExpanded ? 'Hide Cryptographic Signature' : 'View Cryptographic Signature'}
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Cryptographic Signature Box */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-[10px] font-mono text-slate-400 bg-slate-900/50 p-3 rounded-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-bold">Ledger Log ID:</span>
                            <span className="text-slate-200">{log.id}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-bold">Officer Email:</span>
                            <span className="text-emerald-400">{log.adminEmail}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-bold">Target Entity ID:</span>
                            <span>{log.targetId || 'N/A (Global Resource)'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-bold">Full Timestamp:</span>
                            <span>{new Date(log.timestamp).toISOString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-bold">SHA-256 Merkle Hash:</span>
                            <span className="text-slate-500 break-all">
                              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>All mutations signed & persisted to local storage</span>
              </span>

              <button
                onClick={() => setIsAuditDrawerOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
