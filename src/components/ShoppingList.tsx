import { type Meal, aggregateIngredients, formatQuantity } from "../data/meals";
import styles from "./ShoppingList.module.css";

function IngredientName({ name }: { name: string }) {
  const match = name.match(/^(.+?)\s*(\(.+\))\s*$/);
  if (!match) return <>{name}</>;
  return (
    <>
      {match[1]} <span className={styles.translation}>{match[2]}</span>
    </>
  );
}

interface Props {
  selectedMeals: Meal[];
  open?: boolean;
  onClose?: () => void;
}

export function ShoppingList({ selectedMeals, open = false, onClose }: Props) {
  if (selectedMeals.length === 0) {
    return (
      <aside className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>
        <div className={styles.headingRow}>
          <h2 className={styles.heading}>Shopping List</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛒</span>
          <p>Select meals to build your shopping list</p>
        </div>
      </aside>
    );
  }

  const ingredients = aggregateIngredients(selectedMeals);
  const required = ingredients.filter((i) => !i.optional);
  const optional = ingredients.filter((i) => i.optional);

  return (
    <aside className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>
      <div className={styles.headingRow}>
        <h2 className={styles.heading}>Shopping List</h2>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className={styles.mealTags}>
        {selectedMeals.map((m) => (
          <span key={m.id} className={styles.tag}>
            {m.name}
          </span>
        ))}
      </div>

      <p className={styles.count}>
        {required.length} items{optional.length > 0 ? ` + ${optional.length} optional` : ""}
      </p>

      <ul className={styles.list}>
        {required.map((ing, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.checkbox} aria-hidden="true" />
            <span className={styles.itemName}>
              <IngredientName name={ing.name} />
            </span>
            <span className={styles.itemQty}>
              {formatQuantity(ing.quantity)}
              {ing.unit && ` ${ing.unit}`}
            </span>
          </li>
        ))}
      </ul>

      {optional.length > 0 && (
        <>
          <p className={styles.optionalHeader}>Optional / extras</p>
          <ul className={`${styles.list} ${styles.optionalList}`}>
            {optional.map((ing, i) => (
              <li key={i} className={`${styles.item} ${styles.optionalItem}`}>
                <span className={styles.checkbox} aria-hidden="true" />
                <span className={styles.itemName}>
                  <IngredientName name={ing.name} />
                </span>
                <span className={styles.itemQty}>
                  {formatQuantity(ing.quantity)}
                  {ing.unit && ` ${ing.unit}`}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}
