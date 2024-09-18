import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function useURLSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      router.push(`${pathname}?${params.toString()}`, { shallow: true });
    },
    [router, searchParams, pathname]
  );

  const deleteParams = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!params.has(key)) return;

      params.delete(key);
      router.push(`${pathname}?${params.toString()}`, { shallow: true });
    },
    [router, searchParams, pathname]
  );

  const getParams = useCallback(
    (key: string): string | undefined => {
      return searchParams.get(key) || undefined;
    },
    [searchParams]
  );

  const clearParams = useCallback(() => {
    router.push(pathname, { shallow: true });
  }, [router, pathname]);

  return {
    query: searchParams.toString(),
    set: setParams,
    delete: deleteParams,
    get: getParams,
    clear: clearParams,
    currentPath: pathname,
    fullPath: `${pathname}?${searchParams.toString()}`,
  };
}
