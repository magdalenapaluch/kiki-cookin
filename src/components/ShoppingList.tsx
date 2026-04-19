import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { type Meal, aggregateIngredients, formatQuantity, type CategoryKey, CATEGORY_ORDER, CATEGORY_LABELS, getIngredientCategory, shouldHideIngredient } from "../data/meals";
import { getIngredientImageUrl } from "../data/ingredientImages";
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

function InfoIcon() {
  return (
    <span aria-hidden="true" className={styles.imageIconMark}>
      ?
    </span>
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
  mealIds?: string[];
}

interface PreviewDetails {
  name: string;
  imageUrl?: string;
  mealNames: string[];
}

const MEAL_COLORS = ["#f97316", "#8b5cf6", "#10b981", "#3b82f6", "#f43f5e", "#eab308", "#06b6d4", "#ec4899"];
const CATEGORY_EMOJIS: Record<CategoryKey, string[]> = {
  bakery: ["🥐"],
  produce: ["🥕"],
  canned: ["🥫"],
  dryGoods: ["🍝"],
  spices: ["🫙"],
  meat: ["🥩"],
  fridgeVeggies: ["🥒"],
  coldCuts: ["🍖"],
  cheese: ["🧀"],
  dairyYogurt: ["🧈"],
  milkEggsBaking: ["🥛"],
  drinks: ["🧃"],
  snacks: ["🍫"],
  frozen: ["🧊"],
  cosmetics: ["🧴"],
  other: ["😍"],
};

export function ShoppingList({ selectedMeals, open = false, onClose, onClearAll }: Props) {
  // const LONG_PRESS_MS = 420; // removed: no longer used
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

  // Track if the unremovable item is present
  const UNREMOVABLE_ITEM_ID = "unremovable-miauka";
  const UNREMOVABLE_ITEM: CustomItem = { id: UNREMOVABLE_ITEM_ID, name: "Sth nice for miauka" };

  // Add unremovable item if basket was empty and a meal is added
  useEffect(() => {
    // Only add if there are meals, and no custom items, and the unremovable item is not present
    if (selectedMeals.length === 1 && customItems.length === 0 && !customItems.some((item) => item.id === UNREMOVABLE_ITEM_ID)) {
      setCustomItems((prev) => [UNREMOVABLE_ITEM, ...prev]);
    }
  }, [selectedMeals.length]);
  const [newItemName, setNewItemName] = useState("");
  const [focusedMealId, setFocusedMealId] = useState<string | null>(null);
  // const [heldIngredientKey, setHeldIngredientKey] = useState<string | null>(null); // removed: no longer used
  const [previewDetails, setPreviewDetails] = useState<PreviewDetails | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  // const holdTriggeredRef = useRef(false); // removed: no longer used

  const activeFocusedMealId = focusedMealId && selectedMeals.some((m) => m.id === focusedMealId) ? focusedMealId : null;

  const toggleFocusMeal = (mealId: string) => {
    setFocusedMealId((prev) => (prev === mealId ? null : mealId));
  };

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
    if (itemId === UNREMOVABLE_ITEM_ID) return; // Prevent removal
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
    setCustomItems([]);
    setCheckedItems(new Set());
  };

  const mealColorMap = new Map<string, string>(selectedMeals.map((meal, i) => [meal.id, MEAL_COLORS[i % MEAL_COLORS.length]]));
  const mealNameMap = new Map<string, string>(selectedMeals.map((meal) => [meal.id, meal.name]));

  const clearHoldTimer = () => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearHoldTimer();
    };
  }, []);

  useEffect(() => {
    if (!previewDetails) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewDetails(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewDetails]);

  const mealIngredients: DisplayIngredient[] = aggregateIngredients(selectedMeals).map((ing) => ({
    key: `meal__${ing.name.toLowerCase()}__${ing.unit}`,
    name: ing.name,
    quantity: ing.quantity,
    unit: ing.unit,
    optional: ing.optional,
    mealIds: ing.mealIds,
  }));
  const customIngredients: DisplayIngredient[] = customItems.map((item) => ({
    key: `custom__${item.id}`,
    name: item.name,
    quantity: 0,
    unit: "",
    optional: false,
    isCustom: true,
  }));
  const ingredients: DisplayIngredient[] = [...mealIngredients, ...customIngredients].filter((ing) => ing.isCustom || !shouldHideIngredient(ing.name));

  const byCategory = new Map<CategoryKey, DisplayIngredient[]>();
  for (const category of CATEGORY_ORDER) {
    byCategory.set(category, []);
  }
  for (const ingredient of ingredients) {
    const category = getIngredientCategory(ingredient.name);
    byCategory.get(category)?.push(ingredient);
  }

  const imagePreviewModal =
    previewDetails && typeof document !== "undefined"
      ? createPortal(
          <div className={styles.imageModalBackdrop} role="dialog" aria-modal="true" aria-label={`Details for ${previewDetails.name}`} onClick={() => setPreviewDetails(null)}>
            <div className={styles.imageModal} onClick={(e) => e.stopPropagation()}>
              <button type="button" className={styles.imageModalClose} onClick={() => setPreviewDetails(null)} aria-label="Close details">
                ✕
              </button>
              {previewDetails.imageUrl && <img src={previewDetails.imageUrl} alt={previewDetails.name} className={styles.imageModalImage} />}
              <div className={styles.imageModalInfo}>
                <h4 className={styles.imageModalTitle}>{previewDetails.name}</h4>
                <p className={styles.imageModalMetaLabel}>Used in:</p>
                {previewDetails.mealNames.length > 0 ? (
                  <div className={styles.imageModalMeals}>
                    {previewDetails.mealNames.map((mealName) => (
                      <span key={`${previewDetails.name}-${mealName}`} className={styles.imageModalMealChip}>
                        {mealName}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className={styles.imageModalMetaText}>No selected meal uses this ingredient.</p>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <aside className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>
        <div className={styles.headingRow}>
          <h2 className={styles.heading}>Shopping List</h2>
          <div className={styles.headerButtons}>
            {(selectedMeals.length > 0 || customItems.length > 0) && (
              <button className={styles.clearBtn} onClick={handleClearAll} title="Clear all meals">
                Clear
              </button>
            )}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {selectedMeals.length > 0 && (
          <div className={styles.mealLegend}>
            {selectedMeals.map((meal) => {
              const color = mealColorMap.get(meal.id)!;
              const isActive = activeFocusedMealId === meal.id;
              return (
                <button key={meal.id} className={`${styles.mealTag} ${isActive ? styles.mealTagActive : ""}`} style={{ "--tag-color": color } as React.CSSProperties} onClick={() => toggleFocusMeal(meal.id)} aria-pressed={isActive}>
                  {meal.name}
                </button>
              );
            })}
          </div>
        )}

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
                <h3 className={styles.categoryHeading}>
                  <span className={styles.categoryEmojiRow} aria-hidden="true">
                    <span className={styles.categoryEmoji}>{CATEGORY_EMOJIS[category][0]}</span>
                  </span>
                  <span className={styles.categoryLabel}>{CATEGORY_LABELS[category]}</span>
                </h3>
                <ul className={styles.list}>
                  {items.map((ing, i) => {
                    const isChecked = checkedItems.has(ing.key);
                    const isHighlighted = activeFocusedMealId !== null && (ing.mealIds?.includes(activeFocusedMealId) ?? false);
                    const isDimmed = activeFocusedMealId !== null && !isHighlighted && !ing.isCustom;
                    const highlightColor = isHighlighted ? mealColorMap.get(activeFocusedMealId!) : undefined;
                    const imageUrl = ing.isCustom ? undefined : getIngredientImageUrl(ing.name);
                    // const isHeld = heldIngredientKey === ing.key; // removed: no longer used
                    const relatedMealNames = (ing.mealIds ?? []).map((mealId) => mealNameMap.get(mealId)).filter((name): name is string => Boolean(name));
                    return (
                      <li key={`${category}-${ing.key}-${i}`} className={`${styles.item} ${ing.optional ? styles.optionalItem : ""} ${isChecked ? styles.checked : ""} ${isHighlighted ? styles.itemHighlighted : ""} ${isDimmed ? styles.itemDimmed : ""}`} style={isHighlighted ? ({ "--item-accent": highlightColor } as React.CSSProperties) : undefined}>
                        <button className={styles.checkbox} onClick={() => toggleItem(ing.key)} aria-label={`Toggle ${ing.name}`} aria-pressed={isChecked}>
                          {isChecked && "✓"}
                        </button>
                        <span className={styles.itemName}>
                          <span className={styles.itemLabel}>
                            <IngredientName name={ing.name} />
                            {!ing.isCustom && (
                              <button
                                type="button"
                                className={styles.imageIconBtn}
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewDetails({ name: ing.name, imageUrl, mealNames: relatedMealNames });
                                }}
                                aria-label={`Open details for ${ing.name}`}
                                title="Open ingredient details"
                              >
                                <InfoIcon />
                              </button>
                            )}
                            {ing.optional && <span className={styles.optionalInline}>optional</span>}
                          </span>
                        </span>
                        {ing.isCustom ? (
                          ing.key === `custom__${UNREMOVABLE_ITEM_ID}` ? (
                            <span style={{ width: 20, display: "inline-block" }} />
                          ) : (
                            <button className={styles.removeBtn} onClick={() => removeCustomItem(ing.key.replace("custom__", ""))} aria-label={`Remove ${ing.name}`}>
                              ✕
                            </button>
                          )
                        ) : (
                          <span className={styles.itemQty}>
                            {formatQuantity(ing.quantity)}
                            {ing.unit && ` ${ing.unit}`}
                          </span>
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
      {imagePreviewModal}
    </>
  );
}
