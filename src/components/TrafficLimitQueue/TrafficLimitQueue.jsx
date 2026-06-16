import React, { useState, useEffect } from 'react';
import { generateTrafficData } from '../../data/mockData';
import HelpButton from '../HelpButton/HelpButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '../../context/ToastContext';

export default function TrafficLimitQueue() {
  const [queue, setQueue] = useLocalStorage('cachenode-traffic-queue', []);
  const [simulationActive, setSimulationActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Load from API if no data exists in localStorage
  useEffect(() => {
    if (queue && queue.length > 0) return;

    setIsLoading(true);
    // Fetch from JSONPlaceholder to get realistic customer names
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(users => {
        // Map users to traffic limit items
        const limits = [1000, 750, 500, 400, 300, 250, 200, 150, 100, 50];
        const apiData = users.map((u, index) => {
          const limit = limits[index % limits.length];
          // random requests up to limit * 1.15 (to show some violations)
          const requests = Math.floor(Math.random() * (limit * 1.15));
          return {
            id: `t_${u.id}`,
            customer: u.company.name,
            customerId: `CID-${8000 + u.id}`,
            requests,
            limit,
            windowSec: 60,
            blocked: false
          };
        });
        
        // Introduce small delay to showcase skeleton loader
        setTimeout(() => {
          setQueue(apiData);
          setIsLoading(false);
          showToast('Loaded active client profiles from Gateway API', 'success');
        }, 1200);
      })
      .catch(err => {
        console.error('API Fetch failed, using offline fallback', err);
        setQueue(generateTrafficData().map(d => ({ ...d, blocked: false })));
        setIsLoading(false);
      });
  }, [queue, setQueue]);

  // Simulation: randomize requests periodically
  useEffect(() => {
    if (!simulationActive || isLoading || !queue || queue.length === 0) return;
    const interval = setInterval(() => {
      setQueue(prev =>
        prev.map(item => {
          if (item.blocked) return item;
          // randomly add or subtract requests to simulate live traffic
          const change = Math.floor((Math.random() - 0.42) * 80);
          const newRequests = Math.max(0, item.requests + change);
          return { ...item, requests: newRequests };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [simulationActive, isLoading, queue]);

  const getStatus = (item) => {
    if (item.blocked) return { text: 'Blocked', badge: 'badge-blocked' };
    if (item.requests > item.limit) return { text: 'Over Limit', badge: 'badge-blocked' };
    if (item.requests >= item.limit * 0.8) return { text: 'Throttled', badge: 'badge-throttled' };
    return { text: 'Healthy', badge: 'badge-ok' };
  };

  const getProgressColor = (item) => {
    if (item.blocked) return 'var(--red)';
    const ratio = item.requests / item.limit;
    if (ratio > 1.0) return 'var(--red)';
    if (ratio >= 0.8) return 'var(--yellow)';
    return 'var(--cyan)';
  };

  const handleToggleBlock = (id, customerName) => {
    setQueue(prev => prev.map(item => {
      if (item.id === id) {
        const nextBlocked = !item.blocked;
        showToast(
          nextBlocked ? `Manually BLOCKED gateway access for ${customerName}` : `Restored gateway access for ${customerName}`,
          nextBlocked ? 'error' : 'success'
        );
        return { 
          ...item, 
          blocked: nextBlocked,
          requests: nextBlocked ? 0 : Math.floor(item.limit * 0.5) 
        };
      }
      return item;
    }));
  };

  const handleLimitChange = (id, newLimit) => {
    setQueue(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, limit: parseInt(newLimit, 10) };
      }
      return item;
    }));
  };

  const handleLimitChangeCommit = (customerName, limit) => {
    showToast(`Adjusted rate limit for ${customerName} to ${limit}/min`, 'info');
  };

  const totalLimit = queue ? queue.reduce((sum, item) => sum + item.limit, 0) : 0;
  const totalRequests = queue ? queue.reduce((sum, item) => sum + item.requests, 0) : 0;
  const overflowCount = queue ? queue.filter(item => item.blocked || item.requests > item.limit).length : 0;

  return (
    <div style={{ animation: 'fadeInUp 0.3s ease' }}>
      <div className="stat-grid">
        <div className="stat-card glass-card cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Total Egress Load</div>
            <HelpButton topic="egress-load" />
          </div>
          <div className="stat-value cyan">{isLoading ? '...' : `${totalRequests} reqs`}</div>
          <div className="stat-change">Active load windows</div>
        </div>
        <div className="stat-card glass-card purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Aggregated Limit</div>
            <HelpButton topic="aggregated-limit" />
          </div>
          <div className="stat-value purple">{isLoading ? '...' : `${totalLimit} reqs`}</div>
          <div className="stat-change">Total capacity allotted</div>
        </div>
        <div className="stat-card glass-card red">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Policy Violations</div>
            <HelpButton topic="policy-violations" />
          </div>
          <div className="stat-value red">{isLoading ? '...' : overflowCount}</div>
          <div className="stat-change">Throttled / Blocked ips</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <span className="icon" style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--cyan)' }}>⏳</span>
              Traffic Limit Queue
              <HelpButton topic="traffic-queue" />
            </div>
            <div className="panel-subtitle">Real-time traffic policing queue and rate limit monitoring</div>
          </div>
          <div>
            <button 
              className={`btn ${simulationActive ? 'btn-danger' : 'btn-cyan'}`} 
              disabled={isLoading}
              onClick={() => setSimulationActive(!simulationActive)}
            >
              {simulationActive ? '⏹ Pause Live Feed' : '▶ Resume Live Feed'}
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Profile</th>
                <th>API Client ID</th>
                <th>Request Load (60s Window)</th>
                <th>Quota Threshold</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Render skeleton loading states
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td>
                      <div className="skeleton-cell" style={{ width: 120, height: 16 }} />
                    </td>
                    <td>
                      <div className="skeleton-cell" style={{ width: 80, height: 14 }} />
                    </td>
                    <td>
                      <div className="skeleton-cell" style={{ width: '100%', height: 12, marginBottom: 6 }} />
                      <div className="skeleton-cell" style={{ width: '100%', height: 4 }} />
                    </td>
                    <td>
                      <div className="skeleton-cell" style={{ width: 70, height: 14 }} />
                    </td>
                    <td>
                      <div className="skeleton-cell" style={{ width: 60, height: 18, borderRadius: 10 }} />
                    </td>
                    <td>
                      <div className="skeleton-cell" style={{ width: 80, height: 26, marginLeft: 'auto' }} />
                    </td>
                  </tr>
                ))
              ) : (
                queue && queue.map(item => {
                  const status = getStatus(item);
                  const pct = Math.min(100, (item.requests / item.limit) * 100);
                  return (
                    <tr key={item.id} style={{ opacity: item.blocked ? 0.6 : 1 }}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.customer}</div>
                      </td>
                      <td>
                        <span className="mono" style={{ color: 'var(--text-muted)' }}>{item.customerId}</span>
                      </td>
                      <td style={{ width: '30%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                          <span style={{ color: item.blocked ? 'var(--text-muted)' : 'var(--text-primary)', fontWeight: 500 }}>
                            {item.blocked ? '0 (BLOCKED)' : `${item.requests} reqs`}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {item.blocked ? '0' : Math.round(pct)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${item.blocked ? 0 : pct}%`, 
                              backgroundColor: getProgressColor(item) 
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '110px' }}>
                          <span className="mono" style={{ fontWeight: 600 }}>{item.limit} / min</span>
                          <input
                            type="range"
                            min="50"
                            max="2000"
                            step="50"
                            value={item.limit}
                            onChange={(e) => handleLimitChange(item.id, e.target.value)}
                            onMouseUp={(e) => handleLimitChangeCommit(item.customer, e.target.value)}
                            onTouchEnd={(e) => handleLimitChangeCommit(item.customer, e.target.value)}
                            style={{ width: '100%', accentColor: 'var(--cyan)', cursor: 'pointer' }}
                          />
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${status.badge}`}>
                          {status.text}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className={`btn btn-sm ${item.blocked ? 'btn-success' : 'btn-ghost-danger'}`}
                          onClick={() => handleToggleBlock(item.id, item.customer)}
                        >
                          {item.blocked ? '🔓 Unblock' : '🚫 Block'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
