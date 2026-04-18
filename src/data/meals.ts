export interface Ingredient {
  name: string;
  quantity: number;
  unit: string; // 'g' | 'ml' | 'szt' | 'op' | 'łyżka' | 'łyżeczka' | 'ząbki' | ''
  optional?: boolean;
  note?: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  recipeUrl: string;
  ingredients: Ingredient[];
}

// Unit normalization for aggregation: convert to base unit before summing
// dl -> ml (*100), kg -> g (*1000)
export function normalizeToBaseUnit(qty: number, unit: string): { quantity: number; unit: string } {
  if (unit === "dl") return { quantity: qty * 100, unit: "ml" };
  if (unit === "kg") return { quantity: qty * 1000, unit: "g" };
  return { quantity: qty, unit };
}

export interface AggregatedIngredient {
  name: string;
  quantity: number;
  unit: string;
  optional: boolean;
}

export function aggregateIngredients(meals: Meal[]): AggregatedIngredient[] {
  const map = new Map<string, AggregatedIngredient>();

  for (const meal of meals) {
    for (const ing of meal.ingredients) {
      const { quantity, unit } = normalizeToBaseUnit(ing.quantity, ing.unit);
      const key = `${ing.name.toLowerCase()}__${unit}`;
      const existing = map.get(key);
      if (existing) {
        existing.quantity += quantity;
        if (!ing.optional) existing.optional = false;
      } else {
        map.set(key, {
          name: ing.name,
          quantity,
          unit,
          optional: ing.optional ?? false,
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.optional !== b.optional) return a.optional ? 1 : -1;
    return a.name.localeCompare(b.name, "pl");
  });
}

export function formatQuantity(qty: number): string {
  if (qty === 0) return "";
  if (Number.isInteger(qty)) return String(qty);
  // Show as fraction-like decimal, max 1 decimal
  const rounded = Math.round(qty * 10) / 10;
  return String(rounded);
}

export const meals: Meal[] = [
  {
    id: "tarta",
    name: "Tarta",
    description: "Savory quiche with cheese, veggies & bacon",
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=480&q=80",
    recipeUrl: "https://www.kwestiasmaku.com/przepis/tarta-z-serem-i-warzywami",
    ingredients: [
      { name: "Ciasto na tartę (tart pastry)", quantity: 1, unit: "op" },
      { name: "Ser żółty (yellow cheese)", quantity: 1, unit: "op" },
      { name: "Cebula (onion)", quantity: 1, unit: "szt" },
      { name: "Papryka (bell pepper)", quantity: 1, unit: "szt" },
      { name: "Pomidorki koktajlowe (cherry tomatoes)", quantity: 150, unit: "g" },
      { name: "Jajka (eggs)", quantity: 1, unit: "szt" },
      { name: "Śmietana (sour cream)", quantity: 250, unit: "ml" },
      { name: "Boczek plastry (sliced bacon)", quantity: 1, unit: "op" },
    ],
  },
  {
    id: "paprikascsirke",
    name: "Paprikáscsirke",
    description: "Hungarian chicken paprikash with creamy sauce & dumplings",
    imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=480&q=80",
    recipeUrl: "https://www.seriouseats.com/hungarian-chicken-paprikash-recipe",
    ingredients: [
      { name: "Kurczak (chicken)", quantity: 500, unit: "g" },
      { name: "Papryka (bell pepper)", quantity: 1, unit: "szt" },
      { name: "Pomidor (tomato)", quantity: 1, unit: "szt" },
      { name: "Papryka w proszku (paprika powder)", quantity: 1, unit: "op" },
      { name: "Cebula (onion)", quantity: 2, unit: "szt" },
      { name: "Mąka (flour)", quantity: 300, unit: "g" },
      { name: "Jajka (eggs)", quantity: 1, unit: "szt" },
      { name: "Mleko (milk)", quantity: 300, unit: "ml" },
      { name: "Śmietana (sour cream)", quantity: 300, unit: "ml" },
      { name: "Warzywa (vegetables)", quantity: 1, unit: "szt", optional: true },
    ],
  },
  {
    id: "krumplifozelek",
    name: "Krumplifőzelék",
    description: "Hungarian creamy potato stew with meatballs",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=480&q=80",
    recipeUrl: "https://welovebudapest.com/en/2021/03/krumplif%C5%91zel%C3%A9k/",
    ingredients: [
      { name: "Cebula (onion)", quantity: 2, unit: "szt" },
      { name: "Ziemniaki (potatoes)", quantity: 1500, unit: "g" },
      { name: "Mięso mielone wieprzowe (ground pork)", quantity: 500, unit: "g" },
      { name: "Jajka (eggs)", quantity: 2, unit: "szt" },
      { name: "Śmietana (sour cream)", quantity: 200, unit: "ml" },
      { name: "Tejszín / śmietanka (heavy cream)", quantity: 1, unit: "op" },
      { name: "Mąka (flour)", quantity: 60, unit: "g" },
      { name: "Skrobia (starch)", quantity: 30, unit: "g" },
      { name: "Czosnek (garlic)", quantity: 2, unit: "ząbki" },
      { name: "Masło (butter)", quantity: 50, unit: "g" },
      { name: "Bułka tarta (breadcrumbs)", quantity: 1, unit: "op" },
      { name: "Sucha bułka (dry bread roll)", quantity: 1, unit: "szt" },
      { name: "Ocet (vinegar)", quantity: 1, unit: "łyżka" },
      { name: "Cukier (sugar)", quantity: 1, unit: "łyżeczka" },
      { name: "Pieprz mielony (ground pepper)", quantity: 1, unit: "łyżeczka" },
      { name: "Liść laurowy (bay leaf)", quantity: 2, unit: "szt" },
      { name: "Majeranek (marjoram)", quantity: 1, unit: "łyżeczka" },
    ],
  },
  {
    id: "nalesniki",
    name: "Naleśniki",
    description: "Polish crepes with jam or sweetened quark",
    imageUrl: "https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?w=480&q=80",
    recipeUrl: "https://www.kwestiasmaku.com/desery/nalesniki/przepis.html",
    ingredients: [
      { name: "Mleko (milk)", quantity: 500, unit: "ml" },
      { name: "Jajka (eggs)", quantity: 2, unit: "szt" },
      { name: "Mąka (flour)", quantity: 500, unit: "g" },
      { name: "Dżem (jam)", quantity: 1, unit: "op", optional: true },
      { name: "Twaróg (quark / cottage cheese)", quantity: 1, unit: "op", optional: true },
      { name: "Jogurt naturalny (plain yogurt)", quantity: 200, unit: "ml", optional: true },
    ],
  },
  {
    id: "tortille",
    name: "Tortille / Quesadille",
    description: "Mexican-style wraps with ground meat, beans & cheese",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=480&q=80",
    recipeUrl: "https://www.allrecipes.com/recipe/23891/good-old-fashioned-pancakes/",
    ingredients: [
      { name: "Tortille (tortillas)", quantity: 1, unit: "op" },
      { name: "Ser żółty (yellow cheese)", quantity: 1, unit: "op", note: "tarty / grated" },
      { name: "Papryka (bell pepper)", quantity: 1, unit: "szt", optional: true },
      { name: "Kukurydza w puszce (canned corn)", quantity: 1, unit: "szt", optional: true },
      { name: "Fasola Heinz w puszce (Heinz canned beans)", quantity: 1, unit: "szt" },
      { name: "Cebula (onion)", quantity: 2, unit: "szt" },
      { name: "Mięso mielone (ground meat)", quantity: 500, unit: "g" },
      { name: "Pomidory w puszce (canned tomatoes)", quantity: 2, unit: "op" },
    ],
  },
  {
    id: "spaghetti",
    name: "Spaghetti",
    description: "Classic spaghetti bolognese with ground meat & tomato sauce",
    imageUrl: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=480&q=80",
    recipeUrl: "https://www.kwestiasmaku.com/przepis/spaghetti-bolognese",
    ingredients: [
      { name: "Makaron spaghetti (spaghetti pasta)", quantity: 0.5, unit: "op" },
      { name: "Mięso mielone (ground meat)", quantity: 500, unit: "g" },
      { name: "Pomidory w puszce (canned tomatoes)", quantity: 2, unit: "op" },
      { name: "Cebula (onion)", quantity: 2, unit: "szt" },
    ],
  },
  {
    id: "szaszlyki",
    name: "Szaszłyki",
    description: "Grilled chicken & vegetable skewers",
    imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=480&q=80",
    recipeUrl: "https://www.kwestiasmaku.com/przepis/szaszlyki-z-kurczaka",
    ingredients: [
      { name: "Piersi z kurczaka (chicken breasts)", quantity: 500, unit: "g" },
      { name: "Cukinia (zucchini)", quantity: 1, unit: "szt" },
      { name: "Papryka (bell pepper)", quantity: 2, unit: "szt" },
      { name: "Cebula (onion)", quantity: 2, unit: "szt" },
      { name: "Pomidorki koktajlowe (cherry tomatoes)", quantity: 250, unit: "g" },
    ],
  },
  {
    id: "tzatziki",
    name: "Tzatziki z kurczakiem",
    description: "Greek-style yogurt dip with grilled chicken & pita",
    imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=480&q=80",
    recipeUrl: "https://www.kwestiasmaku.com/przepis/tzatziki",
    ingredients: [
      { name: "Jogurt naturalny (plain yogurt)", quantity: 400, unit: "ml" },
      { name: "Czosnek (garlic)", quantity: 5, unit: "ząbki" },
      { name: "Pita bread", quantity: 1, unit: "op" },
      { name: "Piersi z kurczaka (chicken breasts)", quantity: 500, unit: "g" },
    ],
  },
  {
    id: "bigos",
    name: "Transylvanian Bigos",
    description: "Hearty Transylvanian pork & sauerkraut stew",
    imageUrl: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=480&q=80",
    recipeUrl: "https://www.196flavors.com/romania-varza-a-la-cluj/",
    ingredients: [
      { name: "Łopatka wieprzowa (pork shoulder)", quantity: 700, unit: "g" },``
      { name: "Czosnek (garlic)", quantity: 2, unit: "ząbki" },
      { name: "Cebula (onion)", quantity: 1, unit: "szt" },
      { name: "Kmin (caraway)", quantity: 1, unit: "łyżeczka" },
      { name: "Pieprz (pepper)", quantity: 1, unit: "łyżka" },
      { name: "Papryka (bell pepper)", quantity: 2, unit: "szt" },
      { name: "Pomidor (tomato)", quantity: 1, unit: "szt" },
      { name: "Kapusta kiszona (sauerkraut)", quantity: 800, unit: "g" },
      { name: "Śmietana (sour cream)", quantity: 400, unit: "ml" },
      { name: "Mąka (flour)", quantity: 50, unit: "g" },
    ],
  },
];
