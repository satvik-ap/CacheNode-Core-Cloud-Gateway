import React, { useState } from 'react';
import { generateSecurityLog } from '../../data/mockData';
import HelpButton from '../HelpButton/HelpButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '../../context/ToastContext';

const TYPE_COLORS = {
  FIREWALL: { badge: 'badge-blocked', icon: '🔥' },
  RATE_LIMIT: { badge: 'badge-warning', icon: '⚡' },
  ACL: { badge: 'badge-post', icon: '🔑' },
  AUTH: { badge: 'badge-active', icon: '🛡️' },
};

export default function SecurityUndoLog() {
  const [log, setLog] = useLocalStorage('cachenode-security-log', generateSecurityLog());
  const [filter, setFilter] = useState('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [newType, setNewType] = useState('FIREWALL');
  const [newAction, setNewAction] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newPrev, setNewPrev] = useState('No previous rule');

  const handleUndo = (id) => {
    let undoneAction = '';
    setLog(prev => prev.map(e => {
      if (e.id === id) {
        undoneAction = e.action;
        return { ...e, reverted: true };
      }
      return e;
    }));
    showToast(`Undone policy: ${undoneAction}`, 'info');
  };

  const handleRedo = (id) => {
    let redoneAction = '';
    setLog(prev => prev.map(e => {
      if (e.id === id) {
        redoneAction = e.action;
        return { ...e, reverted: false };
      }
      return e;
    }));
    showToast(`Re-applied policy: ${redoneAction}`, 'success');
  };

  const handleApplyPolicy = (e) => {
    e.preventDefault();
    if (!newAction.trim() || !newTarget.trim()) {
      showToast('Action and Target settings are required', 'error');
      return;
    }

    const newEntry = {
      id: 's_custom_' + Math.random().toString(36).substring(7),
      ts: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'sec-admin@cachenode.io',
      type: newType,
      action: newAction.trim(),
      target: newTarget.trim(),
      reverted: false,
      prev: newPrev.trim()
    };

    setLog(prev => [newEntry, ...prev]);
    showToast(`Applied Security Rule: ${newAction.trim()}`, 'success');

    // Reset Form
    setNewAction('');
    setNewTarget('');
    setNewPrev('No previous rule');
    setIsFormOpen(false);
  };

  const filtered = filter === 'ALL' ? log : log.filter(e => e.type === filter);
  const undoneCount = log.filter(e => e.reverted).length;

  return (
    <div style={{ animation: 'fadeInUp 0.3s ease' }}>
      <div className="stat-grid">
        <div className="stat-card glass-card cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Total Changes</div>
            <HelpButton topic="total-changes" />
          </div>
          <div className="stat-value cyan">{log.length}</div>
          <div className="stat-change">security events today</div>
        </div>
        <div className="stat-card glass-card orange">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Reverted</div>
            <HelpButton topic="reverted-changes" />
          </div>
          <div className="stat-value orange">{undoneCount}</div>
          <div className="stat-change">changes undone</div>
        </div>
        <div className="stat-card glass-card green">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Active</div>
            <HelpButton topic="active-policies" />
          </div>
          <div className="stat-value green">{log.length - undoneCount}</div>
          <div className="stat-change">policies applied</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <span className="icon" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)' }}>🔐</span>
              Security Undo Log
              <HelpButton topic="security-log" />
            </div>
            <div className="panel-subtitle">Track and safely revert any security policy modification</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {['ALL', 'FIREWALL', 'RATE_LIMIT', 'ACL', 'AUTH'].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-cyan' : 'btn-ghost'}`}
                onClick={() => setFilter(f)}
              >
                {f === 'ALL' ? 'All Types' : f}
              </button>
            ))}
            <button className="btn btn-primary btn-sm" onClick={() => setIsFormOpen(o => !o)}>
              {isFormOpen ? '✕ Close Form' : '＋ Apply Policy'}
            </button>
          </div>
        </div>

        {/* Apply Policy Form */}
        {isFormOpen && (
          <form className="form-panel" onSubmit={handleApplyPolicy}>
            <h4 style={{ fontSize: 13, color: 'var(--red)', marginBottom: 14, fontWeight: 700, letterSpacing: 0.5 }}>
              APPLY NEW SECURITY POLICY RULE
            </h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Policy Classification</label>
                <select className="select" value={newType} onChange={e => setNewType(e.target.value)}>
                  <option value="FIREWALL">FIREWALL (IP Blocks/Ports)</option>
                  <option value="RATE_LIMIT">RATE LIMIT (Throttling Thresholds)</option>
                  <option value="ACL">ACL (Access Control Lists)</option>
                  <option value="AUTH">AUTH (Authentication Policies)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Rule Action (e.g., 'Blocked port 8080')</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Blocked IP subnet, Granted read credentials"
                  value={newAction}
                  onChange={e => setNewAction(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Subnet/Client (e.g. '192.168.1.0/24')</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. 10.0.5.25, team-beta, customer-4022"
                  value={newTarget}
                  onChange={e => setNewTarget(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Previous Config State (for rollback)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Port open, No limit set, Write-only access"
                  value={newPrev}
                  onChange={e => setNewPrev(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsFormOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-danger btn-sm">
                Enforce & Log Policy
              </button>
            </div>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((entry, i) => {
            const typeInfo = TYPE_COLORS[entry.type] || { badge: 'badge-ok', icon: '•' };
            return (
              <div
                key={entry.id}
                className="glass-card"
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  opacity: entry.reverted ? 0.5 : 1,
                  transition: 'opacity 0.3s',
                  animation: `slideIn 0.3s ease ${i * 0.05}s both`,
                }}
              >
                <div style={{ fontSize: 20 }}>{typeInfo.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className={`badge ${typeInfo.badge}`}>{entry.type}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: entry.reverted ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {entry.action}
                    </span>
                    {entry.reverted && (
                      <span style={{ fontSize: 11, color: 'var(--yellow)', background: 'rgba(245,158,11,0.1)', padding: '1px 8px', borderRadius: 99, border: '1px solid rgba(245,158,11,0.3)' }}>
                        REVERTED
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>🎯 <span className="mono">{entry.target}</span></span>
                    <span>👤 {entry.user}</span>
                    <span>🕐 {entry.ts}</span>
                  </div>
                  {entry.reverted && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      Restored to: <span style={{ color: 'var(--cyan)' }}>{entry.prev}</span>
                    </div>
                  )}
                </div>
                <div>
                  {!entry.reverted ? (
                    <button className="btn btn-danger btn-sm" onClick={() => handleUndo(entry.id)}>
                      ↩ Undo
                    </button>
                  ) : (
                    <button className="btn btn-cyan btn-sm" onClick={() => handleRedo(entry.id)}>
                      ↷ Redo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
