import React, { useState } from 'react';
import { serverRegistry } from '../../data/mockData';
import HelpButton from '../HelpButton/HelpButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '../../context/ToastContext';

export default function ServerIDChecker() {
  const [servers, setServers] = useLocalStorage('cachenode-servers', serverRegistry);
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const { showToast } = useToast();

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setSearched(query.trim().length > 0);
  };

  const handleSuggestionClick = (id) => {
    setSearchQuery(id);
    setSearched(true);
  };

  const activeCount = servers.filter(s => s.status === 'active').length;
  const warningCount = servers.filter(s => s.status === 'warning').length;

  // Find result dynamically from state
  const cleanQuery = searchQuery.trim().toLowerCase();
  const result = cleanQuery ? servers.find(s => s.id.toLowerCase() === cleanQuery || s.ip === cleanQuery) : null;

  const handleReboot = (serverId) => {
    if (isRebooting) return;
    setIsRebooting(true);
    showToast(`Initiating reboot sequence for node ${serverId}...`, 'warning');

    // Set server status to rebooting in database
    setServers(prev => prev.map(s => {
      if (s.id === serverId) {
        return { ...s, status: 'warning', cpu: 0, mem: 0, heartbeat: 'Rebooting...' };
      }
      return s;
    }));

    // Reset status after 3 seconds
    setTimeout(() => {
      setServers(prev => prev.map(s => {
        if (s.id === serverId) {
          return { 
            ...s, 
            status: 'active', 
            cpu: Math.floor(Math.random() * 30) + 10, 
            mem: Math.floor(Math.random() * 20) + 40,
            heartbeat: '1s ago'
          };
        }
        return s;
      }));
      setIsRebooting(false);
      showToast(`Node ${serverId} has successfully rebooted and joined the cluster`, 'success');
    }, 3000);
  };

  const handleToggleMaintenance = (serverId, currentStatus) => {
    const nextStatus = currentStatus === 'warning' ? 'active' : 'warning';
    setServers(prev => prev.map(s => {
      if (s.id === serverId) {
        return { 
          ...s, 
          status: nextStatus,
          cpu: nextStatus === 'warning' ? 85 : 35,
          mem: nextStatus === 'warning' ? 90 : 55
        };
      }
      return s;
    }));
    showToast(
      nextStatus === 'warning' 
        ? `Node ${serverId} set to Maintenance Mode` 
        : `Node ${serverId} returned to standard Cluster pool`,
      'info'
    );
  };

  return (
    <div style={{ animation: 'fadeInUp 0.3s ease' }}>
      <div className="stat-grid">
        <div className="stat-card glass-card green">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Active Nodes</div>
            <HelpButton topic="active-nodes" />
          </div>
          <div className="stat-value green">{activeCount}</div>
          <div className="stat-change">Heartbeat verified</div>
        </div>
        <div className="stat-card glass-card orange">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Alert Flags</div>
            <HelpButton topic="alert-flags" />
          </div>
          <div className="stat-value orange">{warningCount}</div>
          <div className="stat-change">Investigate required</div>
        </div>
        <div className="stat-card glass-card purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Total Servers</div>
            <HelpButton topic="total-servers" />
          </div>
          <div className="stat-value purple">{servers.length}</div>
          <div className="stat-change">Cluster total</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <span className="icon" style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--cyan)' }}>🔍</span>
              Server ID Checker
              <HelpButton topic="server-checker" />
            </div>
            <div className="panel-subtitle">Instantly verify server signatures and check system health</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="input"
              placeholder="Enter Server ID (e.g. srv-a1b2c3d4) or Server IP (e.g. 10.0.1.12)..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{ paddingRight: 40, fontSize: 15 }}
            />
            {searchQuery && (
              <button 
                onClick={() => handleSearchChange('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 18
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>
              QUICK SUGGESTIONS:
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {servers.map(s => (
                <button
                  key={s.id}
                  className="btn btn-ghost btn-sm mono"
                  onClick={() => handleSuggestionClick(s.id)}
                  style={{ fontSize: 11, padding: '4px 8px' }}
                >
                  {s.id} ({s.region})
                </button>
              ))}
            </div>
          </div>
        </div>

        {searched && (
          <div className="animate-fadeInUp" style={{ marginTop: 24 }}>
            <div className="divider" style={{ margin: '0 0 20px 0' }} />
            
            {result ? (
              <div 
                className="glass-card" 
                style={{ 
                  padding: 20, 
                  background: 'rgba(0, 229, 255, 0.02)',
                  borderColor: result.status === 'active' ? 'rgba(16, 185, 129, 0.3)' : result.status === 'warning' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="dot dot-cyan" style={{ 
                        backgroundColor: result.status === 'active' ? 'var(--green)' : result.status === 'warning' ? 'var(--yellow)' : 'var(--red)',
                        boxShadow: result.status === 'active' ? '0 0 8px var(--green)' : result.status === 'warning' ? '0 0 8px var(--yellow)' : '0 0 8px var(--red)'
                      }} />
                      <h4 className="mono" style={{ fontSize: 18, color: 'var(--text-primary)' }}>{result.id}</h4>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>IP Address: <span className="mono">{result.ip}</span></p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`badge ${result.status === 'active' ? 'badge-active' : result.status === 'warning' ? 'badge-warning' : 'badge-blocked'}`}>
                      {isRebooting ? 'REBOOTING...' : result.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Region</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, color: 'var(--cyan)' }}>{result.region.toUpperCase()}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Node Type</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{result.type}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Uptime</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{isRebooting ? '0m' : result.uptime}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Heartbeat</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{result.heartbeat}</div>
                  </div>
                </div>

                <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginBottom: 6 }}>
                      <span>CPU Utilization <HelpButton topic="cpu-utilization" /></span>
                      <span className="mono" style={{ color: result.cpu > 80 ? 'var(--red)' : 'var(--text-primary)' }}>{result.cpu}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ 
                        width: `${result.cpu}%`, 
                        backgroundColor: result.cpu > 85 ? 'var(--red)' : result.cpu > 70 ? 'var(--yellow)' : 'var(--green)' 
                      }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginBottom: 6 }}>
                      <span>Memory Allocation <HelpButton topic="mem-allocation" /></span>
                      <span className="mono" style={{ color: result.mem > 80 ? 'var(--red)' : 'var(--text-primary)' }}>{result.mem}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ 
                        width: `${result.mem}%`, 
                        backgroundColor: result.mem > 85 ? 'var(--red)' : result.mem > 70 ? 'var(--yellow)' : 'var(--purple-light)' 
                      }} />
                    </div>
                  </div>
                </div>

                {/* Operations Toolbar */}
                <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-ghost btn-sm"
                    disabled={isRebooting}
                    onClick={() => handleToggleMaintenance(result.id, result.status)}
                  >
                    {result.status === 'warning' ? '🔓 Restore to Pool' : '🛠 Set Maintenance'}
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    disabled={isRebooting}
                    onClick={() => handleReboot(result.id)}
                  >
                    {isRebooting ? '⏳ Rebooting...' : '🔄 Reboot Node'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: 24, textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                <span style={{ fontSize: 28 }}>⚠️</span>
                <h4 style={{ color: 'var(--red)', marginTop: 8 }}>Verification Failed</h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  The signature "<span className="mono" style={{ color: 'var(--text-primary)' }}>{searchQuery}</span>" could not be verified against any active network nodes in our security database.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
