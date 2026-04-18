import { useParams, useNavigate } from "react-router-dom";
import { meals } from "../data/meals";
import styles from "./RecipeDetail.module.css";

function IngredientName({ name }: { name: string }) {
  const match = name.match(/^(.+?)\s*(\(.+\))\s*$/);
  if (!match) return <>{name}</>;
  return (
    <>
      {match[1]} <span className={styles.translation}>{match[2]}</span>
    </>
  );
}

export function RecipeDetail() {
  const { mealId } = useParams<{ mealId: string }>();
  const navigate = useNavigate();

  const meal = meals.find((m) => m.id === mealId);
  const normalizedContent = meal?.content?.replace(/\\n/g, "\n").replace(/\/n/g, "\n");

  if (!meal) {
    return (
      <div className={styles.notFound}>
        <h1>Recipe not found</h1>
        <button onClick={() => navigate("/")} className={styles.backBtn}>
          ← Back to meals
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate("/")} className={styles.backBtn}>
        ← Back to meals
      </button>

      <article className={styles.recipe}>
        <img src={meal.imageUrl} alt={meal.name} className={styles.image} />

        <div className={styles.content}>
          <h1 className={styles.title}>{meal.name}</h1>

          {normalizedContent && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Instructions</h2>
              <div className={styles.instructionsText}>{normalizedContent}</div>
            </section>
          )}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Ingredients</h2>
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
          </section>

          {meal.recipeUrl && (
            <a href={meal.recipeUrl} target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
              View full recipe on source ↗
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
