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

interface CustomItem {
  id: string;
  name: string;
}

interface DisplayIngredient {
  key: string;
  name: string;
  quantity: number;
  unit: string;
  optional: boolean;
  isCustom?: boolean;
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
  const [customItems, setCustomItems] = useState<CustomItem[]>(() => {
    try {
      const saved = localStorage.getItem("shoppingListCustomItems");
      return saved ? (JSON.parse(saved) as CustomItem[]) : [];
    } catch (e) {
      console.error("Failed to parse localStorage:", e);
      return [];
    }
  });
  const [newItemName, setNewItemName] = useState("");

  // Save checked items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("shoppingListChecked", JSON.stringify(Array.from(checkedItems)));
  }, [checkedItems]);

  useEffect(() => {
    localStorage.setItem("shoppingListCustomItems", JSON.stringify(customItems));
  }, [customItems]);

  const previousSelectedMealIdsRef = useRef<Set<string>>(new Set(selectedMeals.map((meal) => meal.id)));

  useEffect(() => {
    const currentSelectedMealIds = new Set(selectedMeals.map((meal) => meal.id));
    const hadDeselection = Array.from(previousSelectedMealIdsRef.current).some((id) => !currentSelectedMealIds.has(id));

    if (hadDeselection) {
      setCheckedItems(new Set());
    }

    previousSelectedMealIdsRef.current = currentSelectedMealIds;
  }, [selectedMeals]);

  const toggleItem = (itemKey: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }
      return next;
    });
  };

  const addCustomItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newItemName.trim();
    if (!name) return;

    setCustomItems((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name,
      },
    ]);

    setNewItemName("");
  };

  const removeCustomItem = (itemId: string) => {
    setCustomItems((prev) => prev.filter((item) => item.id !== itemId));
    setCheckedItems((prev) => {
      const next = new Set(prev);
      next.delete(`custom__${itemId}`);
      return next;
    });
  };

  const handleClearAll = () => {
    if (!onClearAll) return;
    const shouldClear = window.confirm("Clear all selected meals?");
    if (!shouldClear) return;
    onClearAll();
  };

  const mealIngredients: DisplayIngredient[] = aggregateIngredients(selectedMeals).map((ing) => ({
    key: `meal__${ing.name.toLowerCase()}__${ing.unit}`,
    name: ing.name,
    quantity: ing.quantity,
    unit: ing.unit,
    optional: ing.optional,
  }));
  const customIngredients: DisplayIngredient[] = customItems.map((item) => ({
    key: `custom__${item.id}`,
    name: item.name,
    quantity: 0,
    unit: "",
    optional: false,
    isCustom: true,
  }));
  const ingredients: DisplayIngredient[] = [...mealIngredients, ...customIngredients];
  const required = ingredients.filter((i) => !i.optional);
  const optional = ingredients.filter((i) => i.optional);

  const byCategory = new Map<CategoryKey, DisplayIngredient[]>();
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
            <button className={styles.clearBtn} onClick={handleClearAll} title="Clear all meals">
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

      <form className={styles.customForm} onSubmit={addCustomItem}>
        <input className={styles.customName} placeholder="Add custom item" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} aria-label="Custom item name" />
        <button className={styles.customAddBtn} type="submit">
          Add
        </button>
      </form>

      {ingredients.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛒</span>
          <p>Select meals or add custom items</p>
        </div>
      )}

      <div className={styles.categories}>
        {CATEGORY_ORDER.map((category) => {
          const items = byCategory.get(category) ?? [];
          if (items.length === 0) return null;

          return (
            <section key={category} className={styles.categorySection}>
              <h3 className={styles.categoryHeading}>{CATEGORY_LABELS[category]}</h3>
              <ul className={styles.list}>
                {items.map((ing, i) => {
                  const isChecked = checkedItems.has(ing.key);
                  return (
                    <li key={`${category}-${ing.key}-${i}`} className={`${styles.item} ${ing.optional ? styles.optionalItem : ""} ${isChecked ? styles.checked : ""}`}>
                      <button className={styles.checkbox} onClick={() => toggleItem(ing.key)} aria-label={`Toggle ${ing.name}`} aria-pressed={isChecked}>
                        {isChecked && "✓"}
                      </button>
                      <span
                        className={styles.itemName}
                        onClick={() => toggleItem(ing.key)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleItem(ing.key);
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
                      {ing.isCustom ? (
                        <button className={styles.removeBtn} onClick={() => removeCustomItem(ing.key.replace("custom__", ""))} aria-label={`Remove ${ing.name}`}>
                          ✕
                        </button>
                      ) : (
                        <span className={styles.itemActionPlaceholder} aria-hidden="true" />
                      )}
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
