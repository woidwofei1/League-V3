import { BentoVault, DynamicIsland } from '../components';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';

export function VaultPage() {
  const { matches } = useRivalryData(DEFAULT_TABLE_SLUG);
  const lastMatchTime = matches[0]?.played_at;

  return (
    <>
      <BentoVault />
      <DynamicIsland lastMatchTime={lastMatchTime} />
    </>
  );
}
