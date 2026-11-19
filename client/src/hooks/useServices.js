import { useEffect, useState } from 'react';
import defaultServices from '../data/defaultServices';

// One request is shared by every component on the page (Home, Services, Footer, quote form).
let cachedServices = null;
let pendingRequest = null;

function loadServices() {
  if (!pendingRequest) {
    pendingRequest = fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !Array.isArray(data.services)) throw new Error('Unexpected response');
        cachedServices = data.services;
        return cachedServices;
      })
      .catch(() => {
        // Server not reachable: show the built-in list, and try again on the next page visit
        pendingRequest = null;
        return defaultServices;
      });
  }
  return pendingRequest;
}

/**
 * The services managed in the admin panel, in display order.
 * `loading` is true until the first answer arrives, so pages can show placeholders
 * instead of flashing old content.
 */
export default function useServices() {
  const [services, setServices] = useState(cachedServices || []);
  const [loading, setLoading] = useState(!cachedServices);

  useEffect(() => {
    let cancelled = false;
    loadServices().then((list) => {
      if (cancelled) return;
      setServices(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { services, loading };
}

/** "01", "02", ... for the service cards. */
export function serviceNumber(index) {
  return String(index + 1).padStart(2, '0');
}
