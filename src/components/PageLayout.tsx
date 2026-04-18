import { useState, useCallback, ReactNode } from "react";
import { meals, aggregateIngredients } from "../data/meals";
import { AppHeader } from "./AppHeader";
import { ShoppingList } from "./ShoppingList";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  children: ReactNode;
  selectedMealIds: Set<string>;
  onClearAllMeals: () => void;
}

export function PageLayout({ children, selectedMealIds, onClearAllMeals }: PageLayoutProps) {
  const [showList, setShowList] = useState(false);

  const closeList = useCallback(() => setShowList(false), []);
  const openList = useCallback(() => setShowList(true), []);

  const selectedMeals = meals.filter((m) => selectedMealIds.has(m.id));
  const aggregatedIngredients = aggregateIngredients(selectedMeals);
  const itemCount = aggregatedIngredients.length;

  return (
    <div className={styles.pageWrapper}>
      <AppHeader itemCount={itemCount} onOpenList={openList} />

      <div className={styles.mainWithSidebar}>
        <main className={styles.main}>{children}</main>

        <ShoppingList selectedMeals={selectedMeals} open={showList} onClose={closeList} onClearAll={onClearAllMeals} />
      </div>

      {showList && <div className={styles.backdrop} onClick={closeList} />}
    </div>
  );
}
