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

function normalizeForLookup(value: string): string {
  return value
    .replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (character) => POLISH_CHAR_MAP[character] ?? character)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Add ingredient image urls here. Keys should be normalized names.
const INGREDIENT_IMAGE_URLS: Record<string, string> = {
  "bulka tarta": "https://res.cloudinary.com/dj484tw6k/image/upload/v1715381353/790_8.png",
  "pita bread": "https://scontent-waw2-2.xx.fbcdn.net/v/t39.30808-6/607857048_1364990885671603_2912136071666117098_n.jpg?stp=cp6_dst-jpg_s1080x2048_tt6&_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_ohc=Eh8xPNiAOL8Q7kNvwEwx8Zi&_nc_oc=AdpcK4x9j-kuVPeIUSpHExrMGF21w5xBoxJxTqe2I7lLISs0_4A5qg1O6yhaYlPR-Fc&_nc_zt=23&_nc_ht=scontent-waw2-2.xx&_nc_gid=-jETEaNHUvzij-Csr_vQkw&_nc_ss=7a3a8&oh=00_Af1vCEw5YssnJoW00LSfBkzfN7_LpQEt7_-BXrYe0MkL-w&oe=69E9A882",
  "sucha bulka": "https://imgproxy-retcat.assets.schwarz/1n6n03Enur5CWRQWJ7NiruZ9h1FOnPA_S6eYvV_oTPI/sm:1/exar:1:ce/w:1500/h:1125/cz/M6Ly9wcm9kLWNhd/GFsb2ctbWVkaWEvcGwvMS84NTEwMkZGOUUyM0ExQTJDQjc2QkNENkU/0REI0RDFCQzA4NUFBNzQ2QzJBMDA3OTlBQTIxQzY4MjU1RTMzQTVBLmpwZw.jpg",
  tortille: "https://images.openfoodfacts.org/images/products/003/659/532/8366/front_hr.3.full.jpg",
  "fasola heinz w puszce": "https://wykop.pl/cdn/c3201142/comment_1606660356IbIDrElu7OvvGucqsSMgmG.jpg",
  "passata pomidorowa": "https://www.lidl.pl/static/assets/KW41_italiamo-1150x1150-Passata_pomidorowa-593562.png",
  "cebulka marynowana": "https://smak.com.pl/wp-content/uploads/2016/11/Cebulka-perlowa_290g_SLOIK.png",
  corn: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY8xe4KY5IWaKxXN_wlAkMGkGZFN4pxXMUxQ&s",
  ryz: "https://www.dine4fit.pl/file/image/foodstuff/2643d56b9492432a9390543008c55e9d/703249e0395b4e2eb9f6dfecf78efd18",
  zurawina: "https://image.ceneostatic.pl/data/products/54630547/e5a6a175-b409-4915-a7bd-55ada298d120_i-targroch-zurawina-suszona-swieza-1kg.jpg",
  kminek: "https://www.kamis.pl/-/media/project/oneweb/kampl22/product-packaging/2022-12/kminek_mielony_800.png?rev=d553a7392d114190be70a30eafd697c5&vd=20250321T212745Z&extension=webp&hash=CAE9B665433D91A5946D07ADE5363C23",
  "lisc laurowy": "https://delio.com.pl/_next/image?url=https%3A%2F%2Fimages.prod.lait.app%2Fpim_prod%2Fproduct-images%2Fe_8_b_7_e8b70a8e3544c6b524b80038e9d44dcf81789351_cc71fbef6a8b97eef3545dc2722674bba0bfed41-large.png&w=1200&q=75",
  "ciasto na tarte": "https://res.cloudinary.com/dj484tw6k/image/upload/v1499966206/bb/83565.png",
  "ogorki kiszone": "https://urbanek.com.pl/zjed-content/uploads/2019/06/Ogorki-kiszone-920g-web-e1571050357501-426x560.jpg",
  boczek: "https://res.cloudinary.com/dj484tw6k/f_auto,q_auto,c_pad,b_white,w_524,h_524/v1648482796/a5b209a3-d491-4b9b-b17d-a8690b952ee5.jpg",
  mozzarella: "https://images.openfoodfacts.org/images/products/405/648/909/1752/front_pl.19.full.jpg",
  "ser goralski": "https://mlekovitka.pl/2702-large_default/ser-mini-golka-zakopianska-wedzona-160-g.jpg",
  smietanka: "https://res.cloudinary.com/dj484tw6k/image/upload/v1678146874/12586.png",
  "jogurt grecki": "https://res.cloudinary.com/dj484tw6k/image/upload/v1593174999/101897_5.png",
  "maka 00": "https://zakupy.auchan.pl/images-v3/91f3b8f0-9eaa-434b-8554-b0f1db433c99/7f32dbeb-6336-4e19-8b8b-b9be48edc048/500x500.jpg",
  skrobia: "https://zakupy.auchan.pl/images-v3/91f3b8f0-9eaa-434b-8554-b0f1db433c99/e9266738-e101-49f7-8a76-c1b8018e6f12/1280x1280.webp",
  "platki yellow": "https://scontent-waw2-1.xx.fbcdn.net/v/t39.30808-6/577234562_1516146880274322_9196850346239594932_n.jpg?stp=cp6_dst-jpg_s1080x2048_tt6&_nc_cat=109&ccb=1-7&_nc_sid=7b2446&_nc_ohc=mm19EQEm_eYQ7kNvwEHPcfj&_nc_oc=Adpro_4tGsT7cu74Tvv8rbnuz4fGZqU_tG1rzrwGQTIy4qmsntzGyT3kTxhRH78u_4I&_nc_zt=23&_nc_ht=scontent-waw2-1.xx&_nc_gid=tMcGHXBUuRFCp6ISB1TRhw&_nc_ss=7a3a8&oh=00_Af3UCGCYdOVXC7pJq_b8qlHsp9Te2tIp8GV4E3radBJvwQ&oe=69E9CFBA",
  cebula: "https://sklep.onix.pl/wp-content/uploads/2021/01/cebula-%C5%BC%C3%B3%C5%82ta.jpg",
  "cebula czerwona": "https://bi.im-g.pl/im/47/1a/18/z25273415IER,Czerwona-cebula.jpg",
  rzodkiewka: "https://azcdn.doz.pl/image/d/wiki-herb/6e895cb6-scale-795x350.png",
  szczypiorek: "https://www.kowalczyk.olsztyn.pl/szczypiorek.2.jpg",
  pietruszka: "https://bazarekpolski.pl/wp-content/uploads/2020/12/natka-pietruszki1.jpg",
  bread: "https://cdn.aniagotuje.com/pictures/articles/2020/03/2568759-v-1500x1500.jpg",
  cukinia: "https://cdn.galleries.smcloud.net/t/galleries/gf-obqQ-YFmm-8pwW_cukinia-wartosci-odzywcze-i-przepisy-na-dania-z-cukinii-1920x1080-nocrop.jpg",
  czosnek: "https://jelitaiprzyprawy.pl/3116-large_default/czosnek-swiezy-glowki-na-wage-1-kg.jpg",
  "liscie selera": "https://cebule-kwiatowe.pl/files/fotob/product-6750.jpg",
  ogorek: "https://bazarekpolski.pl/wp-content/uploads/2020/11/ogorek-szklarniowy.jpg",
  papryka: "https://res.cloudinary.com/dj484tw6k/f_auto,q_auto,c_pad,b_white,w_288,h_288/v1499864246/be/3444.jpg",
  pomidor: "https://przyprawomat.pl/wp-content/uploads/2022/07/pomidorro-1024x1024.png",
  "pomidorki koktajlowe": "https://topsklepy.sklepkupiec.pl/101070-thickbox_default/pomidory-koktajlowe-250g.jpg",
  ziemniaki: "https://zagrodaboryny.pl/userdata/public/news/images/12.jpg",
  "pomidory w puszce": "https://res.cloudinary.com/dj484tw6k/image/upload/v1724021177/4771.png",
  "makaron spaghetti": "https://luzem.eu/public/upload/catalog/product/1081/minigallery/thumb_xlarge_1706012827IMG_0081_min.JPG",
  cynamon: "https://res.cloudinary.com/dj484tw6k/f_auto,q_auto,c_pad,b_white,w_524,h_524/v1684191299/141353.png",
  majeranek: "https://www.kamis.pl/-/media/project/oneweb/kampl22/product-packaging/2022-12/majeranek_800.png?rev=4c8dbbef3f124ef08801d996fd1d28c1&vd=20250321T212745Z&extension=webp&hash=DA4157FE29E90BA88F539FB317E3EDEA",
  ocet: "https://www.drogeria-ekologiczna.pl/38087-large_default/ocet-spirytusowy-10-butelka-szklana-750-ml-octim.jpg",
  "papryka mielona": "https://res.cloudinary.com/dj484tw6k/f_auto,q_auto,c_pad,b_white,w_524,h_524/v1717022775/146933.png",
  "pieprz mielony": "https://res.cloudinary.com/dj484tw6k/f_auto,q_auto,c_pad,b_white,w_524,h_524/v1684191304/141330.png",
  sol: "https://res.cloudinary.com/dj484tw6k/f_auto,q_auto,c_pad,b_white,w_524,h_524/v1711013888/ceb7274f-e45c-4e6c-aed3-6a93a6b3b441.png",
  "lopatka wieprzowa": "https://res.cloudinary.com/dj484tw6k/image/upload/v1575617051/be/118649.jpg",
  "mieso mielone": "https://upload.wikimedia.org/wikipedia/commons/5/55/%D0%A4%D0%B0%D1%80%D1%88.jpg",
  "piersi z kurczaka": "https://www.kowalczyk.olsztyn.pl/filet-z-piersi-kurczaka.2.jpg",
  "kapusta kiszona": "https://res.cloudinary.com/dj484tw6k/image/upload/v1748327479/38f3094d-dea5-4079-95f5-8ae5c79824db.jpg",
  kielki: "https://images.openfoodfacts.org/images/products/590/777/144/3218/front_pl.8.400.jpg",
  szynka: "https://res.cloudinary.com/dj484tw6k/image/upload/v1713912386/107535.png",
  kielbasa: "https://kociolkowanie.pl/image/cache/catalog/kielbasa-wegierska-toalmasi%20(2)-900x900.jpg",
  salami: "https://res.cloudinary.com/dj484tw6k/image/upload/v1689029366/139457.png",
  "ser zolty": "https://res.cloudinary.com/dj484tw6k/f_auto,q_auto,c_pad,b_white,w_524,h_524/v1675468017/94905.png",
  twarog: "https://www.lidl.pl/static/assets/1497-36-20-Pilos-Twarog-klinek-poltusty-250g-282636.jpg",
  feta: "https://www.dine4fit.pl/file/image/foodstuff/41515656226142938fb30aba8f68b075/9fb6da8b38e34556857019ca9b4e088c",
  drozdze: "https://res.cloudinary.com/dj484tw6k/image/upload/v1740008757/81789.png",
  "jogurt naturalny": "https://mlekovitka.pl/2918-large_default/jogurt-polski-naturalny-350-g.jpg",
  maslo: "https://mlekovita.com.pl/storage/products/113/6952maslopolskie200gjpg.jpg",
  smietana: "https://res.cloudinary.com/dj484tw6k/image/upload/v1692226091/1277_5.png",
  cukier: "https://sklep.diamant.pl/media/catalog/product/cache/edda0e4e0e9ac3ea97fe4a4283971a1f/d/i/diamant_cukier_bia_y_1_kg_1_.png",
  "cukier trzcinowy": "https://sklep.diamant.pl/media/catalog/product/cache/edda0e4e0e9ac3ea97fe4a4283971a1f/d/i/diam_trzcinowy_papier_1_kg_700.png",
  jajka: "https://sklepkupiec.pl/20985-large_default/bulowice-jajka-10-szt-l-wolny-wybieg.jpg",
  maka: "https://res.cloudinary.com/dj484tw6k/f_auto,q_auto,c_pad,b_white,w_524,h_524/v1647561067/8828_8.png",
  mleko: "https://res.cloudinary.com/dj484tw6k/image/upload/v1634597320/3267_8.png",
  oliwa: "https://sklep.brat.pl/userdata/public/gfx/16830/Oliwa-z-oliwek---Extra-Virgin-500ml.webp",
  "cukier wanilinowy": "https://res.cloudinary.com/dj484tw6k/image/upload/v1690843723/469.png",
  dzem: "https://www.pakomarket.pl/wp-content/uploads/2025/11/LOWICZ-Dzem-Truskawkowy-Sloik-450g.png",
  "cinni minnis": "https://res.cloudinary.com/dj484tw6k/image/upload/v1730245622/141303.png",
  "cinni minis": "https://res.cloudinary.com/dj484tw6k/image/upload/v1730245622/141303.png",
  cheddar: "https://euroser.pl/wp-content/uploads/2022/10/FEOEN5630-Cheddar-Red-scaled.webp",
  woda: "https://upload.wikimedia.org/wikipedia/commons/0/06/Water_glass.jpg",
};

const IMAGE_ALIASES: Record<string, string> = {
  breadcrumbs: "bulka tarta",
  pita: "pita bread",
  tortilla: "tortille",
  "fasola heinz": "fasola heinz w puszce",
  passata: "passata pomidorowa",
  "cebulki marynowane": "cebulka marynowana",
  "kukurydza w puszce": "corn",
  ry: "ryz",
  rice: "ryz",
  mozarella: "mozzarella",
  tejszin: "smietanka",
  "czerwona cebula": "cebula czerwona",
  "red onion": "cebula czerwona",
  onion: "cebula",
  rzodkiewki: "rzodkiewka",
  radishes: "rzodkiewka",
  chives: "szczypiorek",
  parsley: "pietruszka",
  petrezselyem: "pietruszka",
  "mieso mielone wieprzowe": "mieso mielone",
  "piersi kurczaka": "piersi z kurczaka",
  "filet z kurczaka": "piersi z kurczaka",
  chedder: "cheddar",
  butter: "maslo",
  jajko: "jajka",
  egg: "jajka",
  eggs: "jajka",
  flour: "maka",
  milk: "mleko",
  sugar: "cukier",
  jam: "dzem",
  chleb: "bread",
  pieprz: "pieprz mielony",
};

export function getIngredientImageUrl(name: string): string | undefined {
  const normalized = normalizeForLookup(name);

  const aliasTarget = IMAGE_ALIASES[normalized];
  if (aliasTarget && INGREDIENT_IMAGE_URLS[aliasTarget]) {
    return INGREDIENT_IMAGE_URLS[aliasTarget];
  }

  if (INGREDIENT_IMAGE_URLS[normalized]) {
    return INGREDIENT_IMAGE_URLS[normalized];
  }

  for (const [key, url] of Object.entries(INGREDIENT_IMAGE_URLS)) {
    if (normalized.includes(key)) {
      return url;
    }
  }

  return undefined;
}
