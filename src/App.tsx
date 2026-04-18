import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { meals } from "./data/meals";
import { PageLayout } from "./components/PageLayout";
import { MealGridSection } from "./components/MealGridSection";
import { RecipeDetail } from "./components/RecipeDetail";
import "./App.css";

function App() {
  // Use lazy initializer to load from localStorage synchronously on first render
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("selectedMealIds");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      console.error("Failed to parse localStorage:", e);
      return new Set();
    }
  });

  // Save selected meals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("selectedMealIds", JSON.stringify(Array.from(selectedIds)));
  }, [selectedIds]);

  function toggleMeal(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearAll() {
    setSelectedIds(new Set());
  }

  return (
    <BrowserRouter basename="/kiki-cookin/">
      <Routes>
        <Route
          path="/"
          element={
            <PageLayout selectedMealIds={selectedIds} onClearAllMeals={clearAll}>
              <MealGridSection meals={meals} selectedIds={selectedIds} onToggleMeal={toggleMeal} />
            </PageLayout>
          }
        />
        <Route
          path="/recipe/:mealId"
          element={
            <PageLayout selectedMealIds={selectedIds} onClearAllMeals={clearAll}>
              <RecipeDetail />
            </PageLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
