import React, { useState, useEffect } from 'react';
import { initialContainers } from '../../data/mockData';
import HelpButton from '../HelpButton/HelpButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '../../context/ToastContext';

export default function TrafficBalancer() {
  const [containers, setContainers] = useLocalStorage('cachenode-containers', initialContainers);
  const [algorithm, setAlgorithm] = useState('Least Connections');
  const [incomingRequests, setIncomingRequests] = useState([]);
  const lastAssignedIdx = React.useRef(-1);   // use ref so it never triggers interval restart
  const [totalProcessed, setTotalProcessed] = useLocalStorage('cachenode-balancer-total', 12800);
  const { showToast } = useToast();

  // 1. Dynamic traffic generator simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!containers || containers.length === 0) return;

      // Trigger new random request
      const reqId = Math.random().toString(36).substring(7);
      const reqType = ['AUTH', 'DATA', 'IMAGE', 'API'][Math.floor(Math.random() * 4)];
      
      setIncomingRequests(prev => [...prev.slice(-3), { id: reqId, type: reqType, status: 'routing' }]);

      // Choose container according to algorithm
      setContainers(prev => {
        if (!prev || prev.length === 0) return prev;
        
        let selectedIdx = 0;
        
        if (algorithm === 'Least Connections') {
          // Find container with absolute lowest load
          let minLoad = Infinity;
          prev.forEach((c, idx) => {
            if (c.load < minLoad) {
              minLoad = c.load;
              selectedIdx = idx;
            }
          });
        } else {
          // Round Robin — use ref so the counter always has the latest value
          lastAssignedIdx.current = (lastAssignedIdx.current + 1) % prev.length;
          selectedIdx = lastAssignedIdx.current;
        }

        // Increase load on chosen container
        return prev.map((c, idx) => {
          if (idx === selectedIdx) {
            return {
              ...c,
              load: Math.min(100, c.load + Math.floor(Math.random() * 10) + 5),
              requests: c.requests + 1
            };
          } else {
            // Decay container loads slowly over time
            return {
              ...c,
              load: Math.max(5, c.load - Math.floor(Math.random() * 4))
            };
          }
        });
      });

      setTotalProcessed(t => t + 1);
    }, 1200);

    return () => clearInterval(interval);
  }, [algorithm, containers?.length, setContainers, setTotalProcessed]); // re-run if algorithm or container count changes

  const handleScaleUp = () => {
    const newId = 'c' + (containers.length + 1) + '_' + Math.random().toString(36).substring(7);
    const names = ['fn-auth-handler', 'fn-data-processor', 'fn-cache-service', 'fn-image-resize', 'fn-notification', 'fn-payment-svc', 'fn-analytics-worker', 'fn-logger-daemon'];
    const regions = ['us-east-1', 'eu-west-2', 'ap-se-1', 'us-west-2', 'eu-central-1', 'ca-central-1'];
    
    const randomName = names[Math.floor(Math.random() * names.length)] + '-' + Math.random().toString(36).substring(9);
    const randomRegion = regions[Math.floor(Math.random() * regions.length)];

    const newContainer = {
      id: newId,
      name: randomName,
      region: randomRegion,
      load: 10,
      maxLoad: 100,
      requests: 0,
      status: 'active'
    };

    setContainers(prev => [...prev, newContainer]);
    showToast(`Scaled Up: Created new serverless worker node ${randomName} in ${randomRegion}`, 'success');
  };

  const handleTerminateContainer = (id, name) => {
    if (containers.length <= 1) {
      showToast('Cannot terminate node: At least one gateway container is required to process traffic!', 'error');
      return;
    }
    setContainers(prev => prev.filter(c => c.id !== id));
    showToast(`Terminated serverless container: ${name} (De-allocated resources)`, 'warning');
  };

  // Calculations
  const averageLoad = containers && containers.length > 0 
    ? Math.round(containers.reduce((sum, c) => sum + c.load, 0) / containers.length)
    : 0;
  const loadDeviation = containers && containers.length > 0
    ? Math.round(Math.max(...containers.map(c => c.load)) - Math.min(...containers.map(c => c.load)))
    : 0;

  return (
    <div style={{ animation: 'fadeInUp 0.3s ease' }}>
      <div className="stat-grid">
        <div className="stat-card glass-card cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Total Handled</div>
            <HelpButton topic="total-handled" />
          </div>
          <div className="stat-value cyan">{totalProcessed}</div>
          <div className="stat-change">Gateway requests routed</div>
        </div>
        <div className="stat-card glass-card purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Average Cluster Load</div>
            <HelpButton topic="average-cluster-load" />
          </div>
          <div className="stat-value purple">{averageLoad}%</div>
          <div className="stat-change">Server load average</div>
        </div>
        <div className="stat-card glass-card green">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Load Deviation</div>
            <HelpButton topic="load-deviation" />
          </div>
          <div className="stat-value green">{loadDeviation}%</div>
          <div className="stat-change">Balance efficiency indicator</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        
        {/* Balancer Settings & Live Animation */}
        <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <div>
              <div className="panel-title">
                <span className="icon" style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--cyan)' }}>⚖️</span>
                Traffic Balancer
                <HelpButton topic="balancer" />
              </div>
              <div className="panel-subtitle">Balances serverless function loads dynamically</div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>
              SELECT BALANCING ALGORITHM:
              <HelpButton topic="balancer" style={{ transform: 'scale(0.85)' }} />
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['Least Connections', 'Round Robin'].map(algo => (
                <button
                  key={algo}
                  className={`btn btn-sm ${algorithm === algo ? 'btn-cyan' : 'btn-ghost'}`}
                  onClick={() => setAlgorithm(algo)}
                  style={{ flex: 1 }}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>

          {/* Animation Canvas */}
          <div style={{ 
            flex: 1, 
            background: 'rgba(5, 11, 24, 0.5)', 
            border: '1px solid var(--border)', 
            borderRadius: 8, 
            padding: 16, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 220 
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <div className="glass-card" style={{ padding: '8px 16px', border: '1px solid var(--cyan)', boxShadow: '0 0 10px rgba(0, 229, 255, 0.1)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', textAlign: 'center' }}>Gateway Input</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cyan)' }}>PROXY-LB</span>
              </div>
              <span style={{ fontSize: 18, color: 'var(--cyan)', animation: 'pulse 1s infinite' }}>➡</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>
                INCOMING STREAM ROUTING QUEUE:
              </span>
              {incomingRequests.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                  Awaiting gateway packets...
                </div>
              ) : (
                incomingRequests.map((req) => (
                  <div 
                    key={req.id} 
                    className="glass-card mono" 
                    style={{ 
                      padding: '6px 12px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      fontSize: 11,
                      borderLeft: '3px solid var(--cyan)',
                      background: 'rgba(0, 229, 255, 0.02)',
                      animation: 'slideIn 0.3s ease'
                    }}
                  >
                    <span>ID: {req.id}</span>
                    <span className="badge badge-post">{req.type}</span>
                    <span style={{ color: 'var(--green)', fontSize: 10, fontWeight: 700 }}>ROUTED ➔</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Containers List */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              ⚙️ Target Serverless Containers
            </h3>
            <button className="btn btn-success btn-sm" onClick={handleScaleUp}>
              ＋ Scale Up (Add Worker)
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
            {containers.map(container => {
              const statusColor = container.load > 85 ? 'var(--red)' : container.load > 60 ? 'var(--yellow)' : 'var(--green)';
              return (
                <div 
                  key={container.id} 
                  className="glass-card" 
                  style={{ 
                    padding: 14, 
                    borderLeft: `4px solid ${statusColor}`,
                    background: 'rgba(255, 255, 255, 0.01)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <span className="mono" style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                        {container.name}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
                        ({container.region})
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className="mono" style={{ fontSize: 12, color: statusColor, fontWeight: 700 }}>
                        {container.load}% load
                      </span>
                      <button 
                        className="btn btn-sm btn-ghost-danger" 
                        onClick={() => handleTerminateContainer(container.id, container.name)}
                        style={{ padding: '2px 6px', fontSize: 10 }}
                        title="Terminate Container"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="progress-bar" style={{ height: 4, marginBottom: 8 }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${container.load}%`, 
                        backgroundColor: statusColor 
                      }} 
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>Processed Reqs: <strong style={{ color: 'var(--text-secondary)' }}>{container.requests}</strong></span>
                    <span className="mono" style={{ color: container.load > 80 ? 'var(--red)' : 'var(--text-muted)' }}>
                      {container.load > 80 ? '⚠️ OVERHEATING' : '✔ ACTIVE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
