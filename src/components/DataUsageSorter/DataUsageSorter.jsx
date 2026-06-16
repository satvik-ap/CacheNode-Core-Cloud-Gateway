import React, { useState, useEffect } from 'react';
import { dataUsageAccounts as fallbackAccounts } from '../../data/mockData';
import HelpButton from '../HelpButton/HelpButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '../../context/ToastContext';

export default function DataUsageSorter() {
  const [accounts, setAccounts] = useLocalStorage('cachenode-data-usage', []);
  const [sortOrder, setSortOrder] = useState('DESC');
  const [filterTier, setFilterTier] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Load dataset from JSONPlaceholder on mount if uninitialized
  useEffect(() => {
    if (accounts && accounts.length > 0) return;
    
    setIsLoading(true);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(users => {
        const plans = ['Enterprise', 'Business', 'Startup', 'Free'];
        const tiers = ['platinum', 'gold', 'silver', 'bronze', 'free'];
        
        const apiAccounts = users.map((u, idx) => {
          const plan = plans[idx % plans.length];
          const tier = plan === 'Enterprise' ? 'platinum' : plan === 'Business' ? 'gold' : plan === 'Startup' ? 'silver' : 'free';
          // Seeding realistic egress usage
          let egress = 100 + Math.floor(Math.random() * 800);
          if (plan === 'Enterprise') egress += 8000;
          if (plan === 'Business') egress += 4000;
          if (plan === 'Startup') egress += 1500;
          
          return {
            id: `u_${u.id}`,
            name: u.company.name,
            plan,
            egress,
            egressUnit: 'GB',
            ingressRatio: parseFloat((0.2 + Math.random() * 0.9).toFixed(2)),
            tier
          };
        });

        setTimeout(() => {
          setAccounts(apiAccounts);
          setIsLoading(false);
          showToast('Synchronized data consumption matrix with Gateway API', 'success');
        }, 1200);
      })
      .catch(err => {
        console.error('API Fetch failed, using offline mock data', err);
        setAccounts(fallbackAccounts);
        setIsLoading(false);
      });
  }, [accounts, setAccounts]);

  const handleToggleSort = () => {
    const nextOrder = sortOrder === 'DESC' ? 'ASC' : 'DESC';
    setSortOrder(nextOrder);
    showToast(`Sorted traffic egress ${nextOrder === 'DESC' ? 'Descending (High ➔ Low)' : 'Ascending (Low ➔ High)'}`, 'info');
  };

  const handleFilterChange = (val) => {
    setFilterTier(val);
    showToast(val === 'ALL' ? 'Displaying all client tiers' : `Filtered client list: ${val.toUpperCase()}`, 'info');
  };

  const filteredAccounts = filterTier === 'ALL' 
    ? [...accounts] 
    : accounts.filter(acc => acc.tier === filterTier);

  const sortedAccounts = filteredAccounts.sort((a, b) => {
    if (sortOrder === 'DESC') {
      return b.egress - a.egress;
    } else {
      return a.egress - b.egress;
    }
  });

  const maxEgress = accounts.length > 0 ? Math.max(...accounts.map(a => a.egress)) : 1;
  const totalEgress = accounts.reduce((sum, a) => sum + a.egress, 0);

  const getTierColor = (tier) => {
    switch (tier) {
      case 'platinum': return 'linear-gradient(135deg, #e2e8f0, #94a3b8)';
      case 'gold': return 'linear-gradient(135deg, #fbbf24, #d97706)';
      case 'silver': return 'linear-gradient(135deg, #cbd5e1, #64748b)';
      case 'bronze': return 'linear-gradient(135deg, #ca8a04, #78350f)';
      default: return 'rgba(255,255,255,0.1)';
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.3s ease' }}>
      <div className="stat-grid">
        <div className="stat-card glass-card cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Total Egress</div>
            <HelpButton topic="total-egress" />
          </div>
          <div className="stat-value cyan">{isLoading ? '...' : `${(totalEgress / 1000).toFixed(2)} TB`}</div>
          <div className="stat-change">Total outgoing bandwidth</div>
        </div>
        <div className="stat-card glass-card purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Peak Consumer</div>
            <HelpButton topic="peak-consumer" />
          </div>
          <div className="stat-value purple">
            {isLoading ? '...' : (accounts.length > 0 ? accounts.sort((a,b)=>b.egress - a.egress)[0].name.split(' ')[0] : 'None')}
          </div>
          <div className="stat-change">
            {isLoading ? '...' : (accounts.length > 0 ? `${accounts.sort((a,b)=>b.egress - a.egress)[0].egress} GB egress` : '0 GB')}
          </div>
        </div>
        <div className="stat-card glass-card green">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Avg Egress</div>
            <HelpButton topic="avg-egress" />
          </div>
          <div className="stat-value green">
            {isLoading ? '...' : (accounts.length > 0 ? `${Math.round(totalEgress / accounts.length)} GB` : '0 GB')}
          </div>
          <div className="stat-change">Per account average</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <span className="icon" style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--cyan)' }}>📊</span>
              Data Usage Sorter
              <HelpButton topic="data-sorter" />
            </div>
            <div className="panel-subtitle">Sort and monitor cloud service resource usage by client profiles</div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select 
              className="select" 
              value={filterTier}
              disabled={isLoading}
              onChange={e => handleFilterChange(e.target.value)}
            >
              <option value="ALL">All Service Tiers</option>
              <option value="platinum">Platinum Tier</option>
              <option value="gold">Gold Tier</option>
              <option value="silver">Silver Tier</option>
              <option value="bronze">Bronze Tier</option>
              <option value="free">Free Tier</option>
            </select>
            <button className="btn btn-cyan btn-sm" disabled={isLoading} onClick={handleToggleSort}>
              {sortOrder === 'DESC' ? '↓ Sort Egress Descending' : '↑ Sort Egress Ascending'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card" style={{ padding: 18, display: 'flex', gap: 16, alignItems: 'center' }}>
                <div className="skeleton-cell" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    <div className="skeleton-cell" style={{ width: 140, height: 16 }} />
                    <div className="skeleton-cell" style={{ width: 60, height: 14 }} />
                  </div>
                  <div className="skeleton-cell" style={{ width: '100%', height: 4 }} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="skeleton-cell" style={{ width: 80, height: 18, marginBottom: 4 }} />
                  <div className="skeleton-cell" style={{ width: 50, height: 12, marginLeft: 'auto' }} />
                </div>
              </div>
            ))
          ) : (
            sortedAccounts.map((account, index) => {
              const relPct = (account.egress / maxEgress) * 100;
              return (
                <div 
                  key={account.id}
                  className="glass-card" 
                  style={{ 
                    padding: 16, 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Visual indicator of usage strength as a subtle back-bar */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${relPct}%`,
                    background: 'rgba(0, 229, 255, 0.025)',
                    zIndex: 0,
                    pointerEvents: 'none',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />

                  <div style={{ 
                    width: 28, 
                    height: 28, 
                    borderRadius: '50%', 
                    background: 'rgba(255,255,255,0.05)', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    zIndex: 1
                  }}>
                    {index + 1}
                  </div>

                  <div style={{ flex: 1, zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text-primary)' }}>{account.name}</span>
                      <span 
                        style={{ 
                          fontSize: 9, 
                          fontWeight: 800, 
                          background: getTierColor(account.tier), 
                          color: account.tier === 'platinum' || account.tier === 'silver' ? '#0f172a' : '#fff', 
                          padding: '1px 6px', 
                          borderRadius: 4,
                          textTransform: 'uppercase'
                        }}
                      >
                        {account.tier}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Plan: {account.plan}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <div className="progress-bar" style={{ flex: 1, height: 4 }}>
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${relPct}%`, 
                            backgroundColor: relPct > 80 ? 'var(--purple)' : relPct > 40 ? 'var(--cyan)' : 'var(--green)'
                          }} 
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', zIndex: 1 }}>
                    <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: 'var(--cyan)' }}>
                      {account.egress.toLocaleString()} {account.egressUnit}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      Ratio (I/E): {(account.ingressRatio).toFixed(2)}x
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
