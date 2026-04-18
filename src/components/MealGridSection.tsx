import { type Meal } from "../data/meals";
import { MealCard } from "./MealCard";

interface MealGridSectionProps {
  meals: Meal[];
  selectedIds: Set<string>;
  onToggleMeal: (id: string) => void;
}

export function MealGridSection({ meals, selectedIds, onToggleMeal }: MealGridSectionProps) {
  const lunchMeals = meals.filter((meal) => meal.kind !== "idea");
  const quickIdeas = meals.filter((meal) => meal.kind === "idea");

  const selectedCount = selectedIds.size;

  return (
    <section className="meal-section">
      <h1 className="section-title">
        Lunches
        {selectedCount > 0 && <span className="badge">{selectedCount} selected</span>}
      </h1>

      <div className="meal-grid">
        {lunchMeals.map((meal) => (
          <MealCard key={meal.id} meal={meal} selected={selectedIds.has(meal.id)} onToggle={onToggleMeal} />
        ))}
      </div>

      {quickIdeas.length > 0 && (
        <section className="ideas-section" aria-label="Breakfast and dinner ideas">
          <h2 className="section-title">Breakfast / Dinner ideas</h2>
          <div className="meal-grid">
            {quickIdeas.map((meal) => (
              <MealCard key={meal.id} meal={meal} selected={selectedIds.has(meal.id)} onToggle={onToggleMeal} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
