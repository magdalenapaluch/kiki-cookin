export type CategoryKey = "bakery" | "produce" | "canned" | "dryGoods" | "spices" | "meat" | "fridgeVeggies" | "coldCuts" | "cheese" | "dairyYogurt" | "milkEggsBaking" | "drinks" | "snacks" | "frozen" | "cosmetics" | "other";

export const CATEGORY_ORDER: CategoryKey[] = ["bakery", "produce", "canned", "dryGoods", "spices", "meat", "fridgeVeggies", "coldCuts", "cheese", "dairyYogurt", "milkEggsBaking", "drinks", "snacks", "frozen", "cosmetics", "other"];

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  bakery: "Bakery, Coffee & Tea",
  produce: "Veggies & Fruits",
  canned: "Canned Goods & Legumes",
  dryGoods: "Pasta, Rice & Dry Goods",
  spices: "Spices & Condiments",
  meat: "Meat",
  fridgeVeggies: "Pickled & Sprout Veggies",
  coldCuts: "Cold Cuts & Ham",
  cheese: "Cheese",
  dairyYogurt: "Yoghurts, Butter & Yeast",
  milkEggsBaking: "Milk, Eggs & Baking",
  drinks: "Drinks & Water",
  snacks: "Snacks & Sweets",
  frozen: "Frozen",
  cosmetics: "Cosmetics & Household",
  other: "Other",
};

const POLISH_CHAR_MAP: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
  Ą: "a",
  Ć: "c",
  Ę: "e",
  Ł: "l",
  Ń: "n",
  Ó: "o",
  Ś: "s",
  Ź: "z",
  Ż: "z",
};

function normalizeForMatch(value: string): string {
  return value
    .replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (character) => POLISH_CHAR_MAP[character] ?? character)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)/g, "")
    .toLowerCase()
    .trim();
}

function includesAny(text: string, candidates: string[]): boolean {
  return candidates.some((candidate) => text.includes(candidate));
}

const HIDDEN_INGREDIENT_KEYWORDS = ["woda", "water", "viz"];

export function shouldHideIngredient(name: string): boolean {
  const normalized = normalizeForMatch(name);
  return includesAny(normalized, HIDDEN_INGREDIENT_KEYWORDS);
}

// 1. Pickled / fermented / sprout veggies — checked FIRST so "ogórki kiszone"
//    doesn't fall into the plain produce bucket
const FRIDGE_VEGGIES_KEYWORDS = ["kiszon", "kwaszon", "kielk", "kimchi", "ferment", "sauerkraut", "savanyu", "csira", "ciasto na tart"];

// 2. Frozen
const FROZEN_KEYWORDS = ["mrozon", "frozen", "fagy", "fagyaszt", "pizza", "lody", "ice cream", "frytki", "fries"];

// 3. Cosmetics & household — unlikely in meal ingredients but needed for manual list entries
const COSMETICS_KEYWORDS = ["mydl", "szampon", "zebow", "prysznic", "prania", "worek", "folia opak", "folia spozyw", "folia alumi", "odswiezacz", "papier toalet", "soap", "shampoo", "toothpaste", "detergent", "cleanin", "szappan", "sampon", "fogkrem", "mososzer", "wc papir", "tisztito", "condoms", "skyn"];

// 4. Cold cuts & ham — checked before meat so "szynka" / "kiełbasa" don't land in Meat
const COLD_CUTS_KEYWORDS = ["szynk", "kielbas", "parowk", "wedzin", "salami", "mortadel", "boczek", "bekon", "cold cut", "ham", "sausage", "sonka", "kolbasz", "szalonna"];

// 5. Cheese — checked before dairyYogurt (both can contain "ser"-like substrings)
const CHEESE_KEYWORDS = ["ser", "twarog", "mozzarell", "feta", "parmezan", "mascarpone", "ricotta", "gorgonzol", "cheese", "quark", "cottage", "sajt", "turo", "cheddar"];

// 6. Yoghurts, butter, yeast, sour cream / heavy cream, lard
const DAIRY_YOGURT_KEYWORDS = ["jogurt", "maslo", "drozdze", "kefir", "maslank", "smietan", "tejszin", "tejfol", "smalec", "yogurt", "butter", "yeast", "eleszto", "vaj"];

// 7a. Canned goods & legumes
const CANNED_KEYWORDS = ["puszce", "passata", "canned", "can", "fasola", "soczew", "ciecierzyc", "groch", "bab", "lencs", "csicseri", "borso", "konzerv", "konzervdoboz", "koncentrat", "bulion", "cebulk"];

// 7b. Dry goods: pasta, rice, grains, nuts — checked BEFORE produce so "ryz" etc.
//    don't fall through to produce
const DRY_GOODS_KEYWORDS = [
  "makaron",
  "spaghetti",
  "tortellini",
  "gnocchi",
  "ryz",
  "rice",
  "rizs",
  "kasz",
  "grain",
  "grains",
  "kuskus",
  "bulgur",
  "quinoa",
  "suszony",
  "nutella",
  // nuts & seeds
  "orzech",
  "pestk",
  "nasion",
  "migdal",
  "hazelnut",
  "almond",
  "pisztach",
  "dio",
  "mandula",
  "mag",
  "zurawina",
  "cranberr",
];

// 7c. Spices & condiments — checked BEFORE produce so "papryka mielona"
//    is caught here and not matched by "papryk" in produce
const SPICES_KEYWORDS = ["papryka mielon", "papryka slodka", "papryka wedzon", "pieprz", "ocet", "kmin", "majeranek", "laurow", "sol", "cynamon", "oregano", "bazyli", "tymianek", "curry", "kurkum", "chili", "imbir", "czosnek granul", "musztard", "ketchup", "majonez", "spice", "season", "vinegar", "salt", "pepper", "mustard", "cinnamon", "ginger", "turmeric", "garlic powder", "fuszer", "ecet", "bazsalikom", "kakukkf", "fah", "mustar", "orolt paprika", "edes paprika", "fustolt paprika"];

// 8. Milk, eggs, flour, sugar, cereals, baking staples
//    "makaron" (pasta) starts with "maka" so dryCanned must be checked first ↑
const MILK_EGGS_BAKING_KEYWORDS = ["oliw", "mleko", "jajk", "jaj", "maka", "cukier", "dzem", "skrobia", "platki", "muesli", "musli", "granola", "proszek", "soda", "kakao", "wanili", "olej", "milk", "flour", "starch", "sugar", "cocoa", "vanilla", "oil", "tej", "tojas", "liszt", "cukor", "kemenyito", "vanilia", "zabpehely", "oliv"];

// 9. Drinks & water
const DRINKS_KEYWORDS = ["woda", "sok", "napoj", "piwo", "wino", "szampan", "juice", "beer", "wine", "water", "smoothie", "viz", "udito", "sor", "bor", "pezsgo"];

// 10. Meat (whole cuts, poultry, fish)
const MEAT_KEYWORDS = ["mieso", "kurczak", "lopatka", "wieprzow", "wolow", "cielec", "baran", "jagniec", "indyk", "ryb", "losos", "dorsz", "tunczyk", "krewetk", "golec", "pasztet", "meat", "chicken", "pork", "beef", "veal", "lamb", "turkey", "fish", "salmon", "cod", "tuna", "shrimp", "pate", "hus", "csirke", "marha", "sertes", "borju", "bari", "lazac", "tonhal", "garnel", "pulyka", "hal"];

// 11. Fresh veggies & fruits
const PRODUCE_KEYWORDS = [
  "pistac",
  "cebul",
  "papryk",
  "pomidor",
  "ziemniak",
  "czosn",
  "cukini",
  "kukurydz",
  "kapust",
  "ogor",
  "seler",
  "owoc",
  "owoce",
  "jablk",
  "banan",
  "truskawk",
  "malin",
  "borowk",
  "jagod",
  "winogron",
  "cytryn",
  "limonk",
  "pomarancz",
  "gruszk",
  "brzoskwin",
  "kiwi",
  "mango",
  "salat",
  "rukol",
  "szpinak",
  "por",
  "brokul",
  "kalafior",
  "baklazan",
  "rzodkiew",
  "pieczark",
  "pietruszk",
  "koper",
  "szczypior",
  "onion",
  "tomato",
  "potato",
  "garlic",
  "zucchini",
  "corn",
  "cabbage",
  "cucumber",
  "celery",
  "fruit",
  "apple",
  "strawberr",
  "raspberr",
  "blueberr",
  "grape",
  "lemon",
  "lime",
  "orange",
  "pear",
  "peach",
  "lettuce",
  "arugula",
  "spinach",
  "leek",
  "broccoli",
  "cauliflower",
  "eggplant",
  "radish",
  "mushroom",
  "parsley",
  "dill",
  "chive",
  "hagyma",
  "paradicsom",
  "burgony",
  "fokhagy",
  "cukkini",
  "kukorica",
  "ubork",
  "zeller",
  "gyumolcs",
  "alma",
  "eper",
  "szolo",
  "citrom",
  "narancs",
  "korte",
  "barack",
  "salata",
  "spenot",
  "brokkoli",
  "karfiol",
  "retek",
  "gomba",
  "petrezs",
  "kapor",
  "sargarep",
  "repa",
  "ubi",
  "marchew",
  "carrot",
];

// 12. Packaged snacks & sweets
const SNACKS_KEYWORDS = ["chipsy", "crisps", "chips", "slodycze", "cukierki", "zelki", "guma do zucia", "batonik", "chrupk", "snack", "candy", "sweet", "csipsz", "edesseg", "cukorka", "gumicukor", "rago"];

// 13. Bakery: bread, rolls, tortillas, pita, pastry; also coffee, tea, chocolate next to bread counter
const BAKERY_KEYWORDS = ["chleb", "bulk", "pita", "tortill", "ciast", "bagiet", "buleczk", "grzank", "sucha bulk", "herbat", "kawa", "czekolad", "bread", "bun", "toast", "pastry", "croissant", "coffee", "tea", "chocolate", "kenyer", "zsoml", "kelt"];

export function getIngredientCategory(name: string): CategoryKey {
  const n = normalizeForMatch(name);

  if (includesAny(n, FRIDGE_VEGGIES_KEYWORDS)) return "fridgeVeggies";
  if (includesAny(n, FROZEN_KEYWORDS)) return "frozen";
  if (includesAny(n, COSMETICS_KEYWORDS)) return "cosmetics";
  if (includesAny(n, COLD_CUTS_KEYWORDS)) return "coldCuts";
  if (includesAny(n, CHEESE_KEYWORDS)) return "cheese";
  if (includesAny(n, DAIRY_YOGURT_KEYWORDS)) return "dairyYogurt";
  if (includesAny(n, CANNED_KEYWORDS)) return "canned";
  if (includesAny(n, DRY_GOODS_KEYWORDS)) return "dryGoods";
  if (includesAny(n, SPICES_KEYWORDS)) return "spices";
  if (includesAny(n, MILK_EGGS_BAKING_KEYWORDS)) return "milkEggsBaking";
  if (includesAny(n, DRINKS_KEYWORDS)) return "drinks";
  if (includesAny(n, MEAT_KEYWORDS)) return "meat";
  if (includesAny(n, PRODUCE_KEYWORDS)) return "produce";
  if (includesAny(n, SNACKS_KEYWORDS)) return "snacks";
  if (includesAny(n, BAKERY_KEYWORDS)) return "bakery";

  return "other";
}
