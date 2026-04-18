interface MobileListFabProps {
  selectedCount: number;
  onOpen: () => void;
}

export function MobileListFab({ selectedCount, onOpen }: MobileListFabProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <button className="list-fab" onClick={onOpen} aria-label="View shopping list">
      🛒
      <span className="list-fab-badge">{selectedCount}</span>
    </button>
  );
}
