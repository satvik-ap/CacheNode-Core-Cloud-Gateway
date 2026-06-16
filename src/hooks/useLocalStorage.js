import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or fallback to default
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Function to set value and dispatch update event for sync
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Dispatch a custom event to notify other hook instances in the same window
      const event = new CustomEvent('local-storage-update', { detail: { key, value: valueToStore } });
      window.dispatchEvent(event);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    // Sync state if another component updates localStorage
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (err) {
          console.warn(err);
        }
      }
    };

    // Sync state for custom events in the same tab
    const handleCustomChange = (e) => {
      if (e.detail && e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-update', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-update', handleCustomChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
