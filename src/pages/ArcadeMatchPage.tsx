import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArcadeScorer } from '../components';
import { insertMatch } from '../lib/matches';
import { PLAYER_IDS } from '../lib/profile';
import { DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { supabase } from '../lib/supabaseClient';

interface SetScore {
  bachi: number;
  crimebaker: number;
}

export function ArcadeMatchPage() {
  const navigate = useNavigate();

  const handleMatchComplete = useCallback(async (sets: SetScore[], winner: 'bachi' | 'crimebaker') => {
    try {
      // Get table ID
      const { data: tableData } = await supabase
        .from('tables')
        .select('id')
        .eq('slug', DEFAULT_TABLE_SLUG)
        .single();

      if (!tableData) {
        console.error('Table not found');
        return;
      }

      // Calculate total points and sets won
      const pointsA = sets.reduce((sum, set) => sum + set.bachi, 0);
      const pointsB = sets.reduce((sum, set) => sum + set.crimebaker, 0);
      
      const setsAWon = sets.filter(s => {
        if (s.bachi >= 11 && s.bachi - s.crimebaker >= 2) return true;
        if (s.bachi >= 10 && s.crimebaker >= 10 && s.bachi - s.crimebaker >= 2) return true;
        return false;
      }).length;
      
      const setsBWon = sets.filter(s => {
        if (s.crimebaker >= 11 && s.crimebaker - s.bachi >= 2) return true;
        if (s.bachi >= 10 && s.crimebaker >= 10 && s.crimebaker - s.bachi >= 2) return true;
        return false;
      }).length;

      // Submit match
      await insertMatch({
        table_id: tableData.id,
        player_a_id: PLAYER_IDS.bachi,
        player_b_id: PLAYER_IDS.crimebaker,
        winner_player_id: winner === 'bachi' ? PLAYER_IDS.bachi : PLAYER_IDS.crimebaker,
        points_a_total: pointsA,
        points_b_total: pointsB,
        sets_a_won: setsAWon,
        sets_b_won: setsBWon,
      });

      // Navigate after a short delay to show the win animation
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Failed to submit match:', err);
    }
  }, [navigate]);

  return <ArcadeScorer onMatchComplete={handleMatchComplete} />;
}
