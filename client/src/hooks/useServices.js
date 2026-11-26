import defaultServices from '../data/defaultServices';
import useApiJson from './useApiJson';

/**
 * The services managed in the admin panel, in display order.
 * One request is shared by every component on the page (Home, Services, Footer, quote form).
 * `loading` is true until the first answer arrives, so pages can show placeholders
 * instead of flashing old content.
 */
export default function useServices() {
  const { data, loading } = useApiJson('/api/services');

  if (data && Array.isArray(data.services)) return { services: data.services, loading: false };
  if (loading) return { services: [], loading: true };
  // Server not reachable: show the built-in list
  return { services: defaultServices, loading: false };
}

/** "01", "02", ... for the service cards. */
export function serviceNumber(index) {
  return String(index + 1).padStart(2, '0');
}
