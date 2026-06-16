import React, { useState } from 'react';
import URLPathViewer from './components/URLPathViewer/URLPathViewer';
import SecurityUndoLog from './components/SecurityUndoLog/SecurityUndoLog';
import TrafficLimitQueue from './components/TrafficLimitQueue/TrafficLimitQueue';
import ServerIDChecker from './components/ServerIDChecker/ServerIDChecker';
import DataUsageSorter from './components/DataUsageSorter/DataUsageSorter';
import NetworkLinkHub from './components/NetworkLinkHub/NetworkLinkHub';
import FastestPathFinder from './components/FastestPathFinder/FastestPathFinder';
import TrafficBalancer from './components/TrafficBalancer/TrafficBalancer';
import { HelpProvider } from './context/HelpContext';
import { ToastProvider } from './context/ToastContext';
import HelpButton from './components/HelpButton/HelpButton';
import HelpDrawer from './components/HelpDrawer/HelpDrawer';

const NAVIGATION_ITEMS = [
  { id: 'url-viewer', label: 'URL Path Viewer', icon: '🌐', component: URLPathViewer, description: 'Nested API Path Registry' },
  { id: 'security-log', label: 'Security Undo Log', icon: '🔐', component: SecurityUndoLog, description: 'Revert Policy Modifications' },
  { id: 'traffic-queue', label: 'Traffic Limit Queue', icon: '⏳', component: TrafficLimitQueue, description: 'Rate Limit Policing' },
  { id: 'server-checker', label: 'Server ID Checker', icon: '🔍', component: ServerIDChecker, description: 'Instance Signature Validator' },
  { id: 'data-sorter', label: 'Data Usage Sorter', icon: '📊', component: DataUsageSorter, description: 'Client Egress Ranker' },
  { id: 'network-hub', label: 'Network Link Hub', icon: '🛰️', component: NetworkLinkHub, description: 'Topological Connection Canvas' },
  { id: 'path-finder', label: 'Fastest Path Finder', icon: '🔀', component: FastestPathFinder, description: 'Dijkstra Routing Optimizer' },
  { id: 'balancer', label: 'Traffic Balancer', icon: '⚖️', component: TrafficBalancer, description: 'Serverless Load Balancer' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('url-viewer');

  const activeNav = NAVIGATION_ITEMS.find(item => item.id === activeTab);
  const ActiveComponent = activeNav ? activeNav.component : URLPathViewer;

  return (
    <HelpProvider>
      <ToastProvider>
        <div className="app-layout">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">
              <div className="logo-icon">CN</div>
              <div>
                <span className="logo-text">CacheNode Core</span>
                <div className="logo-sub">Cloud Gateway Control</div>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section-label">Gateway Modules</div>
            {NAVIGATION_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(item.id);
                  }}
                  href={`#${item.id}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{item.description}</span>
                  </div>
                  <HelpButton topic={item.id} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                </a>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="system-status">
              <span className="dot dot-cyan"></span>
              <span>Gateway Engine: Online</span>
            </div>
          </div>
        </aside>

        {/* Main Panel Content */}
        <main className="main-content">
          <header className="topbar">
            <div className="topbar-left">
              <div className="breadcrumb">
                <span>Dashboard</span>
                <span>/</span>
                <span className="breadcrumb-active">{activeNav?.label}</span>
                <HelpButton topic={activeNav?.id} style={{ transform: 'scale(0.9)', opacity: 0.8 }} />
              </div>
            </div>
            
            <div className="topbar-right">
              <div className="topbar-stat">
                <span>Active Gateway Nodes:</span>
                <span className="value">6 / 7</span>
              </div>
              <div className="topbar-stat">
                <span>Gateway Latency:</span>
                <span className="value">14ms</span>
              </div>
            </div>
          </header>

          <div className="page-content">
            <ActiveComponent />
          </div>
        </main>
        
        {/* Help Drawer Side panel */}
        <HelpDrawer />
      </div>
      </ToastProvider>
    </HelpProvider>
  );
}

