import React, { useState } from 'react';
import { routeTree as initialRouteTree } from '../../data/mockData';
import HelpButton from '../HelpButton/HelpButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '../../context/ToastContext';

const METHOD_COLORS = { GET: 'badge-get', POST: 'badge-post', PUT: 'badge-put', DELETE: 'badge-delete', PATCH: 'badge-patch' };

function RouteNode({ node, depth = 0, search, expandAll }) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = node.children && node.children.length > 0;

  // Sync open state with the expandAll toggle from the parent
  React.useEffect(() => {
    if (hasChildren) {
      setOpen(expandAll);
    }
  }, [expandAll]);

  const matchesSearch = (n) => {
    if (!search) return true;
    const q = search.toLowerCase();
    if (n.path.toLowerCase().includes(q) || n.label.toLowerCase().includes(q)) return true;
    if (n.children) return n.children.some(c => matchesSearch(c));
    return false;
  };

  if (!matchesSearch(node)) return null;

  return (
    <div className="route-node" style={{ marginLeft: depth * 20 }}>
      <div
        className={`route-row ${hasChildren ? 'route-row-folder' : 'route-row-leaf'}`}
        onClick={() => hasChildren && setOpen(o => !o)}
        style={{ cursor: hasChildren ? 'pointer' : 'default' }}
      >
        <span className="route-toggle">
          {hasChildren ? (open ? '▾' : '▸') : '·'}
        </span>
        <span className="route-path mono">
          {depth === 0 ? node.path : node.label}
        </span>
        {node.method && (
          <span className={`badge ${METHOD_COLORS[node.method] || 'badge-get'}`} style={{ marginLeft: 8 }}>
            {node.method}
          </span>
        )}
        {node.latency && (
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>⏱ {node.latency}</span>
        )}
      </div>
      {node.desc && !hasChildren && (
        <div className="route-desc">{node.desc}</div>
      )}
      {hasChildren && open && (
        <div className="route-children">
          {node.children.map(child => (
            <RouteNode key={child.id} node={child} depth={depth + 1} search={search} expandAll={expandAll} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function URLPathViewer() {
  const [routes, setRoutes] = useLocalStorage('cachenode-routes', initialRouteTree);
  const [search, setSearch] = useState('');
  const [expandAll, setExpandAll] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [parentId, setParentId] = useState('ROOT');
  const [newLabel, setNewLabel] = useState('');
  const [newMethod, setNewMethod] = useState('GET');
  const [newLatency, setNewLatency] = useState('15ms');
  const [newDesc, setNewDesc] = useState('');

  const totalRoutes = (nodes) => nodes.reduce((acc, n) => {
    if (!n.children) return acc + 1;
    return acc + totalRoutes(n.children);
  }, 0);

  // Helper to extract folders to populate parent selector dropdown
  const getFolderList = (nodes, prefix = '') => {
    let list = [];
    nodes.forEach(n => {
      if (n.children) {
        list.push({ id: n.id, path: n.path, label: prefix + n.path });
        list = [...list, ...getFolderList(n.children, prefix + ' └ ')];
      }
    });
    return list;
  };

  const handleRegisterRoute = (e) => {
    e.preventDefault();
    if (!newLabel.trim()) {
      showToast('Route endpoint identifier is required', 'error');
      return;
    }

    const cleanLabel = newLabel.trim().replace(/^\//, ''); // strip leading slash if user added it
    const cleanPath = parentId === 'ROOT' ? `/${cleanLabel}` : '';
    const newId = 'r_custom_' + Math.random().toString(36).substring(7);

    const newRouteNode = {
      id: newId,
      label: cleanLabel,
      path: cleanPath || cleanLabel, // updated below if child
      method: newMethod,
      latency: newLatency,
      desc: newDesc.trim() || 'Simulated user route'
    };

    let updatedRoutes = [...routes];

    if (parentId === 'ROOT') {
      newRouteNode.path = `/${cleanLabel}`;
      updatedRoutes.push({
        id: newId,
        path: `/${cleanLabel}`,
        label: `/${cleanLabel}`,
        children: []
      });
      showToast(`Registered new Gateway Namespace: /${cleanLabel}`, 'success');
    } else {
      // Find parent folder and insert child
      const insertChild = (list) => {
        return list.map(item => {
          if (item.id === parentId) {
            const fullPath = `${item.path}/${cleanLabel}`;
            return {
              ...item,
              children: [...(item.children || []), { ...newRouteNode, path: fullPath, label: cleanLabel }]
            };
          } else if (item.children) {
            return {
              ...item,
              children: insertChild(item.children)
            };
          }
          return item;
        });
      };
      updatedRoutes = insertChild(updatedRoutes);
      showToast(`Registered endpoint: /${cleanLabel} (${newMethod})`, 'success');
    }

    setRoutes(updatedRoutes);
    // Reset Form
    setNewLabel('');
    setNewDesc('');
    setIsFormOpen(false);
  };

  const folderOptions = getFolderList(routes);

  return (
    <div style={{ animation: 'fadeInUp 0.3s ease' }}>
      <div className="stat-grid">
        <div className="stat-card glass-card cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Total Routes</div>
            <HelpButton topic="total-routes" />
          </div>
          <div className="stat-value cyan">{totalRoutes(routes)}</div>
          <div className="stat-change">registered API paths</div>
        </div>
        <div className="stat-card glass-card purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Namespaces</div>
            <HelpButton topic="namespaces" />
          </div>
          <div className="stat-value purple">{routes.length}</div>
          <div className="stat-change">API versions</div>
        </div>
        <div className="stat-card glass-card green">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-label">Avg Latency</div>
            <HelpButton topic="avg-latency" />
          </div>
          <div className="stat-value green">14ms</div>
          <div className="stat-change up">↓ 3ms from yesterday</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <span className="icon" style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--cyan)' }}>🌐</span>
              URL Path Viewer
              <HelpButton topic="url-viewer" />
            </div>
            <div className="panel-subtitle">All registered API paths and serverless endpoints</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              className="input"
              placeholder="🔍  Search routes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 180 }}
            />
            <button className="btn btn-ghost btn-sm" onClick={() => setExpandAll(e => !e)}>
              {expandAll ? 'Collapse' : 'Expand'} All
            </button>
            <button className="btn btn-cyan btn-sm" onClick={() => setIsFormOpen(f => !f)}>
              {isFormOpen ? '✕ Close Form' : '＋ Register Route'}
            </button>
          </div>
        </div>

        {/* Register Route Form Panel */}
        {isFormOpen && (
          <form className="form-panel" onSubmit={handleRegisterRoute}>
            <h4 style={{ fontSize: 13, color: 'var(--cyan)', marginBottom: 14, fontWeight: 700, letterSpacing: 0.5 }}>
              REGISTER NEW ENDPOINT PATHWAY
            </h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Parent Namespace</label>
                <select className="select" value={parentId} onChange={e => setParentId(e.target.value)}>
                  <option value="ROOT">[Create New Top-Level Namespace]</option>
                  {folderOptions.map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Route Endpoint Name (e.g. 'profile')</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. status, details, scale"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">HTTP Method</label>
                <select className="select" value={newMethod} onChange={e => setNewMethod(e.target.value)}>
                  <option value="GET">GET (Read)</option>
                  <option value="POST">POST (Write)</option>
                  <option value="PUT">PUT (Update)</option>
                  <option value="DELETE">DELETE (Destroy)</option>
                  <option value="PATCH">PATCH (Modify)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Latency</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. 15ms"
                  value={newLatency}
                  onChange={e => setNewLatency(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Endpoint Description</label>
              <input
                type="text"
                className="input"
                placeholder="Brief summary explaining this endpoint's usage..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsFormOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save & Register Endpoint
              </button>
            </div>
          </form>
        )}

        <div className="url-tree">
          {routes.map(node => (
            <RouteNode key={node.id} node={node} depth={0} search={search} expandAll={expandAll} />
          ))}
        </div>
      </div>

      <style>{`
        .url-tree { padding: 8px 0; }
        .route-node { margin-bottom: 2px; }
        .route-row {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background 0.15s;
          font-size: 13.5px;
        }
        .route-row:hover { background: rgba(255,255,255,0.04); }
        .route-row-folder { color: var(--text-primary); font-weight: 600; }
        .route-row-leaf { color: var(--text-secondary); }
        .route-toggle { font-size: 12px; color: var(--text-muted); min-width: 14px; }
        .route-path { color: var(--cyan); }
        .route-row-folder .route-path { color: var(--text-primary); }
        .route-desc {
          font-size: 12px;
          color: var(--text-muted);
          padding: 2px 12px 6px calc(20px + 32px);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
