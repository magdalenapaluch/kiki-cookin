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
  recipeUrl?: string;
  content?: string;
  kind?: "lunch" | "idea";
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
  mealIds: string[];
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
        if (!existing.mealIds.includes(meal.id)) existing.mealIds.push(meal.id);
      } else {
        map.set(key, {
          name: ing.name,
          quantity,
          unit,
          optional: ing.optional ?? false,
          mealIds: [meal.id],
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

export { type CategoryKey, CATEGORY_ORDER, CATEGORY_LABELS, getIngredientCategory, shouldHideIngredient } from "./ingredientCategories";

export const meals: Meal[] = [
  {
    id: "tarta",
    name: "Tarta",
    description: "Savory quiche with cheese, veggies & bacon",
    imageUrl: "https://cdn.aniagotuje.com/pictures/articles/2023/03/40271701-v-1080x1080.jpg",
    recipeUrl: "https://aniagotuje.pl/przepis/quiche-lorraine",
    content: `Rozgrzej piekarnik do 200°C. Umieść ciasto na tartę w formie./n/nPokrój cebulę i paprykę. Portnij boczek na paski i smaż na rumiano. Odstaw na bok./n/nDodaj pokrojoną cebulę i paprykę do tłuszczu po boczku, smaż aż się zmiękczą. Wymieszaj jajka ze śmietaną, dopraw solą i pieprzem./n/nUloż ugotowane warzywa i boczek na cieście. Zalej masą jajeczno-śmietankową. Posypuj tartym serem na górze./n/nPiecz przez 25-30 minut aż złoci się i będzie ścisła. Schłodź lekko przed podaniem.`,
    ingredients: [
      { name: "Ciasto na tartę (tart pastry)", quantity: 1, unit: "op" },
      { name: "Ser żółty (yellow cheese)", quantity: 1, unit: "op" },
      { name: "Cebula (onion)", quantity: 1, unit: "szt" },
      { name: "Papryka (bell pepper)", quantity: 1, unit: "szt" },
      { name: "Pomidorki koktajlowe (cherry tomatoes)", quantity: 150, unit: "g" },
      { name: "Jajka (eggs)", quantity: 1, unit: "szt" },
      { name: "Śmietana (sour cream)", quantity: 250, unit: "ml" },
      { name: "Boczek (sliced bacon)", quantity: 1, unit: "op" },
    ],
  },
  {
    id: "paprikascsirke",
    name: "Paprikáscsirke",
    description: "Hungarian chicken paprikash with creamy sauce & dumplings",
    imageUrl: "https://cdn.mindmegette.hu/2024/04/lk2270HzoOa9Xwb7zjsslQbJqZ8bsNwFWnOSntOWbAk/fill/0/0/no/1/aHR0cHM6Ly9jbXNjZG4uYXBwLmNvbnRlbnQucHJpdmF0ZS9jb250ZW50LzJiMGZmOWQ0OTY2NzQ1MTBhMTU4NTRmOGQzODVmMDM0.webp",
    recipeUrl: "https://www.mindmegette.hu/recept/paprikas-csirke-galuskaval",
    content: `Pokrój kurczaka na kawałki. Drobno posiekaj cebulę.\n\nRozgrzej olej w dużym garnku i smaż cebulę do przezroczystości. Dodaj paprykę w proszku i natychmiast zamieszaj. Dodaj kurczaka i przysmaż ze wszystkich stron.\n\nDodaj posiekaną paprykę i pomidora. Wlej szklankę wody i gotuj przez 20-25 minut aż kurczak będzie miękki.\n\nPrzygotuj kluski: wymieszaj mąkę, jajka i mleko na lepkie ciasto. Wrzucaj łyżkami do wrzątku osolonego i gotuj aż wypłyną, a następnie jeszcze 2-3 minuty.\n\nZmieszaj śmietanę z trochą ciepłego bujonu i dodaj do paprikaszu. Dopraw do smaku. Podaj z kluskami.`,
    ingredients: [
      { name: "Piersi z kurczaka (chicken breasts)", quantity: 500, unit: "g" },
      { name: "Papryka (bell pepper)", quantity: 1, unit: "szt" },
      { name: "Pomidor (tomato)", quantity: 1, unit: "szt" },
      { name: "Papryka mielona (ground paprika)", quantity: 2, unit: "łyżeczka" },
      { name: "Cebula (onion)", quantity: 2, unit: "szt" },
      { name: "Mąka (flour)", quantity: 300, unit: "g" },
      { name: "Jajka (eggs)", quantity: 1, unit: "szt" },
      { name: "Mleko (milk)", quantity: 300, unit: "ml" },
      { name: "Śmietana (sour cream)", quantity: 300, unit: "ml" },
      { name: "Ogórki kiszone (pickles)", quantity: 1, unit: "szt", optional: true },
    ],
  },
  {
    id: "krumplifozelek",
    name: "Krumplifőzelék",
    description: "Hungarian creamy potato stew with meatballs",
    imageUrl: "https://production.streetkitchen-cdn.com/ze-kurmplifozelek-fasirttal-2-large-emKSiC.webp",
    recipeUrl: "https://streetkitchen.hu/receptek/magyaros-krumplifozelek-fasirttal-imadjuk",
    content: `Na pulpety: zmocz suchą bułkę w mleku. Wymieszaj mielone wieprzowne z namoczonym chlebem, jednym jajkiem, posiekanym czoskiem, solą i pieprzem. Uformuj kulki i smaż do złota. Odłóż na bok.\n\nNa főzelék: pokrój ziemniaki i cebulę. Rozpuść masło w dużym garnku i smaż cebulę do miękkości. Dodaj ziemniaki i 2 litry wody. Gotuj przez 15 minut.\n\nPrzygotuj zasmażkę: wymieszaj mąkę z 2-3 łyżkami masła, gotuj na jasno. Dodaj do ziemniaków, ciągle mieszając.\n\nDodaj pulpety, liście laurowe, majeranek, ocet, cukier i przyprawy. Gotuj jeszcze 10-15 minut.\n\nZmieszaj śmietanę ze skrobią i trochą ciepłego bujonu. Dodaj do stewu. Gotuj 5 minut. Dopraw do smaku.`,
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
      { name: "Ocet (vinegar)", quantity: 15, unit: "ml" },
      { name: "Cukier (sugar)", quantity: 12, unit: "g" },
      { name: "Pieprz mielony (ground pepper)", quantity: 1, unit: "łyżeczka" },
      { name: "Liść laurowy (bay leaf)", quantity: 2, unit: "szt" },
      { name: "Majeranek (marjoram)", quantity: 1, unit: "łyżeczka" },
    ],
  },
  {
    id: "tortille",
    name: "Tortille / Quesadille",
    description: "Mexican-style wraps with ground meat, beans & cheese",
    imageUrl: "https://www.kwestiasmaku.com/sites/v123.kwestiasmaku.com/files/quesadilla.jpg",
    recipeUrl: "https://www.kwestiasmaku.com/przepis/quesadilla-z-kurczakiem-i-warzywami/",
    content: `Rozgrzej olej na patelni i smaż pokrojoną cebulę do miękkości. Dodaj mielone mięso i smaż aż się zbrązi, mieszając.\n\nDodaj fasołę z puszki (odcedzoną) i dopraw koperkielem, chili, solą i pieprzem. Gotuj przez 5 minut.\n\nDodaj pokrojoną paprykę i kukurydzę. Gotuj jeszcze kilka minut.\n\nDo montażu: rozgrzej blaszkę lub dużą patelnię. Połóż tortillę, dodaj mięso i ser na jednej połowie. Złóż na pół i smaż do złota. Przewróć i smaż drugą stronę aż ser się rozpuści i tortilla będzie chrupiąca.\n\nAlternatywnie podaj mięso jako nadzienie i pozwól gościom na własny montaż.`,
    ingredients: [
      { name: "Tortille (tortillas)", quantity: 1, unit: "op" },
      { name: "Ser żółty (yellow cheese)", quantity: 1, unit: "op", note: "tarty / grated" },
      { name: "Papryka (bell pepper)", quantity: 1, unit: "szt", optional: true },
      { name: "Kukurydza w puszce (corn)", quantity: 1, unit: "op", optional: true },
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
    imageUrl: "https://cdn.aniagotuje.com/pictures/articles/2024/05/61816591-v-1080x1080.jpg",
    content: `Drobno pokrój cebulę. Rozgrzej olej w dużym garnku i smaż cebulę do przezroczystości.\n\nDodaj mielone mięso i smaż do zbrązowienia, mieszając i odcedzając nadmiar tłuszczu.\n\nDodaj pomidory z puszki z sokiem, lekko je miażdżąc. Dopraw solą, pieprzem i suszonymi ziołami (bazylią, oreganem). Gotuj 20-30 minut, od czasu do czasu mieszając. Sos powinien się zagęścić, a smaki się zmieszać.\n\nWtedy, gdy sos się gotuje, zagotuj dużą porcję osolonej wody. Dodaj spaghetti i gotuj według instrukcji na opakowaniu na al dente. Dobrze odcedź.\n\nPodaj makaron z sosem bolognese i tartym serem parmezańskim.`,
    ingredients: [
      { name: "Makaron spaghetti (spaghetti pasta)", quantity: 0.5, unit: "op" },
      { name: "Mięso mielone (ground meat)", quantity: 500, unit: "g" },
      { name: "Pomidory w puszce (canned tomatoes)", quantity: 2, unit: "op" },
      { name: "Cebula (onion)", quantity: 2, unit: "szt" },
      { name: "Ser żółty (yellow cheese)", quantity: 0.5, unit: "op", note: "tarty / grated" },
      { name: "Parmezan", quantity: 0.5, unit: "op" },
    ],
  },
  {
    id: "szaszlyki",
    name: "Szaszłyki",
    description: "Grilled chicken & vegetable skewers",
    imageUrl: "https://www.kwestiasmaku.com/sites/v123.kwestiasmaku.com/files/szaszlyki_z_kurczakiem.jpg",
    recipeUrl: "https://www.kwestiasmaku.com/dania_dla_dwojga/party/szaszlyki_z_kurczakiem/przepis.html",
    content: `Pokrój piersi z kurczaka na kawałki 2-3 cm. Pokrój cukinię wzdłuż na ćwiartki, potem na kawałki. Pokrój paprykę i cebulę na kawałki. Pomidorki koktajlowe zostaw całe.\n\nPrzygotuj marynację: wymieszaj olej, sok z cytryny, posiekanym czosnek, sól, pieprz i zioła (oregano, tymianek). Wrzuć kurczaka i warzywa, zostaw na co najmniej 30 minut.\n\nNakań kurczaka i warzywa naprzemiennie na szaszłyki, zaczynając i kończąc cebulą, aby je utrzymać.\n\nGrill nad średnio wysokim ogniem przez 12-15 minut, obracając od czasu do czasu, aż kurczak będzie gotowy, a warzywa miękkie.\n\nOdstaw na kilka minut przed podaniem, podaj z cytrynką i świeżymi ziołami.`,
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
    imageUrl: "https://www.kwestiasmaku.com/sites/v123.kwestiasmaku.com/files/tzatziki_greckie.jpg",
    recipeUrl: "https://www.kwestiasmaku.com/przepis/tzatziki",
    content: `Na tzatziki: zetrzyj ogórek i wyciśnij nadmiar wilgoci. Drobno posiekaj czosnek.\n\nWymieszaj jogurt z tartym ogórkiem, posiekanym czoskiem, solą, pieprzem i świeżymi ziołami (koperkiem lub pietruszką). Schłodź co najmniej 1 godzinę.\n\nNa kurczaka: dopraw piersi z kurczaka solą, pieprzem, oreganem i sokiem z cytryny. Grill nad średnio wysokim ogniem przez 6-7 minut każdą stronę aż będzie gotowy. Odstaw na 5 minut, potem pokrój.\n\nRozgrzej chleb pita na grillu. Montuj rozmazując tzatziki na ciepłym pitcie, dodaj plasterki kurczaka, świeże pomidory, ogórek i czerwoną cebulę.`,
    ingredients: [
      { name: "Jogurt grecki (greek yogurt)", quantity: 400, unit: "ml" },
      { name: "Czosnek (garlic)", quantity: 5, unit: "ząbki" },
      { name: "Pita bread", quantity: 1, unit: "op" },
      { name: "Piersi z kurczaka (chicken breasts)", quantity: 500, unit: "g" },
      { name: "Ogórek (cucumber)", quantity: 1, unit: "szt" },
    ],
  },
  {
    id: "bigos",
    name: "Transylvanian Bigos",
    description: "Treściwy bigos siedmiogrodzki z wieprzowiną i kiszoną kapustą",
    imageUrl: "https://cdn.mindmegette.hu/2024/04/AmItR2xFasmFOyqrLsLbCPol76um4hVI7YN8TYqxWMM/fill/0/0/no/1/aHR0cHM6Ly9jbXNjZG4uYXBwLmNvbnRlbnQucHJpdmF0ZS9jb250ZW50LzVhMTUzNmRjZWZmNDQ2ZGRhZmRiNWQwMThkNzkwZDMy.webp",
    recipeUrl: "https://www.mindmegette.hu/recept/szekelykaposzta",
    content: `Mięso pokrój w kostkę. Cebulę drobno posiekaj, a czosnek przeciśnij przez praskę.\n\nW dużym garnku rozgrzej oliwę z oliwek i zeszklij cebulę. Dodaj czosnek i smaż jeszcze przez około 10 sekund. Wsyp paprykę mieloną, wlej odrobinę wody i smaż chwilę, aż przyprawy dobrze się połączą.\n\nDodaj mięso. Dopraw solą oraz kminkiem, następnie dorzuć pokrojoną paprykę i pomidora. Przykryj i duś na małym ogniu przez około 5 minut.\n\nKapustę kiszoną opłucz, odciśnij z nadmiaru płynu i dodaj do garnka. Wlej tyle wody, aby prawie przykryła całość, i gotuj dalej, aż mięso oraz kapusta będą miękkie.\n\nW osobnym naczyniu wymieszaj śmietanę z mąką. Dolej 100 ml zimnej wody oraz kilka łyżek płynu z gotowania i dokładnie rozprowadź, aby nie było grudek. Wlej zawiesinę do garnka, zagotuj i gotuj jeszcze przez 5 minut. Na końcu dopraw do smaku, jeśli trzeba.`,
    ingredients: [
      { name: "Łopatka wieprzowa (pork shoulder)", quantity: 700, unit: "g" },
      { name: "Oliwa z oliwek (olive oil)", quantity: 50, unit: "g" },
      { name: "Czosnek (garlic)", quantity: 2, unit: "ząbki" },
      { name: "Cebula (onion)", quantity: 1, unit: "szt" },
      { name: "Papryka mielona (ground paprika)", quantity: 2, unit: "łyżeczka" },
      { name: "Kminek mielony (ground caraway)", quantity: 2, unit: "g" },
      { name: "Papryka (bell pepper)", quantity: 2, unit: "szt" },
      { name: "Pomidor (tomato)", quantity: 1, unit: "szt" },
      { name: "Kapusta kiszona (sauerkraut)", quantity: 800, unit: "g" },
      { name: "Śmietana (sour cream)", quantity: 400, unit: "ml" },
      { name: "Mąka (flour)", quantity: 50, unit: "g" },
    ],
  },
  {
    id: "csaszarmorzsa",
    name: "Császármorsza",
    description: "Hungarian version with kasza",
    recipeUrl: "https://streetkitchen.hu/receptek/igy-keszul-a-tokeletes-csaszarmorzsa",
    imageUrl: "https://production.streetkitchen-cdn.com/img_4438-pdu6oJ.webp",
    content: `Aby przygotować kruszonkę Cezar, zagotuj mleko z cukrem waniliowym w małym rondelku, a następnie zdejmij z ognia, wsyp semolinę i odstaw na 10 minut.\n\nW międzyczasie oddziel jajka od białek i włóż białka i żółtka do osobnych misek. Ubij żółtka na sztywną pianę z trzema czwartymi cukru, a następnie wmieszaj je do masy z semoliny. Białka ubij ze szczyptą soli i pozostałym cukrem.\n\nWymieszaj mąkę pszenną i sok z cytryny z mlekiem jajecznym i semoliną, a następnie ostrożnie wmieszaj pianę jajeczną.\n\nNa większej patelni rozpuść połowę masła na średnio-wysokim ogniu i wlej połowę naszej mieszanki, posypując ją połową rodzynek. Smaż, aż spód lekko się zarumieni, a następnie odwróć jak naleśnik i usmaż z drugiej strony. Nie martw się, jeśli ciasto nie będzie się trzymać kupy po przewróceniu, ponieważ w końcu rozpadnie się na małe kawałki.\n\nGdy druga strona się zrumieni, zacznij łamać ją na mniejsze kawałki drewnianą łyżką i kontynuuj rumienienie.\n\nGdy ciasto będzie wystarczająco kruche, ale nie suche, przykryj je w misce i usmaż drugą połowę ciasta w ten sam sposób, na pozostałym maśle.\n\nUłóż na talerzach i posmaruj dżemem morelowym i posyp cukrem pudrem.`,
    ingredients: [
      { name: "Mleko (milk)", quantity: 300, unit: "ml" },
      { name: "Cukier waniliowy", quantity: 8, unit: "g" },
      { name: "Kasza manna", quantity: 100, unit: "g" },
      { name: "Jajka (eggs)", quantity: 4, unit: "szt" },
      { name: "Cukier (sugar)", quantity: 100, unit: "g" },
      { name: "Mąka (flour)", quantity: 70, unit: "g" },
      { name: "Sól (salt)", quantity: 0.4, unit: "g" },
      { name: "Masło (butter)", quantity: 50, unit: "g" },
      { name: "Rodzynki (raisins)", quantity: 50, unit: "g" },
      { name: "Cytryna", quantity: 1, unit: "szt" },
      { name: "Dżem morelowy (apricot jam)", quantity: 300, unit: "g" },
      { name: "Cukier puder", quantity: 40, unit: "g" },
    ],
  },
  {
    id: "cynamonki",
    name: "Cynamonki",
    description: "Miękkie bułeczki drożdżowe z cynamonem",
    recipeUrl: "https://www.kwestiasmaku.com/przepis/buleczki-cynamonowe-cinnamon-rolls",
    imageUrl: "https://www.kwestiasmaku.com/sites/v123.kwestiasmaku.com/files/cynamonki-03.jpg",
    content: `Ciasto: do misy wsyp mąkę, drożdże instant, cukier i szczyptę soli. Wymieszaj. Dodaj letnie mleko oraz 2 jajka i zacznij wyrabiać ciasto na wolnych obrotach. Następnie, cały czas wyrabiając, dodawaj po kawałku miękkie masło (70 g).\n\nWyrabiaj ok. 15 minut, aż ciasto będzie gładkie i sprężyste. Przykryj ściereczką i odstaw na minimum 1 godzinę do wyrośnięcia w ciepłym miejscu.\n\nWyrośnięte ciasto przełóż na oprószony mąką blat, krótko zagnieć i podziel na 2 części. Każdą część rozwałkuj delikatnie na placek o wymiarach ok. 30 x 30 cm.\n\nNadzienie: placki posmaruj miękkim masłem (70 g), następnie posyp mieszanką cynamonu, cukru wanilinowego i cukru trzcinowego. Opcjonalnie dodaj skórkę startą z 1/2 cytryny.\n\nZwiń oba placki w roladki i pokrój każdą na 10 plasterków (ok. 2 cm). Ułóż bułeczki na blaszce wyłożonej papierem do pieczenia i odstaw na 15-20 minut do ponownego wyrośnięcia.\n\nPiekarnik nagrzej do 180°C. Wierzch bułeczek posmaruj roztrzepanym jajkiem i piecz ok. 20 minut, aż będą złote.\n\nW tej wersji pomijamy lukier i podajemy cynamonki bez polewy.`,
    ingredients: [
      { name: "Mąka (flour)", quantity: 250, unit: "g" },
      { name: "Drożdże (yeast)", quantity: 15, unit: "g" },
      { name: "Cukier (sugar)", quantity: 25, unit: "g" },
      { name: "Sól (salt)", quantity: 5, unit: "g" },
      { name: "Mleko (milk)", quantity: 125, unit: "ml" },
      { name: "Jajka (eggs)", quantity: 1, unit: "szt" },
      { name: "Masło (butter)", quantity: 140, unit: "g" },
      { name: "Cynamon mielony (ground cinnamon)", quantity: 3, unit: "łyżka" },
      { name: "Cukier wanilinowy (vanilla sugar)", quantity: 2, unit: "łyżka", optional: true },
      { name: "Cukier trzcinowy (brown sugar)", quantity: 50, unit: "g" },
    ],
  },
  {
    id: "toltottpaprika",
    name: "Stuffed paprika",
    description: "Papryki faszerowane mięsem i ryżem w sosie pomidorowym",
    recipeUrl: "https://www.mindmegette.hu/recept/a-legfinomabb-toltott-paprika",
    imageUrl: "https://cdn.mindmegette.hu/2024/04/Yy6bop9pA-Pdkj7w67xf2jH4CWwPZORMrRxlzxDwrpA/fill/0/0/no/1/aHR0cHM6Ly9jbXNjZG4uYXBwLmNvbnRlbnQucHJpdmF0ZS9jb250ZW50Lzc2ZTIzMzQ5MGI4ODRiYzk4NzI3NWYwYmFkZTM1Y2Rh.webp",
    content: `Ryż ugotuj do połowy miękkości i odstaw.\n\nDrobno posiekaną cebulę i przeciśnięty czosnek zeszklij na 2 łyżkach oliwy z oliwek. Zdejmij z ognia, dodaj mieloną paprykę i wymieszaj. Gdy masa lekko przestygnie, połącz ją z mięsem mielonym i podgotowanym ryżem. Dopraw solą oraz świeżo mielonym pieprzem.\n\nPapryki umyj, usuń gniazda nasienne i napełnij farszem.\n\nSos pomidorowy: posiekaną cebulę podsmaż na niewielkiej ilości tłuszczu. Dodaj cukier i mąkę, dokładnie wymieszaj, następnie wlej przecier pomidorowy i wodę, cały czas mieszając. Dodaj świeże liście selera, dopraw solą i pieprzem.\n\nDo gotującego się sosu włóż faszerowane papryki i gotuj na małym ogniu przez 30-40 minut, aż farsz całkowicie zmięknie.\n\nW razie potrzeby dolej trochę wody lub bulionu, jeśli sos zbyt mocno odparuje.`,
    ingredients: [
      { name: "Ryż (rice)", quantity: 150, unit: "g" },
      { name: "Cebula (onion)", quantity: 2, unit: "szt" },
      { name: "Czosnek (garlic)", quantity: 1, unit: "ząbki" },
      { name: "Oliwa z oliwek (olive oil)", quantity: 26, unit: "g", note: "do farszu" },
      { name: "Oliwa z oliwek (olive oil)", quantity: 13, unit: "g", note: "do sosu" },
      { name: "Papryka mielona (ground paprika)", quantity: 1, unit: "łyżeczka" },
      { name: "Mięso mielone wieprzowe (ground pork)", quantity: 500, unit: "g" },
      { name: "Papryka do faszerowania (stuffing peppers)", quantity: 8, unit: "szt" },
      { name: "Cukier (sugar)", quantity: 25, unit: "g" },
      { name: "Mąka (flour)", quantity: 25, unit: "g" },
      { name: "Passata pomidorowa (tomato passata)", quantity: 1000, unit: "ml" },
      { name: "Woda (water)", quantity: 500, unit: "ml" },
      { name: "Liście selera (celery leaves)", quantity: 1, unit: "pęczek" },
    ],
  },
  {
    id: "pizza",
    name: "Pizza",
    description: "Pizza-style dough with mixed cheese and meat toppings",
    recipeUrl: "https://wykop.pl/wpis/25705985/zauwazylem-ze-notorycznie-przycwszelakiego-rodzaju",
    imageUrl: "https://kuchnialidla.pl/img/PL/1250x700/ca3b2921fd4b-b8808cab9e10-kw42-2023-lidl-pizza-neapolitanska-przepis-na-klasyczna-neapolitane.webp",
    ingredients: [
      { name: "Mąka 00 (00 flour)", quantity: 1000, unit: "g" },
      { name: "Drożdże (yeast)", quantity: 5, unit: "g" },
      { name: "Sól (salt)", quantity: 20, unit: "g" },
      { name: "Woda (water)", quantity: 500, unit: "ml" },
      { name: "Oliwa z oliwek (olive oil)", quantity: 15, unit: "g" },
      { name: "Cebulki marynowane (pickled onions)", quantity: 1, unit: "op", optional: true },
      { name: "Feta", quantity: 1, unit: "op", optional: true },
      { name: "Kukurydza w puszce (corn)", quantity: 1, unit: "op", optional: true },
      { name: "Mozzarella", quantity: 3, unit: "op" },
      { name: "Salami", quantity: 1, unit: "op", optional: true },
      { name: "Boczek (sliced bacon)", quantity: 1, unit: "op", optional: true },
      { name: "Szynka (ham)", quantity: 1, unit: "op", optional: true },
      { name: "Cebula (onion)", quantity: 1, unit: "szt", optional: true },
      { name: "Ser żółty (yellow cheese)", quantity: 1, unit: "op", optional: true, note: "cheap cheese tarty / grated" },
      { name: "Ser góralski (smoked cheese)", quantity: 1, unit: "op", optional: true },
      { name: "Żurawina (cranberries)", quantity: 1, unit: "op", optional: true },
    ],
  },
  {
    id: "idea-cereals-milk",
    name: "Cereals and milk",
    description: "Quick breakfast or dinner",
    imageUrl: "https://i.imgur.com/s7JefS2.jpg",
    kind: "idea",
    ingredients: [
      { name: "Płatki Yellow", quantity: 1, unit: "op" },
      { name: "Płatki Cinni Minis", quantity: 1, unit: "op", optional: true },
      { name: "Mleko (milk)", quantity: 500, unit: "ml" },
    ],
  },
  {
    id: "idea-sandwiches",
    name: "Sandwiches",
    description: "Quick breakfast or dinner",
    imageUrl: "https://www.kwestiasmaku.com/sites/v123.kwestiasmaku.com/files/grzanki-z-jajecznica-grzybami-oliwa-truflowa.jpg",
    kind: "idea",
    ingredients: [
      { name: "Cheddar", quantity: 1, unit: "op" },
      { name: "Chleb (bread)", quantity: 0.2, unit: "op" },
      { name: "Szynka (ham)", quantity: 1, unit: "op" },
      { name: "Kiełbasa (sausage)", quantity: 1, unit: "op", optional: true },
      { name: "Masło (butter)", quantity: 20, unit: "g" },
      { name: "Pomidor (tomato)", quantity: 2, unit: "szt" },
      { name: "Kiełki (sprouts)", quantity: 1, unit: "op" },
    ],
  },
  {
    id: "idea-korozott",
    name: "Körözött",
    description: "Węgierska pasta z twarogu do pieczywa i warzyw",
    imageUrl: "https://cdn.mindmegette.hu/2024/04/df1VYJqQYwcvqAHTp0Sy7yJLZeFhjb03V343Z7krT1E/fill/0/0/no/1/aHR0cHM6Ly9jbXNjZG4uYXBwLmNvbnRlbnQucHJpdmF0ZS9jb250ZW50Lzk1ZmQzMjZhZTBiMjQ0ODA5YTY3ZjE1ZDA2ZjViMTcw.webp",
    recipeUrl: "https://www.mindmegette.hu/recept/hazi-korozott-egyszeruen",
    content: "Na początku rozgnieć twaróg w misce widelcem lub tłuczkiem do ziemniaków. Dodaj masło w temperaturze pokojowej oraz śmietanę i dokładnie wymieszaj.\n\nObierz czerwoną cebulę i zetrzyj ją do masy twarogowej. Dodaj kminek mielony, paprykę mieloną oraz sól, następnie wszystko starannie połącz.\n\nGotową pastę odstaw do lodówki na kilka godzin, żeby smaki się przegryzły.\n\nPodawaj schłodzony körözött posypany świeżą pietruszką, najlepiej z pieczywem i świeżymi warzywami.",
    kind: "idea",
    ingredients: [
      { name: "Twaróg (quark/cottage cheese)", quantity: 1, unit: "op" },
      { name: "Masło (butter)", quantity: 50, unit: "g" },
      { name: "Śmietana (sour cream)", quantity: 100, unit: "ml" },
      { name: "Czerwona cebula (red onion)", quantity: 1, unit: "szt" },
      { name: "Kminek mielony (ground caraway)", quantity: 1, unit: "g" },
      { name: "Papryka mielona (ground paprika)", quantity: 2, unit: "łyżeczka" },
      { name: "Sól (salt)", quantity: 2, unit: "g" },
      { name: "Pietruszka (parsley)", quantity: 0.5, unit: "pęczek", optional: true },
      { name: "Chleb (bread)", quantity: 0.2, unit: "op" },
    ],
  },
  {
    id: "idea-twarozek",
    name: "Twarożek",
    description: "Quick cottage cheese spread",
    imageUrl: "https://cdn.aniagotuje.com/pictures/articles/2022/04/27603128-v-1500x1500.jpg",
    recipeUrl: "https://aniagotuje.pl/przepis/twarozek",
    kind: "idea",
    ingredients: [
      { name: "Twaróg (quark/cottage cheese)", quantity: 1, unit: "op" },
      { name: "Jogurt naturalny (plain yogurt)", quantity: 150, unit: "ml" },
      { name: "Rzodkiewki (radishes)", quantity: 1, unit: "op" },
      { name: "Szczypiorek (chives)", quantity: 1, unit: "op" },
      { name: "Sól (salt)", quantity: 2, unit: "g" },
      { name: "Pieprz (pepper)", quantity: 1, unit: "g" },
      { name: "Chleb (bread)", quantity: 0.2, unit: "op" },
    ],
  },
  {
    id: "idea-jajecznica",
    name: "Jajecznica",
    description: "Quick scrambled eggs idea",
    imageUrl: "https://cdn.aniagotuje.com/pictures/articles/2022/01/23318618-v-1500x1500.jpg",
    kind: "idea",
    ingredients: [
      { name: "Jajka (eggs)", quantity: 4, unit: "szt" },
      { name: "Szynka (ham)", quantity: 1, unit: "op" },
      { name: "Masło (butter)", quantity: 10, unit: "g" },
      { name: "Chleb (bread)", quantity: 0.2, unit: "op" },
      { name: "Cebula (onion)", quantity: 1, unit: "szt" },
    ],
  },
  {
    id: "idea-nalesniki",
    name: "Naleśniki",
    kind: "idea",
    description: "Polish crepes with jam or sweetened quark",
    imageUrl: "https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?w=480&q=80",
    content: `Przygotuj ciasto: wymieszaj mleko, jajka i mąkę na gładkie. Dopraw solą. Pozostaw na 20 minut.\n\nRozgrzej patelnię z powłoką i lekko ją pomaść. Wlej cienką warstwę ciasta i przechyl patelnię równomiernie. Smaż do złota, przewróć i smaż drugą stronę. Odłóż.\n\nJeśli dżem: rozłóż dżem na każdą naleśnik i zwijaj.\n\nJeśli twaróg: wymieszaj twaróg z cukrem i jogurtem na odpowiednią słodycz. Rozłóż na naleśnik i złóż.\n\nPodaj ciepłe, posypane cukrem pudrem, z dżemem lub śmietaną.`,
    ingredients: [
      { name: "Mleko (milk)", quantity: 500, unit: "ml" },
      { name: "Jajka (eggs)", quantity: 2, unit: "szt" },
      { name: "Mąka (flour)", quantity: 500, unit: "g" },
      { name: "Dżem (jam)", quantity: 1, unit: "op", optional: true },
      { name: "Twaróg (quark/cottage cheese)", quantity: 1, unit: "op", optional: true },
      { name: "Jogurt naturalny (plain yogurt)", quantity: 200, unit: "ml", optional: true },
    ],
  },
  {
    id: "idea-snacks",
    name: "Snacks",
    description: "Quick and easy snack ideas",
    imageUrl: "https://cablevey.com/wp-content/uploads/2020/11/The-Complete-Guide-on-Snack-Foods.jpg",
    kind: "idea",
    ingredients: [
      { name: "Crisps (chips)", quantity: 1, unit: "op" },
      { name: "Vegetable chips", quantity: 1, unit: "op" },
      { name: "Jogurty (yogurts)", quantity: 2, unit: "szt" },
      { name: "Sth sweet for miauka", quantity: 1, unit: "op" },
      { name: "Marchew (carrots)", quantity: 3, unit: "szt" },
      { name: "Nice fruits for miauka", quantity: 2, unit: "szt" },
      { name: "Woda (water)", quantity: 6, unit: "szt" },
    ],
  },
];
