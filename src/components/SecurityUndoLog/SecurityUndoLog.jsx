import React, { useState, useEffect } from 'react';
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
  // --- Stack (LIFO) Data Structure Persistence ---
  // Store stack data (log) and undone counts in localStorage so they persist across page reloads.
  // The 'log' array acts as the Stack:
  // - Top of the Stack is index 0 (the latest policy).
  // - Pushing onto the Stack prepends elements to index 0.
  // - Popping from the Stack slices off the element at index 0.
  const [log, setLog] = useLocalStorage('cachenode-security-log', generateSecurityLog());
  const [undoneCount, setUndoneCount] = useLocalStorage('cachenode-security-undone-count', 0);
  const [filter, setFilter] = useState('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [newType, setNewType] = useState('FIREWALL');
  const [newAction, setNewAction] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newPrev, setNewPrev] = useState('No previous rule');

  // Automatically migrate legacy state by filtering out reverted changes from previous runs
  useEffect(() => {
    if (log.some(e => e.reverted)) {
      setLog(log.filter(e => !e.reverted));
    }
  }, [log, setLog]);

  // --- Stack Operations ---
  
  /**
   * Pop operation (Undo).
   * In LIFO (Last In First Out), we only pop the item at the top of the stack (index 0).
   * We remove this element and update our stack state.
   */
  const handleUndo = (id) => {
    if (log.length === 0) return;
    const topEntry = log[0];

    // Safety check to ensure we only pop the top of the stack
    if (topEntry.id !== id) {
      showToast('Only the top of the stack can be undone', 'error');
      return;
    }

    const undoneAction = topEntry.action;

    // Pop/remove the latest entry (index 0) from the stack
    setLog(prev => prev.slice(1));
    setUndoneCount(prev => prev + 1);
    showToast(`Undone policy: ${undoneAction}`, 'info');
  };

  /**
   * Push operation (Apply Policy).
   * Adds a new policy rule directly onto the top of the stack (prepended at index 0).
   */
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

    // Push the new item to the top of the stack (index 0)
    setLog(prev => [newEntry, ...prev]);
    showToast(`Applied Security Rule: ${newAction.trim()}`, 'success');

    // Reset Form
    setNewAction('');
    setNewTarget('');
    setNewPrev('No previous rule');
    setIsFormOpen(false);
  };

  // Stack elements split into Top of Stack and Older Changes
  const topOfStack = log[0];
  const olderChanges = log.slice(1);

  // Apply filters for active rendering
  const showTop = topOfStack && (filter === 'ALL' || topOfStack.type === filter);
  const filteredOlder = olderChanges.filter(e => filter === 'ALL' || e.type === filter);

  // Calculate stats based on current stack size and popped count
  const totalCount = log.length + undoneCount;
  const activeCount = log.length;

  return (
    <div style={{ animation: 'fadeInUp 0.3s ease' }}>
      <div className="stat-grid">
        <div className="stat-card glass-card cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Total Changes</div>
            <HelpButton topic="total-changes" />
          </div>
          <div className="stat-value cyan">{totalCount}</div>
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
          <div className="stat-value green">{activeCount}</div>
          <div className="stat-change">policies applied</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div className="panel-header">
          <div>
            <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="icon" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)' }}>🔐</span>
              <span>Security Undo Log</span>
              <span className="badge badge-patch" style={{ fontSize: 10, padding: '2px 8px', borderRadius: '4px', textTransform: 'none', fontWeight: 600 }}>
                Stack (LIFO) Demonstration
              </span>
              <HelpButton topic="security-log" />
            </div>
            <div className="panel-subtitle">Track and safely revert any security policy modification</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
              💡 Only the latest security change can be reverted first.
            </div>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Top of Stack Section */}
          {showTop && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: 0.8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10 }}>▼</span> Top of Stack
              </div>
              <div
                key={topOfStack.id}
                className="glass-card"
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  borderLeft: '3px solid var(--cyan)',
                  transition: 'opacity 0.3s',
                  animation: 'slideIn 0.3s ease 0s both',
                }}
              >
                <div style={{ fontSize: 20 }}>{(TYPE_COLORS[topOfStack.type] || { icon: '•' }).icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className={`badge ${(TYPE_COLORS[topOfStack.type] || { badge: 'badge-ok' }).badge}`}>{topOfStack.type}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {topOfStack.action}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>🎯 <span className="mono">{topOfStack.target}</span></span>
                    <span>👤 {topOfStack.user}</span>
                    <span>🕐 {topOfStack.ts}</span>
                  </div>
                </div>
                <div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleUndo(topOfStack.id)}>
                    ↩ Undo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Older Changes Section */}
          {filteredOlder.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Older Changes
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredOlder.map((entry, i) => {
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
                        opacity: 0.8,
                        transition: 'opacity 0.3s',
                        animation: `slideIn 0.3s ease ${(i + 1) * 0.05}s both`,
                      }}
                    >
                      <div style={{ fontSize: 20 }}>{typeInfo.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span className={`badge ${typeInfo.badge}`}>{entry.type}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {entry.action}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                          <span>🎯 <span className="mono">{entry.target}</span></span>
                          <span>👤 {entry.user}</span>
                          <span>🕐 {entry.ts}</span>
                        </div>
                      </div>
                      <div>
                        <button
                          className="btn btn-ghost btn-sm"
                          disabled
                          style={{ cursor: 'not-allowed', opacity: 0.5 }}
                        >
                          Cannot Undo Yet
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state if nothing matches filter */}
          {!showTop && filteredOlder.length === 0 && (
            <div className="empty-state">
              <span className="empty-state-icon">🔐</span>
              <span className="empty-state-text">No security policies found matching the filter</span>
            </div>
          )}
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
