import { useEffect, useRef } from 'react';

export function useAbortGroup() {
  const controllersRef = useRef(new Set<AbortController>());

  useEffect(() => {
    return () => {
      controllersRef.current.forEach((controller) => controller.abort());
      controllersRef.current.clear();
    };
  }, []);

  const createController = () => {
    const controller = new AbortController();
    controllersRef.current.add(controller);

    const release = () => {
      controllersRef.current.delete(controller);
    };

    controller.signal.addEventListener('abort', release, { once: true });

    return {
      controller,
      release,
    };
  };

  return { createController };
}
