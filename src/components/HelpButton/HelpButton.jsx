import React from 'react';
import { useHelp } from '../../context/HelpContext';

export default function HelpButton({ topic, style }) {
  const { openHelp } = useHelp();

  return (
    <button
      className="help-trigger-btn"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openHelp(topic);
      }}
      title="What is this?"
      style={style}
    >
      ?
    </button>
  );
}
