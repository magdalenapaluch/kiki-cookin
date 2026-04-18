import { useState, useEffect, useRef } from "react";
import { type Meal, aggregateIngredients, formatQuantity, type CategoryKey, CATEGORY_ORDER, CATEGORY_LABELS, getIngredientCategory } from "../data/meals";
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
  onClearAll?: () => void;
}

export function ShoppingList({ selectedMeals, open = false, onClose, onClearAll }: Props) {
  // Use lazy initializer to load from localStorage synchronously on first render
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("shoppingListChecked");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      console.error("Failed to parse localStorage:", e);
      return new Set();
    }
  });

  // Save checked items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("shoppingListChecked", JSON.stringify(Array.from(checkedItems)));
  }, [checkedItems]);

  const previousSelectedMealIdsRef = useRef<Set<string>>(new Set(selectedMeals.map((meal) => meal.id)));

  useEffect(() => {
    const currentSelectedMealIds = new Set(selectedMeals.map((meal) => meal.id));
    const hadDeselection = Array.from(previousSelectedMealIdsRef.current).some((id) => !currentSelectedMealIds.has(id));

    if (hadDeselection) {
      setCheckedItems(new Set());
    }

    previousSelectedMealIdsRef.current = currentSelectedMealIds;
  }, [selectedMeals]);

  const getItemKey = (name: string, unit: string) => `${name.toLowerCase()}__${unit}`;

  const toggleItem = (name: string, unit: string) => {
    const key = getItemKey(name, unit);
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

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

  const byCategory = new Map<CategoryKey, typeof ingredients>();
  for (const category of CATEGORY_ORDER) {
    byCategory.set(category, []);
  }
  for (const ingredient of ingredients) {
    const category = getIngredientCategory(ingredient.name);
    byCategory.get(category)?.push(ingredient);
  }

  return (
    <aside className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>
      <div className={styles.headingRow}>
        <h2 className={styles.heading}>Shopping List</h2>
        <div className={styles.headerButtons}>
          {selectedMeals.length > 0 && (
            <button className={styles.clearBtn} onClick={onClearAll} title="Clear all meals">
              Clear
            </button>
          )}
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
      </div>

      <p className={styles.count}>
        {required.length} items{optional.length > 0 ? ` + ${optional.length} optional` : ""}
      </p>

      <div className={styles.categories}>
        {CATEGORY_ORDER.map((category) => {
          const items = byCategory.get(category) ?? [];
          if (items.length === 0) return null;

          return (
            <section key={category} className={styles.categorySection}>
              <h3 className={styles.categoryHeading}>{CATEGORY_LABELS[category]}</h3>
              <ul className={styles.list}>
                {items.map((ing, i) => {
                  const itemKey = getItemKey(ing.name, ing.unit);
                  const isChecked = checkedItems.has(itemKey);
                  return (
                    <li key={`${category}-${ing.name}-${i}`} className={`${styles.item} ${ing.optional ? styles.optionalItem : ""} ${isChecked ? styles.checked : ""}`}>
                      <button className={styles.checkbox} onClick={() => toggleItem(ing.name, ing.unit)} aria-label={`Toggle ${ing.name}`} aria-pressed={isChecked}>
                        {isChecked && "✓"}
                      </button>
                      <span
                        className={styles.itemName}
                        onClick={() => toggleItem(ing.name, ing.unit)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleItem(ing.name, ing.unit);
                          }
                        }}
                      >
                        <span className={styles.itemLabel}>
                          <IngredientName name={ing.name} />
                          {ing.optional && <span className={styles.optionalInline}>optional</span>}
                        </span>
                      </span>
                      <span className={styles.itemQty}>
                        {formatQuantity(ing.quantity)}
                        {ing.unit && ` ${ing.unit}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </aside>
  );
}
