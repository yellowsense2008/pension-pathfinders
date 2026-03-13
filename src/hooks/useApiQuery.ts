import { useQuery, UseQueryOptions } from '@tanstack/react-query';

/**
 * Thin wrapper around useQuery for consistent API loading patterns.
 */
export function useApiQuery<T>(
  key: string[],
  fetcher: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: fetcher,
    staleTime: 30_000,
    retry: 2,
    ...options,
  });
}
