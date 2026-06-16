import React, { useState, useEffect } from 'react';
import { networkNodes, networkEdges as defaultEdges } from '../../data/mockData';
import HelpButton from '../HelpButton/HelpButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '../../context/ToastContext';

export default function FastestPathFinder() {
  const [edges] = useLocalStorage('cachenode-network-edges', defaultEdges);
  const [source, setSource] = useState('n1');
  const [destination, setDestination] = useState('n5');
  const [resultPath, setResultPath] = useState(null);
  const [calculationSteps, setCalculationSteps] = useState([]);
  const { showToast } = useToast();

  const runDijkstra = (src, dest) => {
    // 1. Build Adjacency List using active edges from state
    const graph = {};
    networkNodes.forEach(node => {
      graph[node.id] = [];
    });

    edges.forEach(edge => {
      if (edge.active) {
        graph[edge.from].push({ node: edge.to, weight: edge.latency, id: edge.id });
        graph[edge.to].push({ node: edge.from, weight: edge.latency, id: edge.id }); // Undirected
      }
    });

    // Dijkstra's structures
    const distances = {};
    const previous = {};
    const visited = new Set();
    const steps = [];

    networkNodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });
    distances[src] = 0;

    steps.push({
      log: `Initialized algorithm. Set starting node ${networkNodes.find(n => n.id === src)?.label} distance to 0, all others to Infinity.`
    });

    const unvisited = new Set(networkNodes.map(n => n.id));

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let minNode = null;
      let minDistance = Infinity;
      for (const node of unvisited) {
        if (distances[node] < minDistance) {
          minDistance = distances[node];
          minNode = node;
        }
      }

      if (minNode === null || minDistance === Infinity) {
        steps.push({ log: `Remaining nodes are unreachable. Ending calculation loop.` });
        break;
      }

      steps.push({
        log: `Selected node ${networkNodes.find(n => n.id === minNode)?.label} with current total latency of ${minDistance}ms.`
      });

      if (minNode === dest) {
        steps.push({ log: `Target node ${networkNodes.find(n => n.id === dest)?.label} reached successfully.` });
        break;
      }

      unvisited.delete(minNode);
      visited.add(minNode);

      const neighbors = graph[minNode] || [];
      for (const neighbor of neighbors) {
        if (visited.has(neighbor.node)) continue;

        const alt = distances[minNode] + neighbor.weight;
        if (alt < distances[neighbor.node]) {
          const prevDist = distances[neighbor.node];
          distances[neighbor.node] = alt;
          previous[neighbor.node] = minNode;
          steps.push({
            log: `  Relaxing edge: Found shorter path to ${networkNodes.find(n => n.id === neighbor.node)?.label} via ${networkNodes.find(n => n.id === minNode)?.label} (${prevDist === Infinity ? '∞' : prevDist + 'ms'} ➔ ${alt}ms)`
          });
        }
      }
    }

    // Reconstruct path
    const path = [];
    let curr = dest;
    while (curr !== null) {
      path.unshift(curr);
      curr = previous[curr];
    }

    const isValidPath = path[0] === src;

    return {
      path: isValidPath ? path : [],
      totalLatency: isValidPath ? distances[dest] : Infinity,
      steps
    };
  };

  useEffect(() => {
    const res = runDijkstra(source, destination);
    setResultPath(res.path);
    setCalculationSteps(res.steps);
  }, [source, destination, edges]); // recalculate if routes/edges update globally

  const handleVisualNodeClick = (nodeId) => {
    const nodeLabel = networkNodes.find(n => n.id === nodeId)?.label || nodeId;
    if (nodeId === source) {
      showToast(`${nodeLabel} is already the starting source`, 'info');
      return;
    }

    if (nodeId === destination) {
      // Swap source and destination
      setSource(destination);
      setDestination(source);
      showToast('Swapped start and target nodes', 'success');
    } else {
      setDestination(nodeId);
      showToast(`Selected destination endpoint: ${nodeLabel}`, 'info');
    }
  };

  const handleSwapEndpoints = () => {
    setSource(destination);
    setDestination(source);
    showToast('Swapped start and target nodes', 'success');
  };

  const sourceNodeObj = networkNodes.find(n => n.id === source);
  const destNodeObj = networkNodes.find(n => n.id === destination);

  return (
    <div style={{ animation: 'fadeInUp 0.3s ease' }}>
      <div className="stat-grid">
        <div className="stat-card glass-card cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Source Node</div>
            <HelpButton topic="source-node" />
          </div>
          <div className="stat-value cyan">{sourceNodeObj?.label}</div>
          <div className="stat-change">Start Gateway</div>
        </div>
        <div className="stat-card glass-card purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Destination Node</div>
            <HelpButton topic="destination-node" />
          </div>
          <div className="stat-value purple">{destNodeObj?.label}</div>
          <div className="stat-change">Target Endpoint</div>
        </div>
        <div className="stat-card glass-card green">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Minimum Latency</div>
            <HelpButton topic="min-latency" />
          </div>
          <div className="stat-value green">
            {resultPath && resultPath.length > 0 ? `${runDijkstra(source, destination).totalLatency} ms` : 'N/A'}
          </div>
          <div className="stat-change">Optimal transit duration</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        
        {/* Router Panel */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="panel-header">
            <div>
              <div className="panel-title">
                <span className="icon" style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--cyan)' }}>🔀</span>
                Fastest Path Finder
                <HelpButton topic="path-finder" />
              </div>
              <div className="panel-subtitle">Calculates the absolute lowest latency path across the node grid using Dijkstra's</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                SOURCE NODE:
              </label>
              <select className="select" style={{ width: '100%' }} value={source} onChange={e => setSource(e.target.value)}>
                {networkNodes.map(n => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
            </div>
            
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={handleSwapEndpoints}
              style={{ padding: '9px 12px', fontSize: 14 }}
              title="Swap Start & Target"
            >
              ⇆
            </button>

            <div style={{ flex: 1, minWidth: 120 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                DESTINATION NODE:
              </label>
              <select className="select" style={{ width: '100%' }} value={destination} onChange={e => setDestination(e.target.value)}>
                {networkNodes.map(n => (
                  <option key={n.id} value={n.id}>{n.label} {n.id === source ? '(Source)' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {resultPath && resultPath.length > 0 ? (
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 700, letterSpacing: 0.5 }}>
                OPTIMAL NETWORK PIPELINE PATHWAY:
                <HelpButton topic="optimal-pipeline" />
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                {resultPath.map((nodeId, idx) => {
                  const nodeObj = networkNodes.find(n => n.id === nodeId);
                  return (
                    <React.Fragment key={nodeId}>
                      <div className="glass-card" style={{ padding: '8px 16px', background: 'rgba(0,229,255,0.03)', border: nodeId === source ? '1px solid var(--cyan)' : nodeId === destination ? '1px solid var(--purple-light)' : undefined }}>
                        <span className="mono" style={{ color: nodeId === source ? 'var(--cyan)' : nodeId === destination ? 'var(--purple-light)' : 'var(--text-secondary)', fontWeight: 700 }}>{nodeObj?.label}</span>
                      </div>
                      {idx < resultPath.length - 1 && (
                        <span style={{ color: 'var(--purple-light)', fontSize: 16 }}>➔</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 0', border: '1px dashed var(--red-dim)', borderRadius: 8 }}>
              <span style={{ fontSize: 32 }}>🛑</span>
              <h4 style={{ color: 'var(--red)', marginTop: 8 }}>No Path Found</h4>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                The target node is unreachable because one or more critical virtual edges are offline (disable them in Network Link Hub).
              </p>
            </div>
          )}

          {/* SVG Map representing routing */}
          <div style={{ marginTop: 24, background: 'rgba(5, 11, 24, 0.4)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
            <svg viewBox="0 0 500 250" style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* Draw Edges */}
              {edges.map(edge => {
                const src = networkNodes.find(n => n.id === edge.from);
                const dest = networkNodes.find(n => n.id === edge.to);
                if (!src || !dest) return null;

                // Check if this edge is in the calculated path
                let isPathEdge = false;
                if (resultPath && resultPath.length > 0) {
                  for (let i = 0; i < resultPath.length - 1; i++) {
                    if (
                      (resultPath[i] === edge.from && resultPath[i+1] === edge.to) ||
                      (resultPath[i] === edge.to && resultPath[i+1] === edge.from)
                    ) {
                      isPathEdge = true;
                    }
                  }
                }

                return (
                  <line
                    key={edge.id}
                    x1={src.x - 50}
                    y1={src.y - 80}
                    x2={dest.x - 50}
                    y2={dest.y - 80}
                    stroke={isPathEdge ? 'var(--green)' : edge.active ? 'rgba(255,255,255,0.06)' : 'rgba(239, 68, 68, 0.05)'}
                    strokeWidth={isPathEdge ? 3.5 : 1.5}
                    strokeDasharray={!edge.active ? '3,3' : undefined}
                    style={{ transition: 'stroke 0.3s' }}
                  />
                );
              })}

              {/* Draw Nodes */}
              {networkNodes.map(node => {
                const isPart = resultPath?.includes(node.id);
                const isSource = node.id === source;
                const isDest = node.id === destination;
                
                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x - 50}, ${node.y - 80})`}
                    onClick={() => handleVisualNodeClick(node.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      r="9"
                      fill={isSource ? 'var(--cyan)' : isDest ? 'var(--purple-light)' : isPart ? 'var(--green)' : 'rgba(255,255,255,0.08)'}
                      stroke={isSource ? '#fff' : isDest ? '#fff' : '#050b18'}
                      strokeWidth={isSource || isDest ? 2 : 1}
                      style={{ transition: 'fill 0.3s' }}
                    />
                    <text
                      y="-12"
                      textAnchor="middle"
                      fill={isSource ? 'var(--cyan)' : isDest ? 'var(--purple-light)' : isPart ? 'var(--green)' : 'var(--text-secondary)'}
                      fontSize="9.5"
                      fontWeight="bold"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              💡 Click nodes in visual map directly to set Destination endpoint or swap selections.
            </div>
          </div>
        </div>

        {/* Algorithm execution trace step-log */}
        <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            🔬 Dijkstra Execution Pipeline Trace
            <HelpButton topic="dijkstra-trace" />
          </h3>
          <div style={{ 
            flex: 1, 
            background: 'rgba(5, 11, 24, 0.5)', 
            border: '1px solid var(--border)', 
            borderRadius: 8, 
            padding: 16, 
            maxHeight: 400, 
            overflowY: 'auto' 
          }}>
            {calculationSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="mono" 
                style={{ 
                  fontSize: 11.5, 
                  color: step.log.startsWith(' ') ? 'var(--text-muted)' : 'var(--text-primary)', 
                  borderLeft: step.log.startsWith(' ') ? '2px solid rgba(124, 58, 237, 0.3)' : '2px solid rgba(0, 229, 255, 0.5)', 
                  paddingLeft: 8,
                  marginBottom: 10,
                  lineHeight: 1.4
                }}
              >
                {step.log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
