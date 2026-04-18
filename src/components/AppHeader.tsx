interface AppHeaderProps {
  itemCount: number;
  onOpenList: () => void;
}

export function AppHeader({ itemCount, onOpenList }: AppHeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-icon">🍳</span>
          <span className="logo-text">Kiki Cookin'</span>
        </div>

        <p className="tagline">Pick your meals · get your shopping list</p>

        <button className="cart-btn" onClick={onOpenList} aria-label="Open shopping list">
          🛒
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </button>
      </div>
    </header>
  );
}
