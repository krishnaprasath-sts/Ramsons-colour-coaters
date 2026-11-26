import { useEffect, useState } from 'react';
import { loadJson, peekJson } from '../lib/api';

function initialState(path) {
  const data = path ? peekJson(path) : null;
  return { path, data, loading: Boolean(path) && !data, error: null };
}

/**
 * Data of a public GET endpoint, shared and cached across pages.
 * - `data` is available immediately when the endpoint was loaded before (this visit or an earlier one).
 * - `loading` is true only while there is nothing to show yet.
 * - `error` is set when the request failed; saved data is kept if the server was merely unreachable.
 */
export default function useApiJson(path) {
  const [state, setState] = useState(() => initialState(path));

  useEffect(() => {
    let cancelled = false;
    setState((prev) => (prev.path === path ? prev : initialState(path)));
    if (!path) return undefined;

    loadJson(path)
      .then((data) => {
        if (cancelled) return;
        setState((prev) =>
          prev.path === path && prev.data === data && !prev.loading && !prev.error
            ? prev
            : { path, data, loading: false, error: null }
        );
      })
      .catch((error) => {
        if (cancelled) return;
        setState((prev) => ({
          path,
          data: error.offline && prev.path === path ? prev.data : null,
          loading: false,
          error,
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  // While `path` changes, the state of the previous path must not leak into this render
  return state.path === path ? state : initialState(path);
}
