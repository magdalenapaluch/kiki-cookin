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
  "jogurt naturalny": "jogurt grecki",
  "czerwona cebula": "cebula czerwona",
  "red onion": "cebula czerwona",
  onion: "cebula",
  rzodkiewki: "rzodkiewka",
  radishes: "rzodkiewka",
  chives: "szczypiorek",
  parsley: "pietruszka",
  petrezselyem: "pietruszka",
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
