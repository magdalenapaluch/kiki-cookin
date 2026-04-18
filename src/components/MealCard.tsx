import { Link } from "react-router-dom";
import { type Meal } from "../data/meals";
import styles from "./MealCard.module.css";

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

        <Link to={`/recipe/${meal.id}`} className={styles.recipeLink} onClick={(e) => e.stopPropagation()}>
          Go to recipe ↗
        </Link>
      </div>

      <div className={styles.selectBar}>
        <span>{selected ? "Selected ✓" : "Click to select"}</span>
      </div>
    </article>
  );
}
