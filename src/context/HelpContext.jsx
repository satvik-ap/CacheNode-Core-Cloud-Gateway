import React, { createContext, useContext, useState } from 'react';

const HelpContext = createContext();

export function HelpProvider({ children }) {
  const [activeTopic, setActiveTopic] = useState(null);

  const openHelp = (topicId) => {
    setActiveTopic(topicId);
  };

  const closeHelp = () => {
    setActiveTopic(null);
  };

  return (
    <HelpContext.Provider value={{ activeTopic, openHelp, closeHelp }}>
      {children}
    </HelpContext.Provider>
  );
}

export function useHelp() {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
}
