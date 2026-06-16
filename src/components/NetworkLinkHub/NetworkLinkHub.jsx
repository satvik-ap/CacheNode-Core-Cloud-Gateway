import React, { useState } from 'react';
import { networkNodes, networkEdges } from '../../data/mockData';
import HelpButton from '../HelpButton/HelpButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '../../context/ToastContext';

export default function NetworkLinkHub() {
  const nodes = networkNodes;
  const [edges, setEdges] = useLocalStorage('cachenode-network-edges', networkEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const { showToast } = useToast();

  const handleToggleEdge = (edgeId) => {
    let edgeName = '';
    let nextState = false;

    setEdges(prev => prev.map(e => {
      if (e.id === edgeId) {
        const fromNode = nodes.find(n => n.id === e.from)?.label || e.from;
        const toNode = nodes.find(n => n.id === e.to)?.label || e.to;
        edgeName = `${fromNode} ⇄ ${toNode}`;
        nextState = !e.active;
        return { ...e, active: nextState };
      }
      return e;
    }));

    // Keep detail panel in sync
    if (selectedEdge && selectedEdge.id === edgeId) {
      setSelectedEdge(prev => ({ ...prev, active: !prev.active }));
    }

    showToast(
      nextState ? `Restored virtual link: ${edgeName}` : `Severed virtual link: ${edgeName} (Router Offline)`,
      nextState ? 'success' : 'error'
    );
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  };

  const handleEdgeClick = (edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  };

  const activeLinks = edges.filter(e => e.active).length;
  const avgLatency = Math.round(edges.filter(e => e.active).reduce((sum, e) => sum + e.latency, 0) / (activeLinks || 1));

  return (
    <div style={{ animation: 'fadeInUp 0.3s ease' }}>
      <div className="stat-grid">
        <div className="stat-card glass-card cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Active Links</div>
            <HelpButton topic="active-links" />
          </div>
          <div className="stat-value cyan">{activeLinks} / {edges.length}</div>
          <div className="stat-change">Operational routes</div>
        </div>
        <div className="stat-card glass-card purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Avg Link Latency</div>
            <HelpButton topic="avg-link-latency" />
          </div>
          <div className="stat-value purple">{avgLatency} ms</div>
          <div className="stat-change">System transit speed</div>
        </div>
        <div className="stat-card glass-card green">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Region Clusters</div>
            <HelpButton topic="region-clusters" />
          </div>
          <div className="stat-value green">{nodes.length}</div>
          <div className="stat-change">Edge nodes registered</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        
        {/* SVG Network Map */}
        <div className="glass-card" style={{ padding: 20, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header" style={{ marginBottom: 12 }}>
            <div>
              <div className="panel-title">
                <span className="icon" style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--cyan)' }}>🛰️</span>
                Network Topology Canvas
                <HelpButton topic="network-hub" />
              </div>
              <div className="panel-subtitle">Interactive map of active virtual network interconnections</div>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative', background: 'rgba(5, 11, 24, 0.4)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <svg viewBox="0 0 600 400" style={{ width: '100%', height: '100%', display: 'block' }}>
              {/* Grid background effect */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="600" height="400" fill="url(#grid)" />

              {/* Edge Links */}
              {edges.map(edge => {
                const sourceNode = nodes.find(n => n.id === edge.from);
                const targetNode = nodes.find(n => n.id === edge.to);
                if (!sourceNode || !targetNode) return null;

                const isSelected = selectedEdge && selectedEdge.id === edge.id;

                return (
                  <g key={edge.id} style={{ cursor: 'pointer' }} onClick={() => handleEdgeClick(edge)}>
                    {/* Hover wider path for easy clicking */}
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke="transparent"
                      strokeWidth="12"
                    />
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isSelected ? 'var(--cyan)' : edge.active ? 'rgba(124, 58, 237, 0.5)' : 'rgba(239, 68, 68, 0.2)'}
                      strokeWidth={isSelected ? 3.5 : edge.active ? 2 : 1.5}
                      strokeDasharray={!edge.active ? '4,4' : undefined}
                      style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                    />
                    
                    {/* Animated Data Packets for Active Connections */}
                    {edge.active && (
                      <circle r="4" fill="var(--cyan)">
                        <animateMotion
                          dur={`${edge.latency / 20}s`}
                          repeatCount="indefinite"
                          path={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Node Circles */}
              {nodes.map(node => {
                const isSelected = selectedNode && selectedNode.id === node.id;
                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x}, ${node.y})`} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNodeClick(node)}
                  >
                    {/* Outer pulse */}
                    {node.status === 'active' && (
                      <circle r="12" fill="none" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="1">
                        <animate attributeName="r" values="7;18;7" dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {/* Main node bubble */}
                    <circle
                      r="7"
                      fill={isSelected ? 'var(--cyan)' : node.status === 'active' ? 'var(--purple-light)' : 'var(--yellow)'}
                      stroke="#050b18"
                      strokeWidth="2"
                      style={{ transition: 'fill 0.2s, r 0.2s' }}
                    />
                    <text
                      y="-12"
                      textAnchor="middle"
                      fill={isSelected ? 'var(--cyan)' : 'var(--text-primary)'}
                      fontSize="10"
                      fontWeight="bold"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Details Sidepanel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div className="glass-card" style={{ padding: 20, flex: 1 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
              ⚡ Link Control & Monitoring
            </h3>

            {selectedNode && (
              <div className="animate-fadeInUp">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span className="badge badge-get" style={{ textTransform: 'uppercase' }}>{selectedNode.type} Node</span>
                  <span className={`badge ${selectedNode.status === 'active' ? 'badge-ok' : 'badge-warning'}`}>{selectedNode.status}</span>
                </div>
                <h4 style={{ fontSize: 18, color: 'var(--cyan)' }}>{selectedNode.label}</h4>
                <div className="divider" style={{ margin: '10px 0' }} />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <div>Node Coordinates: <span className="mono">X: {selectedNode.x}, Y: {selectedNode.y}</span></div>
                  <div>Primary ISP: <span style={{ color: 'var(--text-primary)' }}>CoreNetwork Transit</span></div>
                  <div>Associated Connections: <span className="mono" style={{ color: 'var(--text-primary)' }}>
                    {edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).length} active routes
                  </span></div>
                </div>
              </div>
            )}

            {selectedEdge && (
              <div className="animate-fadeInUp">
                {(() => {
                  const src = nodes.find(n => n.id === selectedEdge.from);
                  const dest = nodes.find(n => n.id === selectedEdge.to);
                  // Find current state directly from active edges list to reflect changes
                  const currentEdge = edges.find(e => e.id === selectedEdge.id) || selectedEdge;
                  
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <span className="badge badge-patch">Virtual Route</span>
                        <span className={`badge ${currentEdge.active ? 'badge-ok' : 'badge-blocked'}`}>
                          {currentEdge.active ? 'active' : 'disabled'}
                        </span>
                      </div>
                      <h4 style={{ fontSize: 16 }}>
                        <span className="mono" style={{ color: 'var(--cyan)' }}>{src?.label}</span>
                        <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>⇄</span>
                        <span className="mono" style={{ color: 'var(--cyan)' }}>{dest?.label}</span>
                      </h4>
                      <div className="divider" style={{ margin: '12px 0' }} />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Route latency:</span>
                          <span className="mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{currentEdge.latency} ms</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Max bandwidth:</span>
                          <span className="mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{currentEdge.bw}</span>
                        </div>
                      </div>

                      <button 
                        className={`btn w-100 ${currentEdge.active ? 'btn-danger' : 'btn-cyan'}`} 
                        onClick={() => handleToggleEdge(currentEdge.id)}
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        {currentEdge.active ? 'Disable Virtual Edge' : 'Enable Virtual Edge'}
                      </button>
                    </>
                  );
                })()}
              </div>
            )}

            {!selectedNode && !selectedEdge && (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <span className="empty-state-icon">📡</span>
                <p className="empty-state-text" style={{ fontSize: 12 }}>
                  Click on any node or line path in the canvas topology map to modify connection routes or view metrics.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
