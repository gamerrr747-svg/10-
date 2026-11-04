import { LangCode } from './translations';
import { TERM3_LESSONS_TR, TERM3_UNITS_TR } from './term3Translations';

export interface EnrichedLesson {
  k: number;
  n: number;
  unit: string;
  title: string;
  obj: string[];
  aim: string;
  sc: string[];
  values: string[];
  hook: string;
  feynman: string;
  dualCoding: string;
  cpaExplanation: string;
  key: string;
  ex: any[];
  prac: any[];
  exit: any[];
  mis: string;
  misconceptions?: {
    wrong: string;
    why: string;
    correct: string;
  };
  pisaTask?: {
    context: string;
    question: string;
    solution: string;
  };
  sideNote?: string;
  sideWarning?: string;
  terms?: { kz: string; ru: string; en: string }[];
  diff?: string;
  hw?: string;
  scene?: string;
  lab?: any;
  sas?: string;
  sat?: string;
}

// Default values per language
const DEFAULT_VALUES: Record<LangCode, string[]> = {
  kz: ['Академиялық адалдық', 'Сыни тұрғыдан ойлау', 'Зерттеушілік мәдениет', 'Жаһандық азаматтық'],
  ru: ['Академическая честность', 'Критическое мышление', 'Исследовательская культура', 'Глобальное мышление'],
  en: ['Academic integrity', 'Critical thinking', 'Research culture', 'Global citizenship'],
};

// Term 2 specific pedagogical enrichments
const TERM2_ENRICHMENTS: Record<number, Record<LangCode, any>> = {
  1: {
    kz: {
      feynman: 'Айқас түзулер — бұл бөлмедегі бір-біріне ешқашан соқтығыспайтын екі ұшақ сияқты. Олардың арасындағы бұрышты өлшеу үшін біреуін өзіне параллель ұстап, екіншісімен қиылысқанша жақындатамыз. Пайда болған сүйір бұрыш — іздеген бұрышымыз!',
      dualCoding: 'Сөздік: «Бір түзуді екіншісімен қиылысқанша өзіне параллель көшіреміз». Визуалды: Кубтағы AA₁ қырының BB₁ қырына параллель көшірілуі (қызыл үзік сызық).',
      cpaExplanation: 'Заттық: Екі қарындашты кеңістікте қиылыспайтындай ұстау → Бейнелік: Куб қырларын сызу → Дерексіз: ∠(a,b) = ∠(a\',b) ∈ [0°; 90°].',
      misconceptions: {
        wrong: '«Түзулер перпендикуляр болса, олар міндетті түрде қиылысуы керек» деп ойлау.',
        why: "Жазықтықта солай, бірақ кеңістікте түзулер бір-біріне тимей, бірақ бағыттары 90° бұрыш жасайтын айқас перпендикуляр бола алады.",
        correct: 'Кеңістікте перпендикуляр түзулер қиылысуы да, айқас болуы да мүмкін.'
      },
      pisaTask: {
        context: 'Екі деңгейлі жол айрығында жоғарғы көпір жолы мен төменгі тоннель жолы бір-бірімен қиылыспай өтеді.',
        question: 'Көпір мен тоннель осьтерінің бағыттары арасындағы бұрышты қалай анықтауға болады?',
        solution: 'Төменгі тоннель бағытын өзіне параллель жоғарыға, көпір деңгейіне көшіріп, олардың арасындағы бұрышты өлшейміз.'
      },
      sideNote: 'Түзулер арасындағы бұрыш әрқашан [0°; 90°] аралығында болады (сүйір немесе тік).',
      sideWarning: 'Ешқашан доғал бұрышты (мысалы 120°) түзулер арасындағы бұрыш деп алмаңыз; сыбайлас 180° - 120° = 60° алынады.',
      terms: [
        { kz: 'Айқас түзулер', ru: 'Скрещивающиеся прямые', en: 'Skew lines' },
        { kz: 'Перпендикуляр түзулер', ru: 'Перпендикулярные прямые', en: 'Perpendicular lines' },
        { kz: 'Түзулер арасындағы бұрыш', ru: 'Угол между прямыми', en: 'Angle between lines' }
      ]
    },
    ru: {
      feynman: 'Скрещивающиеся прямые — как два самолета на разной высоте, летящие разными курсами. Чтобы найти угол между ними, мысленно перенесите одну траекторию параллельно себе до пересечения с другой. Полученный острый угол и есть искомый!',
      dualCoding: 'Словесно: «Переносим одну прямую параллельно до пересечения со второй». Визуально: Перенос ребра AA₁ в кубе в ребро BB₁.',
      cpaExplanation: 'Предметно: скрещивание двух карандашей в воздухе → Наглядно: чертеж куба → Абстрактно: ∠(a,b) ∈ [0°; 90°].',
      misconceptions: {
        wrong: 'Считать, что перпендикулярные прямые обязательно должны пересекаться.',
        why: 'В пространстве прямые могут не иметь общих точек, но угол между их направлениями равен 90° (скрещивающиеся перпендикулярные).',
        correct: 'В пространстве перпендикулярные прямые могут либо пересекаться, либо скрещиваться.'
      },
      pisaTask: {
        context: 'На двухуровневой развязке эстакада и нижний тоннель не пересекаются.',
        question: 'Как определить угол между направлениями движения по эстакаде и тоннелю?',
        solution: 'Перенести параллельно направление тоннеля на уровень эстакады и измерить образованный угол.'
      },
      sideNote: 'Угол между прямыми всегда лежит в пределах от 0° до 90°.',
      sideWarning: 'Тупой угол не может быть углом между прямыми; берется смежный с ним острый угол.',
      terms: [
        { kz: 'Айқас түзулер', ru: 'Скрещивающиеся прямые', en: 'Skew lines' },
        { kz: 'Перпендикуляр түзулер', ru: 'Перпендикулярные прямые', en: 'Perpendicular lines' }
      ]
    },
    en: {
      feynman: 'Skew lines are like two airplanes flying at different altitudes that never collide. To measure the angle between them, slide one line parallel to itself until it intersects the other. The acute angle formed is the angle between them!',
      dualCoding: 'Verbal: "Translate one line parallel until it meets the second". Visual: In a cube, translate AA₁ to BB₁.',
      cpaExplanation: 'Concrete: two pencils in 3D air → Pictorial: cube diagram → Abstract: ∠(a,b) ∈ [0°; 90°].',
      misconceptions: {
        wrong: 'Assuming perpendicular lines must intersect.',
        why: 'In 3D, two lines can be skew and perpendicular without having any common point.',
        correct: 'Perpendicular lines in space can be either intersecting or skew.'
      },
      pisaTask: {
        context: 'An overpass bridge crosses above a sunken railway track without touching.',
        question: 'How can civil engineers verify the angle between the bridge direction and the railway tracks?',
        solution: 'By projecting or translating the railway direction vector up onto the bridge deck plane and measuring the acute angle.'
      },
      sideNote: 'The angle between two lines is always between 0° and 90° inclusive.',
      sideWarning: 'Never state an obtuse angle; take the supplementary acute angle (180° - θ).',
      terms: [
        { kz: 'Айқас түзулер', ru: 'Скрещивающиеся прямые', en: 'Skew lines' },
        { kz: 'Перпендикуляр түзулер', ru: 'Перпендикулярные прямые', en: 'Perpendicular lines' },
        { kz: 'Түзулер арасындағы бұрыш', ru: 'Угол между прямыми', en: 'Angle between lines' }
      ]
    }
  },
  2: {
    kz: {
      feynman: 'Үстелдің үстіне баған қойсаңыз, оның бір бағытта тік тұруы жеткіліксіз (ол оңға-солға құлап кетуі мүмкін). Бірақ егер ол қиылысатын екі түрлі бағытқа да перпендикуляр болса — ол үстелдің бүкіл жазықтығына қатып тұрады!',
      dualCoding: 'Сөздік: «Қиылысатын екі түзуге перпендикуляр түзу жазықтыққа перпендикуляр болады». Визуалды: a ⊥ b және a ⊥ c, b ∩ c = O.',
      cpaExplanation: 'Заттық: Кітап бетіне тік қойылған қарындаш және екі бұрыштық сызғыш → Бейнелік: Жазықтық пен оған тік түскен перпендикуляр.',
      misconceptions: {
        wrong: '«Түзу жазықтықтағы екі параллель түзуге перпендикуляр болса, ол жазықтыққа да перпендикуляр» деп ойлау.',
        why: 'Екі параллель түзу кеңістікте тек бір ғана бағытты береді; түзу сол бағытқа перпендикуляр бола тұра, екінші бағытта көлбеу тұра алады.',
        correct: 'Белгі орындалуы үшін жазықтықтағы түзулер МІНДЕТТІ ТҮРДЕ қиылысуы тиіс (b ∩ c ≠ ∅).'
      },
      pisaTask: {
        context: 'Құрылыс алаңында тіреуіш бағанның вертикальдығын тексеру үшін лазерлік өлшеуіш қолданылады.',
        question: 'Неге бағанды тек бір бағыттан ғана емес, екі түрлі қиылысатын бағыттан тексеру қажет?',
        solution: 'Түзу мен жазықтықтың перпендикулярлық белгісі бойынша түзу жазықтықтағы қиылысатын екі түзуге перпендикуляр болуы шарт. Бір бағыт қана тексерілсе, баған екінші бағытта қисайып тұруы мүмкін.'
      },
      sideNote: 'Егер түзу жазықтыққа перпендикуляр болса, ол осы жазықтықта жатқан кез келген түзуге перпендикуляр!',
      sideWarning: 'Екі түзудің параллель емес, қиылысатындығын дәлелдеуде көрсетуді ұмытпаңыз.',
      terms: [
        { kz: 'Жазықтыққа перпендикуляр түзу', ru: 'Прямая, перпендикулярная плоскости', en: 'Line perpendicular to a plane' },
        { kz: 'Перпендикулярлық белгісі', ru: 'Признак перпендикулярности', en: 'Perpendicularity criterion' }
      ]
    },
    ru: {
      feynman: 'Если поставить шест на стол, проверки с одной стороны недостаточно — он может наклониться вбок. Но если он перпендикулярен двум пересекающимся направлениям на столе, он гарантированно перпендикулярен всей плоскости стола!',
      dualCoding: 'Словесно: «Если прямая перпендикулярна двум пересекающимся прямым плоскости, она перпендикулярна плоскости». Визуально: a ⊥ b, a ⊥ c, b ∩ c = O.',
      cpaExplanation: 'Предметно: угольники вокруг карандаша → Наглядно: чертеж пересекающихся прямых → Абстрактно: a ⊥ α.',
      misconceptions: {
        wrong: 'Проверять перпендикулярность двум параллельным прямым плоскости.',
        why: 'Параллельные прямые задают только одно направление; прямая может оставаться наклонной.',
        correct: 'Прямые в плоскости ОБЯЗАТЕЛЬНО должны пересекаться.'
      },
      pisaTask: {
        context: 'На стройке проверяют вертикальность колонны с помощью отвеса.',
        question: 'Почему проверку необходимо выполнить минимум в двух направлениях?',
        solution: 'По признаку перпендикулярности прямой и плоскости, прямая должна быть перпендикулярна двум пересекающимся направлениям.'
      },
      sideNote: 'Если прямая перпендикулярна плоскости, она перпендикулярна любой прямой этой плоскости.',
      sideWarning: 'Обязательно указывайте точку пересечения прямых в доказательстве.',
      terms: [
        { kz: 'Жазықтыққа перпендикуляр түзу', ru: 'Прямая, перпендикулярная плоскости', en: 'Line perpendicular to a plane' }
      ]
    },
    en: {
      feynman: 'To keep a pole vertical on a floor, squaring it from one direction is not enough. But if it is perpendicular to two intersecting lines on the floor, it cannot wobble anywhere — it is perpendicular to the whole plane!',
      dualCoding: 'Verbal: "Perpendicular to two intersecting lines implies perpendicular to the plane". Visual: a ⊥ b and a ⊥ c with b ∩ c ≠ ∅.',
      cpaExplanation: 'Concrete: two set squares touching a standing pencil → Pictorial: 3D diagram → Abstract: a ⊥ α.',
      misconceptions: {
        wrong: 'Using two parallel lines in the criterion.',
        why: 'Parallel lines span only one single direction; the line can still be slanted along the other direction.',
        correct: 'The two lines in the plane MUST intersect.'
      },
      pisaTask: {
        context: 'A surveyor aligns a vertical antenna tower on a foundation slab.',
        question: 'Why does the surveyor use transit sightings from two different non-collinear positions?',
        solution: 'By the criterion of perpendicularity, a line perpendicular to two intersecting lines of a plane is perpendicular to the entire plane.'
      },
      sideNote: 'If a line is perpendicular to a plane, it is perpendicular to EVERY line in that plane.',
      sideWarning: 'Always verify and cite that the two lines intersect.',
      terms: [
        { kz: 'Жазықтыққа перпендикуляр түзу', ru: 'Прямая, перпендикулярная плоскости', en: 'Line perpendicular to a plane' },
        { kz: 'Перпендикулярлық белгісі', ru: 'Perpendicularity criterion', en: 'Criterion of perpendicularity' }
      ]
    }
  },
  5: {
    kz: {
      feynman: 'Үш перпендикуляр туралы теорема — бұл керемет көпір! 1) Төбеден түскен перпендикуляр. 2) Көлбеу. 3) Жазықтықтағы проекция. Егер еденде жатқан сызғыш проекцияға 90° перпендикуляр болса, ол көлбеудің өзіне де автоматты түрде 90° перпендикуляр болады!',
      dualCoding: 'Сөздік: «Проекцияға перпендикуляр болса ⇔ көлбеудің өзіне де перпендикуляр». Визуалды: Қызыл көлбеу PA, көк проекция HA, жердегі l түзуі.',
      cpaExplanation: 'Жіп (көлбеу), қалам (перпендикуляр) және партадағы сызғыш → Сызбада 3 тік бұрышты белгілеу → l ⊥ HA ⇔ l ⊥ PA.',
      misconceptions: {
        wrong: 'Теореманы көлбеудің табаны арқылы өтпейтін түзуге қолдану.',
        why: 'Түзу міндетті түрде жазықтықта көлбеудің табаны (A нүктесі) арқылы өтуі керек.',
        correct: 'Түзу көлбеудің табаны арқылы өтетінін әрқашан тексеріңіз: A ∈ l.'
      },
      pisaTask: {
        context: 'Көлбеу төбесі бар шатырдан жаңбыр суы ағатын науа орнатылған. Науа шатырдың көлбеу қырының проекциясына перпендикуляр орналасқан.',
        question: 'Науа шатырдың көлбеу бетіне перпендикуляр бола ма?',
        solution: 'Үш перпендикуляр туралы теорема бойынша, егер түзу көлбеудің проекциясына перпендикуляр болса, ол көлбеудің өзіне де перпендикуляр.'
      },
      sideNote: 'Бұл теорема нүктеден кеңістіктегі түзуге дейінгі қашықтықты табудың ең басты құралы.',
      sideWarning: 'Кері теореманы да ұмытпаңыз: егер түзу көлбеуге перпендикуляр болса, онда оның проекциясына да перпендикуляр.',
      terms: [
        { kz: 'Үш перпендикуляр туралы теорема', ru: 'Теорема о трёх перпендикулярах', en: 'Three perpendiculars theorem' },
        { kz: 'Көлбеу', ru: 'Наклонная', en: 'Inclined line' },
        { kz: 'Проекция', ru: 'Проекция', en: 'Projection' }
      ]
    },
    ru: {
      feynman: 'Теорема о трёх перпендикулярах — это золотой мост между плоскостью и пространством! Если прямая на плоскости перпендикулярна проекции наклонной, она перпендикулярна и самой наклонной!',
      dualCoding: 'Словесно: «Перпендикулярна проекции ⇔ перпендикулярна наклонной». Визуально: Наклонная PA, проекция HA, прямая l через точку A.',
      cpaExplanation: 'Модель из нитки и линейки → Построение треугольника расстояний → l ⊥ HA ⇔ l ⊥ PA.',
      misconceptions: {
        wrong: 'Применять теорему к прямой, не проходящей через основание наклонной.',
        why: 'Прямая обязательно должна проходить через основание наклонной в плоскости.',
        correct: 'Всегда проверяйте условие: точка A принадлежит прямой l.'
      },
      pisaTask: {
        context: 'К наклонной балке стропильной системы монтируют водосток, перпендикулярный проекции балки.',
        question: 'Будет ли водосток перпендикулярен самой балке?',
        solution: 'Да, по теореме о трёх перпендикулярах.'
      },
      sideNote: 'Главный инструмент для нахождения расстояния от точки в пространстве до прямой.',
      sideWarning: 'Обратная теорема действует в обратную сторону: перпендикулярность к наклонной влечет перпендикулярность к проекции.',
      terms: [
        { kz: 'Үш перпендикуляр туралы теорема', ru: 'Теорема о трёх перпендикулярах', en: 'Three perpendiculars theorem' }
      ]
    },
    en: {
      feynman: 'The three perpendiculars theorem is a magic bridge! 1) Altitude to plane. 2) Inclined line. 3) Shadow projection. If a line on the floor is perpendicular to the shadow, it is automatically perpendicular to the inclined line in space!',
      dualCoding: 'Verbal: "Perpendicular to projection ⇔ perpendicular to inclined line". Visual: Inclined PA, projection HA, line l through A.',
      cpaExplanation: 'String (inclined), pencil (altitude), ruler on desk → 3 right angles diagram → l ⊥ HA ⇔ l ⊥ PA.',
      misconceptions: {
        wrong: 'Applying to a line that does not pass through the foot of the inclined line.',
        why: 'The line in the plane must pass through the foot of the inclined line.',
        correct: 'Ensure the line passes through the foot: A ∈ l.'
      },
      pisaTask: {
        context: 'A support wire runs from the top of a pole to an anchor point A on the ground.',
        question: 'If a drainage trench through A is perpendicular to the shadow of the wire, what is its angle with the wire?',
        solution: '90° by the three perpendiculars theorem.'
      },
      sideNote: 'This is the primary method to determine the distance from a point in space to a line.',
      sideWarning: 'Remember the converse: perpendicular to inclined line implies perpendicular to projection.',
      terms: [
        { kz: 'Үш перпендикуляр туралы теорема', ru: 'Теорема о трёх перпендикулярах', en: 'Three perpendiculars theorem' },
        { kz: 'Көлбеу', ru: 'Наклонная', en: 'Inclined line' }
      ]
    }
  }
};

/**
 * Enriches any lesson with pedagogical depth, trilingual data, and modern structures
 */
export function getEnrichedLesson(
  rawLesson: any,
  term: 't2' | 't3',
  lang: LangCode
): EnrichedLesson {
  const k = rawLesson.k;

  // If Term 3, check our rich trilingual translation registry first
  if (term === 't3') {
    const t3Map = TERM3_LESSONS_TR[lang] || TERM3_LESSONS_TR['kz'];
    const t3Item = t3Map[k];
    if (t3Item) {
      return {
        ...rawLesson,
        title: t3Item.title || rawLesson.title,
        obj: t3Item.obj || rawLesson.obj,
        aim: t3Item.aim || rawLesson.aim,
        sc: t3Item.sc || rawLesson.sc,
        values: t3Item.values || DEFAULT_VALUES[lang],
        hook: t3Item.hook || rawLesson.hook,
        feynman: t3Item.feynman,
        dualCoding: t3Item.dualCoding,
        cpaExplanation: t3Item.cpaExplanation,
        key: t3Item.keyHtml || rawLesson.key,
        mis: rawLesson.mis || t3Item.misconceptions?.wrong,
        misconceptions: t3Item.misconceptions,
        pisaTask: t3Item.pisaTask,
        sideNote: t3Item.sideNote,
        sideWarning: t3Item.sideWarning,
        terms: t3Item.terms,
      };
    }
  }

  // If Term 2, check Term 2 enrichments
  const t2Enrich = TERM2_ENRICHMENTS[k]?.[lang];
  if (t2Enrich) {
    return {
      ...rawLesson,
      values: DEFAULT_VALUES[lang],
      feynman: t2Enrich.feynman,
      dualCoding: t2Enrich.dualCoding,
      cpaExplanation: t2Enrich.cpaExplanation,
      misconceptions: t2Enrich.misconceptions,
      pisaTask: t2Enrich.pisaTask,
      sideNote: t2Enrich.sideNote,
      sideWarning: t2Enrich.sideWarning,
      terms: t2Enrich.terms,
    };
  }

  // Default fallback enrichment
  return {
    ...rawLesson,
    values: DEFAULT_VALUES[lang],
    feynman:
      lang === 'kz'
        ? 'Бұл тақырыпты қарапайым тілмен елестетіңіз: кеңістіктік геометрия жазықтықтағы заңдарды үшінші өлшемге (биіктікке) кеңейтеді. Есептерді шешудің кілті — қажетті тікбұрышты үшбұрышты дұрыс тауып алу.'
        : lang === 'ru'
        ? 'Представьте эту тему простыми словами: стереометрия переносит законы планиметрии в третье измерение. Ключ к решению задач — правильный выбор прямоугольного треугольника.'
        : 'Think of this simply: 3D geometry extends 2D plane rules into the third dimension. The key to almost every proof is locating the hidden right-angled triangle.',
    dualCoding:
      lang === 'kz'
        ? 'Вербалды ереже мен визуалды 3D сызба бір-бірін толықтырады: теоремадағы әрбір шарт сызбада нақты түспен (берілгені — көк, ізделетіні — алтын) айқындалған.'
        : lang === 'ru'
        ? 'Словесное правило и визуальный 3D чертеж дополняют друг друга: каждое условие теоремы выделено цветом.'
        : 'Verbal rules and visual 3D diagrams reinforce each other: each given condition is color-coded.',
    cpaExplanation:
      lang === 'kz'
        ? '1) Заттық: қаламдар мен модельдермен ұстап көру → 2) Бейнелік: 3D сызбасын орындау → 3) Дерексіз: математикалық қатаң формула мен дәлелдеу.'
        : lang === 'ru'
        ? '1) Предметно: моделирование предметами → 2) Наглядно: 3D чертеж → 3) Абстрактно: строгая математическая формула.'
        : '1) Concrete: physical models → 2) Pictorial: 3D sketches → 3) Abstract: formal formulas and proofs.',
    misconceptions: {
      wrong:
        lang === 'kz'
          ? 'Жазықтықтағы ережелерді кеңістікке шарттарын тексермей көшіре салу.'
          : lang === 'ru'
          ? 'Перенос правил планиметрии в пространство без проверки условий.'
          : 'Directly transferring 2D rules into 3D space without verifying plane conditions.',
      why:
        lang === 'kz'
          ? 'Кеңістікте түзулер айқас болуы, жазықтықтар көлбеу орналасуы мүмкін.'
          : lang === 'ru'
          ? 'В пространстве прямые могут быть скрещивающимися, а плоскости наклонными.'
          : 'In 3D space, lines can be skew and planes can be inclined.',
      correct:
        lang === 'kz'
          ? 'Әрдайым түзулердің бір жазықтықта жатқандығын немесе перпендикулярлығын алдын ала дәлелдеңіз.'
          : lang === 'ru'
          ? 'Всегда предварительно обосновывайте принадлежность одной плоскости или взаимную перпендикулярность.'
          : 'Always justify that lines lie in a common plane or are genuinely perpendicular.',
    },
    sideNote:
      lang === 'kz'
        ? 'Тік бұрыштарды табу үшін алдымен жазықтыққа перпендикулярды анықтап алыңыз.'
        : lang === 'ru'
        ? 'Чтобы найти прямые углы, сначала определите перпендикуляр к плоскости.'
        : 'To find right angles, always identify the line perpendicular to the plane first.',
    sideWarning:
      lang === 'kz'
        ? 'Сызбадағы көрінетін бұрыштар кеңістіктік проекцияда бұрмаланып көрінуі мүмкін (мысалы, 90° бұрыш сүйір немесе доғал болып салынады).'
        : lang === 'ru'
        ? 'Прямые углы в пространственной проекции могут выглядеть острыми или тупыми.'
        : 'Right angles in 3D projection may look acute or obtuse on a 2D sheet.',
    terms: [
      { kz: 'Перпендикуляр', ru: 'Перпендикуляр', en: 'Perpendicular' },
      { kz: 'Проекция', ru: 'Проекция', en: 'Projection' },
      { kz: 'Кеңістік', ru: 'Пространство', en: 'Space' },
    ],
  };
}
