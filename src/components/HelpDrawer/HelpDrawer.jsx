import React, { useState } from 'react';
import { useHelp } from '../../context/HelpContext';
import { helpData } from '../../data/helpData';

export default function HelpDrawer() {
  const { activeTopic, openHelp, closeHelp } = useHelp();
  const [searchQuery, setSearchQuery] = useState('');

  if (!activeTopic) return null;

  const topicInfo = helpData[activeTopic];

  const handleBackdropClick = (e) => {
    if (e.target.className === 'help-drawer-overlay') {
      closeHelp();
    }
  };

  // Filter topics for the search registry
  const filteredTopics = Object.entries(helpData).filter(([key, value]) => {
    const query = searchQuery.toLowerCase();
    return (
      value.title.toLowerCase().includes(query) ||
      value.summary.toLowerCase().includes(query) ||
      (value.whatIsIt && value.whatIsIt.toLowerCase().includes(query))
    );
  });

  return (
    <div className="help-drawer-overlay" onClick={handleBackdropClick}>
      <div className="help-drawer animate-slideInRight">
        {/* Header */}
        <div className="help-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="help-drawer-icon-badge">{topicInfo?.icon || '❓'}</span>
            <div>
              <h2 className="help-drawer-title">{topicInfo?.title || 'Help Center'}</h2>
              <span className="help-drawer-subtitle">Documentation & Guides</span>
            </div>
          </div>
          <button className="help-drawer-close-btn" onClick={closeHelp}>✕</button>
        </div>

        {/* Content Area */}
        <div className="help-drawer-content">
          {topicInfo ? (
            <div className="help-topic-details">
              <p className="help-topic-summary">{topicInfo.summary}</p>

              <div className="help-section">
                <h3 className="help-section-title">🔍 What is it?</h3>
                <p className="help-section-text">{topicInfo.whatIsIt}</p>
              </div>

              {topicInfo.usedFor && topicInfo.usedFor.length > 0 && (
                <div className="help-section">
                  <h3 className="help-section-title">🛠️ What is it used for?</h3>
                  <ul className="help-used-list">
                    {topicInfo.usedFor.map((item, idx) => (
                      <li key={idx} className="help-used-item">
                        <span className="help-used-bullet">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {topicInfo.deepDive && (
                <div className="help-section help-section-deepdive">
                  <h3 className="help-section-title" style={{ color: 'var(--cyan)' }}>⚙️ Under the Hood</h3>
                  <p className="help-section-text" style={{ fontStyle: 'italic', fontSize: '12.5px' }}>
                    {topicInfo.deepDive}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Select a topic below to inspect documentation.</p>
          )}

          <div className="divider" style={{ margin: '24px 0 16px 0' }} />

          {/* Quick Search and Explorer */}
          <div className="help-explorer">
            <h3 className="help-section-title" style={{ fontSize: 13, marginBottom: 10 }}>📖 Document Index</h3>
            
            <input
              type="text"
              className="input help-search-input"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: 12, fontSize: 12, padding: '6px 10px' }}
            />

            <div className="help-explorer-list">
              {filteredTopics.map(([key, topic]) => {
                const isSelected = key === activeTopic;
                return (
                  <button
                    key={key}
                    className={`help-explorer-item ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      openHelp(key);
                      setSearchQuery(''); // clear search on select
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{topic.icon}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div className="item-title">{topic.title}</div>
                      <div className="item-summary">{topic.summary}</div>
                    </div>
                  </button>
                );
              })}
              {filteredTopics.length === 0 && (
                <div className="help-empty-search">No matching documentation topics found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
