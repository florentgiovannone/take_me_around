import type { Artwork } from "../artworks"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type ArtworkSlug = "overcast" | "study-for-toali" | "stars-wrapped-in-flesh"

export type ArtworkLocaleFields = {
  kicker: string
  medium: string
  section: string
  status: string
  imageAlt: string
  extraImageAlts: string[]
  documentLabel: string | null
  standfirst: string
  paragraphs: string[]
}

const FR: Record<ArtworkSlug, ArtworkLocaleFields> = {
  overcast: {
    kicker: "Peinture",
    medium: "Acrylique, huile, encre et encaustique sur lin",
    section: "D’artiste à artiste",
    status: "Disponible",
    imageAlt: "Paul Robas, Overcast, 2026",
    extraImageAlts: ["Paul Robas, Overcast, 2026, vue d’installation"],
    documentLabel: "Biographie de l’artiste",
    standfirst:
      "Robas compose Overcast à partir de photographies de ses archives, retouchées et collées jusqu’à ce qu’un visage ne tienne plus en place.",
    paragraphs: [
      "Les images passent par un appareil photo, un travail numérique, puis une projection ou un transfert sur lin. Ce qui arrive sur la toile est flou, dédoublé, superposé ou en partie caché.",
      "Il utilise l’encaustique, un pigment posé sur de la cire, une méthode qu’il a d’abord rencontrée dans les portraits du Fayoum de l’époque romaine. La cire laisse une surface pâle et évanescente, qualité qu’il cherche dans l’image.",
      "Le visage anonyme est moins une ressemblance figée qu’un lieu où la mémoire et une vie intérieure affleurent. Présenté par Alice Amati dans D’artiste à artiste à Frieze London. Inventaire PR075.",
    ],
  },
  "study-for-toali": {
    kicker: "Dessin",
    medium: "Dessin au noir de fumée sur tissu",
    section: "D’artiste à artiste",
    status: "Disponible",
    imageAlt: "Jorge González Santos, Study for Toali, 2021",
    extraImageAlts: [
      "Jorge González Santos, Study for Toali, détail",
      "Jorge González Santos, Study for Toali, autre vue",
    ],
    documentLabel: null,
    standfirst: "",
    paragraphs: [
      "Les dessins au noir de fumée de González Santos appartiennent à une série en cours intitulée Toali, d’après les pierres taïnos sculptées à trois pointes. Ces objets autochtones servaient à reconnaître les esprits ancestraux et d’offrandes pour les cultures. Les représentations de ces pierres, parmi d’autres symboles et motifs taïnos, sont réalisées au noir de fumée, un pigment noir tiré de la suie que l’artiste recueille sur une lampe à huile dans son atelier. Le pigment rappelle la documentation photographique des enquêtes archéologiques menées dans les Caraïbes au début du XXe siècle.",
    ],
  },
  "stars-wrapped-in-flesh": {
    kicker: "Œuvres sur papier",
    medium: "Aquarelle et encre sur papier de mûrier",
    section: "L’univers du code",
    status: "Disponible",
    imageAlt: "Karim Boumjimar, Stars wrapped in flesh, 2025",
    extraImageAlts: [],
    documentLabel: "CV de l’artiste",
    standfirst:
      "La présentation de Boumjimar à Frieze London traite le corps comme un code façonné par le désir, le mythe, les médias et les marques qu’une société y laisse.",
    paragraphs: [
      "Des céramiques accompagnent une peinture murale réalisée sur les cloisons du stand. Dans ce cadre, des pièces telles que Deep Leopard, 2025, se lisent comme les traces d’un corps et d’une société en transformation. Stars wrapped in flesh est une aquarelle et encre sur papier de mûrier, inventaire BOUM-240019.",
      "Les figures sont hybrides : amants, sirènes, diables et êtres mi-humains mi-animaux, issus de la parenté queer, de la mythologie et des images de dévotion. Les distinctions entre masculin et féminin, humain et bête, sacré et grotesque se défont.",
      "Les décors sous-marins portent la même idée de fluidité jusque dans l’identité. L’œuvre a une portée politique : elle marque à la fois la résistance des communautés et la pression qu’elles continuent de subir.",
      "Les expositions personnelles récentes comprennent Bodies under Construction, Møstings, Frederiksberg (2026) ; Rites of Affection, Lahti Museum of Visual Arts Malva (2026) ; Pandemonium Paradiso, O-Overgaden, Copenhague (2025) ; Drawings from the Hotel, Poriginal Galleria, Pori Art Museum (2025) ; et Alien Water, Art Hub Copenhagen (2021). Les expositions collectives comprennent Beauty Is the Best Defense, Jessica Silverman, San Francisco (2026) ; Stockholm Cosmologies, Liljevalchs, Stockholm (2025) ; Kultuur, TINA, Londres (2025) ; Queer Ecologies, Centro de Arte la Panera, Lleida (2023) ; et Psychopathia Sexualis, O-Overgaden, Copenhague (2021).",
      "Présenté par TINA dans L’univers du code à Frieze London.",
    ],
  },
}

const JA: Record<ArtworkSlug, ArtworkLocaleFields> = {
  overcast: {
    kicker: "絵画",
    medium: "リネンにアクリル、油彩、インク、エンカウスティック",
    section: "アーティストからアーティストへ",
    status: "販売中",
    imageAlt: "Paul Robas、Overcast、2026年",
    extraImageAlts: ["Paul Robas、Overcast、2026年、展示風景"],
    documentLabel: "作家略歴",
    standfirst:
      "ロバスは自身のアーカイブの写真を編集し、コラージュして、顔が静止しなくなるまで組み立て、Overcast を制作している。",
    paragraphs: [
      "画像はカメラを通り、デジタル作業を経て、リネンへの投影または転写に至る。キャンバスに残るものは、ぼやけ、二重になり、重なり、あるいは一部が隠されている。",
      "彼が使うエンカウスティックは、蝋の上に顔料を置く技法で、ローマ時代のファイユームのミイラ肖像で最初に出会った。蝋は淡く褪せていく表面を残し、それが彼が画像に求める質である。",
      "無名の顔は固定された肖像というより、記憶と内面が通り抜ける場所である。Frieze London の「アーティストからアーティストへ」にて Alice Amati が展示。作品番号 PR075。",
    ],
  },
  "study-for-toali": {
    kicker: "ドローイング",
    medium: "布にランプブラックの素描",
    section: "アーティストからアーティストへ",
    status: "販売中",
    imageAlt: "Jorge González Santos、Study for Toali、2021年",
    extraImageAlts: [
      "Jorge González Santos、Study for Toali、部分",
      "Jorge González Santos、Study for Toali、別の角度",
    ],
    documentLabel: null,
    standfirst: "",
    paragraphs: [
      "ゴンサレス・サントスのランプブラックによる素描は、三点のタイノ族の石彫にちなむ進行中のシリーズ Toali に属する。これらの先住民の器物は祖霊を認め、作物の栽培への供物として用いられた。彫られた石と他のタイノの記号や意匠の描写は、ランプブラック、すなわち煤から作る黒い顔料で描かれる。作家はアトリエのオイルランプから煤を採取する。その顔料は、20世紀初頭にカリブ海で行われた考古学調査の写真記録を想起させる。",
    ],
  },
  "stars-wrapped-in-flesh": {
    kicker: "紙の作品",
    medium: "楮紙に水彩とインク",
    section: "コード・ユニバース",
    status: "販売中",
    imageAlt: "Karim Boumjimar、Stars wrapped in flesh、2025年",
    extraImageAlts: [],
    documentLabel: "作家経歴",
    standfirst:
      "ブムジマルの Frieze London での発表は、身体を、欲望、神話、メディア、そして社会が残す痕跡によって形づくられるコードとして扱う。",
    paragraphs: [
      "セラミックはブースの壁に描かれた壁画とともに置かれる。その場では、Deep Leopard（2025年）のような器が、変わりゆく身体と社会の記録として読める。Stars wrapped in flesh は楮紙に水彩とインク、作品番号 BOUM-240019。",
      "人物は混成である。恋人、セイレーン、悪魔、人と動物のあいだの存在で、クィアな親族関係、神話、信仰の図像から引き出される。男性と女性、人間と獣、聖とグロテスクの区別はほどけていく。",
      "水中の情景は、同じ流動性の考えをアイデンティティへ運ぶ。作品には政治的な刃がある。共同体の抵抗と、その共同体がいまも受ける圧力の両方を記している。",
      "近年の個展には、Bodies under Construction、Møstings、フレゼリクスベア（2026年）、Rites of Affection、Lahti Museum of Visual Arts Malva（2026年）、Pandemonium Paradiso、O-Overgaden、コペンハーゲン（2025年）、Drawings from the Hotel、Poriginal Galleria、Pori Art Museum（2025年）、Alien Water、Art Hub Copenhagen（2021年）がある。グループ展には、Beauty Is the Best Defense、Jessica Silverman、サンフランシスコ（2026年）、Stockholm Cosmologies、Liljevalchs、ストックホルム（2025年）、Kultuur、TINA、ロンドン（2025年）、Queer Ecologies、Centro de Arte la Panera、リェイダ（2023年）、Psychopathia Sexualis、O-Overgaden、コペンハーゲン（2021年）がある。",
      "Frieze London の「コード・ユニバース」にて TINA が展示。",
    ],
  },
}

const AR: Record<ArtworkSlug, ArtworkLocaleFields> = {
  overcast: {
    kicker: "رسم",
    medium: "أكريليك وزيت وحبر وإنكوستيك على كتان",
    section: "من فنان إلى فنان",
    status: "متاح",
    imageAlt: "Paul Robas، Overcast، 2026",
    extraImageAlts: ["Paul Robas، Overcast، 2026، مشهد التركيب"],
    documentLabel: "سيرة الفنان",
    standfirst:
      "يصنع روباس Overcast من صور في أرشيفه الخاص، يحرّرها ويلصقها إلى أن يكفّ الوجه عن الثبات.",
    paragraphs: [
      "تمر الصور بكاميرا، ثم بعمل رقمي، ثم بإسقاط أو نقل على الكتان. ما يصل إلى القماش ضبابي أو مزدوج أو متراكب أو مخفي جزئيًا.",
      "يستخدم الإنكوستيك، وهو صباغ يُوضع فوق الشمع، وهي طريقة التقى بها أولًا في صور مومياوات الفيوم من العصر الروماني. يترك الشمع سطحًا شاحبًا آخذًا في التلاشي، وهذه هي الصفة التي يريدها من الصورة.",
      "الوجه المجهول أقل شبهًا ثابتًا منه موضعًا تعبر منه الذاكرة وحياة داخلية. من تقديم Alice Amati في «من فنان إلى فنان» في Frieze London. رقم الجرد PR075.",
    ],
  },
  "study-for-toali": {
    kicker: "رسم",
    medium: "رسم بأسود السخام على قماش",
    section: "من فنان إلى فنان",
    status: "متاح",
    imageAlt: "Jorge González Santos، Study for Toali، 2021",
    extraImageAlts: [
      "Jorge González Santos، Study for Toali، تفصيل",
      "Jorge González Santos، Study for Toali، زاوية أخرى",
    ],
    documentLabel: null,
    standfirst: "",
    paragraphs: [
      "رسوم غونثاليث سانتوس بأسود السخام جزء من سلسلة مستمرة بعنوان Toali، نسبةً إلى الحجارة التاينو المنحوتة ذات الرؤوس الثلاثة. استُخدمت هذه الأشياء الأصلية للاعتراف بالأرواح السلفية ولتقديم القرابين من أجل زراعة المحاصيل. تصوّر هذه الحجارة المنحوتة، إلى جانب رموز وتصاميم تاينو أخرى، بأسود السخام، وهو صباغ أسود مصنوع من السخام يجنيه الفنان من مصباح زيت في مرسمه. يستدعي الصباغ التوثيق الفوتوغرافي للتحقيقات الأثرية في الكاريبي في أوائل القرن العشرين.",
    ],
  },
  "stars-wrapped-in-flesh": {
    kicker: "أعمال على الورق",
    medium: "ألوان مائية وحبر على ورق التوت",
    section: "عالم الرمز",
    status: "متاح",
    imageAlt: "Karim Boumjimar، Stars wrapped in flesh، 2025",
    extraImageAlts: [],
    documentLabel: "السيرة الذاتية للفنان",
    standfirst:
      "يتعامل عرض بومجيمار في Frieze London مع الجسد بوصفه رمزًا تشكّله الرغبة والأسطورة والإعلام والعلامات التي يتركها المجتمع عليه.",
    paragraphs: [
      "تقف الخزفيات إلى جانب جدارية مرسومة على جدران الجناح. في هذا السياق، تُقرأ أوانٍ مثل Deep Leopard، 2025، بوصفها سجلات لجسد ومجتمع يتغيران. Stars wrapped in flesh ألوان مائية وحبر على ورق التوت، رقم الجرد BOUM-240019.",
      "الشخصيات هجينة: عشّاق وحوريات وشياطين وكائنات بين الإنسان والحيوان، مستمدة من القرابة الكويرية والأساطير وصور التعبد. تنفك الفروق بين المذكر والمؤنث، والإنسان والوحش، والمقدس والغرائبي.",
      "تحمل المشاهد تحت الماء الفكرة نفسها عن السيولة إلى الهوية. للعمل حد سياسي: يسجّل تحدي المجتمعات والضغط الذي ما تزال تلقاه.",
      "من المعارض الفردية الأخيرة: Bodies under Construction، Møstings، فريدريكسبيرغ (2026)؛ وRites of Affection، Lahti Museum of Visual Arts Malva (2026)؛ وPandemonium Paradiso، O-Overgaden، كوبنهاغن (2025)؛ وDrawings from the Hotel، Poriginal Galleria، Pori Art Museum (2025)؛ وAlien Water، Art Hub Copenhagen (2021). ومن المعارض الجماعية: Beauty Is the Best Defense، Jessica Silverman، سان فرانسيسكو (2026)؛ وStockholm Cosmologies، Liljevalchs، ستوكهولم (2025)؛ وKultuur، TINA، لندن (2025)؛ وQueer Ecologies، Centro de Arte la Panera، لاردة (2023)؛ وPsychopathia Sexualis، O-Overgaden، كوبنهاغن (2021).",
      "من تقديم TINA في «عالم الرمز» في Frieze London.",
    ],
  },
}

const DE: Record<ArtworkSlug, ArtworkLocaleFields> = {
  overcast: {
    kicker: "Malerei",
    medium: "Acryl, Öl, Tinte und Enkaustik auf Leinen",
    section: "Von Künstler zu Künstler",
    status: "Verfügbar",
    imageAlt: "Paul Robas, Overcast, 2026",
    extraImageAlts: ["Paul Robas, Overcast, 2026, Installationsansicht"],
    documentLabel: "Biografie des Künstlers",
    standfirst:
      "Robas macht Overcast aus Fotografien seines eigenen Archivs, bearbeitet und collagiert, bis ein Gesicht nicht mehr stillhält.",
    paragraphs: [
      "Die Bilder gehen durch eine Kamera, durch digitale Arbeit und dann durch Projektion oder Übertragung auf Leinen. Was auf der Leinwand ankommt, ist unscharf, verdoppelt, geschichtet oder teilweise verborgen.",
      "Er verwendet Enkaustik, Pigment auf Wachs, eine Methode, der er zuerst in den Mumienporträts von Fayum aus der römischen Zeit begegnete. Das Wachs hinterlässt eine blasse, verblassende Oberfläche, und genau diese Qualität sucht er im Bild.",
      "Das anonyme Gesicht ist weniger ein festes Abbild als ein Ort, an dem Erinnerung und ein Innenleben durchscheinen. Präsentiert von Alice Amati in Von Künstler zu Künstler auf der Frieze London. Inventar PR075.",
    ],
  },
  "study-for-toali": {
    kicker: "Zeichnung",
    medium: "Lampenschwarzzeichnung auf Stoff",
    section: "Von Künstler zu Künstler",
    status: "Verfügbar",
    imageAlt: "Jorge González Santos, Study for Toali, 2021",
    extraImageAlts: [
      "Jorge González Santos, Study for Toali, Detail",
      "Jorge González Santos, Study for Toali, andere Ansicht",
    ],
    documentLabel: null,
    standfirst: "",
    paragraphs: [
      "Die Lampenschwarzzeichnungen von González Santos gehören zu einer fortlaufenden Serie mit dem Titel Toali, benannt nach den dreispitzigen geschnitzten Steinen der Taíno. Diese indigenen Objekte dienten dazu, Ahnengeister anzuerkennen, und als Opfergaben für den Anbau. González’ Darstellungen dieser geschnitzten Steine, zusammen mit anderen Symbolen und Mustern der Taíno, entstehen mit Lampenschwarz, einem schwarzen Pigment aus Ruß, das der Künstler von einer Öllampe in seinem Atelier sammelt. Das Pigment erinnert an die fotografische Dokumentation archäologischer Untersuchungen in der Karibik zu Beginn des 20. Jahrhunderts.",
    ],
  },
  "stars-wrapped-in-flesh": {
    kicker: "Arbeiten auf Papier",
    medium: "Aquarell und Tinte auf Maulbeerpapier",
    section: "Das Code-Universum",
    status: "Verfügbar",
    imageAlt: "Karim Boumjimar, Stars wrapped in flesh, 2025",
    extraImageAlts: [],
    documentLabel: "Lebenslauf des Künstlers",
    standfirst:
      "Boumjimars Präsentation auf der Frieze London behandelt den Körper als einen Code, geformt von Begehren, Mythos, Medien und den Spuren, die eine Gesellschaft auf ihm hinterlässt.",
    paragraphs: [
      "Keramiken stehen neben einem Wandbild auf den Wänden des Stands. In diesem Zusammenhang lesen sich Gefäße wie Deep Leopard, 2025, als Aufzeichnungen eines Körpers und einer Gesellschaft im Wandel. Stars wrapped in flesh ist Aquarell und Tinte auf Maulbeerpapier, Inventar BOUM-240019.",
      "Die Figuren sind hybrid: Liebende, Sirenen, Teufel und Wesen zwischen Mensch und Tier, aus queerer Verwandtschaft, Mythologie und Andachtsbildern. Unterscheidungen zwischen männlich und weiblich, Mensch und Tier, heilig und grotesk lösen sich auf.",
      "Unterwasser-Settings tragen dieselbe Idee von Fluidität in die Identität. Die Arbeit hat eine politische Kante: Sie markiert sowohl den Widerstand von Gemeinschaften als auch den Druck, dem diese Gemeinschaften weiter begegnen.",
      "Zu den jüngeren Einzelausstellungen gehören Bodies under Construction, Møstings, Frederiksberg (2026); Rites of Affection, Lahti Museum of Visual Arts Malva (2026); Pandemonium Paradiso, O-Overgaden, Kopenhagen (2025); Drawings from the Hotel, Poriginal Galleria, Pori Art Museum (2025); und Alien Water, Art Hub Copenhagen (2021). Zu den Gruppenausstellungen gehören Beauty Is the Best Defense, Jessica Silverman, San Francisco (2026); Stockholm Cosmologies, Liljevalchs, Stockholm (2025); Kultuur, TINA, London (2025); Queer Ecologies, Centro de Arte la Panera, Lleida (2023); und Psychopathia Sexualis, O-Overgaden, Kopenhagen (2021).",
      "Präsentiert von TINA in Das Code-Universum auf der Frieze London.",
    ],
  },
}

const ES: Record<ArtworkSlug, ArtworkLocaleFields> = {
  overcast: {
    kicker: "Pintura",
    medium: "Acrílico, óleo, tinta y encáustica sobre lino",
    section: "De artista a artista",
    status: "Disponible",
    imageAlt: "Paul Robas, Overcast, 2026",
    extraImageAlts: ["Paul Robas, Overcast, 2026, vista de instalación"],
    documentLabel: "Biografía del artista",
    standfirst:
      "Robas hace Overcast a partir de fotografías de su propio archivo, editadas y collageadas hasta que un rostro deja de quedarse quieto.",
    paragraphs: [
      "Las imágenes pasan por una cámara, por un trabajo digital y luego por una proyección o una transferencia sobre lino. Lo que llega al lienzo está borroso, duplicado, superpuesto o en parte oculto.",
      "Usa encáustica, pigmento tendido sobre cera, un método que conoció primero en los retratos de momias de Fayum del periodo romano. La cera deja una superficie pálida y que se desvanece, que es la cualidad que busca en la imagen.",
      "El rostro anónimo es menos un parecido fijo que un lugar por el que pasan la memoria y una vida interior. Presentado por Alice Amati en De artista a artista en Frieze London. Inventario PR075.",
    ],
  },
  "study-for-toali": {
    kicker: "Dibujo",
    medium: "Dibujo con negro de humo sobre tela",
    section: "De artista a artista",
    status: "Disponible",
    imageAlt: "Jorge González Santos, Study for Toali, 2021",
    extraImageAlts: [
      "Jorge González Santos, Study for Toali, detalle",
      "Jorge González Santos, Study for Toali, otra vista",
    ],
    documentLabel: null,
    standfirst: "",
    paragraphs: [
      "Los dibujos con negro de humo de González Santos pertenecen a una serie en curso titulada Toali, llamada así por las piedras talladas taínas de tres puntas. Estos objetos indígenas servían para reconocer a los espíritus ancestrales y como ofrendas para el cultivo. Las representaciones de estas piedras talladas, entre otros símbolos y diseños taínos, se hacen con negro de humo, un pigmento negro obtenido del hollín que el artista recoge de una lámpara de aceite en su estudio. El pigmento recuerda la documentación fotográfica de las investigaciones arqueológicas del Caribe a principios del siglo XX.",
    ],
  },
  "stars-wrapped-in-flesh": {
    kicker: "Obras sobre papel",
    medium: "Acuarela y tinta sobre papel de morera",
    section: "El universo del código",
    status: "Disponible",
    imageAlt: "Karim Boumjimar, Stars wrapped in flesh, 2025",
    extraImageAlts: [],
    documentLabel: "CV del artista",
    standfirst:
      "La presentación de Boumjimar en Frieze London trata el cuerpo como un código formado por el deseo, el mito, los medios y las marcas que una sociedad deja en él.",
    paragraphs: [
      "Las cerámicas conviven con un mural pintado en las paredes del stand. En ese contexto, piezas como Deep Leopard, 2025, se leen como registros de un cuerpo y una sociedad que cambian. Stars wrapped in flesh es acuarela y tinta sobre papel de morera, inventario BOUM-240019.",
      "Las figuras son híbridas: amantes, sirenas, demonios y seres entre lo humano y lo animal, tomados del parentesco queer, la mitología y las imágenes devocionales. Las distinciones entre masculino y femenino, humano y bestia, sagrado y grotesco se deshacen.",
      "Los escenarios submarinos llevan la misma idea de fluidez a la identidad. La obra tiene un filo político: señala tanto la resistencia de las comunidades como la presión que esas comunidades siguen encontrando.",
      "Entre las exposiciones individuales recientes están Bodies under Construction, Møstings, Frederiksberg (2026); Rites of Affection, Lahti Museum of Visual Arts Malva (2026); Pandemonium Paradiso, O-Overgaden, Copenhague (2025); Drawings from the Hotel, Poriginal Galleria, Pori Art Museum (2025); y Alien Water, Art Hub Copenhagen (2021). Entre las colectivas están Beauty Is the Best Defense, Jessica Silverman, San Francisco (2026); Stockholm Cosmologies, Liljevalchs, Estocolmo (2025); Kultuur, TINA, Londres (2025); Queer Ecologies, Centro de Arte la Panera, Lleida (2023); y Psychopathia Sexualis, O-Overgaden, Copenhague (2021).",
      "Presentado por TINA en El universo del código en Frieze London.",
    ],
  },
}

const KO: Record<ArtworkSlug, ArtworkLocaleFields> = {
  overcast: {
    kicker: "회화",
    medium: "린넨에 아크릴, 유채, 잉크, 엔코스틱",
    section: "아티스트에서 아티스트로",
    status: "판매 가능",
    imageAlt: "Paul Robas, Overcast, 2026",
    extraImageAlts: ["Paul Robas, Overcast, 2026, 설치 전경"],
    documentLabel: "작가 약력",
    standfirst:
      "로바스는 자신의 아카이브에 있는 사진을 편집하고 콜라주하여, 얼굴이 더 이상 가만히 있지 않을 때까지 다듬어 Overcast를 만든다.",
    paragraphs: [
      "이미지는 카메라를 지나 디지털 작업을 거치고, 린넨 위에 투영되거나 전사된다. 캔버스에 도착한 것은 흐리고, 겹쳐 있고, 층을 이루거나, 일부가 가려져 있다.",
      "그는 밀랍 위에 안료를 얹는 엔코스틱을 쓰는데, 로마 시대 파이윰 미라 초상화에서 처음 만난 방법이다. 밀랍은 옅고 바래 가는 표면을 남기며, 그것이 그가 이미지에서 원하는 성질이다.",
      "익명의 얼굴은 고정된 닮음이라기보다 기억과 내면이 스며 나오는 자리이다. Frieze London의 아티스트에서 아티스트로에서 Alice Amati가 선보인다. 작품 번호 PR075.",
    ],
  },
  "study-for-toali": {
    kicker: "드로잉",
    medium: "천 위에 등흑 드로잉",
    section: "아티스트에서 아티스트로",
    status: "판매 가능",
    imageAlt: "Jorge González Santos, Study for Toali, 2021",
    extraImageAlts: [
      "Jorge González Santos, Study for Toali, 세부",
      "Jorge González Santos, Study for Toali, 다른 각도",
    ],
    documentLabel: null,
    standfirst: "",
    paragraphs: [
      "곤살레스 산토스의 등흑 드로잉은 세 개의 끝을 가진 타이노 석조에서 이름을 딴 진행 중인 연작 Toali에 속한다. 이 원주민 물건은 조상 영혼을 인정하고 작물 재배를 위한 봉헌물로 쓰였다. 조각된 돌과 다른 타이노 기호와 문양의 묘사는 등흑, 곧 그을음으로 만든 검은 안료로 그려진다. 작가는 작업실의 기름 등에서 그을음을 거둔다. 이 안료는 20세기 초 카리브해 고고학 조사의 사진 기록을 떠올리게 한다.",
    ],
  },
  "stars-wrapped-in-flesh": {
    kicker: "종이 작업",
    medium: "닥나무 종이에 수채와 잉크",
    section: "코드 유니버스",
    status: "판매 가능",
    imageAlt: "Karim Boumjimar, Stars wrapped in flesh, 2025",
    extraImageAlts: [],
    documentLabel: "작가 이력",
    standfirst:
      "붐지마르의 Frieze London 전시는 몸을, 욕망과 신화와 매체, 그리고 사회가 몸에 남기는 자국으로 빚어진 코드로 다룬다.",
    paragraphs: [
      "도자기는 부스 벽에 그린 벽화와 함께 놓인다. 그 자리에서 Deep Leopard, 2025 같은 그릇은 변해 가는 몸과 사회의 기록으로 읽힌다. Stars wrapped in flesh는 닥나무 종이에 수채와 잉크이며, 작품 번호는 BOUM-240019이다.",
      "인물은 혼종이다. 연인, 세이렌, 악마, 인간과 동물 사이의 존재로, 퀴어 친족과 신화와 신앙 이미지에서 가져온다. 남성과 여성, 인간과 짐승, 성스러운 것과 기괴한 것의 구분은 풀린다.",
      "물속 배경은 같은 유동성의 생각을 정체성으로 옮긴다. 작업에는 정치적 날이 있다. 공동체의 거부와 그 공동체가 여전히 마주하는 압력을 함께 표시한다.",
      "최근 개인전으로는 Bodies under Construction, Møstings, 프레데릭스베르(2026), Rites of Affection, Lahti Museum of Visual Arts Malva(2026), Pandemonium Paradiso, O-Overgaden, 코펜하겐(2025), Drawings from the Hotel, Poriginal Galleria, Pori Art Museum(2025), Alien Water, Art Hub Copenhagen(2021)이 있다. 단체전으로는 Beauty Is the Best Defense, Jessica Silverman, 샌프란시스코(2026), Stockholm Cosmologies, Liljevalchs, 스톡홀름(2025), Kultuur, TINA, 런던(2025), Queer Ecologies, Centro de Arte la Panera, 례이다(2023), Psychopathia Sexualis, O-Overgaden, 코펜하겐(2021)이 있다.",
      "Frieze London의 코드 유니버스에서 TINA가 선보인다.",
    ],
  },
}

const ZH: Record<ArtworkSlug, ArtworkLocaleFields> = {
  overcast: {
    kicker: "绘画",
    medium: "亚麻布上的丙烯、油画、墨与蜡画",
    section: "艺术家对艺术家",
    status: "在售",
    imageAlt: "Paul Robas，《Overcast》，2026",
    extraImageAlts: ["Paul Robas，《Overcast》，2026，展览现场"],
    documentLabel: "艺术家简介",
    standfirst: "罗巴斯用自己档案里的照片制作《Overcast》，经过编辑与拼贴，直到一张脸不再保持静止。",
    paragraphs: [
      "图像经过相机、数字处理，再投影或转印到亚麻布上。到达画布的东西是模糊的、重叠的、分层的，或被部分遮住。",
      "他使用蜡画，把颜料敷在蜡上。他最初在罗马时期的法尤姆木乃伊肖像中见到这种方法。蜡留下一层苍白、渐渐褪去的表面，这正是他要从图像里得到的质地。",
      "这张匿名的脸与其说是固定的肖像，不如说是记忆和内心生活穿过的地方。由 Alice Amati 呈现在 Frieze London 的“艺术家对艺术家”单元。库存编号 PR075。",
    ],
  },
  "study-for-toali": {
    kicker: "素描",
    medium: "织物上的灯黑素描",
    section: "艺术家对艺术家",
    status: "在售",
    imageAlt: "Jorge González Santos，《Study for Toali》，2021",
    extraImageAlts: [
      "Jorge González Santos，《Study for Toali》，局部",
      "Jorge González Santos，《Study for Toali》，另一角度",
    ],
    documentLabel: null,
    standfirst: "",
    paragraphs: [
      "冈萨雷斯·桑托斯的灯黑素描属于一个持续的系列，题为 Toali，名称来自泰诺人雕刻的三尖石。这些原住民器物用来确认祖先之灵，也作为农作物耕种的供品。对这些雕刻石头以及其他泰诺符号与纹样的描绘，使用灯黑完成。灯黑是一种由烟灰制成的黑色颜料，艺术家从工作室的油灯上收集。这种颜料令人想起 20 世纪初加勒比考古调查的摄影记录。",
    ],
  },
  "stars-wrapped-in-flesh": {
    kicker: "纸上作品",
    medium: "桑皮纸上的水彩与墨",
    section: "代码宇宙",
    status: "在售",
    imageAlt: "Karim Boumjimar，《Stars wrapped in flesh》，2025",
    extraImageAlts: [],
    documentLabel: "艺术家简历",
    standfirst:
      "布姆吉马尔在 Frieze London 的呈现把身体当作一种代码，由欲望、神话、媒介，以及社会留在身体上的痕迹所塑造。",
    paragraphs: [
      "陶瓷与画在展位墙上的壁画放在一起。在这个环境里，Deep Leopard（2025）这样的器物读起来像一个身体和一种社会正在变化的记录。《Stars wrapped in flesh》是桑皮纸上的水彩与墨，库存编号 BOUM-240019。",
      "人物是混杂的：恋人、塞壬、魔鬼，以及人与动物之间的存在，来自酷儿亲属关系、神话和虔敬图像。男性与女性、人与兽、神圣与怪诞之间的区分随之解开。",
      "水下场景把同一种流动性带进身份。作品有政治的锋刃：它既记下社群的反抗，也记下这些社群仍会遇到的压力。",
      "近期个展包括 Bodies under Construction，Møstings，弗雷德里克斯贝（2026）；Rites of Affection，Lahti Museum of Visual Arts Malva（2026）；Pandemonium Paradiso，O-Overgaden，哥本哈根（2025）；Drawings from the Hotel，Poriginal Galleria，Pori Art Museum（2025）；以及 Alien Water，Art Hub Copenhagen（2021）。群展包括 Beauty Is the Best Defense，Jessica Silverman，旧金山（2026）；Stockholm Cosmologies，Liljevalchs，斯德哥尔摩（2025）；Kultuur，TINA，伦敦（2025）；Queer Ecologies，Centro de Arte la Panera，莱里达（2023）；以及 Psychopathia Sexualis，O-Overgaden，哥本哈根（2021）。",
      "由 TINA 呈现在 Frieze London 的“代码宇宙”单元。",
    ],
  },
}

const PT: Record<ArtworkSlug, ArtworkLocaleFields> = {
  overcast: {
    kicker: "Pintura",
    medium: "Acrílica, óleo, tinta e encáustica sobre linho",
    section: "De artista para artista",
    status: "Disponível",
    imageAlt: "Paul Robas, Overcast, 2026",
    extraImageAlts: ["Paul Robas, Overcast, 2026, vista da instalação"],
    documentLabel: "Biografia do artista",
    standfirst:
      "Robas faz Overcast a partir de fotografias do próprio arquivo, editadas e coladas até um rosto deixar de ficar parado.",
    paragraphs: [
      "As imagens passam por uma câmera, por um trabalho digital e depois por uma projeção ou transferência sobre linho. O que chega à tela está borrado, duplicado, em camadas ou em parte escondido.",
      "Ele usa encáustica, pigmento sobre cera, um método que conheceu primeiro nos retratos de múmias de Faium do período romano. A cera deixa uma superfície pálida e que se apaga, que é a qualidade que ele quer da imagem.",
      "O rosto anônimo é menos uma semelhança fixa do que um lugar por onde passam a memória e uma vida interior. Apresentado por Alice Amati em De artista para artista na Frieze London. Inventário PR075.",
    ],
  },
  "study-for-toali": {
    kicker: "Desenho",
    medium: "Desenho com negro de fumo sobre tecido",
    section: "De artista para artista",
    status: "Disponível",
    imageAlt: "Jorge González Santos, Study for Toali, 2021",
    extraImageAlts: [
      "Jorge González Santos, Study for Toali, detalhe",
      "Jorge González Santos, Study for Toali, outra vista",
    ],
    documentLabel: null,
    standfirst: "",
    paragraphs: [
      "Os desenhos com negro de fumo de González Santos fazem parte de uma série em andamento intitulada Toali, nomeada a partir das pedras talhadas taínas de três pontas. Esses objetos indígenas serviam para reconhecer espíritos ancestrais e como oferendas para o cultivo. As representações dessas pedras talhadas, entre outros símbolos e desenhos taínos, são feitas com negro de fumo, um pigmento preto obtido da fuligem que o artista recolhe de uma lâmpada a óleo no ateliê. O pigmento lembra a documentação fotográfica das investigações arqueológicas do Caribe no início do século XX.",
    ],
  },
  "stars-wrapped-in-flesh": {
    kicker: "Obras sobre papel",
    medium: "Aquarela e tinta sobre papel de amoreira",
    section: "O universo do código",
    status: "Disponível",
    imageAlt: "Karim Boumjimar, Stars wrapped in flesh, 2025",
    extraImageAlts: [],
    documentLabel: "CV do artista",
    standfirst:
      "A apresentação de Boumjimar na Frieze London trata o corpo como um código moldado pelo desejo, pelo mito, pela mídia e pelas marcas que uma sociedade deixa nele.",
    paragraphs: [
      "Cerâmicas ficam junto de um mural pintado nas paredes do estande. Nesse contexto, peças como Deep Leopard, 2025, se leem como registros de um corpo e de uma sociedade em mudança. Stars wrapped in flesh é aquarela e tinta sobre papel de amoreira, inventário BOUM-240019.",
      "As figuras são híbridas: amantes, sereias, demônios e seres entre o humano e o animal, tirados do parentesco queer, da mitologia e de imagens devocionais. As distinções entre masculino e feminino, humano e besta, sagrado e grotesco se desfazem.",
      "Os cenários subaquáticos levam a mesma ideia de fluidez para a identidade. A obra tem um corte político: marca tanto a resistência das comunidades quanto a pressão que essas comunidades ainda encontram.",
      "Entre as exposições individuais recentes estão Bodies under Construction, Møstings, Frederiksberg (2026); Rites of Affection, Lahti Museum of Visual Arts Malva (2026); Pandemonium Paradiso, O-Overgaden, Copenhague (2025); Drawings from the Hotel, Poriginal Galleria, Pori Art Museum (2025); e Alien Water, Art Hub Copenhagen (2021). Entre as coletivas estão Beauty Is the Best Defense, Jessica Silverman, São Francisco (2026); Stockholm Cosmologies, Liljevalchs, Estocolmo (2025); Kultuur, TINA, Londres (2025); Queer Ecologies, Centro de Arte la Panera, Lleida (2023); e Psychopathia Sexualis, O-Overgaden, Copenhague (2021).",
      "Apresentado por TINA em O universo do código na Frieze London.",
    ],
  },
}

const TR: Record<ArtworkSlug, ArtworkLocaleFields> = {
  overcast: {
    kicker: "Resim",
    medium: "Keten üzerine akrilik, yağlı boya, mürekkep ve enkostik",
    section: "Sanatçıdan sanatçıya",
    status: "Satışta",
    imageAlt: "Paul Robas, Overcast, 2026",
    extraImageAlts: ["Paul Robas, Overcast, 2026, yerleştirme görünümü"],
    documentLabel: "Sanatçı özgeçmişi",
    standfirst:
      "Robas, Overcast’i kendi arşivindeki fotoğraflardan yapar; bir yüz artık durağan kalmayana kadar onları düzenler ve kolajlar.",
    paragraphs: [
      "Görüntüler bir kameradan, dijital çalışmadan, sonra ketene izdüşüm ya da aktarımdan geçer. Tuvale varan şey bulanık, ikilenmiş, katmanlı ya da kısmen gizlidir.",
      "Balmumu üzerine pigment olan enkostiği kullanır; bu yöntemle ilk olarak Roma döneminin Fayyum mumya portrelerinde karşılaşmıştır. Balmumu soluk, silinmeye yüz tutan bir yüzey bırakır; görüntüden istediği nitelik budur.",
      "Adsız yüz, sabit bir benzerlikten çok belleğin ve bir iç yaşamın geçtiği yerdir. Frieze London’da Sanatçıdan sanatçıya bölümünde Alice Amati sunumu. Envanter PR075.",
    ],
  },
  "study-for-toali": {
    kicker: "Çizim",
    medium: "Kumaş üzerine lamba isi çizimi",
    section: "Sanatçıdan sanatçıya",
    status: "Satışta",
    imageAlt: "Jorge González Santos, Study for Toali, 2021",
    extraImageAlts: [
      "Jorge González Santos, Study for Toali, ayrıntı",
      "Jorge González Santos, Study for Toali, başka bir görünüm",
    ],
    documentLabel: null,
    standfirst: "",
    paragraphs: [
      "González Santos’un lamba isi çizimleri, üç uçlu Taíno oyma taşlarından adını alan süregelen Toali dizisine aittir. Bu yerli nesneler ata ruhlarını tanımak ve ekin ekimi için sunu olarak kullanılırdı. Bu oyma taşların ve diğer Taíno simgeleri ile desenlerinin betimleri lamba isiyle yapılır; lamba isi, sanatçının atölyesindeki bir yağ lambasından topladığı isten elde edilen siyah bir pigmenttir. Pigment, 20. yüzyılın başında Karayipler’de yapılan arkeolojik araştırmaların fotoğraf belgelerini çağrıştırır.",
    ],
  },
  "stars-wrapped-in-flesh": {
    kicker: "Kâğıt üzerine işler",
    medium: "Dut kâğıdı üzerine suluboya ve mürekkep",
    section: "Kod evreni",
    status: "Satışta",
    imageAlt: "Karim Boumjimar, Stars wrapped in flesh, 2025",
    extraImageAlts: [],
    documentLabel: "Sanatçı özgeçmişi",
    standfirst:
      "Boumjimar’ın Frieze London sunumu, bedeni arzu, mit, medya ve bir toplumun üzerinde bıraktığı izlerle biçimlenen bir kod olarak ele alır.",
    paragraphs: [
      "Seramikler, stant duvarlarına boyanmış bir duvar resmiyle birlikte durur. Bu düzenlemede Deep Leopard, 2025 gibi kaplar, değişen bir bedenin ve toplumun kayıtları olarak okunur. Stars wrapped in flesh, dut kâğıdı üzerine suluboya ve mürekkeptir; envanter BOUM-240019.",
      "Figürler melezdir: queer akrabalıktan, mitolojiden ve adak imgelerinden gelen âşıklar, sirenler, şeytanlar ve insan-hayvan varlıklar. Eril ile dişil, insan ile hayvan, kutsal ile grotesk arasındaki ayrımlar çözülür.",
      "Sualtı ortamları aynı akışkanlık düşüncesini kimliğe taşır. İşin politik bir kenarı vardır: hem toplulukların direnişini hem de bu toplulukların hâlâ karşılaştığı baskıyı işaretler.",
      "Yakın dönem kişisel sergiler arasında Bodies under Construction, Møstings, Frederiksberg (2026); Rites of Affection, Lahti Museum of Visual Arts Malva (2026); Pandemonium Paradiso, O-Overgaden, Kopenhag (2025); Drawings from the Hotel, Poriginal Galleria, Pori Art Museum (2025) ve Alien Water, Art Hub Copenhagen (2021) vardır. Karma sergiler arasında Beauty Is the Best Defense, Jessica Silverman, San Francisco (2026); Stockholm Cosmologies, Liljevalchs, Stockholm (2025); Kultuur, TINA, Londra (2025); Queer Ecologies, Centro de Arte la Panera, Lleida (2023) ve Psychopathia Sexualis, O-Overgaden, Kopenhag (2021) vardır.",
      "Frieze London’da Kod evreni bölümünde TINA sunumu.",
    ],
  },
}

const IT: Record<ArtworkSlug, ArtworkLocaleFields> = {
  overcast: {
    kicker: "Pittura",
    medium: "Acrilico, olio, inchiostro ed encausto su lino",
    section: "Da artista ad artista",
    status: "Disponibile",
    imageAlt: "Paul Robas, Overcast, 2026",
    extraImageAlts: ["Paul Robas, Overcast, 2026, vista dell’installazione"],
    documentLabel: "Biografia dell’artista",
    standfirst:
      "Robas realizza Overcast a partire da fotografie del proprio archivio, montate e collageate finché un volto non sta più fermo.",
    paragraphs: [
      "Le immagini passano da una macchina fotografica, da un lavoro digitale e poi da una proiezione o un trasferimento su lino. Ciò che arriva sulla tela è sfocato, raddoppiato, stratificato o in parte nascosto.",
      "Usa l’encausto, pigmento steso sulla cera, un metodo incontrato per la prima volta nei ritratti di mummie del Fayum di epoca romana. La cera lascia una superficie pallida e che sbiadisce, ed è la qualità che cerca nell’immagine.",
      "Il volto anonimo è meno una somiglianza fissa che un luogo in cui affiorano la memoria e una vita interiore. Presentato da Alice Amati in Da artista ad artista a Frieze London. Inventario PR075.",
    ],
  },
  "study-for-toali": {
    kicker: "Disegno",
    medium: "Disegno a nero di lampada su tessuto",
    section: "Da artista ad artista",
    status: "Disponibile",
    imageAlt: "Jorge González Santos, Study for Toali, 2021",
    extraImageAlts: [
      "Jorge González Santos, Study for Toali, dettaglio",
      "Jorge González Santos, Study for Toali, altra vista",
    ],
    documentLabel: null,
    standfirst: "",
    paragraphs: [
      "I disegni a nero di lampada di González Santos appartengono a una serie in corso intitolata Toali, dal nome delle pietre scolpite taíno a tre punte. Questi oggetti indigeni servivano a riconoscere gli spiriti degli antenati e come offerte per la coltivazione. Le raffigurazioni di queste pietre, insieme ad altri simboli e motivi taíno, sono realizzate con il nero di lampada, un pigmento nero ricavato dalla fuliggine che l’artista raccoglie da una lampada a olio nello studio. Il pigmento richiama la documentazione fotografica delle indagini archeologiche nei Caraibi all’inizio del XX secolo.",
    ],
  },
  "stars-wrapped-in-flesh": {
    kicker: "Opere su carta",
    medium: "Acquerello e inchiostro su carta di gelso",
    section: "L’universo del codice",
    status: "Disponibile",
    imageAlt: "Karim Boumjimar, Stars wrapped in flesh, 2025",
    extraImageAlts: [],
    documentLabel: "CV dell’artista",
    standfirst:
      "La presentazione di Boumjimar a Frieze London tratta il corpo come un codice plasmato dal desiderio, dal mito, dai media e dai segni che una società lascia su di esso.",
    paragraphs: [
      "Le ceramiche stanno accanto a un murale dipinto sulle pareti dello stand. In quel contesto, oggetti come Deep Leopard, 2025, si leggono come registri di un corpo e di una società che cambiano. Stars wrapped in flesh è acquerello e inchiostro su carta di gelso, inventario BOUM-240019.",
      "Le figure sono ibride: amanti, sirene, diavoli ed esseri tra umano e animale, tratti dalla parentela queer, dalla mitologia e dalle immagini devozionali. Le distinzioni tra maschile e femminile, umano e bestia, sacro e grottesco si sciolgono.",
      "Gli ambienti sott’acqua portano la stessa idea di fluidità nell’identità. L’opera ha un taglio politico: segna sia la resistenza delle comunità sia la pressione che quelle comunità continuano a incontrare.",
      "Tra le mostre personali recenti ci sono Bodies under Construction, Møstings, Frederiksberg (2026); Rites of Affection, Lahti Museum of Visual Arts Malva (2026); Pandemonium Paradiso, O-Overgaden, Copenaghen (2025); Drawings from the Hotel, Poriginal Galleria, Pori Art Museum (2025); e Alien Water, Art Hub Copenhagen (2021). Tra le collettive ci sono Beauty Is the Best Defense, Jessica Silverman, San Francisco (2026); Stockholm Cosmologies, Liljevalchs, Stoccolma (2025); Kultuur, TINA, Londra (2025); Queer Ecologies, Centro de Arte la Panera, Lleida (2023); e Psychopathia Sexualis, O-Overgaden, Copenaghen (2021).",
      "Presentato da TINA in L’universo del codice a Frieze London.",
    ],
  },
}

const ARTWORK_COPY: Record<Exclude<ArtworkPageLocale, "en">, Record<ArtworkSlug, ArtworkLocaleFields>> = {
  fr: FR,
  ja: JA,
  ar: AR,
  de: DE,
  es: ES,
  ko: KO,
  zh: ZH,
  pt: PT,
  tr: TR,
  it: IT,
}

function isArtworkSlug(slug: string): slug is ArtworkSlug {
  return slug in FR
}

export function localizeArtwork(artwork: Artwork, locale: ArtworkPageLocale): Artwork {
  if (locale === "en" || !isArtworkSlug(artwork.slug)) return artwork
  const fields = ARTWORK_COPY[locale][artwork.slug]
  return {
    ...artwork,
    kicker: fields.kicker,
    medium: fields.medium,
    section: fields.section,
    status: fields.status,
    imageAlt: fields.imageAlt,
    standfirst: fields.standfirst,
    paragraphs: fields.paragraphs,
    document: artwork.document
      ? { ...artwork.document, label: fields.documentLabel ?? artwork.document.label }
      : null,
    extraImages: artwork.extraImages.map((image, index) => ({
      ...image,
      alt: fields.extraImageAlts[index] ?? image.alt,
    })),
  }
}
