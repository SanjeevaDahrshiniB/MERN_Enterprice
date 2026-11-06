import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const [page, setPage] = useState<number>(options.initialPage || 1);
  const [limit, setLimit] = useState<number>(options.initialLimit || 10);
  const [total, setTotal] = useState<number>(0);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const nextPage = () => {
    if (hasNextPage) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (hasPrevPage) setPage((p) => p - 1);
  };

  const resetPage = () => setPage(1);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setPage,
    setLimit,
    setTotal,
    nextPage,
    prevPage,
    resetPage
  };
}
