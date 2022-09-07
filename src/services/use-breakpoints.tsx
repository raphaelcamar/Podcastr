import { useEffect, useState } from 'react';

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(null);
  const resize = () => {
    setBreakpoint(window.innerWidth);
  };

  useEffect(() => {
    setBreakpoint(window.innerWidth);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return breakpoint;
}
