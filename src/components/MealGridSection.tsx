import { type Meal } from "../data/meals";
import { MealCard } from "./MealCard";

interface MealGridSectionProps {
  meals: Meal[];
  selectedIds: Set<string>;
  onToggleMeal: (id: string) => void;
}

export function MealGridSection({ meals, selectedIds, onToggleMeal }: MealGridSectionProps) {
  return (
    <section className="meal-section">
      <h1 className="section-title">
        Choose your meals
        {selectedIds.size > 0 && <span className="badge">{selectedIds.size} selected</span>}
      </h1>

      <div className="meal-grid">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} selected={selectedIds.has(meal.id)} onToggle={onToggleMeal} />
        ))}
      </div>
    </section>
  );
}
