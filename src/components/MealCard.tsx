import { type Meal } from "../data/meals";
import styles from "./MealCard.module.css";

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
  meal: Meal;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function MealCard({ meal, selected, onToggle }: Props) {
  return (
    <article className={`${styles.card} ${selected ? styles.selected : ""}`} onClick={() => onToggle(meal.id)} role="checkbox" aria-checked={selected} tabIndex={0} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle(meal.id)}>
      <div className={styles.imageWrapper}>
        <img src={meal.imageUrl} alt={meal.name} className={styles.image} loading="lazy" />
        {selected && (
          <div className={styles.checkmark} aria-hidden="true">
            ✓
          </div>
        )}
      </div>

      <div className={styles.body}>
        <h2 className={styles.title}>{meal.name}</h2>
        <p className={styles.description}>{meal.description}</p>

        <details className={styles.details} onClick={(e) => e.stopPropagation()}>
          <summary className={styles.detailsSummary}>{meal.ingredients.length} ingredients</summary>
          <ul className={styles.ingredientList}>
            {meal.ingredients.map((ing, i) => (
              <li key={i} className={ing.optional ? styles.optional : ""}>
                {ing.quantity > 0 && (
                  <span className={styles.qty}>
                    {Number.isInteger(ing.quantity) ? ing.quantity : ing.quantity}
                    {ing.unit && ` ${ing.unit}`}
                  </span>
                )}{" "}
                <IngredientName name={ing.name} />
                {ing.note && <span className={styles.note}> ({ing.note})</span>}
                {ing.optional && <span className={styles.optTag}> optional</span>}
              </li>
            ))}
          </ul>
        </details>

        <a href={meal.recipeUrl} target="_blank" rel="noopener noreferrer" className={styles.recipeLink} onClick={(e) => e.stopPropagation()}>
          View recipe ↗
        </a>
      </div>

      <div className={styles.selectBar}>
        <span>{selected ? "Selected ✓" : "Click to select"}</span>
      </div>
    </article>
  );
}
