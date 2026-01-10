import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  fetchMatchesForTable,
  fetchTableBySlug,
  computeRivalrySummary,
  computeEloSeries,
  type RivalrySummary,
  type EloDataPoint,
  type TableInfo,
} from '../lib/rivalryData';
import type { Match } from '../lib/matches';

interface UseRivalryDataResult {
  loading: boolean;
  error: string | null;
  table: TableInfo | null;
  matches: Match[];
  summary: RivalrySummary | null;
  eloSeries: EloDataPoint[];
  refetch: () => Promise<void>;
}

/**
 * Hook to load and manage rivalry data for a table.
 * Automatically subscribes to Supabase Realtime for live updates.
 */
export function useRivalryData(tableSlug: string): UseRivalryDataResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState<TableInfo | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [summary, setSummary] = useState<RivalrySummary | null>(null);
  const [eloSeries, setEloSeries] = useState<EloDataPoint[]>([]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch table info and matches in parallel
      const [tableInfo, matchesData] = await Promise.all([
        fetchTableBySlug(tableSlug),
        fetchMatchesForTable(tableSlug),
      ]);

      setTable(tableInfo);
      setMatches(matchesData);

      // Compute derived data
      const summaryData = computeRivalrySummary(matchesData);
      const eloData = computeEloSeries(matchesData);

      setSummary(summaryData);
      setEloSeries(eloData);
    } catch (err) {
      console.error('Failed to load rivalry data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [tableSlug]);

  // Initial load
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!table?.id) return;

    // Subscribe to INSERT events on matches table for this table
    const channel = supabase
      .channel(`matches-${table.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `table_id=eq.${table.id}`,
        },
        (payload) => {
          console.log('New match received via realtime:', payload);
          // Refetch all data to ensure consistency
          fetchData();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table?.id, fetchData]);

  return {
    loading,
    error,
    table,
    matches,
    summary,
    eloSeries,
    refetch: fetchData,
  };
}

// Default table slug for the Pink Room
export const DEFAULT_TABLE_SLUG = 'pink-room-main';
