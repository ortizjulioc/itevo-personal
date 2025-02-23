import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';

export default function useURLSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentHash, setCurrentHash] = useState<string>(typeof window !== 'undefined' ? window.location.hash : '');

  const buildUrl = useCallback((newParams: URLSearchParams) => {
    return `${pathname}?${newParams.toString()}${currentHash}`;
  }, [pathname, currentHash]);

  const setParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      value === '' ? params.delete(key) : params.set(key, value);
      router.push(buildUrl(params));
    },
    [router, searchParams, buildUrl]
  );

  const deleteParams = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.has(key)) {
        params.delete(key);
        router.push(buildUrl(params));
      }
    },
    [router, searchParams, buildUrl]
  );

  const getParams = useCallback(
    (key: string, defaultValue: string = ''): string => {
      return searchParams.get(key) || defaultValue;
    },
    [searchParams]
  );

  const clearParams = useCallback(() => {
    router.push(pathname + currentHash);
  }, [router, pathname, currentHash]);

  const setHash = useCallback((hash: string) => {
    window.location.hash = hash;
    setCurrentHash(hash); // Mantener el estado sincronizado
  }, []);

  // Actualiza el estado del hash cuando cambia la URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleHashChange = () => {
        setCurrentHash(window.location.hash);
      };

      // Escuchar cambios en el hash
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  return {
    query: searchParams.toString(),
    set: setParams,
    delete: deleteParams,
    get: getParams,
    clear: clearParams,
    currentPath: pathname,
    fullPath: buildUrl(new URLSearchParams(searchParams.toString())),
    setHash,
    currentHash,
  };
}
