import { useState, useCallback } from 'react';

export function useDebounce(delay = 300) {
  const [timer, setTimer] = useState(null);

  const debounce = useCallback((fn) => {
    if (timer) clearTimeout(timer);
    const t = setTimeout(fn, delay);
    setTimer(t);
  }, [timer, delay]);

  return debounce;
}
