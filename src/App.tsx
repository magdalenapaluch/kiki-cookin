import { useState, useCallback } from "react";
import { meals } from "./data/meals";
import { MealCard } from "./components/MealCard";
import { ShoppingList } from "./components/ShoppingList";
import "./App.css";

function App() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showList, setShowList] = useState(false);

  function toggleMeal(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearAll() {
    setSelectedIds(new Set());
  }

  const closeList = useCallback(() => setShowList(false), []);

  const selectedMeals = meals.filter((m) => selectedIds.has(m.id));

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🍳</span>
            <span className="logo-text">Kiki Cookin'</span>
          </div>
          <p className="tagline">Pick your meals · get your shopping list</p>
          {selectedIds.size > 0 && (
            <button className="clear-btn" onClick={clearAll}>
              Clear all ({selectedIds.size})
            </button>
          )}
        </div>
      </header>

      <main className="main">
        <section className="meal-section">
          <h1 className="section-title">
            Choose your meals
            {selectedIds.size > 0 && <span className="badge">{selectedIds.size} selected</span>}
          </h1>
          <div className="meal-grid">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} selected={selectedIds.has(meal.id)} onToggle={toggleMeal} />
            ))}
          </div>
        </section>

        <ShoppingList selectedMeals={selectedMeals} open={showList} onClose={closeList} />
      </main>

      {selectedIds.size > 0 && (
        <button className="list-fab" onClick={() => setShowList(true)} aria-label="View shopping list">
          🛒
          <span className="list-fab-badge">{selectedIds.size}</span>
        </button>
      )}

      {showList && <div className="list-backdrop" onClick={closeList} />}
    </div>
  );
}

export default App;
